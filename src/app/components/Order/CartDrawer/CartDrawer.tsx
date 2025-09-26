'use client';

import React, {
    useEffect,
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import {X, Minus, Plus, ChevronLeft, ChevronRight} from 'lucide-react';
import {useCart} from '@/app/lib/cart';
import {StoreLocation} from "@/app/lib/types";
import PrimaryButton from "@/app/components/Order/Stepper/PrimaryButton";
import {useRouter} from "next/navigation";
import {LOCATIONS} from "@/app/lib/locations";
import {useOrder} from "@/app/components/Order/Stepper/OrderCtx";
import QuantityDropdown from "@/app/components/Order/CartDrawer/QuantityDropdown";

type Modifier = { id: string; name: string; priceCents: number };
type CartItem = {
    id: string;
    name: string;
    basePriceCents: number;
    quantity: number;
    modifiers?: Modifier[];
};

type Props = {
    open: boolean;
    setOpen: (v: boolean) => void;
    anchorRef: React.RefObject<HTMLElement | null>;
    isMobile?: boolean
};

export default function CartDrawer({open, setOpen, anchorRef, isMobile = false}: Props) {
    const router = useRouter();

    async function checkout() {
        setOpen(false);
        router.push('/order/checkout');
    }

    const cart = useCart() as any;
    const {selectedStoreId} = useOrder();
    const location: StoreLocation | null = useMemo(
        () => (selectedStoreId ? LOCATIONS.find(s => s.id === selectedStoreId) || null : null),
        [selectedStoreId]
    );

    useEffect(() => {
        if (selectedStoreId) return;

        if (cart?.clearCart) cart.clearCart();
        else if (cart?.empty) cart.empty();
        else if (cart?.removeAll) cart.removeAll();
        else if (Array.isArray(cart?.items)) {
            cart.items.forEach((it: any) => {
                if (cart.removeItem) cart.removeItem(it.id);
                else if (cart.remove) cart.remove(it.id);
            });
        }

        if (open) setOpen(false);

        router.replace("/order");
    }, [selectedStoreId]);

    const rawItems: CartItem[] = cart.items ?? [];
    const uiItems = rawItems.map((i) => {
        const modsTotal =
            i.modifiers?.reduce((s, m) => s + (m.priceCents ?? 0), 0) ?? 0;
        return {
            id: i.id,
            name: i.name,
            qty: i.quantity ?? 1,
            unitCents: (i.basePriceCents ?? 0) + modsTotal,
            modifiers: i.modifiers ?? [],
        };
    });

    const subtotalCents: number =
        cart.subtotalCents ?? uiItems.reduce((s, i) => s + i.unitCents * i.qty, 0);

    const itemCount = useMemo(
        () => uiItems.reduce((n, i) => n + i.qty, 0),
        [uiItems]
    );
    const subtotalUsd = useMemo(
        () =>
            (subtotalCents / 100).toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD',
            }),
        [subtotalCents]
    );

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

    const [pos, setPos] = useState<{ top: number; left: number; width: number }>(
        {top: 0, left: 0, width: 0}
    );

    const panelRef = useRef<HTMLDivElement | null>(null);

    const recompute = () => {
        const anchor = anchorRef?.current;
        if (!anchor) return;

        const rect = anchor.getBoundingClientRect();
        const margin = 8;

        const vw = window.innerWidth;
        const maxWidth = Math.min(500, vw - margin * 2);

        let top = Math.round(rect.bottom + margin);
        let left = Math.round(rect.right - maxWidth);

        const isMobile = vw < 640;
        const isDesktop = vw >= 1024;

        if (isMobile) {
            top -= 700;
        }

        if (isDesktop) {
            left += 70;
        }

        left = Math.max(margin, Math.min(left, vw - maxWidth - margin));

        setPos({top, left, width: maxWidth});
    };

    useLayoutEffect(() => {
        if (!open) return;
        recompute();
        const onResize = () => recompute();
        const onScroll = () => recompute();
        window.addEventListener('resize', onResize);
        window.addEventListener('scroll', onScroll, {passive: true});
        return () => {
            window.removeEventListener('resize', onResize);
            window.removeEventListener('scroll', onScroll);
        };
    }, [open]);

    if (!open) return null;

    const resetCart = () => {
        if (cart.clearCart) {
            cart.clearCart();
        } else if (cart.empty) {
            cart.empty();
        } else if (cart.removeAll) {
            cart.removeAll();
        } else {
            uiItems.forEach((it) => remove(it.id));
        }
    };

    return (
        <>
            <div
                aria-hidden
                className="fixed inset-0 z-[100] pointer-events-none pb-10"
            />

            {/* Anchored panel */}
            <div
                ref={panelRef}
                role="dialog"
                aria-label="Shopping cart"
                className="fixed z-[1001] rounded-2xl border border-neutral-200 bg-white shadow-2xl flex flex-col"
                style={{
                    top: pos.top,
                    left: pos.left,
                    width: pos.width,
                    padding: "1rem"
                }}
                onPointerDownCapture={(e) => e.stopPropagation()}
            >
                {/* arrow */}
                {!isMobile && (
                    <div
                        aria-hidden
                        className="absolute -top-2 right-18 h-4 w-4 rotate-45 border-l border-t border-neutral-200 bg-white"
                    />
                )}

                {/* Header */}
                <div className="flex items-start justify-between border-b border-[#E8E8E8] pb-3 pt-4">
                    <div className="min-w-0">
                        <h2 className="truncate text-[22px] sm:text-[25px] font-semibold leading-tight">
                            {location?.brand} <span style={{color: "#AF3935"}}>{location?.city}</span>
                        </h2>
                        <p className="mt-0.5 text-[17px] sm:text-[18px] text-neutral-700">{location?.address}</p>
                    </div>
                    <button
                        onClick={() => setOpen(false)}
                        aria-label="Close"
                        className="-mr-1 rounded-full p-2 hover:bg-neutral-100 cursor-pointer"
                    >
                        <X className="h-5 w-5"/>
                    </button>
                </div>

                {/* Summary row */}
                <div className="flex items-center justify-between py-3 text-[15px]">
                    <div className="flex items-center gap-4 text-[#262626]">
                        <span className="font-bold font-xl">
                          {itemCount} {itemCount === 1 ? 'item' : 'items'}
                        </span>
                        {itemCount > 0 && (
                            <button
                                onClick={resetCart}
                                className="text-sm text-[#262626] hover:underline cursor-pointer"
                            >
                                reset
                            </button>
                        )}
                    </div>
                    <div className="text-[#262626] font-bold font-xl">
                        <span className="mr-1">Subtotal:</span>
                        <span className="font-semibold">{subtotalUsd}</span>
                    </div>
                </div>

                {/* Scrollable content */}
                <div className="max-h-[60vh] overflow-auto pb-4">
                    {uiItems.length === 0 ? (
                        <div className="rounded-lg bg-neutral-50 text-sm text-neutral-600">
                            Your cart is empty.
                        </div>
                    ) : (
                        <ul className="divide-y divide-neutral-200">
                            {uiItems.map((it) => (
                                <li key={it.id} className="py-3">
                                    <div className="flex items-start justify-between gap-3">
                                        <QuantityDropdown
                                            value={it.qty}
                                            onChange={(n) => setQty(it.id, it.qty, n)}
                                            min={0}
                                            max={20}
                                            step={1}
                                            className="h-8"
                                        />

                                        <div className="min-w-0 flex-1">
                                            <div
                                                className="truncate text-[15px] sm:text-[18px] font-semibold leading-tight">{formatWithBreaks(it.name)}</div>
                                            {it.modifiers?.length ? (
                                                <div
                                                    className="mt-1 space-y-0.5 text-[12px] sm:text-[13px] text-neutral-600">
                                                    {it.modifiers.slice(0, 6).map((m) => (
                                                        <div key={m.id} className="truncate">{m.name}</div>
                                                    ))}
                                                </div>
                                            ) : null}
                                        </div>

                                        <div className="text-[15px] sm:text-[18px] font-semibold leading-none">
                                            {((it.unitCents * it.qty) / 100).toLocaleString('en-US', {
                                                style: 'currency',
                                                currency: 'USD'
                                            })}
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}

                    {/*<div className="mt-5">*/}
                    {/*    <div className="mb-2 flex items-center justify-between">*/}
                    {/*        <h3 className="text-[16px] font-semibold">Offers for you</h3>*/}
                    {/*        <div className="flex items-center gap-1 text-neutral-500">*/}
                    {/*            <button className="p-1 hover:text-neutral-800 cursor-pointer" aria-label="Prev">*/}
                    {/*                <ChevronLeft className="h-5 w-5" />*/}
                    {/*            </button>*/}
                    {/*            <button className="p-1 hover:text-neutral-800 cursor-pointer" aria-label="Next">*/}
                    {/*                <ChevronRight className="h-5 w-5" />*/}
                    {/*            </button>*/}
                    {/*        </div>*/}
                    {/*    </div>*/}

                    {/*    <div className="grid grid-cols-3 gap-3">*/}
                    {/*        {[*/}
                    {/*            { t: 'Burrito', p: 1345, img: '/offers/burrito.jpg' },*/}
                    {/*            { t: 'Tacos', p: 1345, img: '/offers/tacos.jpg' },*/}
                    {/*            { t: 'Salad', p: 1435, img: '/offers/salad.jpg' },*/}
                    {/*        ].map((o, i) => (*/}
                    {/*            <div key={i} className="overflow-hidden rounded-2xl border">*/}
                    {/*                <div className="relative h-[110px] w-full bg-neutral-100">*/}
                    {/*                    <img src={o.img} alt="" className="h-full w-full object-cover" />*/}
                    {/*                    <button*/}
                    {/*                        className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-white shadow cursor-pointer" // add pointer*/}
                    {/*                        aria-label={`Add ${o.t}`}*/}
                    {/*                    >*/}
                    {/*                        <Plus className="h-4 w-4" />*/}
                    {/*                    </button>*/}
                    {/*                </div>*/}
                    {/*                <div className="p-3">*/}
                    {/*                    <div className="text-[13px] font-medium leading-tight">{o.t}</div>*/}
                    {/*                    <div className="mt-1 text-[13px] text-neutral-600">*/}
                    {/*                        {(o.p / 100).toLocaleString('en-US', {*/}
                    {/*                            style: 'currency',*/}
                    {/*                            currency: 'USD',*/}
                    {/*                        })}*/}
                    {/*                    </div>*/}
                    {/*                    <div className="mt-2 inline-flex items-center gap-1 rounded bg-neutral-100 px-2 py-[2px] text-[11px] font-medium text-neutral-700">*/}
                    {/*                        Free on $20.00+*/}
                    {/*                    </div>*/}
                    {/*                </div>*/}
                    {/*            </div>*/}
                    {/*        ))}*/}
                    {/*    </div>*/}
                    {/*</div>*/}
                </div>

                {/* Footer */}
                <div className="border-t border-[#E8E8E8] py-3">
                    <div className="mb-2 flex items-center justify-between text-[15px] sm:text-[16px]">
                        <span className="text-[#262626] text-xl text-semibold">Subtotal</span>
                        <span className="font-semibold text-lg">{subtotalUsd}</span>
                    </div>
                    <button
                        className="mt-3 w-full rounded-2xl pt-4 pb-3 text-center text-[18px] font-semibold text-white cursor-pointer">
                        <PrimaryButton
                            disabled={rawItems.length === 0}
                            onClick={checkout}
                        >
                            Go to checkout
                        </PrimaryButton>
                    </button>
                </div>
            </div>
        </>
    );
}
