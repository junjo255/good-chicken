"use client";

import React, {useEffect, useMemo, useState} from "react";
import {ArrowLeft, MapPin, CreditCard, Plus} from "lucide-react";
import {useOrder} from "@/app/components/Order/Stepper/OrderCtx";
import {LOCATIONS} from "@/app/lib/locations";
import {PaymentKind, Pm} from "@/app/components/Order/Payment/types";
import {Card, Line, SectionTitle} from "@/app/components/ui/Card";
import {Row} from "@/app/components/ui/Row";
import {CartSummary} from "@/app/components/Order/Checkout/CartSummary";
import {PriceRow} from "@/app/components/ui/PriceRow";
import {PaymentOptionsModal} from "@/app/components/Order/Payment/PaymentOptionsModal";
import {AddCardModal} from "@/app/components/Order/Payment/AddCardModal";
import {useRouter} from "next/navigation";
import {useCart} from "@/app/lib/cart";
import {v4 as uuid} from "uuid";
import {cloverCreateToken} from "@/app/components/Order/Payment/clover";
import {formatPickupLabel, isOpenNow, minutesToLabel, PickupSlot, to12h, toMinutes} from "@/app/utils";
import AuthCard from "@/app/components/Auth/AuthCard";
import Link from "next/link";
import {ConfirmResetModal, resetStoreAndCartAndGoToOrder} from "@/app/components/Order/OrderReset/OrderReset";
import {useAuth} from "@/app/components/Auth/AuthProvider";
import TimePickerModal from "@/app/components/TimePickerModal/TimePickerModal";
import {supabase} from "@/app/lib/supabase/client";

type Profile = {
    id: string;
    full_name?: string | null;
    address?: any | null;
    preferred_location?: string | null;
};

