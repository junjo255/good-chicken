"use client";
import React from "react";
import { X, Briefcase, User, Plus } from "lucide-react";
import type { PaymentKind, Pm } from "./types";

function BrandIcon({ brand }: { brand: Pm["brand"] }) {
    const base = "inline-flex h-5 min-w-8 items-center justify-center rounded px-1 text-[11px] font-semibold";
    if (brand === "visa") return <span className={`${base} bg-blue-600 text-white`}>VISA</span>;
    if (brand === "mastercard") return <span className={`${base} bg-black text-white`}>MC</span>;
    if (brand === "applepay") return <span className={`${base} bg-neutral-900 text-white`}>Pay</span>;
    return <span className={`${base} bg-neutral-800 text-white`}>CARD</span>;
}
function Radio({ checked, disabled }: { checked: boolean; disabled?: boolean }) {
    return (
        <span
            className={[
                "relative flex h-[18px] w-[18px] items-center justify-center rounded-full border",
                disabled ? "border-neutral-300" : checked ? "border-black" : "border-neutral-400",
                disabled ? "bg-neutral-200" : "bg-white",
            ].join(" ")}
        >
      {checked && !disabled ? <span className="h-[10px] w-[10px] rounded-full bg-black" /> : null}
    </span>
    );
}
function SegmentTabs({
                         active, onChange,
                     }: { active: PaymentKind; onChange: (k: PaymentKind) => void }) {
    const base = "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium";
    const onCls = "bg-black text-white";
    const offCls = "bg-neutral-100 text-neutral-800";
    return (
        <div className="inline-flex gap-2 rounded-full bg-neutral-100 p-1">
            <button className={`${base} ${active === "personal" ? onCls : offCls}`} onClick={() => onChange("personal")}>
                <User className="h-4 w-4" /> Personal
            </button>
            <button className={`${base} ${active === "business" ? onCls : offCls}`} onClick={() => onChange("business")}>
                <Briefcase className="h-4 w-4" /> Business
            </button>
        </div>
    );
}
function PaymentRow({
                        pm, selected, onSelect,
                    }: { pm: Pm; selected: boolean; onSelect: (id: string) => void }) {
    const disabled = pm.available === false;
    return (
        <button
            type="button"
            onClick={() => !disabled && onSelect(pm.id)}
            className={[
                "w-full select-none items-center justify-between px-3 py-5 text-left flex cursor-pointer",
                disabled ? "opacity-60 cursor-not-allowed" : "hover:bg-neutral-50",
            ].join(" ")}
        >
            <div className="flex items-center gap-3">
                <BrandIcon brand={pm.brand} />
                <div className="text-[15px] md:text-[17px]">
                    {pm.brand === "applepay" ? (
                        <div className="flex items-center gap-2">
                            <span>Apple Pay</span>
                            {pm.note && <span className="text-[13px]  md:text-[16px] text-[#D64545]">{pm.note}</span>}
                        </div>
                    ) : (
                        <>
                            <span>{pm.label}</span>
                            {pm.last4 && <span className="ml-1 text-neutral-500">—••••{pm.last4}</span>}
                        </>
                    )}
                </div>
            </div>
            <Radio checked={selected} disabled={disabled} />
        </button>
    );
}

export function PaymentOptionsModal({
                                        open, onClose,
                                        activeTab, onTabChange,
                                        payments, selectedId,
                                        onSelect, onAddNew, onSave,
                                    }: {
    open: boolean; onClose: () => void;
    activeTab: PaymentKind; onTabChange: (k: PaymentKind) => void;
    payments: Pm[]; selectedId: string | null;
    onSelect: (id: string) => void;
    onAddNew: () => void;
    onSave: () => void;
}) {
    if (!open) return null;
    // const visible = payments.filter((p) =>
    //     activeTab === "personal" ? p.kind !== "business" : p.kind === "business"
    // );
    return (
        <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={onClose} />
            <div className="relative w-full md:w-[520px] rounded-t-2xl md:rounded-2xl bg-white shadow-2xl p-4 md:p-6">
                <div className="flex items-center justify-between">
                    <div className="text-2xl md:text-[26px] text-[#3F3126] font-bold tracking-tight">Payment options</div>
                    <button onClick={onClose} className="p-1 rounded hover:bg-neutral-100">
                        <X className="h-6 w-6 text-neutral-600" />
                    </button>
                </div>

                {/*<div className="mt-4"><SegmentTabs active={activeTab} onChange={onTabChange} /></div>*/}

                <div className="mt-4 rounded-2xl  overflow-hidden">
                    {payments.map((pm) => (
                        <PaymentRow key={pm.id} pm={pm} selected={pm.id === selectedId} onSelect={onSelect} />
                    ))}
                    <button type="button" onClick={onAddNew} className="flex w-full items-center gap-2 px-3 py-3 hover:bg-neutral-50 cursor-pointer">
                        <Plus className="h-5 w-5" />
                        <span className="text-[15px] md:text-[17px] font-medium">Add Payment Method</span>
                    </button>
                </div>

                <button
                    type="button"
                    onClick={onSave}
                    className="mt-4 w-full rounded-xl bg-[#AF3935] py-3 text-[15px] md:text-[18px] font-semibold text-white"
                >
                    Save
                </button>
            </div>
        </div>
    );
}
