"use client";

import React from "react";
import { supabase } from "@/app/lib/supabase/client";
import AuthCard from "@/app/components/Auth/AuthCard";

type AuthCtx = {
    userId: string | null;
    firstName: string | null;
    openAuth: () => void;
    closeAuth: () => void;
};

const Ctx = React.createContext<AuthCtx | null>(null);

export function useAuth() {
    const ctx = React.useContext(Ctx);
    return (
        ctx ?? {
            userId: null,
            firstName: null,
            openAuth: () => {},
            closeAuth: () => {},
        }
    );
}

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const [userId, setUserId] = React.useState<string | null>(null);
    const [authOpen, setAuthOpen] = React.useState(false);
    const [firstName, setFirstName] = React.useState<string | null>(null);

    React.useEffect(() => {
        let cancelled = false;
        async function loadProfile() {
            if (!userId) { setFirstName(null); return; }
            const { data, error } = await supabase
                .from("profiles")
                .select("first_name, last_name")
                .eq("id", userId)
                .maybeSingle();

            if (cancelled) return;
            if (error) {
                console.error("load profile failed:", error.message);
                setFirstName(null);
                return;
            }

            setFirstName(data?.first_name);
        }

        loadProfile();
        return () => { cancelled = true; };
    }, [userId]);


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
        firstName,
        openAuth: () => setAuthOpen(true),
        closeAuth: () => setAuthOpen(false),
    };

    return (
        <Ctx.Provider value={ctxValue}>
            {children}
            <AuthCard open={authOpen} onClose={() => setAuthOpen(false)} />
        </Ctx.Provider>
    );
}
