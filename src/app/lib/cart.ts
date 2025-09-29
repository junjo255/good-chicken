'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { v4 as uuid } from "uuid";

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

function isExpired(ts?: number) {
    return !ts || Date.now() - ts > ONE_DAY_MS;
}

export type CartModifier = { id: string; name: string; priceCents: number };
export type CartLine = {
    id: string;
    sku: string;
    name: string;
    basePriceCents: number;
    quantity: number;
    modifiers: CartModifier[];
};

type CartStore = {
    items: CartLine[];
    createdAt: number;
    addItem: (sku: string, name: string, basePriceCents: number, modifiers?: CartModifier[]) => void;
    increaseQty: (id: string) => void;
    decreaseQty: (id: string) => void;
    removeItem: (id: string) => void;
    clear: () => void;
};

const sameMods = (a: CartModifier[] = [], b: CartModifier[] = []) => {
    if (a.length !== b.length) return false;
    const norm = (arr: CartModifier[]) =>
        arr
            .slice()
            .map((m) => `${m.id}:${m.name}:${m.priceCents}`)
            .sort()
            .join('|');
    return norm(a) === norm(b);
};

export const useCart = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],
            createdAt: Date.now(),
            _ensureFresh() {
                if (isExpired(get().createdAt)) {
                    set({ items: [], createdAt: Date.now() });
                }
            },
            addItem: (sku, name, basePriceCents, modifiers = []) => {
                set((state) => {
                    const idx = state.items.findIndex(
                        (i) => i.sku === sku && sameMods(i.modifiers, modifiers)
                    );
                    if (idx >= 0) {
                        const next = state.items.slice();
                        next[idx] = { ...next[idx], quantity: next[idx].quantity + 1 };
                        return { items: next };
                    }
                    const id = `${sku}-${Math.random().toString(36).slice(2, 9)}`;
                    const line: CartLine = { id, sku, name, basePriceCents, quantity: 1, modifiers };
                    return {
                        items: [...state.items, line]
                    };
                });
            },
            increaseQty: (id) =>
                set((state) => ({
                    items: state.items.map((i) => (i.id === id ? { ...i, quantity: i.quantity + 1 } : i)),
                })),
            decreaseQty: (id) =>
                set((state) => {
                    const it = state.items.find((i) => i.id === id);
                    if (!it) return {};
                    if (it.quantity > 1) {
                        return {
                            items: state.items.map((i) =>
                                i.id === id ? { ...i, quantity: i.quantity - 1 } : i
                            ),
                        };
                    }
                    return { items: state.items.filter((i) => i.id !== id) };
                }),
            removeItem: (id) => set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
            clear: () => set({ items: [] }),
        }),
        {
            name: 'gc-cart',
            storage:
                typeof window !== 'undefined' ? createJSONStorage(() => localStorage) : undefined,
        }
    )
);
