import { NextResponse } from "next/server";
import { z } from "zod";
import {getMerchant} from "@/app/lib/clover/storage";
import {updateItemStock} from "@/app/lib/clover/clover";


const Body = z.object({ merchantId: z.string(), itemId: z.string(), quantity: z.number().int().nonnegative() });


export async function POST(req: Request) {
    const json = await req.json();
    const body = Body.parse(json);
    const merchant = await getMerchant(body.merchantId);
    if (!merchant) return new NextResponse("Unknown merchant", { status: 404 });


    const out = await updateItemStock(body.merchantId, merchant.access_token, body.itemId, body.quantity);
    return NextResponse.json(out);
}