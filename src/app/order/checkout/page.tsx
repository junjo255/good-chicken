"use client";

import React, {useEffect, useMemo, useRef, useState} from "react";
import {ArrowLeft, ChevronRight, MapPin, CreditCard, CalendarDays} from "lucide-react";
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
import {CloverCardFields, CloverCardFieldsHandle, cloverCreateToken} from "@/app/components/Order/Payment/clover";
import {isOpenNow} from "@/app/utils";
import {supabase} from "@/app/lib/supabase/client";
import AuthCard from "@/app/components/Auth/AuthCard";
import Link from "next/link";
import {AppRouterInstance} from "next/dist/shared/lib/app-router-context.shared-runtime";
import {ConfirmResetModal, resetStoreAndCartAndGoToOrder} from "@/app/components/Order/OrderReset/OrderReset";
import {useAuth} from "@/app/components/Auth/AuthProvider";

type Profile = {
    id: string;
    full_name?: string | null;
    address?: any | null;
    preferred_location?: string | null;
};

export default function Checkout() {
    const {selectedStoreId, scheduleLater} = useOrder() as any;
    const router = useRouter();
    const { userId, openAuth } = useAuth();

    // Store
    const selectedStore = useMemo(() => {
        if (!selectedStoreId) return null;
        return LOCATIONS.find((s) => s.id === selectedStoreId) || null;
    }, [selectedStoreId]);

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
        const {token} = await cloverCreateToken(process.env.NEXT_PUBLIC_CLOVER_PUBLIC_KEY!);

        setSelectedPaymentId(token);

        try {
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
                    source: selectedPaymentId,
                    amount: totalCents,
                    cartId: cartId, // temporary solution
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


    // Pickup time (HH:MM) — default to today's best guess (see effect below)
    const [pickupHour, setPickupHour] = useState<string>("");
    const [pickupMinute, setPickupMinute] = useState<string>("");

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
                        className="hidden md:block w-full rounded-lg bg-[#E9BC46] py-3 text-center text-[15px] md:text-[18px] font-semibold text-[#3F3126] cursor-pointer"
                    >
                        Login
                    </button>
                ) : (
                    <>{userId}</>
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
                    <ArrowLeft className="h-4 w-4"/> Back to order
                </Link>

                {/* Title: right on mobile, centered on desktop */}
                <div
                    className="justify-self-end md:justify-self-center text-md md:text-xl font-semibold tracking-tight">
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
                            action="change"
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
                            <div className="mt-3 rounded-xl border">
                                <button className="flex w-full items-center justify-between p-4 text-left">
                                    <div className="flex items-center gap-3">
                                        <CalendarDays className="h-4 w-4 text-neutral-700"/>
                                        <span className="text-[15px] font-medium text-neutral-800">
                                          {scheduleLater ? "Scheduled" : "ASAP"}
                                        </span>
                                    </div>
                                    <ChevronRight className="h-4 w-4 text-neutral-500"/>
                                </button>
                            </div>

                            {scheduleLater ?
                                <div className="mt-3 rounded-xl border p-4">
                                    <div className="flex items-center gap-3 mb-3">
                                        <CalendarDays className="h-4 w-4 text-neutral-700"/>
                                        <span className="text-[15px] font-medium text-neutral-800">
                                     {selectedStore ? "Choose your pickup time" : "Select a store to set time"}
                                 </span>
                                    </div>
                                    <div className="grid grid-cols-6 gap-3">
                                        <div className="col-span-3">
                                            <label className="block text-xs font-medium text-neutral-600 mb-1">
                                                Hours (HH)
                                            </label>
                                            <input
                                                type="number"
                                                min={0}
                                                max={23}
                                                placeholder="HH"
                                                value={pickupHour}
                                                onChange={(e) => {
                                                    const v = e.target.value.slice(0, 2);
                                                    if (v === "" || (/^\d+$/.test(v) && Number(v) <= 23)) setPickupHour(v);
                                                }}
                                                className="w-full rounded-lg border px-3 py-2 text-[15px] outline-none focus:ring-2 focus:ring-[#AF3935]"
                                                disabled={!selectedStore}
                                            />
                                        </div>
                                        <div className="col-span-3">
                                            <label className="block text-xs font-medium text-neutral-600 mb-1">
                                                Minutes (MM)
                                            </label>
                                            <input
                                                type="number"
                                                min={0}
                                                max={59}
                                                placeholder="MM"
                                                value={pickupMinute}
                                                onChange={(e) => {
                                                    const v = e.target.value.slice(0, 2);
                                                    if (v === "" || (/^\d+$/.test(v) && Number(v) <= 59)) setPickupMinute(v);
                                                }}
                                                className="w-full rounded-lg border px-3 py-2 text-[15px] outline-none focus:ring-2 focus:ring-[#AF3935]"
                                                disabled={!selectedStore}
                                            />
                                        </div>
                                    </div>
                                    {selectedStore?.hours && (
                                        <p className="mt-3 text-sm text-neutral-600">
                                            {(() => {
                                                const st = isOpenNow(selectedStore.hours);
                                                if (st.isOpen) return "Store is open now. Defaulted to current time.";
                                                if (st.isOpenToday) return "Store opens later today. Defaulted to today’s opening time.";
                                                return "Store is closed today. Please choose a different day/time.";
                                            })()}
                                        </p>
                                    )}
                                </div> : null
                            }
                        </div>
                    </Card>

                    <Card>
                        <div className="p-4">
                            <SectionTitle>Payment</SectionTitle>
                        </div>
                        <Line/>
                        {!selectedPayment ? (
                            <div className="p-4 text-sm md:text-md text-neutral-600">Choose a payment method.</div>
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
                        className="hidden md:block w-full rounded-lg bg-[#AF3935] py-4 text-center text-[15px] md:text-[18px] font-semibold text-white cursor-pointer"
                    >
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
                                    action="change"
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
                                className="mt-4 hidden md:block w-full rounded-lg bg-[#AF3935] py-4 text-center text-[15px] md:text-[18px] font-semibold text-white cursor-pointer"
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
                                <div className="font-semibold font-[18px]">
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
                    className="w-full rounded-lg bg-[#AF3935] py-5 text-center text-[15px] font-semibold text-white cursor-pointer"
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

            {accountOpen && (
                <AuthCard open={accountOpen} onClose={() => setAccountOpen(false)}/>
            )}
        </section>
    );
}
