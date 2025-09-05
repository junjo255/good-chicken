import { NextRequest, NextResponse } from 'next/server';
import { addLineItems, createOrder, ensureTenderId, printToKitchen, recordExternalPayment } from '@/app/lib/clover';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const amountCents = body.subtotalCents + body.taxCents + (body.tipCents || 0) + (body.serviceFeeCents || 0);

        const title = `${process.env.NEXT_PUBLIC_STORE_NAME || 'Online Order'} — ${body.orderType || 'pickup'}`;
        const order = await createOrder(title);
        const orderId = order?.id;

        await addLineItems(orderId, body.items);

        const tenderId = await ensureTenderId(process.env.CLOVER_TENDER_ID);
        await recordExternalPayment(orderId, amountCents, tenderId, `EXT-${Date.now()}`);

        try { await printToKitchen(orderId); } catch {}

        return NextResponse.json({ ok: true, orderId });
    } catch (e: any) {
        return NextResponse.json({ ok: false, error: e.message || 'Payment failed' }, { status: 400 });
    }
}

