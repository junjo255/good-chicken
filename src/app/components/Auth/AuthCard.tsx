"use client";

import React, { useMemo, useState } from "react";
import { supabase } from "@/app/lib/supabase/client";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import styles from "./AuthCard.module.css";

type AuthCardProps = { open: boolean; onClose: () => void };

export default function AuthCard({ open, onClose }: AuthCardProps) {
    const [mode, setMode] = useState<"sign_in" | "sign_up">("sign_up"); // open directly to Create Account
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState<string | null>(null);
    const [ok, setOk] = useState<string | null>(null);

    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");

    const canSubmit = useMemo(() => {
        if (mode === "sign_in") return true;
        return (
            firstName.trim().length >= 1 &&
            lastName.trim().length >= 1 &&
            email.trim().length > 3 &&
            password.length >= 6 &&
            phone.trim().length >= 7
        );
    }, [mode, firstName, lastName, email, password, phone]);

    if (!open) return null;

    async function handleSignUp(e: React.FormEvent) {
        e.preventDefault();
        setErr(null);
        setOk(null);
        setLoading(true);
        try {
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        first_name: firstName,
                        last_name: lastName,
                        full_name: `${firstName} ${lastName}`.trim(),
                    },
                },
            });
            if (error) throw error;
            setOk("Account created. Check your email to confirm, then sign in.");
            setMode("sign_in");
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

            {/* Card */}
            <div className="relative z-[101] text-[16px] w-full md:max-w-sm md:rounded-2xl bg-white shadow-xl">
                {/* Close */}
             <div className={styles.header}>

                    <div className="flex items-center justify-center">
                        <img
                            width="85"
                            height="85"
                            src={"/logo/GoodChicken-logo.png"}
                            alt="Good Chicken"
                        />
                    </div>

                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close"
                    className="absolute top-3 right-3 rounded-md px-2 py-1 text-md text-neutral-600 hover:bg-neutral-100 hover:rounded-full cursor-pointer"
                >
                    ✕
                </button>

             </div>
                <div className="pt-1 px-6 pb-6">
                    {/* (Optional) little heading area for consistency */}
                    <div className={styles.header}>
                        <p className={`${styles.subheader} text-center`}>
                            {mode === "sign_in" ? "Welcome back!" : "Create your account"}
                        </p>
                    </div>

                    {/* Mode switch (kept but subtle) */}
                    <div className="mt-3 mb-5 grid grid-cols-2 gap-2 bg-neutral-100 rounded-xl p-1">
                        <button
                            className={`py-2 rounded-lg ${
                                mode === "sign_in" ? "bg-white shadow font-medium" : "text-neutral-600"
                            }`}
                            onClick={() => setMode("sign_in")}
                            type="button"
                        >
                            Sign in
                        </button>
                        <button
                            className={`py-2 rounded-lg ${
                                mode === "sign_up" ? "bg-white shadow font-medium" : "text-neutral-600"
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
                            providers={["google"]}
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
                                            brand: "#3F3126",
                                            brandAccent: "#3a2a1e",
                                            inputText: "#0f172a",
                                            inputBackground: "#ffffff",
                                            inputBorder: "#e5e7eb",
                                            inputBorderFocus: "#f3f3f3",
                                            defaultButtonBackground: "#ffffff",
                                            defaultButtonBorder: "#e5e7eb",
                                            defaultButtonText: "#3F3126",
                                            messageText: "#6b7280",
                                        },
                                        radii: {inputBorderRadius: "12px", borderRadiusButton: "12px"},
                                        space: {inputPadding: "12px", buttonPadding: "12px"},
                                        fonts: {
                                            bodyFontFamily: "inherit",
                                            buttonFontFamily: "inherit",
                                            inputFontFamily: "inherit",
                                            labelFontFamily: "inherit",
                                        },
                                        fontSizes: {
                                            baseBodySize: "16px",
                                            baseLabelSize: "14px",
                                            baseInputSize: "16px",
                                            baseButtonSize: "16px",
                                        },
                                    },
                                },
                                className: {
                                    container: "auth-container",
                                    button: styles.googleBtn,
                                    input: styles["auth-input"],
                                    label: styles["auth-label"],
                                    divider: "auth-divider",
                                    anchor: styles["auth-link"],
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
                        <form onSubmit={handleSignUp} className="space-y-5">
                            {/* Google button */}
                            <button
                                type="button"
                                onClick={async () => {
                                    await supabase.auth.signInWithOAuth({provider: "google"});
                                }}
                                className={styles.googleBtn}
                            >
                                {/* Google "G" */}
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="25" height="25"
                                     aria-hidden="true">
                                    <path fill="#FFC107"
                                          d="M43.6 20.5H42V20H24v8h11.3C33.6 32.4 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.1 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c10 0 19-7.3 19-20 0-1.3-.1-2.5-.4-3.5z"/>
                                    <path fill="#FF3D00"
                                          d="M6.3 14.7l6.6 4.8C14.7 16.1 18.9 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.1 6.1 29.3 4 24 4 15.5 4 8.4 9 6.3 14.7z"/>
                                    <path fill="#4CAF50"
                                          d="M24 44c5.1 0 10-1.9 13.6-5.3l-6.3-5.3C29.3 35.9 26.8 37 24 37c-5.2 0-9.6-3.6-11.1-8.5l-6.5 5C8.4 39 15.5 44 24 44z"/>
                                    <path fill="#1976D2"
                                          d="M43.6 20.5H42V20H24v8h11.3c-1.1 3.2-3.6 5.8-6.7 7.2l6.3 5.3C37.5 38.6 43 33.5 43.6 24c.1-1.2 0-2.3 0-3.5z"/>
                                </svg>
                                <span className="text-md">Create account with Google</span>
                            </button>

                            {/* Divider */}
                            <div className={styles.divider}>
                                <div className={styles.dividerLine}/>
                                <span className={styles.dividerText}>or</span>
                                <div className={styles.dividerLine}/>
                            </div>

                            {/* Alerts */}
                            {err && (
                                <div
                                    className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                                    {err}
                                </div>
                            )}
                            {ok && (
                                <div
                                    className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
                                    {ok}
                                </div>
                            )}

                            {/* Name */}
                            <div>
                                <label className={styles["auth-label"]}>
                                    Name<span className="text-red-500">*</span>
                                </label>
                                <input
                                    className={styles["auth-input"]}
                                    type="text"
                                    placeholder="Enter your name"
                                    value={`${firstName} ${lastName}`.trim()}
                                    onChange={(e) => {
                                        const v = e.target.value;
                                        const [f, ...rest] = v.split(" ");
                                        setFirstName(f ?? "");
                                        setLastName(rest.join(" ") ?? "");
                                    }}
                                    required
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label className={styles["auth-label"]} htmlFor="email">
                                    Email<span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="email"
                                    className={styles["auth-input"]}
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            {/* Password */}
                            <div>
                                <label className={styles["auth-label"]}>
                                    Password<span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="password"
                                    className={styles["auth-input"]}
                                    type="password"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    minLength={6}
                                    autoComplete="new-password"
                                />
                            </div>

                            {/* CTA */}
                            <button type="submit" disabled={!canSubmit || loading} className={styles.submitBtn}>
                                Create Account
                            </button>

                            {/* Footer link */}
                            <p className={styles.footerText}>
                                Already have an account?{" "}
                                <button type="button" className={styles.footerLink} onClick={() => setMode("sign_in")}>
                                    Login Here
                                </button>
                            </p>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
