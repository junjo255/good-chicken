//
// "use client";
//
// import {useEffect, useState} from "react";
// import {supabase} from "@/app/lib/supabase/client";
// import AuthCard from "@/app/components/Auth/AuthCard";
//
// export default function AccountCard({ profile, loading }: { profile: any, loading: boolean }) {
//     const [editing, setEditing] = useState(false);
//     const [form, setForm] = useState({
//         full_name: profile?.full_name ?? "",
//         preferred_location: profile?.preferred_location ?? "",
//         address_line1: profile?.address?.line1 ?? "",
//         address_line2: profile?.address?.line2 ?? "",
//         city: profile?.address?.city ?? "",
//         state: profile?.address?.state ?? "",
//         postal_code: profile?.address?.postal_code ?? "",
//         country: profile?.address?.country ?? ""
//     });
//
//     useEffect(() => {
//         setForm((f) => ({
//             ...f,
//             full_name: profile?.full_name ?? "",
//             preferred_location: profile?.preferred_location ?? "",
//             address_line1: profile?.address?.line1 ?? "",
//             address_line2: profile?.address?.line2 ?? "",
//             city: profile?.address?.city ?? "",
//             state: profile?.address?.state ?? "",
//             postal_code: profile?.address?.postal_code ?? "",
//             country: profile?.address?.country ?? ""
//         }));
//     }, [profile]);
//
//     const save = async () => {
//         const { error } = await supabase.from("profiles").upsert({
//             id: (await supabase.auth.getUser()).data.user?.id,
//             full_name: form.full_name,
//             preferred_location: form.preferred_location,
//             address: {
//                 line1: form.address_line1,
//                 line2: form.address_line2,
//                 city: form.city,
//                 state: form.state,
//                 postal_code: form.postal_code,
//                 country: form.country
//             }
//         });
//         if (!error) setEditing(false);
//     };
//
//     const signOut = async () => { await supabase.auth.signOut(); };
//
//     return (
//         <div className="rounded-2xl border p-4">
//             {loading ? (
//                 <div className="text-sm text-neutral-600">Loading account…</div>
//             ) : profile ? (
//                 <div className="space-y-3">
//                     <div className="flex items-center justify-between">
//                         <div className="font-semibold">Hello{profile.full_name ? `, ${profile.full_name}` : ""} 👋</div>
//                         <button onClick={signOut} className="text-xs underline">Sign out</button>
//                     </div>
//
//                     {!editing ? (
//                         <div className="text-sm text-neutral-700 space-y-1">
//                             <div><span className="text-neutral-500">Preferred location:</span> {profile.preferred_location ?? "—"}</div>
//                             <div className="text-neutral-500">Shipping address:</div>
//                             <div>
//                                 {[profile.address?.line1, profile.address?.line2, `${profile.address?.city ?? ""} ${profile.address?.state ?? ""} ${profile.address?.postal_code ?? ""}`, profile.address?.country]
//                                     .filter(Boolean).join(", ") || "—"}
//                             </div>
//                             <button onClick={() => setEditing(true)} className="mt-2 rounded-lg border px-3 py-1 text-xs">Edit</button>
//                         </div>
//                     ) : (
//                         <div className="grid grid-cols-1 gap-2 text-sm">
//                             <input className="rounded-lg border p-2" placeholder="Full name" value={form.full_name} onChange={e=>setForm({...form, full_name:e.target.value})}/>
//                             <input className="rounded-lg border p-2" placeholder="Preferred location" value={form.preferred_location} onChange={e=>setForm({...form, preferred_location:e.target.value})}/>
//                             <input className="rounded-lg border p-2" placeholder="Address line 1" value={form.address_line1} onChange={e=>setForm({...form, address_line1:e.target.value})}/>
//                             <input className="rounded-lg border p-2" placeholder="Address line 2" value={form.address_line2} onChange={e=>setForm({...form, address_line2:e.target.value})}/>
//                             <div className="grid grid-cols-3 gap-2">
//                                 <input className="rounded-lg border p-2" placeholder="City" value={form.city} onChange={e=>setForm({...form, city:e.target.value})}/>
//                                 <input className="rounded-lg border p-2" placeholder="State" value={form.state} onChange={e=>setForm({...form, state:e.target.value})}/>
//                                 <input className="rounded-lg border p-2" placeholder="Postal code" value={form.postal_code} onChange={e=>setForm({...form, postal_code:e.target.value})}/>
//                             </div>
//                             <input className="rounded-lg border p-2" placeholder="Country" value={form.country} onChange={e=>setForm({...form, country:e.target.value})}/>
//                             <div className="flex gap-2 pt-1">
//                                 <button onClick={save} className="rounded-lg border px-3 py-1 text-xs">Save</button>
//                                 <button onClick={()=>setEditing(false)} className="rounded-lg border px-3 py-1 text-xs">Cancel</button>
//                             </div>
//                         </div>
//                     )}
//
//                     {/* Placeholder for a “Manage cards” modal/section that lists tokenized PMs */}
//                     <ManageCards />
//                 </div>
//             ) : (
//                 <div className="space-y-3">
//                     <div className="text-sm text-neutral-700">Sign in to save your details and payment methods:</div>
//                     <AuthCard />
//                 </div>
//             )}
//         </div>
//     );
// }
//
// function ManageCards() {
//     // In production, read from `payment_methods` and allow user to set default.
//     // Keep it simple here; wire to Stripe tokenization on your checkout page.
//     return (
//         <div className="pt-3">
//             <div className="text-sm font-medium">Payment methods</div>
//             <div className="text-xs text-neutral-600">
//                 Add or change cards during checkout. We store only tokens (brand, last4, exp).
//             </div>
//         </div>
//     );
// }
