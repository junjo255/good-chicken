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

type Profile = {
    id: string;
    full_name?: string | null;
    address?: any | null;
    preferred_location?: string | null;
};

export default function Checkout() {
    const {selectedStoreId, scheduleLater} = useOrder() as any;
    const router = useRouter();
    const cloverRef = useRef<CloverCardFieldsHandle | null>(null);
    const [sessionUserId, setSessionUserId] = useState<string | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loadingProfile, setLoadingProfile] = useState(false);

    useEffect(() => {
        const getSession = async () => {
            const { data } = await supabase.auth.getSession();
            setSessionUserId(data.session?.user?.id ?? null);
        };
        getSession();

        const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
            setSessionUserId(s?.user?.id ?? null);
        });
        return () => sub.subscription.unsubscribe();
    }, []);

    useEffect(() => {
        if (!sessionUserId) { setProfile(null); return; }
        let active = true;
        const run = async () => {
            setLoadingProfile(true);
            const { data, error } = await supabase
                .from("profiles")
                .select("id, full_name, address, preferred_location")
                .eq("id", sessionUserId)
                .maybeSingle();
            if (!active) return;
            if (!error && data) setProfile(data as Profile);
            setLoadingProfile(false);
        };
        run();
        return () => { active = false; };
    }, [sessionUserId]);
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
        if (time === undefined || time === null) return { hh: "", mm: "" };

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

        return { hh: "", mm: "" };
    }

    const [accountOpen, setAccountOpen] = useState(false);

    const handleLogin = () => setAccountOpen(true);
    useEffect(() => {
        if (accountOpen) document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = ""; };
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


    return (
        <section
            style={{marginTop: "var(--header-h, 96px)", scrollMarginTop: "var(--header-h, 96px)"}}
            className="min-h-screen w-full pb-24 md:pb-12"
        >
            {/* Top bar */}
            <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-6">
                <Link
                    href="/order"
                    className="inline-flex items-center gap-2 text-lg font-medium text-neutral-700 hover:text-black cursor-pointer"
                >
                    <ArrowLeft className="h-4 w-4"/> Back to order

                </Link>
                <div className="text-xl font-semibold tracking-tight">Pickup Checkout</div>
                <div className="w-[192px]"/>
            </div>

            {/* Content */}
            <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 md:grid-cols-3">
                {/* LEFT */}
                <div className="md:col-span-2 space-y-4">
                    <Card>
                        <div className="flex items-center justify-between p-5">
                            <div className="text-[18px] font-bold">Pickup details</div>
                        </div>
                        <Row
                            icon={MapPin}
                            title={selectedStore ? selectedStore.brand : "Choose a store"}
                            subtitle={selectedStore?.address}
                            action="Edit"
                            onAction={() => {/* open store picker when ready */
                            }}
                        />
                        <Line/>
                        <div className="p-4">
                            <SectionTitle>Pickup time</SectionTitle>
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
                                            <label className="block text-xs font-medium text-neutral-600 mb-1">Hours
                                                (HH)</label>
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
                                            <label className="block text-xs font-medium text-neutral-600 mb-1">Minutes
                                                (MM)</label>
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
                            <div className="text-[15px] md:text-[18px] font-bold">Payment</div>
                        </div>
                        <Line/>
                        {!selectedPayment ? (
                            <div className="p-4 text-sm text-neutral-600">Choose a payment method.</div>
                        ) : (
                            <Row
                                icon={CreditCard}
                                title={
                                    <div className="font-medium">
                                        {selectedPayment.brand === "applepay"
                                            ? "Apple Pay"
                                            : `${selectedPayment.label}${selectedPayment.last4 ? ` —••••${selectedPayment.last4}` : ""}`}
                                    </div>
                                }
                                action="Edit"
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
                <div className="space-y-4">
                    <Card>

                        {!sessionUserId && !profile ?
                            <button
                                onClick={handleLogin}
                                className="hidden md:block w-full rounded-lg bg-[#E9BC46] py-3 text-center text-[15px] md:text-[18px] font-semibold text-[#3F3126] cursor-pointer"
                            >
                                Login
                            </button>
                            :
                            <>
                                {sessionUserId}
                            </>
                        }

                    </Card>
                    <Card>
                        <div className="p-4">
                            <div className="flex items-start gap-3">
                                <div>
                                    <div className="text-[15px] font-semibold">{selectedStore?.brand ?? "—"}</div>
                                    <div className="text-sm text-neutral-600">{selectedStore?.address ?? "—"}</div>
                                </div>
                            </div>

                            <div className="mt-4 rounded-xl">
                                <div className="py-3 text-[18px] font-bold">Cart summary</div>
                                <Line/>
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
                            <div className="text-[15px] md:text-[18px] font-semibold">Order total</div>
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
                                <div className="font-semibold">Total</div>
                                <div className="font-semibold">
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
                <AuthCard open={accountOpen} onClose={() => setAccountOpen(false)} />
            )}
        </section>
    );
}
