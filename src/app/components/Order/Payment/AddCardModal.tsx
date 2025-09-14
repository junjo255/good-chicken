"use client";
import React, { useState } from "react";
import { AddCardForm, NewCard } from "./AddCardForm";

export function AddCardModal({
                                 open, onClose,
                                 onSaved,
                                 defaultCountry = "United States",
                             }: {
    open: boolean; onClose: () => void;
    onSaved: (saved: { id: string; label: string; brand: "visa" | "mastercard" | "card"; last4: string }) => void;
    defaultCountry?: string;
}) {
    const [card, setCard] = useState<NewCard>({ number: "", expiry: "", cvc: "", country: defaultCountry, zip: "", nickname: "" });
    const [saving, setSaving] = useState(false);

    const handleSubmit = async () => {
        setSaving(true);
        const digits = card.number.replace(/\D/g, "");
        const last4 = digits.slice(-4) || "0000";
        const brand = digits.startsWith("4") ? "visa" : digits.startsWith("5") ? "mastercard" : "card";
        const label = card.nickname?.trim() || "Card";
        onSaved({ id: `pm_${Date.now()}`, label, brand, last4 });
        setSaving(false);
        onClose();
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[70] flex items-end md:items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={onClose} />
            <div className="relative w-full md:w-[520px] rounded-t-2xl md:rounded-2xl bg-white shadow-2xl p-4 md:p-6">
                <AddCardForm value={card} onChange={setCard} onSubmit={handleSubmit} submitting={saving} showHeader onClose={onClose}/>
            </div>
        </div>
    );
}
