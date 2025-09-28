"use client";
import React, { useMemo } from "react";
import { Info, X, ChevronDown } from "lucide-react";

export type NewCard = {
    number: string;
    expiry: string;
    cvc: string;
    country: string;
    zip: string;
    nickname?: string;
};

function luhnOk(num: string) {
    const s = num.replace(/\D/g, "");
    if (s.length < 12) return false;
    let sum = 0,
        dbl = false;
    for (let i = s.length - 1; i >= 0; i--) {
        let d = parseInt(s[i], 10);
        if (dbl) {
            d *= 2;
            if (d > 9) d -= 9;
        }
        sum += d;
        dbl = !dbl;
    }
    return sum % 10 === 0;
}

function isExpiryOk(exp: string) {
    const m = exp.match(/^(\d{2})\s*\/\s*(\d{2})$/);
    if (!m) return false;
    const mm = +m[1],
        yy = +m[2];
    if (mm < 1 || mm > 12) return false;
    const year = 2000 + yy;
    const end = new Date(year, mm, 0, 23, 59, 59);
    return end >= new Date();
}

export function AddCardForm({
                                value,
                                onChange,
                                onSubmit,
                                submitting = false,
                                showHeader = false,
                                onClose,
                            }: {
    value: NewCard;
    onChange: (next: NewCard) => void;
    onSubmit: () => void;
    submitting?: boolean;
    showHeader?: boolean;
    onClose?: () => void;
}) {
    const canSubmit = useMemo(() => {
        const digits = value.number.replace(/\D/g, "");
        const okNumber = luhnOk(digits);
        const okExp = isExpiryOk(value.expiry);
        const okCvc = value.cvc.replace(/\D/g, "").length >= 3;
        const okZip = value.zip.trim().length >= 3;
        return okNumber && okExp && okCvc && okZip && !!value.country;
    }, [value]);

    const input =
        "w-full rounded-lg border border-neutral-300 px-3 py-2 text-[15px] outline-none focus:ring-2 focus:ring-[#AF3935] bg-white placeholder-neutral-400";
    const label =
        "text-[13px] md:text-[15px] font-medium text-neutral-800 mb-1";

    return (
        <form
            className="w-full"
            autoComplete="on"
            onSubmit={(e) => {
                e.preventDefault();
                if (canSubmit && !submitting) onSubmit();
            }}
        >
            {showHeader && (
                <div className="mb-4 flex items-center justify-between">
                    <div className="text-2xl md:text-[26px] font-bold tracking-tight">
                        Add credit or debit card
                    </div>
                    {onClose && (
                        <button
                            type="button"
                            onClick={onClose}
                            className="p-1 rounded-full hover:bg-neutral-100"
                        >
                            <X className="h-6 w-6 text-neutral-600" />
                        </button>
                    )}
                </div>
            )}

            <div className="mb-3">
                <label className={label} htmlFor="cc-number">
                    Card Number
                </label>
                <div className="relative">
                    <input
                        id="cc-number"
                        name="cc-number"
                        type="tel"
                        inputMode="numeric"
                        autoComplete="cc-number"
                        className={`${input} pr-12`}
                        placeholder="•••• •••• •••• ••••"
                        value={value.number}
                        onChange={(e) => onChange({ ...value, number: e.target.value })}
                        spellCheck={false}
                    />
                    <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-7 w-10 rounded bg-neutral-200" />
                </div>
            </div>

            <div className="mb-3 grid grid-cols-2 gap-3">
                <div>
                    <label className={label} htmlFor="cc-exp">
                        Exp. Date
                    </label>
                    <input
                        id="cc-exp"
                        name="cc-exp"
                        type="tel"
                        inputMode="numeric"
                        autoComplete="cc-exp"
                        className={input}
                        placeholder="MM / YY"
                        value={value.expiry}
                        onChange={(e) => onChange({ ...value, expiry: e.target.value })}
                        spellCheck={false}
                    />
                </div>
                <div>
                    <div className={`${label} flex items-center gap-1`}>
                        <label htmlFor="cc-csc" className="cursor-pointer">
                            Security Code
                        </label>
                        <Info className="h-4 w-4 text-neutral-400" />
                    </div>
                    <input
                        id="cc-csc"
                        name="cc-csc"
                        type="tel"
                        inputMode="numeric"
                        autoComplete="cc-csc"
                        className={input}
                        placeholder="CVC"
                        value={value.cvc}
                        onChange={(e) => onChange({ ...value, cvc: e.target.value })}
                        spellCheck={false}
                    />
                </div>
            </div>

            <div className="mb-3">
                <label className={label} htmlFor="country">
                    Country
                </label>
                <div className="relative">
                    <select
                        id="country"
                        name="country"
                        autoComplete="country-name"
                        className={`${input} appearance-none`}
                        value={value.country}
                        onChange={(e) => onChange({ ...value, country: e.target.value })}
                    >
                        <option value="">Select a country</option>
                        <option>United States</option>
                        <option>Canada</option>
                        <option>United Kingdom</option>
                        <option>Australia</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-500" />
                </div>
            </div>

            <div className="mb-3">
                <label className={label} htmlFor="postal-code">
                    Zip Code
                </label>
                <input
                    id="postal-code"
                    name="postal-code"
                    type="tel"
                    inputMode="numeric"
                    autoComplete="postal-code"
                    className={input}
                    value={value.zip}
                    onChange={(e) => onChange({ ...value, zip: e.target.value })}
                    spellCheck={false}
                />
            </div>

            <div className="mb-4">
                <label className={label} htmlFor="nickname">
                    Nickname (optional)
                </label>
                <input
                    id="nickname"
                    name="nickname"
                    className={input}
                    placeholder="e.g. joint account or work card"
                    autoComplete="off"
                    value={value.nickname ?? ""}
                    onChange={(e) => onChange({ ...value, nickname: e.target.value })}
                />
            </div>

            <button
                type="submit"
                disabled={!canSubmit || submitting}
                className={`w-full rounded-xl py-4 text-[15px] font-semibold ${
                    canSubmit && !submitting
                        ? "bg-[#AF3935] text-white"
                        : "bg-neutral-300 text-white cursor-not-allowed"
                }`}
            >
                {submitting ? "Adding..." : "Add Card"}
            </button>
        </form>
    );
}
