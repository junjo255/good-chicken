import { NextResponse } from "next/server";
import {createHostedCheckoutSession} from "@/app/lib/clover/clover";


export async function POST(req: Request) {
    const { amount, currency, orderId, customer } = await req.json();


// Example payload (adjust per your configured Hosted Checkout product):
    const payload = {
        amount, // cents
        currency, // "USD" etc.
        orderId, // your internal order reference
        customer, // { email, name }
        successUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
        cancelUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout`
    };


    const session = await createHostedCheckoutSession(payload);
// Expect response to include a hosted checkout URL
    return NextResponse.json({ checkoutUrl: session.url || session.checkoutUrl || null, raw: session });
}