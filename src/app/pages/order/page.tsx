'use client';

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MenuScreen from "@/app/screens/MenuScreen";
import CheckoutScreen from "@/app/screens/CheckoutScreen";

export default function OrderRouterPage() {
    return (
        <BrowserRouter basename="/order">
            <Routes>
                <Route path="/" element={<MenuScreen />} />
                <Route path="checkout" element={<CheckoutScreen />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}
