"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

// The Main API
//
// Base URL: https://sandbox.dev.clover.com/v3/merchants/{mId}/... (sandbox) or https://api.clover.com/v3/merchants/{mId}/... (production).
//
//     Authentication: Uses an OAuth 2.0 access token tied to your merchant account.
//
//     Core Resources:
//
//     Items API → /items
// Create, update, delete items that appear on the POS.
//     Example:
//
// POST /v3/merchants/{mId}/items
// Authorization: Bearer {token}
// Content-Type: application/json
//
// {
//     "name": "Blue Lemonade",
//     "price": 549,
//     "priceType": "FIXED",
//     "hidden": false,
//     "isRevenue": true
// }
//
//
// Categories API → /categories
// Group items for the POS interface.
//
// Modifiers API → /modifier_groups
// Add options like “BBQ Sauce”, “Blue Cheese”.
//
// Inventory API → /inventory
// Manage stock counts and “Out of Stock” status.
//
// 🧩 Which API for Items?
//
//                     For the list you shared (menu items with prices, in/out of stock flags, hidden flags), the main ones are:
//
// Inventory Items API → to add/update each menu item.
//
//     Categories API → to group them (e.g., Beverages, Catering).
//
// Attributes (like isHidden, outOfStock) → handled by fields in the items resource or related endpoints.
//
// 🚀 Flow
//
// Authenticate (OAuth → get access_token).
//
// Call POST /items (or PUT /items/{itemId}) to send your products to Clover.
//
//     Optionally assign them to categories, modifier groups, etc.
//
//     POS devices pull updates automatically from Clover’s cloud.
//
// ⚠️ Important: Clover only accepts cents (integer) for price fields (549 = $5.49).
/** ----------------------------------------------------------------
 *  Public script URL helper (sandbox vs production)
 *  ---------------------------------------------------------------- */
export function getCloverSdkSrc(env: "production" | "sandbox" = "sandbox") {
    return env === "production"
        ? "https://checkout.clover.com/sdk.js"
        : "https://checkout.sandbox.dev.clover.com/sdk.js";
}

/** ----------------------------------------------------------------
 *  Hook: load Clover SDK once and report readiness
 *  ---------------------------------------------------------------- */
export function useCloverSdk(
    env: "production" | "sandbox" = (process.env.NEXT_PUBLIC_CLOVER_ENV === "production" ? "production" : "sandbox")
) {
    const [ready, setReady] = useState(false);
    const hasAppended = useRef(false);

    useEffect(() => {
        if (typeof window === "undefined") return;
        if ((window as any).Clover) {
            setReady(true);
            return;
        }
        if (hasAppended.current) return;
        hasAppended.current = true;

        const script = document.createElement("script");
        script.src = getCloverSdkSrc(env);
        script.async = true;
        script.onload = () => setReady(Boolean((window as any).Clover));
        script.onerror = () => setReady(false);
        document.head.appendChild(script);

        return () => {
            // don’t remove to avoid reloading on route changes
        };
    }, [env]);

    return ready;
}

/** ----------------------------------------------------------------
 *  Factory: create Clover instance + elements
 *  ---------------------------------------------------------------- */
export function createClover(publicKey: string) {
    const CloverCtor = (window as any).Clover;
    if (!CloverCtor) throw new Error("Clover SDK not loaded");
    if (!publicKey) throw new Error("Missing Clover public key");
    return new CloverCtor(publicKey);
}

export type CloverElements = {
    create: (type: "CARD_NUMBER" | "CARD_DATE" | "CARD_CVV" | "CARD_POSTAL_CODE", styles?: any) => {
        mount: (selector: string) => void;
        unmount: () => void;
    };
};

export function createCloverElements(publicKey: string): CloverElements {
    const clover = createClover(publicKey);
    return clover.elements();
}

/** ----------------------------------------------------------------
 *  Tokenize helper
 *  ---------------------------------------------------------------- */
export async function cloverCreateToken(publicKey: string): Promise<{ token: string }> {
    const clover = createClover(publicKey);
    const result = await clover.createToken();
    if (result?.errors) {
        // pick a human message
        const first = Object.values(result.errors)[0];
        throw new Error(String(first ?? "Card validation failed"));
    }
    if (!result?.token) throw new Error("Tokenization failed");
    return { token: result.token as string }; // e.g., "clv_xxx"
}

