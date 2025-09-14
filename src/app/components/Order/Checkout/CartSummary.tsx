"use client";
import React, { useMemo } from "react";
import { useCart } from "@/app/lib/cart";

type Modifier = { id: string; name: string; priceCents: number };
type UiItem = { id: string; name: string; qty: number; unitCents: number; modifiers: Modifier[] };

export function CartSummary() {
    const cart = useCart() as any;

    const uiItems: UiItem[] = useMemo(() => {
        const raw = (cart?.items ?? []) as Array<{
            id: string; name: string; basePriceCents?: number; quantity?: number; modifiers?: Modifier[];
        }>;
        return raw.map((i) => {
            const modsTotal = i.modifiers?.reduce((s, m) => s + (m.priceCents ?? 0), 0) ?? 0;
            return { id: i.id, name: i.name, qty: i.quantity ?? 1, unitCents: (i.basePriceCents ?? 0) + modsTotal, modifiers: i.modifiers ?? [] };
        });
    }, [cart?.items]);

    if (!uiItems.length) {
        return <div className="py-3 text-sm text-neutral-600">Your cart is empty.</div>;
    }

    const formatWithBreaks = (txt: string) => {
        const parts = txt.split(/\s*[–—-]\s*/);

        return (
            <>
                {parts.map((part, index) => (
                    <React.Fragment key={index}>
                        {part}
                        {index < parts.length - 1 && <br/>}
                    </React.Fragment>
                ))}
            </>
        );
    }

    return (
        <ul className="divide-y divide-neutral-200">
            {uiItems.map((it) => (
                <li key={it.id} className="py-3">
                    <div className="flex items-start justify-between gap-3">
                        <div className="">{it.qty}</div>
                        <div className="min-w-0 flex-1">
                            <div className="truncate text-[15px] sm:text-[18px] font-semibold leading-tight">
                                {formatWithBreaks(it.name)}
                                {/*<span className="text-neutral-500">× {it.qty}</span>*/}
                            </div>
                            {it.modifiers?.length ? (
                                <div className="mt-1 space-y-0.5 text-[12px] sm:text-[13px] text-neutral-600">
                                    {it.modifiers.slice(0, 6).map((m) => (
                                        <div key={m.id} className="truncate">{m.name}</div>
                                    ))}
                                </div>
                            ) : null}
                        </div>
                        <div className="text-[15px] sm:text-[18px] font-semibold leading-none">
                            {((it.unitCents * it.qty) / 100).toLocaleString("en-US", { style: "currency", currency: "USD" })}
                        </div>
                    </div>
                </li>
            ))}
        </ul>
    );
}
