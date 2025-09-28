'use client';

import { useEffect, useMemo } from 'react';

type AttrId = 'heat' | 'part' | 'size';

export type Variant = {
    sku: string;
    attrs: Record<AttrId, string>;
    priceCents: number;
};

export type ConfigProduct = {
    id: string;
    title: string;
    image: string;
    ribbon?: string;
    attributes: { id: AttrId; name: string; values: string[] }[];
    variants: Variant[];
};

function availableValuesFor(
    attr: AttrId,
    variants: Variant[],
    sel: Partial<Record<AttrId, string>>
) {
    return Array.from(
        new Set(
            variants
                .filter(v =>
                    (attr !== 'heat' ? (sel.heat ? v.attrs.heat === sel.heat : true) : true) &&
                    (attr !== 'part' ? (sel.part ? v.attrs.part === sel.part : true) : true) &&
                    (attr !== 'size' ? (sel.size ? v.attrs.size === sel.size : true) : true)
                )
                .map(v => v.attrs[attr])
        )
    );
}

function Pill({ children, on, disabled, onClick }:{
    children: React.ReactNode; on?: boolean; disabled?: boolean; onClick?: ()=>void;
}) {
    return (
        <button
            disabled={disabled}
            onClick={onClick}
            className={[
                'rounded-full border px-3 py-1 text-sm ',
                on ? 'bg-[#3F3126] text-white' : 'bg-white hover:bg-neutral-100',
                disabled ? 'opacity-40 cursor-not-allowed' : ''
            ].join(' ')}
        >
            {children}
        </button>
    );
}

export default function OptionModal({
                                        open,
                                        onClose,
                                        product,
                                        sel,
                                        setSel,
                                        onAdd,
                                    }: {
    open: boolean;
    onClose: () => void;
    product: ConfigProduct;
    sel: Partial<Record<AttrId, string>>;
    setSel: (s: Partial<Record<AttrId, string>>) => void;
    onAdd: (p: { sku: string; name: string; priceCents: number }) => void;
}) {
    useEffect(() => {
        if (!open) return;
        // initialize to a valid combo
        if (!sel.heat || !sel.part || !sel.size) {
            const v = product.variants[0];
            setSel({ heat: v.attrs.heat, part: v.attrs.part, size: v.attrs.size });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, product.id]);

    const chosen = useMemo(() => {
        return product.variants.find(v =>
            v.attrs.heat === sel.heat &&
            v.attrs.part === sel.part &&
            v.attrs.size === sel.size
        );
    }, [product.variants, sel]);

    function pick(attr: AttrId, value: string) {
        const next = { ...sel, [attr]: value };
        (['heat','part','size'] as AttrId[]).forEach(a => {
            const ok = availableValuesFor(a, product.variants, next).includes(next[a] as string);
            if (!ok) delete (next as any)[a];
        });
        (['heat','part','size'] as AttrId[]).forEach(a => {
            if (!next[a]) {
                const vals = availableValuesFor(a, product.variants, next);
                if (vals.length) next[a] = vals[0];
            }
        });
        setSel(next);
    }

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[60]">
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />
            <div className="absolute left-1/2 top-1/2 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white shadow-xl">
                <div className="flex items-start gap-3 p-4">
                    <img src={product.image} alt="" className="h-28 w-28 rounded-lg object-cover" />
                    <div className="min-w-0">
                        <div className="flex items-center gap-2">
                            <h3 className="truncate text-lg font-semibold">{product.title}</h3>
                            {product.ribbon && <span className="rounded-full bg-[#AF3935] px-2 py-[2px] text-[11px] font-bold text-white">{product.ribbon}</span>}
                        </div>
                        <div className="mt-1 text-sm text-[#262626]">Choose Options</div>
                    </div>
                    <button onClick={onClose} className="ml-auto rounded-lg border px-2 py-1 text-sm  ">Close</button>
                </div>

                <div className="border-t p-4">
                    {product.attributes.map(a => {
                        const avail = availableValuesFor(a.id, product.variants, sel);
                        const all = a.values;
                        return (
                            <div key={a.id} className="mb-3">
                                <div className="font-[14px] sm:font-[17px] uppercase mb-1 text-xs font-semibold text-[#262626]">{a.name}</div>
                                <div className="font-[14px] sm:font-[17px flex flex-wrap gap-2   mb-2">
                                    {all.filter(a => avail.includes(a)).map(v => (
                                        <Pill
                                            key={v}
                                            on={sel[a.id] === v}
                                            disabled={!avail.includes(v)}
                                            onClick={() => avail.includes(v) && pick(a.id, v)}
                                        >
                                            {v}
                                        </Pill>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="flex items-center justify-between border-t p-4">
                    <div className="text-lg font-semibold">
                        ${(chosen?.priceCents ?? 0).toLocaleString('usd')}
                    </div>
                    <button
                        className="rounded-xl bg-[#AF3935] px-4 py-2 text-white disabled:opacity-50"
                        disabled={!chosen}
                        onClick={() => {
                            if (!chosen) return;
                            const name = `${product.title} — ${chosen.attrs.part} ${chosen.attrs.size} (${chosen.attrs.heat})`;
                            onAdd({ sku: chosen.sku, name, priceCents: chosen.priceCents });
                            onClose();
                        }}
                    >
                        Add
                    </button>
                </div>
            </div>
        </div>
    );
}
