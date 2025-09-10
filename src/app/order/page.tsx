'use client';

import React, {useState} from 'react';
import StepperMain from "@/app/components/Order/Stepper/StepperMain";
import Header from "@/app/components/Header/Header";
import {OrderProvider} from "@/app/components/Order/Stepper/OrderCtx";
import {OrderType, Partner} from "@/app/components/Order/Stepper/Steps";

export default function OrderPage() {
    const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null);
    const [orderType, setOrderType] = useState<OrderType>(null);
    const [partner, setPartner] = useState<Partner>(null);
    const [scheduleLater, setScheduleLater] = useState<boolean>(false);

    return (
        <section
            style={{maxWidth: "1200px"}}
            className="mx-auto space-y-4 py-10 mt-[var(--header-h)]">

            <StepperMain/>

        </section>
    );
}
