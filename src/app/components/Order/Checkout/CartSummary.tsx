"use client";
import React, {useMemo} from "react";
import { useCart } from "@/app/lib/cart";
import QuantityDropdown from "@/app/components/Order/CartDrawer/QuantityDropdown";
import {Line, SectionTitle} from "@/app/components/ui/Card";

type Modifier = { id: string; name: string; priceCents: number };
type UiItem = { id: string; name: string; qty: number; unitCents: number; modifiers: Modifier[] };

export function CartSummary() {
    const cart = useCart() as any;

    const inc = (id: string) => {
        if (cart.increaseQty) return cart.increaseQty(id);
        if (cart.incQty) return cart.incQty(id);
        if (cart.increment) return cart.increment(id);
    };

    const dec = (id: string) => {
        if (cart.decreaseQty) return cart.decreaseQty(id);
        if (cart.decQty) return cart.decQty(id);
        if (cart.decrement) return cart.decrement(id);
    };

    const remove = (id: string) => {
        if (cart.removeItem) return cart.removeItem(id);
        if (cart.remove) return cart.remove(id);
    };

    const setQty = (id: string, current: number, next: number) => {
        const n = Math.max(0, Math.floor(next));
        if (n === current) return;

        if (cart.setQty) return cart.setQty(id, n);
        if (cart.updateQty) return cart.updateQty(id, n);
        if (cart.setQuantity) return cart.setQuantity(id, n);
        if (cart.changeQty) return cart.changeQty(id, n);

        if (n === 0) return remove?.(id);
        if (n > current) {
            for (let i = 0; i < n - current; i++) inc?.(id);
        } else {
            for (let i = 0; i < current - n; i++) {
                dec?.(id);
            }
        }
    };
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
        return (
            <div className="space-y-3">
                <div className="py-3 text-sm text-neutral-600">Your cart is empty.</div>
            </div>
        );
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
        <>
            <SectionTitle>Cart Summary</SectionTitle>
            <Line/>
            <ul className="divide-y divide-neutral-200">

                {uiItems.map((it) => (
                    <li key={it.id} className="py-3">
                        <div className="flex items-start justify-between gap-3">
                            <div className="">
                                <QuantityDropdown
                                    value={it.qty}
                                    onChange={(n) => setQty(it.id, it.qty, n)}
                                    min={0}
                                    max={20}
                                    step={1}
                                    className="h-8"/>
                            </div>
                            <div className="min-w-0 flex-1">
                                <div className="truncate text-[15px] sm:text-[18px] font-semibold leading-tight">
                                    {formatWithBreaks(it.name)}
                                </div>
                                {it.modifiers?.length ? (
                                    <div className="mt-1 space-y-0.5 text-[13px] sm:text-[15px] text-neutral-600">
                                        {it.modifiers.slice(0, 6).map((m) => (
                                            <div key={m.id} className="truncate">{m.name}</div>
                                        ))}
                                    </div>
                                ) : null}
                            </div>
                            <div className="text-[15px] sm:text-[18px] font-semibold leading-none">
                                {((it.unitCents * it.qty) / 100).toLocaleString("en-US", {
                                    style: "currency",
                                    currency: "USD"
                                })}
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </>
    );
}