/** ----------------------------------------------------------------
 *  React component: Hosted fields (number, date, cvv, postal)
 *  ----------------------------------------------------------------
 *  Props:
 *    - publicKey: Clover public (apiAccessKey)
 *    - env: "sandbox" | "production"
 *    - onToken: callback when token created
 *    - onError: callback when tokenization fails
 *    - styles: optional Clover element styles
 *    - autoTokenizeOnMount: if true, tries tokenization after mount (usually false)
 *    - externalSubmitRef: a ref you can call to trigger tokenization from outside
 *  ---------------------------------------------------------------- */
export type CloverCardFieldsHandle = {
    tokenize: () => Promise<void>;
};

export function CloverCardFields({
                                     publicKey = process.env.NEXT_PUBLIC_CLOVER_PUBLIC_KEY || "",
                                     env = (process.env.NEXT_PUBLIC_CLOVER_ENV === "production" ? "production" : "sandbox") as "sandbox" | "production",
                                     onToken,
                                     onError,
                                     styles,
                                     autoTokenizeOnMount = false,
                                     externalSubmitRef,
                                     ids = {
                                         number: "clover-card-number",
                                         date: "clover-card-date",
                                         cvv: "clover-card-cvv",
                                         postal: "clover-card-postal",
                                     },
                                 }: {
    publicKey?: string;
    env?: "sandbox" | "production";
    onToken: (token: string) => void;
    onError?: (message: string) => void;
    styles?: any;
    autoTokenizeOnMount?: boolean;
    externalSubmitRef?: React.Ref<CloverCardFieldsHandle>;
    ids?: { number: string; date: string; cvv: string; postal: string };
}) {
    const sdkReady = useCloverSdk(env);
    const [elements, setElements] = useState<CloverElements | null>(null);
    const mounts = useRef<{ unmountAll: () => void } | null>(null);

    // expose imperative tokenize
    const tokenize = useMemo(
        () => async () => {
            try {
                const { token } = await cloverCreateToken(publicKey);
                onToken(token);
            } catch (e: any) {
                onError?.(e?.message ?? "Tokenization failed");
            }
        },
        [publicKey, onToken, onError]
    );

    useEffect(() => {
        if (externalSubmitRef) {
            const api: CloverCardFieldsHandle = { tokenize };
            if (typeof externalSubmitRef === "function") {
                externalSubmitRef(api);
            } else {
                (externalSubmitRef as React.MutableRefObject<CloverCardFieldsHandle | undefined>).current = api;
            }
        }
    }, [externalSubmitRef, tokenize]);

    // mount/unmount hosted fields
    useEffect(() => {
        if (!sdkReady) return;
        try {
            const els = createCloverElements(publicKey);
            setElements(els);

            const number = els.create("CARD_NUMBER", styles);
            const date = els.create("CARD_DATE", styles);
            const cvv = els.create("CARD_CVV", styles);
            const postal = els.create("CARD_POSTAL_CODE", styles);

            number.mount(`#${ids.number}`);
            date.mount(`#${ids.date}`);
            cvv.mount(`#${ids.cvv}`);
            postal.mount(`#${ids.postal}`);

            mounts.current = {
                unmountAll: () => {
                    try { number.unmount(); } catch {}
                    try { date.unmount(); } catch {}
                    try { cvv.unmount(); } catch {}
                    try { postal.unmount(); } catch {}
                },
            };

            if (autoTokenizeOnMount) {
                // Often you don’t want this; left here for completeness.
                tokenize();
            }
        } catch (e: any) {
            onError?.(e?.message ?? "Failed to mount Clover fields");
        }

        return () => {
            mounts.current?.unmountAll();
            mounts.current = null;
            setElements(null);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sdkReady, publicKey, JSON.stringify(styles), ids.number, ids.date, ids.cvv, ids.postal]);

    return (
        <div className="space-y-3">
            <div id={ids.number} className="rounded-lg border p-3" />
            <div className="grid grid-cols-2 gap-3">
                <div id={ids.date} className="rounded-lg border p-3" />
                <div id={ids.cvv} className="rounded-lg border p-3" />
            </div>
            <div id={ids.postal} className="rounded-lg border p-3" />
            {/* No internal submit button. Call tokenize via `externalSubmitRef` or your own Next button. */}
        </div>
    );
}
