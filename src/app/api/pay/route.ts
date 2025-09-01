import { NextRequest } from 'next/server';
import { z } from 'zod';
import { captureWithOpaque } from '@/lib/authnet';
import { addLineItems, createOrder, ensureTenderId, printToKitchen, recordExternalPayment } from '@/lib/clover';


export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';


const ItemSchema = z.object({ name: z.string(), priceCents: z.number().int().nonnegative(), quantity: z.number().int().positive() });
const BodySchema = z.object({
    items: z.array(ItemSchema),
    subtotalCents: z.number().int(),
    taxCents: z.number().int(),
    tipCents: z.number().int().default(0),
    serviceFeeCents: z.number().int().default(0),
    orderType: z.enum(['pickup','delivery']).default('pickup'),
    customer: z.object({ name: z.string().optional(), email: z.string().email().optional(), phone: z.string().optional(), notes: z.string().optional() }).default({}),
    opaqueData: z.object({ dataDescriptor: z.string(), dataValue: z.string() })
});


export async function POST(req: NextRequest) {
    try {
        const body = BodySchema.parse(await req.json());
        const amountCents = body.subtotalCents + body.taxCents + body.tipCents + body.serviceFeeCents;


// 1) Capture on Authorize.Net
        const authnet = await captureWithOpaque(amountCents, body.opaqueData);
        if (authnet.resultCode !== 'Ok' || authnet.responseCode !== 1 || !authnet.transId) {
            return new Response(JSON.stringify({ ok: false, stage: 'authnet', details: { resultCode: authnet.resultCode, responseCode: authnet.responseCode } }), { status: 402 });
        }


// 2) Create order in Clover
        const title = `${process.env.NEXT_PUBLIC_STORE_NAME || 'Online Order'} — ${body.orderType}`;
        const order = await createOrder(title);
        const orderId = order?.id;


// 3) Add line items to Clover
        await addLineItems(orderId, body.items);


// 4) Record an external tender payment on the Clover order
        const tenderId = await ensureTenderId(process.env.CLOVER_TENDER_ID);
        await recordExternalPayment(orderId, amountCents, tenderId, `AUTHNET-${authnet.transId}`);


// 5) Optionally print the order to kitchen
        try { await printToKitchen(orderId); } catch {}


        return new Response(JSON.stringify({ ok: true, orderId, transId: authnet.transId }), { status: 200 });
    } catch (e: any) {
        return new Response(JSON.stringify({ ok: false, error: e.message || 'Payment failed' }), { status: 400 });
    }
}