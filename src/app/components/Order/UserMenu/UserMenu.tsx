'use client';

import React, {useLayoutEffect, useRef, useState} from 'react';
import {createPortal} from 'react-dom';
import Link from "next/link";
import AuthCard from "@/app/components/Auth/AuthCard";
import {Line} from "@/app/components/ui/Card";

export default function UserDropdown({
                                     open,
                                     onClose,
                                     anchorRef,
                                     loginLabel = "Login",
                                         children
                                 }: {
    open: boolean;
    onClose: () => void;
    anchorRef: React.RefObject<HTMLElement | null>;
    loginLabel?: string;
    children?: React.ReactNode;
}) {
    const panelRef = useRef<HTMLDivElement | null>(null);
    const [pos, setPos] = useState<{top:number; left:number; width:number}>({top:0,left:0,width:224});

    const [accountOpen, setAccountOpen] = useState(false);

    const recompute = () => {
        const a = anchorRef.current;
        if (!a) return;

        const rect = a.getBoundingClientRect();
        const margin = 8;
        const vw = window.innerWidth;
        const idealWidth = 224; // ≈ w-56
        const width = Math.min(idealWidth, vw - margin*2);

        const top = Math.round(rect.bottom + margin);
        let left = Math.round(rect.right - width);

        left = Math.max(margin, Math.min(left, vw - width - margin));

        setPos({top, left, width});
    };

    useLayoutEffect(() => {
        if (!open) return;
        recompute();
        const onResize = () => recompute();
        const onScroll = () => recompute();
        window.addEventListener('resize', onResize);
        window.addEventListener('scroll', onScroll, {passive:true});
        return () => {
            window.removeEventListener('resize', onResize);
            window.removeEventListener('scroll', onScroll);
        };
    }, [open]);

    if (!open) return null;
    const handleLogin = () => setAccountOpen(true);

    const content = children ?? (
        <>
            <Link href="/account" role="menuitem" className="block px-3 py-2 rounded-xl hover:bg-[#f8f8f8] cursor-pointer">
                Manage account
            </Link>
            <Line />
            <button
                onClick={handleLogin}
                className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#f8f8f8] cursor-pointer"
            >
                {loginLabel}
            </button>

            {accountOpen && (
                <AuthCard open={accountOpen} onClose={() => setAccountOpen(false)} />
            )}
        </>
    );

    return createPortal(
        <>
            <div className="fixed inset-0 z-[101]" onClick={onClose} aria-hidden />
            <div
                ref={panelRef}
                role="menu"
                aria-orientation="vertical"
                className="fixed z-[10000] rounded-2xl border border-[#f3f3f3] bg-white shadow-xl p-2"
                style={{ top: pos.top, left: pos.left, width: pos.width }}
                onClick={(e) => e.stopPropagation()}
            >
                {content}
            </div>
        </>,
        document.body
    );
}
