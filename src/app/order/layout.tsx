"use client";

import React, {useEffect, useRef, useState} from "react";
import {OrderProvider} from "@/app/components/Order/Stepper/OrderCtx";
import {OrderType, Partner} from "@/app/components/Order/Stepper/Steps";
import Header from "@/app/components/Header/Header";
import AuthProvider from "@/app/components/Auth/AuthProvider";
import MobileBottomNav from "@/app/components/Header/MobileBottomNav";
import {useCart} from "@/app/lib/cart";
import CartDrawer from "@/app/components/Order/CartDrawer/CartDrawer";
import {CartIcon} from "@/app/components/Order/CartDrawer/CartIcon";

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
    const isMobile = typeof window !== "undefined" && window.innerWidth <= 1024;

    const cartBtnRef = useRef<HTMLButtonElement | null>(null);
    const [cartOpen, setCartOpen] = useState(false);
    const cart = useCart();
    const itemCount = cart.items?.reduce((n, i) => n + (i.quantity ?? 1), 0) ?? 0;
    const [userMenuOpen, setUserMenuOpen] = useState(false);

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
                <CartDrawer
                    open={cartOpen}
                    setOpen={setCartOpen}
                    anchorRef={cartBtnRef}
                    isMobile={isMobile}
                />
                {children}
                <MobileBottomNav
                    isMobile={isMobile}
                    cartBtnRef={cartBtnRef}
                    cartOpen={cartOpen}
                    setCartOpen={setCartOpen}
                    itemCount={itemCount}
                    CartIcon={CartIcon}
                />
            </OrderProvider>
        </AuthProvider>
    );
}
