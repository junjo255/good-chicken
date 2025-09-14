'use client';

import React from 'react';
import StepperMain from "@/app/components/Order/Stepper/StepperMain";

export default function OrderPage() {

    return (
        <section
            style={{maxWidth: "1200px"}}
            className="mx-auto space-y-4 py-10 mt-[var(--header-h)]"
        >
            <StepperMain/>
        </section>
    );
}
