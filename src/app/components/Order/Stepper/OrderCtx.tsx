"use client";

import React, { createContext, useContext } from "react";
import type { OrderType, Partner } from "@/app/components/Order/Stepper/Steps";

export type OrderCtx = {

    selectedStoreId: string | null;
    setSelectedStoreId: (id: string | null) => void;
    orderType: OrderType;
    setOrderType: (t: OrderType) => void;
    partner: Partner;
    setPartner: (p: Partner) => void;
    scheduleLater: boolean;
    setScheduleLater: (b: boolean) => void;
    // startMenu?: () => void;
    // openPartner?: (p: Exclude<Partner, null>) => void;
};

const OrderContext = createContext<OrderCtx | null>(null);

export function OrderProvider({
                                  value,
                                  children,
                              }: {
    value: OrderCtx;
    children: React.ReactNode;
}) {
    return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
}

export function useOrder() {
    const ctx = useContext(OrderContext);
    if (!ctx) throw new Error("useOrder must be used within <OrderProvider>");
    return ctx;
}
