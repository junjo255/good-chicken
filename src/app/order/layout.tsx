"use client";

import React, {useEffect, useState} from "react";
import {OrderProvider} from "@/app/components/Order/Stepper/OrderCtx";
import {OrderType, Partner} from "@/app/components/Order/Stepper/Steps";
import Header from "@/app/components/Header/Header";
import AuthProvider from "@/app/components/Auth/AuthProvider";

export default function OrderLayout({children}: { children: React.ReactNode }) {
    // 1) Restore from localStorage on first render
    const [selectedStoreId, setSelectedStoreId] = useState<string | null>(() => {
        if (typeof window === "undefined") return null;
        try {
            return localStorage.getItem("selectedStoreId");
        } catch {
            return null;
        }
    });

    // 2) Write-through to localStorage whenever it changes
    useEffect(() => {
        if (typeof window === "undefined") return;
        try {
            if (selectedStoreId) {
                localStorage.setItem("selectedStoreId", selectedStoreId);
            } else {
                localStorage.removeItem("selectedStoreId");
            }
        } catch {
        }
    }, [selectedStoreId]);

    // 3) Cross-tab sync via `storage` event
    useEffect(() => {
        function onStorage(e: StorageEvent) {
            if (e.key !== "selectedStoreId") return;
            setSelectedStoreId(e.newValue);
        }

        window.addEventListener("storage", onStorage);
        return () => window.removeEventListener("storage", onStorage);
    }, []);

    const [orderType, setOrderType] = useState<OrderType>(null);
    const [partner, setPartner] = useState<Partner>(null);
    const [scheduleLater, setScheduleLater] = useState<boolean>(false);

    return (
        <AuthProvider>
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
        </AuthProvider>
    );
}
