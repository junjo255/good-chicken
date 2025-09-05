'use client';

import React from 'react';
import {useRouter} from 'next/navigation';

const LOCATIONS = [
    {id: 'montclair', name: 'Montclair'},
    {id: 'jersey-city', name: 'Jersey City'},
];

export default function OrderPage() {
    const router = useRouter();

    function choose(id: string) {
        try {
            localStorage.setItem('gc_location', id);
        } catch {
        }
        router.push('/order/menu');
    }

    return (
        <section className="mx-auto max-w-md space-y-4 py-10 mt-[var(--header-h)]">
            <h1 className="text-2xl font-bold mb-4 text-center">Choose Location</h1>
            {LOCATIONS.map(loc => (
                <button
                    key={loc.id}
                    onClick={() => choose(loc.id)}
                    className="block w-full rounded-lg border px-4 py-3 text-left hover:bg-neutral-50"
                >
                    {loc.name}
                </button>
            ))}
        </section>
    );
}
