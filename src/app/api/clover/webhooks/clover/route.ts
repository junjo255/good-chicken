import { NextResponse } from "next/server";
import {verifyCloverWebhook} from "@/app/lib/clover/verifyCloverWebhook";


export const runtime = "nodejs"; // ensure Node runtime for crypto


export async function POST(req: Request) {
    const raw = await req.text(); // IMPORTANT: read raw body
    const signature = (req.headers.get("x-clover-signature") || req.headers.get("clover-signature") || "").trim();


    const ok = verifyCloverWebhook(raw, signature);
    if (!ok) return new NextResponse("Invalid signature", { status: 401 });


// Parse after verifying
    const evt = JSON.parse(raw);


// Minimal router – customize for your topics/types
    switch (evt.type || evt.topic) {
        case "inventory.item.updated":
        case "inventory.stock.updated":
// TODO: fetch the changed item/stock from Platform v3 and update your DB
            break;
        case "ecommerce.payment.succeeded":
// TODO: mark order paid; decrement stock via Platform v3 `item_stocks`
            break;
        case "ecommerce.payment.refunded":
// TODO: adjust ledger and (optionally) restock
            break;
    }


    return NextResponse.json({ received: true });
}