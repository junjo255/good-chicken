'use client';

import React, {useMemo, useRef, useState} from 'react';
import {ChevronDown} from 'lucide-react';

type Props = {
    value: number;
    onChange: (v: number) => void;
    min?: number;
    max?: number;
    step?: number;
    options?: number[];
    className?: string;
};

export default function QuantityDropdown({
                                             value,
                                             onChange,
                                             min = 0,
                                             max = 20,
                                             step = 1,
                                             options,
                                             className = '',
                                         }: Props) {

    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement | null>(null);

    const opts = useMemo(
        () => options ?? Array.from({length: Math.floor((max - min) / step) + 1}, (_, i) => min + i * step),
        [options, min, max, step]
    );

    return (
        <div
            ref={ref}
            className={`relative inline-flex h-9 items-center gap-1 rounded-full bg-[#E8E8E8] px-1 text-[#3F3126] ${className}`}
            role="group"
            aria-label="Quantity selector"
            onPointerDownCapture={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
        >
            <button
                type="button"
                onClick={(e) => {
                    e.stopPropagation();
                    setOpen((o) => !o);
                }}
                aria-haspopup="listbox"
                aria-expanded={open}
                aria-label="Choose quantity"
                className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-sm font-medium hover:bg-white/10  transition-colors"
            >
                {value}
                <ChevronDown className="h-4 w-4" aria-hidden="true"/>
            </button>

            {open && (
                <div
                    role="listbox"
                    tabIndex={-1}
                    className="absolute top-[calc(100%+8px)] w-10 overflow-auto rounded-xl border border-neutral-200 bg-white p-1 shadow-lg"
                    onPointerDownCapture={(e) => e.stopPropagation()}
                    onMouseDown={(e) => e.stopPropagation()}
                    onClick={(e) => e.stopPropagation()}
                    style={{zIndex: 1000}}
                >
                    {opts.map((n) => (
                        <button
                            key={n}
                            role="option"
                            aria-selected={n === value}
                            onClick={(e) => {
                                e.stopPropagation();
                                onChange(n);
                                setOpen(false);
                            }}
                            className={`flex w-full items-center justify-between rounded-lg px-2 py-2 text-sm  hover:bg-neutral-100 ${n === value ? 'bg-neutral-100 font-semibold' : 'text-neutral-700'}`}
                        >
                            <span>{n}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}