import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";

const API_BASE =
    process.env.CLOVER_ENV === "production"
        ? "https://scl.clover.com"
        : "https://scl-sandbox.dev.clover.com";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        // ⚠️ Always compute the total on the server (do NOT trust client amount)
        // Example: const amount = await calculateAmountFromCart(body.cartId);
        const amount: number = Number(body.amount); // cents; replace with real calc
        const currency = "usd";
        const cloverSourceToken: string = body.source; // "clv_..." from Clover iframe

        if (!cloverSourceToken?.startsWith("clv_")) {
            return NextResponse.json({ error: "Missing/invalid Clover token" }, { status: 400 });
        }

        const idempotencyKey = randomUUID();
        const bearer = process.env.CLOVER_PRIVATE_KEY!; // or OAuth access_token

        const resp = await fetch(`${API_BASE}/v1/charges`, {
            method: "POST",
            headers: {
                accept: "application/json",
                "content-type": "application/json",
                authorization: `Bearer ${bearer}`,
                "idempotency-key": idempotencyKey,
                "x-forwarded-for": req.headers.get("x-forwarded-for") || "",
            },
            body: JSON.stringify({
                amount,
                currency,
                source: cloverSourceToken,
            }),
        });

        const data = await resp.json();
        if (!resp.ok) {
            return NextResponse.json({ error: data?.error || "Charge failed", raw: data }, { status: 400 });
        }
        return NextResponse.json({ ok: true, charge: data });
    } catch (e: any) {
        return NextResponse.json({ error: e?.message || "Server error" }, { status: 500 });
    }
}
