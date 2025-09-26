"use client";

import { Home, User } from "lucide-react";
import React from "react";

function Tab({ icon, active = false }: { icon: React.ReactNode; active?: boolean }) {
    return (
        <button className={`flex flex-col items-center justify-center py-2 ${active ? "text-black" : "text-neutral-400"}`}>
            {icon}
        </button>
    );
}

export default function MobileBottomNav({
                                            isMobile,
                                            cartBtnRef,
                                            cartOpen,
                                            setCartOpen,
                                            itemCount,
                                            CartIcon,
                                        }: {
    isMobile: boolean;
    cartBtnRef: React.RefObject<HTMLButtonElement | null>;
    cartOpen: boolean;
    setCartOpen: (v: boolean) => void;
    itemCount: number;
    CartIcon: React.ComponentType<{ className?: string; count?: number; onAdd?: () => void }>;
}) {
    if (!isMobile) return null;

    return (
        <>
            {/* Bottom nav bar (under the drawer) */}
            <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-neutral-200 bg-white/95 px-2 py-2 backdrop-blur supports-[backdrop-filter]:bg-white/70">
                <div className="mx-auto grid max-w-sm grid-cols-3 items-center text-center">
                    <Tab icon={<Home className="h-6 w-6" />} active />

                    {/* Centered cart button wired to the same ref/state as the drawer */}
                    <button
                        aria-label="Open cart"
                        ref={cartBtnRef}
                        onClick={() => setCartOpen(!cartOpen)}
                        className="mx-auto flex items-center justify-center"
                    >
                        <CartIcon className="h-6 w-6" count={itemCount} onAdd={() => setCartOpen(true)} />
                    </button>

                    <Tab icon={<User className="h-6 w-6" />} />
                </div>
            </nav>

            {/* Safe area so content isn't hidden behind the fixed bar */}
            <div className="h-16" />
        </>
    );
}
