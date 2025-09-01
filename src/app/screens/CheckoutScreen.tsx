// 'use client';
// import Script from 'next/script';
// import { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
// import {useCart} from "@/app/lib/cart";
// import {cartSubtotalCents, taxCents, totalCents} from "@/app/lib/pricing";
//
// function Money({ cents }: { cents: number }) { return <span>${(cents/100).toFixed(2)}</span> }
//
// export default function CheckoutScreen() {
//     const { items, tipCents, setTipCents, clear } = useCart();
//     const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0);
//     const subtotal = cartSubtotalCents(items);
//     const tax = taxCents(subtotal, taxRate);
//     const total = totalCents(subtotal, tax, tipCents);
//
//     const [status, setStatus] = useState<string>('');
//     const [customer, setCustomer] = useState({ name: '', email: '', phone: '', notes: '' });
//     const [orderType, setOrderType] = useState<'pickup'|'delivery'>('pickup');
//
//     // Use NEXT_PUBLIC_* values for client-side AcceptUI attributes
//     const env = (process.env.NEXT_PUBLIC_AUTHNET_ENV || 'sandbox').toLowerCase();
//     const acceptUISrc = env === 'production'
//         ? 'https://js.authorize.net/v3/AcceptUI.js'
//         : 'https://jstest.authorize.net/v3/AcceptUI.js';
//
//     useEffect(() => {
//         (window as any).anetResponseHandler = function(resp: any) {
//             if (resp?.messages?.resultCode === 'Error') {
//                 setStatus('Card entry error');
//                 return;
//             }
//             submitOrder(resp.opaqueData);
//         };
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [items, tipCents, customer, orderType]);
//
//     async function submitOrder(opaqueData: { dataDescriptor: string; dataValue: string }) {
//         try {
//             setStatus('Processing payment...');
//             const res = await fetch('/api/pay', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({
//                     items: items.map(i => ({
//                         name: i.name,
//                         priceCents: i.basePriceCents + i.modifiers.reduce((s,m)=>s+m.priceCents,0),
//                         quantity: i.quantity
//                     })),
//                     subtotalCents: subtotal,
//                     taxCents: tax,
//                     tipCents,
//                     serviceFeeCents: Number(process.env.NEXT_PUBLIC_DEFAULT_SERVICE_FEE || 0),
//                     orderType,
//                     customer,
//                     opaqueData
//                 })
//             });
//             const data = await res.json();
//             if (!res.ok) throw new Error(data?.error || 'Charge failed');
//             setStatus(`Paid! Order ${data.orderId}, txn ${data.transId}`);
//             clear();
//         } catch (e: any) {
//             setStatus(`Error: ${e.message}`);
//         }
//     }
//
//     return (
//         <main className="mx-auto max-w-2xl space-y-6">
//             <Script src={acceptUISrc} strategy="afterInteractive" />
//
//             <section className="rounded-2xl border bg-white p-4 shadow-sm">
//                 <div className="mb-3 flex items-center justify-between">
//                     <h2 className="text-lg font-semibold">Checkout</h2>
//                     <Link to="/menu" className="text-sm underline">Back to Menu</Link>
//                 </div>
//                 <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
//                     <input className="rounded border p-2" placeholder="Name"
//                            value={customer.name} onChange={e=>setCustomer({...customer,name:e.target.value})}/>
//                     <input className="rounded border p-2" placeholder="Email"
//                            value={customer.email} onChange={e=>setCustomer({...customer,email:e.target.value})}/>
//                     <input className="rounded border p-2" placeholder="Phone"
//                            value={customer.phone} onChange={e=>setCustomer({...customer,phone:e.target.value})}/>
//                     <select className="rounded border p-2" value={orderType}
//                             onChange={e=>setOrderType(e.target.value as any)}>
//                         <option value="pickup">Pickup</option>
//                         <option value="delivery">Delivery</option>
//                     </select>
//                     <textarea className="sm:col-span-2 rounded border p-2" placeholder="Notes"
//                               value={customer.notes} onChange={e=>setCustomer({...customer,notes:e.target.value})}/>
//                 </div>
//             </section>
//
//             <section className="rounded-2xl border bg-white p-4 shadow-sm">
//                 <h2 className="mb-3 text-lg font-semibold">Tip</h2>
//                 <div className="flex gap-2">
//                     {[0, 0.1, 0.15, 0.2].map(p => (
//                         <button key={p} className="rounded-xl border px-3 py-2"
//                                 onClick={() => setTipCents(Math.round(subtotal * p))}>
//                             {p*100}%
//                         </button>
//                     ))}
//                     <input className="ml-auto w-24 rounded border p-2" type="number"
//                            value={tipCents/100}
//                            onChange={e=>setTipCents(Math.max(0, Math.round(Number(e.target.value)*100)))} />
//                 </div>
//             </section>
//
//             <section className="rounded-2xl border bg-white p-4 shadow-sm">
//                 <div className="flex items-center justify-between text-lg font-medium">
//                     <span>Total</span><span><Money cents={total} /></span>
//                 </div>
//
//                 <button
//                     className="mt-4 w-full rounded-xl bg-black py-3 text-white"
//                     data-billingAddressOptions='{"show":true, "required":false}'
//                     data-apiLoginID={process.env.NEXT_PUBLIC_AUTHNET_API_LOGIN_ID}
//                     data-clientKey={process.env.NEXT_PUBLIC_AUTHNET_CLIENT_KEY}
//                     data-acceptUIFormBtnTxt="Pay now"
//                     data-acceptUIFormHeaderTxt="Card Information"
//                     data-responseHandler="anetResponseHandler"
//                 >Enter card & Pay</button>
//
//                 <div className="mt-3 text-sm text-neutral-600">{status}</div>
//             </section>
//         </main>
//     );
// }
