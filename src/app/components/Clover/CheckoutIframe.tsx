"use client";
import React, { useEffect, useState } from "react";


export default function CheckoutIframe() {
    const [pubKey, setPubKey] = useState<string | null>(null);


    useEffect(() => {
        (async () => {
            const r = await fetch("/api/payments/iframe-token");
            const j = await r.json();
            setPubKey(j.publishableKey);
        })();
    }, []);


    if (!pubKey) return <div>Loading payment form…</div>;


// Placeholder: replace with Clover’s actual iFrame Embed snippet
    return (
        <iframe
            title="Clover Payment"
            src={`https://pay.sandbox.example.clover/iframe?pk=${encodeURIComponent(pubKey)}&amount=1999&currency=USD`}
            className="w-full h-[520px] border rounded"
        />
    );
}