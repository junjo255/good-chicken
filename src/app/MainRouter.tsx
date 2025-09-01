"use client";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainScreen from "@/app/screens/MainScreen";
import MenuScreen from "@/app/screens/MenuScreen";

export default function MainRouter({locations}: { locations: any[]; }) {

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MainScreen locations={locations} />} />
                <Route path="menu" element={<MenuScreen />} />
                {/*<Route path="checkout" element={<CheckoutScreen />} />*/}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}
