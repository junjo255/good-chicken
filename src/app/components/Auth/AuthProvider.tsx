"use client";

import React from "react";
import { supabase } from "@/app/lib/supabase/client";
import AuthCard from "@/app/components/Auth/AuthCard";

type AuthCtx = {
    userId: string | null;
    openAuth: () => void;
    closeAuth: () => void;
};

const Ctx = React.createContext<AuthCtx | null>(null);

export function useAuth() {
    const ctx = React.useContext(Ctx);
    return (
        ctx ?? {
            userId: null,
            openAuth: () => {},
            closeAuth: () => {},
        }
    );
}

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const [userId, setUserId] = React.useState<string | null>(null);
    const [authOpen, setAuthOpen] = React.useState(false);

    // single source of truth for session
    React.useEffect(() => {
        let mounted = true;

        (async () => {
            const { data } = await supabase.auth.getSession();
            if (!mounted) return;
            setUserId(data.session?.user?.id ?? null);
        })();

        const { data: sub } = supabase.auth.onAuthStateChange((_evt, session) => {
            if (!mounted) return;
            setUserId(session?.user?.id ?? null);
        });

        return () => {
            mounted = false;
            sub.subscription.unsubscribe();
        };
    }, []);

    React.useEffect(() => {
        document.body.style.overflow = authOpen ? "hidden" : "";
    }, [authOpen]);

    const ctxValue: AuthCtx = {
        userId,
        openAuth: () => setAuthOpen(true),
        closeAuth: () => setAuthOpen(false),
    };

    return (
        <Ctx.Provider value={ctxValue}>
            {children}
            {/* Centralized Auth UI so any component can open it */}
            <AuthCard open={authOpen} onClose={() => setAuthOpen(false)} />
        </Ctx.Provider>
    );
}
