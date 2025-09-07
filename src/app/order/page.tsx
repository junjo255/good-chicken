'use client';

import React from 'react';
import {useRouter} from 'next/navigation';
import StepperMain from "@/app/components/Order/Stepper/StepperMain";

const LOCATIONS = [
    {id: 'montclair', name: 'Montclair'},
    {id: 'jersey-city', name: 'Jersey City'},
];

export default function OrderPage() {
    const router = useRouter();

    async function choose(id: string) {
        try {
            localStorage.setItem('gc_location', id);
            let userId = localStorage.getItem('gc_user_id');
            if (!userId) {
                userId = crypto.randomUUID();
                localStorage.setItem('gc_user_id', userId);
            }
            await fetch('/api/preferences', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, key: 'location', value: id }),
            });
        } catch {
        }router.push('/order/menu');
    }

    return (
        <section
            style={{maxWidth: "1200px"}}
            className="mx-auto space-y-4 py-10 mt-[var(--header-h)]">

            <StepperMain />

        </section>
    );
}
