"use client";

import { useMemo, useState } from "react";
import { supabase } from "@/app/lib/supabase/client";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import styles from "./AuthCard.module.css";

type AuthCardProps = {
    open: boolean;
    onClose: () => void;
};

// Toggle this if you maintain a `profiles` table (id uuid PK references auth.users)
// create table profiles (id uuid primary key references auth.users on delete cascade, name text, phone text, created_at timestamp default now());
const MIRROR_TO_PROFILES = false;

export default function AuthCard({ open, onClose }: AuthCardProps) {
    const [mode, setMode] = useState<"sign_in" | "sign_up">("sign_in");
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState<string | null>(null);
    const [ok, setOk] = useState<string | null>(null);

    // sign-up form fields
    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const canSubmit = useMemo(() => {
        if (mode === "sign_in") return true;
        return (
            fullName.trim().length >= 2 &&
            email.trim().length > 3 &&
            password.length >= 6 &&
            phone.trim().length >= 7
        );
    }, [mode, fullName, email, password, phone]);

    if (!open) return null;

    async function handleSignUp(e: React.FormEvent) {
        e.preventDefault();
        setErr(null);
        setOk(null);
        setLoading(true);
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        name: fullName,
                        phone_number: phone,
                    },
                    // emailRedirectTo: `${window.location.origin}/auth/callback`, // optional
                },
            });

            if (error) throw error;

            // Optionally mirror to a `profiles` table for relational queries
            if (MIRROR_TO_PROFILES && data.user) {
                const { error: insertErr } = await supabase.from("profiles").insert({
                    id: data.user.id,
                    name: fullName,
                    phone,
                });
                if (insertErr) {
                    // Non-fatal; user is created and metadata is stored
                    console.warn("profiles insert failed:", insertErr.message);
                }
            }

            // Supabase may require email confirmation depending on your project settings
            setOk(
                "Account created. Check your email to confirm, then sign in."
            );
            // Optionally switch back to sign_in
            setMode("sign_in");
            // Pre-fill email for convenience
            setEmail(email);
            setPassword("");
        } catch (e: any) {
            setErr(e?.message ?? "Something went wrong creating your account.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div
            className="auth-container fixed inset-0 z-[100] flex items-end md:items-center justify-center"
            role="dialog"
            aria-modal="true"
            aria-label="Account"
        >
            <div className="absolute inset-0 bg-black/40" onClick={onClose} />

            <div className="relative z-[101] text-md md:text-lg w-full md:max-w-lg md:rounded-2xl bg-white shadow-xl">
                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close"
                    className="absolute top-3 right-3 rounded-md px-2 py-1 text-md text-neutral-600 hover:bg-neutral-100 hover:rounded-full cursor-pointer"
                >
                    ✕
                </button>

                <div className="p-6">
                    <div className={styles.header}>
                        <div className="flex items-center justify-center">
                            <img
                                width="85"
                                height="85"
                                src={"/logo/GoodChicken-logo.png"}
                                alt="Good Chicken"
                            />
                        </div>
                        <p className={`${styles.subheader} mt-2 text-center`}>
                            {mode === "sign_in" ? "Welcome back!" : "Create your account"}
                        </p>
                    </div>

                    {/* Tab switcher */}
                    <div className="mt-4 mb-6 grid grid-cols-2 gap-2 bg-neutral-100 rounded-xl p-1">
                        <button
                            className={`py-2 rounded-lg ${
                                mode === "sign_in"
                                    ? "bg-white shadow font-medium"
                                    : "text-neutral-600"
                            }`}
                            onClick={() => setMode("sign_in")}
                            type="button"
                        >
                            Sign in
                        </button>
                        <button
                            className={`py-2 rounded-lg ${
                                mode === "sign_up"
                                    ? "bg-white shadow font-medium"
                                    : "text-neutral-600"
                            }`}
                            onClick={() => setMode("sign_up")}
                            type="button"
                        >
                            Create account
                        </button>
                    </div>

                    {mode === "sign_in" ? (
                        <Auth
                            supabaseClient={supabase}
                            view="sign_in"
                            providers={["google", "facebook", "apple"]}
                            socialLayout="vertical"
                            appearance={{
                                theme: ThemeSupa,
                                style: {
                                    anchor: {
                                        justifyContent: "flex-start",
                                        fontSize: "14px",
                                        color: "#6b7280",
                                        textAlign: "left",
                                    },
                                },
                                variables: {
                                    default: {
                                        colors: {
                                            brand: "#AF3935",
                                            brandAccent: "#AF3935",
                                            inputText: "#0f172a",
                                            inputBackground: "#ffffff",
                                            inputBorder: "#e5e7eb",
                                            inputBorderFocus: "#f3f3f3",
                                            defaultButtonBackground: "#ffffff",
                                            defaultButtonBorder: "#e5e7eb",
                                            defaultButtonText: "#3F3126",
                                            messageText: "#6b7280",
                                        },
                                        radii: {
                                            inputBorderRadius: "10px",
                                            borderRadiusButton: "10px",
                                        },
                                        space: {
                                            inputPadding: "12px",
                                            buttonPadding: "12px",
                                        },
                                        fonts: {
                                            bodyFontFamily: "inherit",
                                            buttonFontFamily: "inherit",
                                            inputFontFamily: "inherit",
                                            labelFontFamily: "inherit",
                                        },
                                        fontSizes: {
                                            baseBodySize: "18px",
                                            baseLabelSize: "16px",
                                            baseInputSize: "16px",
                                            baseButtonSize: "18px",
                                        },
                                    },
                                },
                                className: {
                                    container: "auth-container",
                                    button: "auth-btn",
                                    input: "auth-input",
                                    label: "auth-label",
                                    divider: "auth-divider",
                                    anchor: "auth-link",
                                },
                            }}
                            localization={{
                                variables: {
                                    sign_in: {
                                        email_label: "Email",
                                        password_label: "Password",
                                    },
                                },
                            }}
                        />
                    ) : (
                        <form onSubmit={handleSignUp} className="space-y-4">
                            {err && (
                                <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                                    {err}
                                </div>
                            )}
                            {ok && (
                                <div className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
                                    {ok}
                                </div>
                            )}

                            <div className="space-y-1">
                                <label className="auth-label" htmlFor="fullName">
                                    Full name
                                </label>
                                <input
                                    id="fullName"
                                    className="auth-input"
                                    type="text"
                                    placeholder="Jane Doe"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="auth-label" htmlFor="phone">
                                    Phone number
                                </label>
                                <input
                                    id="phone"
                                    className="auth-input"
                                    type="tel"
                                    placeholder="+1 555 123 4567"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="auth-label" htmlFor="email">
                                    Email
                                </label>
                                <input
                                    id="email"
                                    className="auth-input"
                                    type="email"
                                    placeholder="jane@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    autoComplete="email"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="auth-label" htmlFor="password">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    className="auth-input"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    autoComplete="new-password"
                                    minLength={6}
                                />
                            </div>

                            <button
                                type="submit"
                                className="auth-btn w-full"
                                disabled={!canSubmit || loading}
                            >
                                {loading ? "Creating account…" : "Create account"}
                            </button>

                            <p className="text-sm text-neutral-600">
                                Already have an account?{" "}
                                <button
                                    type="button"
                                    className="auth-link underline"
                                    onClick={() => setMode("sign_in")}
                                >
                                    Sign in
                                </button>
                            </p>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
