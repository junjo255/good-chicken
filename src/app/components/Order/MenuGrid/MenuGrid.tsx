'use client';
import { useEffect, useMemo, useState } from 'react';
import {useCart} from "@/app/lib/cart";
import {MenuItem, ModifierChoice, ModifierGroup} from "@/app/lib/types";


function Money({ cents }: { cents: number }) {
    return <span>${(cents / 100).toFixed(2)}</span>;
}


export default function MenuGrid() {
    const [menu, setMenu] = useState<MenuItem[]>([]);
    const { addItem } = useCart();


    useEffect(() => {
        fetch('/menu.json').then(r => r.json()).then(setMenu).catch(() => setMenu([]));
    }, []);


    const categories = useMemo(() => Array.from(new Set(menu.map(m => m.category))), [menu]);


    return (
        <div className="space-y-10">
            {categories.map(cat => (
                <section key={cat}>
                    <h2 className="mb-4 text-xl font-semibold">{cat}</h2>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {menu.filter(m => m.category === cat).map(item => (
                            <Card key={item.id} item={item} onAdd={(mods) => addItem(item.id, item.name, item.priceCents, mods)} />
                        ))}
                    </div>
                </section>
            ))}
        </div>
    );
}

function Card({ item, onAdd }: { item: MenuItem; onAdd: (mods: { id: string; name: string; priceCents: number }[]) => void }) {
    const [selected, setSelected] = useState<Record<string, Set<string>>>({});


    const groups = item.modifiers || [];


    function toggle(g: ModifierGroup, c: ModifierChoice) {
        setSelected(prev => {
            const set = new Set(prev[g.id] || []);
            if (set.has(c.id)) set.delete(c.id); else {
                if (g.max === 1) set.clear();
                if (set.size < g.max || set.has(c.id)) set.add(c.id);
            }
            return { ...prev, [g.id]: set };
        });
    }


    function add() {
        const mods = groups.flatMap(g => {
            const chosenIds = [...(selected[g.id] || [])];
            return chosenIds.map(id => {
                const ch = g.choices.find(c => c.id === id)!;
                return { id: `${g.id}:${ch.id}`, name: `${g.name}: ${ch.name}`, priceCents: ch.priceCents };
            });
        });
        onAdd(mods);
    }


    return (
        <div className="rounded-2xl border bg-white p-4 shadow-sm">
            {item.imageUrl && <img src={item.imageUrl} alt="" className="mb-3 h-40 w-full rounded-xl object-cover" />}
            <div className="mb-2 flex items-baseline justify-between">
                <h3 className="text-lg font-medium">{item.name}</h3>
                <Money cents={item.priceCents} />
            </div>
            {item.description && <p className="mb-3 text-sm text-neutral-600">{item.description}</p>}
            {groups.length > 0 && (
                <div className="mb-3 space-y-2">
                    {groups.map(g => (
                        <div key={g.id}>
                            <div className="mb-1 text-sm font-medium">{g.name}{g.min > 0 ? ` (choose ${g.min}${g.max>g.min?`-${g.max}`:''})` : ''}</div>
                            <div className="flex flex-wrap gap-2">
                                {g.choices.map(c => {
                                    const on = selected[g.id]?.has(c.id);
                                    return (
                                        <button key={c.id} onClick={() => toggle(g, c)} className={`rounded-full border px-3 py-1 text-sm ${on ? 'bg-black text-white' : 'bg-white'}`}>
                                            {c.name}{c.priceCents ? ` +$${(c.priceCents/100).toFixed(2)}` : ''}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            )}
            <button onClick={add} className="mt-2 w-full rounded-xl bg-black px-4 py-2 text-white">Add to cart</button>
        </div>
    );
}