"use client";

import React, { useState } from "react";
import { OrderProvider } from "@/app/components/Order/Stepper/OrderCtx";
import { OrderType, Partner } from "@/app/components/Order/Stepper/Steps";
import Header from "@/app/components/Header/Header";

export default function OrderLayout({ children }: { children: React.ReactNode }) {
    const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null);
    const [orderType, setOrderType] = useState<OrderType>(null);
    const [partner, setPartner] = useState<Partner>(null);
    const [scheduleLater, setScheduleLater] = useState<boolean>(false);

    return (
        <OrderProvider
            value={{
                selectedStoreId,
                setSelectedStoreId,
                orderType,
                setOrderType,
                partner,
                setPartner,
                scheduleLater,
                setScheduleLater,
            }}
        >
            <Header/>

            {children}
        </OrderProvider>
    );
}
