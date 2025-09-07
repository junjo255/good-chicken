'use client';

import React from 'react';
import {useCart} from '@/app/lib/cart';
import {cartSubtotalCents, taxCents, totalCents} from '@/app/lib/pricing';

function Money({cents}: {cents: number}) {
  return <span>${(cents/100).toFixed(2)}</span>;
}

export default function CheckoutPage() {
  const {items, clear} = useCart();
  const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0);
  const subtotal = cartSubtotalCents(items);
  const tax = taxCents(subtotal, taxRate);
  const total = totalCents(subtotal, tax);

  function placeOrder() {
    alert('Order placed!');
    clear();
  }

  return (
    <main className="mx-auto max-w-2xl space-y-6 mt-32">
      <section className="rounded-2xl border bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold mb-3">Checkout</h2>
        <div className="space-y-2">
          {items.map((it, i) => (
            <div key={i} className="flex justify-between">
              <span>{it.name} x{it.quantity}</span>
              <Money cents={(it.basePriceCents + it.modifiers.reduce((s,m)=>s+m.priceCents,0)) * it.quantity} />
            </div>
          ))}
        </div>
        <div className="mt-4 space-y-1 text-sm">
          <div className="flex justify-between"><span>Subtotal</span><Money cents={subtotal} /></div>
          <div className="flex justify-between"><span>Tax</span><Money cents={tax} /></div>
          <div className="flex justify-between"><span>Tip</span>
            <input
              type="number"
              className="ml-2 w-20 rounded border p-1"
              // value={(tipCents/100).toFixed(2)}
              // onChange={e=>setTipCents(Math.max(0, Math.round(Number(e.target.value)*100)))}
            />
          </div>
          <div className="flex justify-between font-semibold"><span>Total</span><Money cents={total} /></div>
        </div>
        <button onClick={placeOrder} className="mt-4 w-full rounded-xl bg-black py-2 text-white">Place Order</button>
      </section>
    </main>
  );
}
