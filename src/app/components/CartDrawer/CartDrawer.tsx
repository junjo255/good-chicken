'use client';
import {useCart} from "@/app/lib/cart";
import {cartSubtotalCents, lineItemTotalCents, taxCents} from "@/app/lib/pricing";



function Money({ cents }: { cents: number }) { return <span>${(cents/100).toFixed(2)}</span> }


export default function CartDrawer() {
    const { items, updateItem, removeItem } = useCart();
    const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0);


    const subtotal = cartSubtotalCents(items);
    const tax = taxCents(subtotal, taxRate);


    return (
        <aside className="rounded-2xl border bg-white p-4 shadow-sm">
            <h3 className="mb-3 text-lg font-semibold">Your cart</h3>
            <div className="space-y-3">
                {items.map((it, i) => (
                    <div key={i} className="rounded-lg bg-neutral-50 p-3">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="font-medium">{it.name}</div>
                                {it.modifiers.length > 0 && (
                                    <ul className="ml-4 list-disc text-sm text-neutral-600">
                                        {it.modifiers.map(m => <li key={m.id}>{m.name} {m.priceCents?`(+${(m.priceCents/100).toFixed(2)})`:''}</li>)}
                                    </ul>
                                )}
                            </div>
                            <div className="text-sm"><Money cents={lineItemTotalCents(it)} /></div>
                        </div>
                        <div className="mt-2 flex items-center gap-2 text-sm">
                            <button className="rounded border px-2" onClick={() => updateItem(i, { quantity: Math.max(1, it.quantity - 1) })}>-</button>
                            <span>{it.quantity}</span>
                            <button className="rounded border px-2" onClick={() => updateItem(i, { quantity: it.quantity + 1 })}>+</button>
                            <button className="ml-auto text-red-600 underline" onClick={() => removeItem(i)}>Remove</button>
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-4 space-y-1 text-sm">
                <div className="flex justify-between"><span>Subtotal</span><Money cents={subtotal} /></div>
                <div className="flex justify-between"><span>Tax</span><Money cents={tax} /></div>
            </div>
            <a href="/checkout" className="mt-4 block w-full rounded-xl bg-black py-2 text-center text-white">Go to checkout</a>
        </aside>
    );
}