export default function Checkout() {
    const {selectedStoreId, scheduleLater, setScheduleLater} = useOrder() as any;
    const router = useRouter();
    const {userId, firstName, openAuth} = useAuth();
    const [loadingPayments, setLoadingPayments] = useState(false);

    const selectedStore = useMemo(() => {
        if (!selectedStoreId) return null;
        return LOCATIONS.find((s) => s.id === selectedStoreId) || null;
    }, [selectedStoreId]);

    const storeStatus = React.useMemo(() => {
        return selectedStore?.hours ? isOpenNow(selectedStore.hours) : null;
    }, [selectedStore?.hours]);

    const isClosedNow = !!(storeStatus && !storeStatus.isOpen);

    const opensAtLabel = React.useMemo(() => {
        if (!isClosedNow || !storeStatus?.start) return "";
        const startMin =
            typeof storeStatus.start === "number"
                ? storeStatus.start
                : toMinutes(storeStatus.start); // "HH:MM" -> minutes since midnight
        return minutesToLabel(startMin);
    }, [isClosedNow, storeStatus]);

    // Totals (cents) — computed the same way the drawer does; keep your tax % here
    const [subtotalCents, setSubtotalCents] = useState<number>(0); // optional: lift from a totals hook
    const taxesCents = Math.round(subtotalCents * 0.0825);
    const totalCents = subtotalCents + taxesCents;

    // Payment state
    const [payments, setPayments] = useState<Pm[]>([
        {id: "pm_1681", label: "Personal", brand: "visa", last4: "1681", kind: "personal", available: true},
        {id: "pm_6054", label: "Visa", brand: "visa", last4: "6054", kind: "personal", available: true},
        {id: "pm_4029", label: "Visa", brand: "visa", last4: "4029", kind: "personal", available: true},
        // {id: "pm_apay", label: "Apple Pay", brand: "applepay", kind: "wallet", available: false, note: "Unavailable"},
    ]);
    const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>("pm_1681");
    const [activeTab, setActiveTab] = useState<PaymentKind>("personal");
    const [paymentModalOpen, setPaymentModalOpen] = useState(false);
    const [addCardOpen, setAddCardOpen] = useState(false);
    const cart = useCart() as any;
    const cartId = uuid();

    const selectedPayment = payments.find((p) => p.id === selectedPaymentId) || null;

    async function handleProcessPayment() {
        if (scheduleLater && !selectedTimeLabel) {
            setTimeModalOpen(true);
            return;
        }

        const {token} = await cloverCreateToken(process.env.NEXT_PUBLIC_CLOVER_PUBLIC_KEY!);

        setSelectedPaymentId(token);

        try {
            let source = selectedPaymentId;

            // If nothing selected, try to tokenize a new card (AddCardModal flow)
            if (!source) {
                const {token} = await cloverCreateToken(process.env.NEXT_PUBLIC_CLOVER_PUBLIC_KEY!);
                source = token; // single-use token; server will confirm & (optionally) vault
            }

            if (!source) {
                // toast.error("Please add or select a card.");
                return;
            }

            // 1) Ensure you have a Clover token from the card fields
            if (!selectedPaymentId?.startsWith("clv_")) {
                // Ask CloverCardFields to tokenize (e.g., fire an event or ref callback)
                // Or, if the user never clicked "Add card", prompt them to add payment.
                // toast.error("Please enter your card details.");
                return;
            }

            // 2) Calculate amount server-side (here we just pass the known total in cents)
            const res = await fetch("/api/pay", {
                method: "POST",
                headers: {"content-type": "application/json"},
                body: JSON.stringify({
                    source,
                    amount: totalCents,
                    cartId: cartId,
                }),
            });

            const out = await res.json();
            if (!res.ok) throw new Error(out?.error || "Payment failed");

            // 3) Success → navigate to confirmation
            router.push(`/order/confirmation?charge=${out.charge?.id}`);
        } catch (e: any) {
            // toast.error(e.message ?? "Something went wrong");
        }
    }

    const [pickupHour, setPickupHour] = useState<string>("");
    const [pickupMinute, setPickupMinute] = useState<string>("");
    const [timeModalOpen, setTimeModalOpen] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState<{
        targetDate: Date | null;
        startMin: number | null;
        durationMin: number;
    } | null>(null);

    const selectedTimeLabel = useMemo(() => {
        if (!selectedSlot?.targetDate || selectedSlot.startMin == null) return "";
        return formatPickupLabel({
            targetDate: selectedSlot.targetDate,
            startMin: selectedSlot.startMin,
            durationMin: selectedSlot.durationMin ?? 30,
            timezone: selectedStore?.hours?.timezone,
        });
    }, [selectedSlot, selectedStore?.hours?.timezone]);

    const missingScheduledTime = scheduleLater && !selectedTimeLabel;

    function minsToHM(time: string | number | undefined) {
        if (time === undefined || time === null) return {hh: "", mm: ""};

        if (typeof time === "string") {
            const [h, m] = time.split(":").map(Number);
            return {
                hh: String(h).padStart(2, "0"),
                mm: String(m).padStart(2, "0"),
            };
        }

        if (typeof time === "number") {
            const hh = Math.floor(time / 60);
            const mm = time % 60;
            return {
                hh: String(hh).padStart(2, "0"),
                mm: String(mm).padStart(2, "0"),
            };
        }

        return {hh: "", mm: ""};
    }

    // useEffect(() => {
    //     if (!userId) return;
    //     setLoadingPayments(true);
    //     supabase
    //         .from("payment_methods")
    //         .select("id, processor, processor_payment_method_id, brand, last4, exp_month, exp_year, is_default")
    //         .eq("profile_id", userId)
    //         .order("is_default", { ascending: false })
    //         .then(({ data, error }) => {
    //             if (error) {
    //                 console.error("load payment methods failed:", error.message);
    //                 return;
    //             }
    //             const mapped: Pm[] = (data ?? []).map((m) => ({
    //                 // Use the PSP token as our runtime id to charge with
    //                 id: m.processor_payment_method_id,
    //                 label: m.brand ? m.brand.toUpperCase() : "Card",
    //                 brand: m.brand ?? "card",
    //                 last4: m.last4 ?? undefined,
    //                 kind: "personal",
    //                 available: true,
    //             }));
    //             setPayments(mapped);
    //             const def = data?.find((x) => x.is_default);
    //             setSelectedPaymentId(def ? def.processor_payment_method_id : mapped[0]?.id ?? null);
    //         }).then(() => setLoadingPayments(false));
    // }, [userId]);


    const [accountOpen, setAccountOpen] = useState(false);
    const [showConfirmReset, setShowConfirmReset] = useState(false);

    const handleLogin = () => openAuth();
    useEffect(() => {
        if (accountOpen) document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "";
        };
    }, [accountOpen]);

    useEffect(() => {
        const onEsc = (e: KeyboardEvent) => e.key === "Escape" && setAccountOpen(false);
        window.addEventListener("keydown", onEsc);
        return () => window.removeEventListener("keydown", onEsc);
    }, []);

    React.useEffect(() => {
        if (!selectedStore?.hours) return;
        const status = isOpenNow(selectedStore.hours);
        if (status.isOpen) {
            const now = new Date();
            setPickupHour(String(now.getHours()).padStart(2, "0"));
            setPickupMinute(String(now.getMinutes()).padStart(2, "0"));
            return;
        }
        if (status.isOpenToday) {
            const {hh, mm} = minsToHM(status.start);
            setPickupHour(hh);
            setPickupMinute(mm);
        } else {
            setPickupHour("");
            setPickupMinute("");
        }
    }, [selectedStore?.hours]);

    const isMobile = typeof window !== "undefined" && window.innerWidth <= 1024;

    function LoginDisplay() {
        return (
            <Card>
                {!userId ? (
                    <button
                        onClick={handleLogin}
                        className="hidden md:block w-full rounded-lg bg-[#E9BC46] py-3 text-center text-[15px] md:text-[18px] font-semibold text-[#3F3126] "
                    >
                        Login
                    </button>
                ) : (
                    <SectionTitle>Welcome back, {firstName}</SectionTitle>
                )}
            </Card>
        );
    }

    return (
        <section
            style={{marginTop: "var(--header-h, 96px)", scrollMarginTop: "var(--header-h, 96px)"}}
            className="min-h-screen w-full pb-24 md:pb-12"
        >
            {/* Top bar */}
            <div className="mx-auto grid max-w-6xl grid-cols-2 md:grid-cols-3 items-center px-4 py-6">

                {/* Left: Back link */}
                <Link
                    href="/order"
                    className="justify-self-start inline-flex items-center gap-2 text-sm md:text-lg font-medium text-neutral-700 hover:text-black cursor-pointer"
                >
                    <ArrowLeft className="h-4 w-4"/> Back to menu
                </Link>

                {/* Title: right on mobile, centered on desktop */}
                <div
                    className="justify-self-end md:justify-self-center text-md md:text-[1.5rem] font-semibold tracking-tight">
                    Pickup Checkout
                </div>

                {/* Spacer: only on desktop */}
                <div className="hidden md:block justify-self-end w-[192px]"/>
            </div>

            {/* Content */}
            <div className="mx-auto grid max-w-6xl grid-cols-1 !gap-0 md:!gap-6 px-4 md:grid-cols-8">
                {/* LEFT */}
                <div className="md:col-span-5 space-y-4">
                    {isMobile &&
                        <LoginDisplay/>
                    }
                    <Card>
                        <div className="px-4">
                            <SectionTitle>Pickup Details</SectionTitle>
                        </div>

                        <Row
                            icon={MapPin}
                            title={selectedStore ? selectedStore.brand : "Choose a store"}
                            subtitle={selectedStore?.address}
                            action="Edit"
                            onAction={() => setShowConfirmReset(true)}
                        />

                        <ConfirmResetModal
                            open={showConfirmReset}
                            onCancel={() => setShowConfirmReset(false)}
                            onConfirm={() => {
                                setShowConfirmReset(false);
                                resetStoreAndCartAndGoToOrder({
                                    cart,
                                    router,
                                });
                            }}
                        />


                        <Line/>
                        <div className="p-4">
                            <SectionTitle>Pickup Time</SectionTitle>

                            {/* Choice cards: Standard (ASAP) vs Schedule */}
                            <div className="mt-3 grid grid-cols-1 gap-1">
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (isClosedNow) return;
                                        setScheduleLater?.(false);
                                    }}
                                    disabled={isClosedNow}
                                    aria-disabled={isClosedNow}
                                    className={`flex items-center justify-between rounded-xl px-4 py-6 transition
                                    ${!scheduleLater && !isClosedNow ? "border-2 border-[#3F3126]" : "border border-[#F3F3F3] bg-neutral-50"}
                                    ${isClosedNow ? "opacity-60 cursor-not-allowed" : ""} `}
                                >
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`text-[1.1rem] font-medium ${
                                                isClosedNow ? "text-neutral-400" : "text-neutral-900"
                                            }`}
                                        >
                                            ASAP
                                        </div>
                                        <div className="text-[1rem] text-neutral-500">
                                            {isClosedNow
                                                ? `Currently closed${opensAtLabel ? `. Opens at ${opensAtLabel}` : ""}`
                                                : "15–30 min"}
                                        </div>
                                    </div>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setScheduleLater?.(true);
                                        setTimeModalOpen(true);
                                    }}
                                    className={`flex items-center justify-between rounded-xl px-4 py-6
                                        ${scheduleLater ? "border-2 border-[#3F3126]" : "border border-[#F3F3F3] bg-neutral-50"}`}
                                >
                                    <div className="flex items-center gap-3">
                                        {scheduleLater && selectedTimeLabel ?
                                            <div className="text-[1.1rem] font-semibold text-neutral-900">
                                                {selectedTimeLabel}
                                            </div> :
                                            <>
                                                <div className="text-[1.1rem] font-medium text-neutral-900">
                                                    Schedule
                                                </div>
                                                <div className="text-[1rem] text-neutral-500">Choose a time</div>
                                            </>
                                        }
                                    </div>
                                </button>
                            </div>
                        </div>

                    </Card>

                    <Card>
                        <div className="p-4">
                            <SectionTitle>Payment</SectionTitle>
                        </div>
                        <Line/>
                        {!selectedPayment ? (
                            <button
                                type="button"
                                onClick={() => setAddCardOpen(true)}
                                className="flex w-full items-center gap-2 px-3 py-3 hover:bg-neutral-50"
                            >
                                <Plus className="h-5 w-5"/>
                                <span className="text-[15px] md:text-[17px] font-medium">Add Payment Method</span>
                            </button>
                        ) : (
                            <Row
                                icon={CreditCard}
                                title={
                                    <div className="font-medium text-[#3F3126]">
                                        {selectedPayment.brand === "applepay"
                                            ? "Apple Pay"
                                            : `${selectedPayment.label}${selectedPayment.last4 ? ` —••••${selectedPayment.last4}` : ""}`}
                                    </div>
                                }
                                action="update"
                                onAction={() => setPaymentModalOpen(true)}
                            />
                        )}
                    </Card>

                    <button
                        onClick={handleProcessPayment}
                        className={`hidden md:block w-full rounded-lg py-4 text-center text-[15px] md:text-[18px] font-semibold text-white ${
                            missingScheduledTime ? "bg-neutral-300 cursor-not-allowed" : "bg-[#AF3935]"
                        }`}>
                        Process Payment
                    </button>
                </div>

                {/* RIGHT */}
                <div className="md:col-span-3 space-y-4">
                    {!isMobile &&
                        <LoginDisplay/>
                    }
                    <Card>
                        {!isMobile && (
                            <>
                                <Row
                                    icon={MapPin}
                                    showIcon={false}
                                    title={selectedStore?.brand ?? "—"}
                                    subtitle={selectedStore?.address ?? "—"}
                                    action="Edit"
                                    onAction={() => setShowConfirmReset(true)}
                                />

                                <ConfirmResetModal
                                    open={showConfirmReset}
                                    onCancel={() => setShowConfirmReset(false)}
                                    onConfirm={() => {
                                        setShowConfirmReset(false);
                                        resetStoreAndCartAndGoToOrder({
                                            cart,
                                            router,
                                        });
                                    }}
                                />
                            </>
                        )
                        }
                        <div className="p-4">

                            <div className="mt-4 rounded-xl">
                                <CartSummary/>
                            </div>

                            {/* Right-side CTA (DESKTOP ONLY) */}
                            <button
                                onClick={handleProcessPayment}
                                className="mt-4 hidden md:block w-full rounded-lg bg-[#AF3935] py-4 text-center text-[15px] md:text-[18px] font-semibold text-white"
                            >
                                Process Payment
                            </button>
                        </div>
                    </Card>

                    {/* Order total */}
                    <Card>
                        <div className="p-4">
                            <SectionTitle>Order total</SectionTitle>
                            <div className="mt-2">
                                <PriceRow label="Subtotal" value={(subtotalCents / 100).toLocaleString("en-US", {
                                    style: "currency",
                                    currency: "USD"
                                })}/>
                                <PriceRow label="Taxes" value={(taxesCents / 100).toLocaleString("en-US", {
                                    style: "currency",
                                    currency: "USD"
                                })} info muted/>
                            </div>
                            <div className="mt-4 flex items-center justify-between border-t pt-4 text-[15px]">
                                <SectionTitle>Total</SectionTitle>
                                <div className="font-semibold text-[1.5rem]">
                                    {(totalCents / 100).toLocaleString("en-US", {style: "currency", currency: "USD"})}
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-neutral-200 bg-white p-4 md:hidden">
                <button
                    onClick={handleProcessPayment}
                    className="w-full rounded-lg bg-[#AF3935] py-5 text-center text-[15px] font-semibold text-white"
                >
                    Process Payment
                </button>
            </div>

            <PaymentOptionsModal
                open={paymentModalOpen}
                onClose={() => setPaymentModalOpen(false)}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                payments={payments}
                selectedId={selectedPaymentId}
                onSelect={(id) => setSelectedPaymentId(id)}
                onAddNew={() => {
                    setPaymentModalOpen(false);
                    setAddCardOpen(true);
                }}
                onSave={() => setPaymentModalOpen(false)}
            />

            <AddCardModal
                open={addCardOpen}
                onClose={() => setAddCardOpen(false)}
                onSaved={(p) => {
                    const newPm: Pm = {
                        id: p.id,
                        label: p.label,
                        brand: p.brand,
                        last4: p.last4,
                        kind: activeTab,
                        available: true
                    };
                    setPayments((xs) => [newPm, ...xs]);
                    setSelectedPaymentId(newPm.id);
                }}
            />
            {/*<AddCardModal*/}
            {/*    open={addCardOpen}*/}
            {/*    onClose={() => setAddCardOpen(false)}*/}
            {/*    onSaved={async (p) => {*/}
            {/*        try {*/}
            {/*            const vaultedId = p.id;*/}

            {/*            const { error: dbErr } = await supabase.from("payment_methods").insert({*/}
            {/*                profile_id: userId,*/}
            {/*                processor: "clover",*/}
            {/*                processor_payment_method_id: vaultedId,*/}
            {/*                brand: p.brand,*/}
            {/*                last4: p.last4,*/}
            {/*                // exp_month / exp_year if your modal provides them; else omit*/}
            {/*                is_default: true,*/}
            {/*            });*/}
            {/*            if (dbErr) throw new Error(dbErr.message);*/}

            {/*            const newPm: Pm = {*/}
            {/*                id: vaultedId,*/}
            {/*                label: p.label,*/}
            {/*                brand: p.brand,*/}
            {/*                last4: p.last4,*/}
            {/*                kind: activeTab,*/}
            {/*                available: true,*/}
            {/*            };*/}
            {/*            setPayments((xs) => [newPm, ...xs]);*/}
            {/*            setSelectedPaymentId(newPm.id);*/}
            {/*            setAddCardOpen(false);*/}
            {/*        } catch (e: any) {*/}
            {/*            console.error(e?.message || e);*/}
            {/*        }*/}
            {/*    }}*/}
            {/*    />*/}

            {accountOpen && (
                <AuthCard open={accountOpen} onClose={() => setAccountOpen(false)}/>
            )}

            <TimePickerModal
                open={timeModalOpen}
                onClose={() => setTimeModalOpen(false)}
                selectedStore={selectedStore}
                scheduleLater={scheduleLater}
                onPick={(meta: PickupSlot) => {
                    // derive hour/min from minutes
                    const hour = Math.floor(meta.startMin / 60);
                    const minute = meta.startMin % 60;

                    // keep your hour/min state (string, zero-padded)
                    setPickupHour(String(hour).padStart(2, "0"));
                    setPickupMinute(String(minute).padStart(2, "0"));

                    // keep a structured selection for label rendering
                    setSelectedSlot({
                        targetDate: meta.targetDate,
                        startMin: meta.startMin,
                        durationMin: meta.durationMin ?? 30,
                    });
                }}
            />
        </section>
    );
}
