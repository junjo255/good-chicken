import { NextResponse } from "next/server";
import {getMerchant} from "@/app/lib/clover/storage";
import {getItemStock, listItems} from "@/app/lib/clover/clover";


export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const merchantId = searchParams.get("merchantId");
    if (!merchantId) return new NextResponse("merchantId required", { status: 400 });


    const merchant = await getMerchant(merchantId);
    if (!merchant) return new NextResponse("Unknown merchant", { status: 404 });


    const items = await listItems(merchantId, merchant.access_token, 100, 0);


    const withStock = await Promise.all(
        items.elements.map(async (it: any) => {
            try {
                const stock = await getItemStock(merchantId, merchant.access_token, it.id);
                return { ...it, stock };
            } catch {
                return { ...it, stock: null };
            }
        })
    );


    return NextResponse.json({ count: items.count, items: withStock });
}