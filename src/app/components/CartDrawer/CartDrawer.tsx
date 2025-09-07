'use client';

import React, {
    useEffect,
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import { X, Minus, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCart } from '@/app/lib/cart';

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
    /** pass a ref to the cart button/icon element */
    anchorRef: React.RefObject<HTMLElement | null>;
};

export default function CartDrawer({ open, setOpen, anchorRef }: Props) {
    const cart = useCart() as any;

    // Normalize for UI
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

    // Quantity handlers: call whichever your store exposes
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

    // ----- Anchored positioning right below the cart icon
    const [pos, setPos] = useState<{ top: number; left: number; width: number }>(
        { top: 0, left: 0, width: 0 }
    );
    const panelRef = useRef<HTMLDivElement | null>(null);

    const recompute = () => {
        const anchor = anchorRef?.current;
        if (!anchor) return;
        const rect = anchor.getBoundingClientRect();
        const margin = 8;
        const maxWidth = Math.min(420, window.innerWidth - margin * 2);
        const top = Math.round(rect.bottom + margin);
        // align right edge of panel to right edge of anchor, clamp to viewport
        let left = Math.round(rect.right - maxWidth);
        left = Math.max(margin, Math.min(left, window.innerWidth - maxWidth - margin));
        setPos({ top, left, width: maxWidth });
    };

    useLayoutEffect(() => {
        if (!open) return;
        recompute();
        const onResize = () => recompute();
        const onScroll = () => recompute();
        window.addEventListener('resize', onResize);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => {
            window.removeEventListener('resize', onResize);
            window.removeEventListener('scroll', onScroll);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    // Close on outside click + ESC
    useEffect(() => {
        if (!open) return;
        const onDocClick = (e: MouseEvent) => {
            const t = e.target as Node;
            const panel = panelRef.current;
            const anchor = anchorRef?.current;
            if (panel?.contains(t)) return;
            if (anchor && anchor.contains(t)) return; // clicking the button shouldn't close
            setOpen(false);
        };
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setOpen(false);
        };
        document.addEventListener('mousedown', onDocClick);
        document.addEventListener('keydown', onKey);
        return () => {
            document.removeEventListener('mousedown', onDocClick);
            document.removeEventListener('keydown', onKey);
        };
    }, [open, setOpen, anchorRef]);

    if (!open) return null;

    const restaurantTitle = 'Good Chicken, Jersey City';
    const restaurantAddress = '414 Grand St Jersey City, NJ';

    return (
        <>
            {/* Transparent overlay to catch outside clicks (keeps layering simple) */}
            <div aria-hidden className="fixed inset-0 z-[100]" />

            {/* Anchored panel */}
            <div
                ref={panelRef}
                role="dialog"
                aria-label="Shopping cart"
                className="fixed z-[101] rounded-2xl border border-neutral-200 bg-white shadow-2xl"
                style={{ top: pos.top, left: pos.left, width: pos.width }}
            >
                {/* arrow */}
                <div
                    aria-hidden
                    className="absolute -top-2 right-6 h-4 w-4 rotate-45 border-l border-t border-neutral-200 bg-white"
                />

                {/* Header */}
                <div className="flex items-start justify-between border-b px-4 pb-3 pt-4">
                    <div className="min-w-0">
                        <h2 className="truncate text-[18px] font-semibold leading-tight">
                            {restaurantTitle}
                        </h2>
                        <p className="mt-0.5 text-[14px] text-neutral-700">{restaurantAddress}</p>
                    </div>
                    <button
                        onClick={() => setOpen(false)}
                        aria-label="Close"
                        className="-mr-1 rounded-full p-2 hover:bg-neutral-100"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Summary row */}
                <div className="flex items-center justify-between px-4 py-3 text-[14px]">
                    <div className="text-neutral-700">
            <span className="font-medium">
              {itemCount} {itemCount === 1 ? 'item' : 'items'}
            </span>
                    </div>
                    <div className="text-neutral-900">
                        <span className="mr-1">Subtotal:</span>
                        <span className="font-semibold">{subtotalUsd}</span>
                    </div>
                </div>

                {/* Scrollable content */}
                <div className="max-h-[60vh] overflow-auto px-4 pb-4">
                    {uiItems.length === 0 ? (
                        <div className="rounded-lg border p-4 text-sm text-neutral-600">
                            Your cart is empty.
                        </div>
                    ) : (
                        <ul className="space-y-3">
                            {uiItems.map((it) => (
                                <li key={it.id} className="rounded-2xl border p-3">
                                    <div className="flex items-start justify-between gap-3">
                                        {/* Qty stepper */}
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => (it.qty > 1 ? dec?.(it.id) : remove?.(it.id))}
                                                className="grid h-7 w-7 place-items-center rounded-full border hover:bg-neutral-100"
                                                aria-label="Decrease quantity"
                                            >
                                                <Minus className="h-4 w-4" />
                                            </button>
                                            <div className="w-5 text-center text-[15px] font-medium">{it.qty}</div>
                                            <button
                                                onClick={() => inc?.(it.id)}
                                                className="grid h-7 w-7 place-items-center rounded-full border hover:bg-neutral-100"
                                                aria-label="Increase quantity"
                                            >
                                                <Plus className="h-4 w-4" />
                                            </button>
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <div className="truncate text-[15px] font-semibold leading-tight">
                                                {it.name}
                                            </div>
                                            {it.modifiers?.length ? (
                                                <div className="mt-1 space-y-0.5 text-[12px] text-neutral-600">
                                                    {it.modifiers.slice(0, 6).map((m) => (
                                                        <div key={m.id} className="truncate">
                                                            {m.name}
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : null}
                                        </div>

                                        <div className="text-[14px] font-semibold leading-none">
                                            {((it.unitCents * it.qty) / 100).toLocaleString('en-US', {
                                                style: 'currency',
                                                currency: 'USD',
                                            })}
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}

                    {/* Optional: Offers (kept from your original, now inside scroll area) */}
                    <div className="mt-5">
                        <div className="mb-2 flex items-center justify-between">
                            <h3 className="text-[16px] font-semibold">Offers for you</h3>
                            <div className="flex items-center gap-1 text-neutral-500">
                                <button className="p-1 hover:text-neutral-800" aria-label="Prev">
                                    <ChevronLeft className="h-5 w-5" />
                                </button>
                                <button className="p-1 hover:text-neutral-800" aria-label="Next">
                                    <ChevronRight className="h-5 w-5" />
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                            {[
                                { t: 'Burrito', p: 1345, img: '/offers/burrito.jpg' },
                                { t: 'Tacos', p: 1345, img: '/offers/tacos.jpg' },
                                { t: 'Salad', p: 1435, img: '/offers/salad.jpg' },
                            ].map((o, i) => (
                                <div key={i} className="overflow-hidden rounded-2xl border">
                                    <div className="relative h-[110px] w-full bg-neutral-100">
                                        <img src={o.img} alt="" className="h-full w-full object-cover" />
                                        <button
                                            className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-white shadow"
                                            aria-label={`Add ${o.t}`}
                                        >
                                            <Plus className="h-4 w-4" />
                                        </button>
                                    </div>
                                    <div className="p-3">
                                        <div className="text-[13px] font-medium leading-tight">{o.t}</div>
                                        <div className="mt-1 text-[12px] text-neutral-600">
                                            {(o.p / 100).toLocaleString('en-US', {
                                                style: 'currency',
                                                currency: 'USD',
                                            })}
                                        </div>
                                        <div className="mt-2 inline-flex items-center gap-1 rounded bg-neutral-100 px-2 py-[2px] text-[11px] font-medium text-neutral-700">
                                            Free on $20.00+
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="border-t px-4 py-3">
                    <div className="mb-2 flex items-center justify-between text-[15px]">
                        <span className="text-neutral-700">Subtotal</span>
                        <span className="font-semibold">{subtotalUsd}</span>
                    </div>
                    <button className="w-full rounded-2xl bg-black py-3 text-center text-[15px] font-semibold text-white hover:opacity-90">
                        Go to checkout
                    </button>
                </div>
            </div>
        </>
    );
}
