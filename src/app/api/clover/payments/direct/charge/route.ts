import { NextResponse } from "next/server";
import {payDirectOrder} from "@/app/lib/clover/clover";


export async function POST(req: Request) {
    const body = await req.json();
// Expected body: { amount, currency, sourceToken, description, metadata }
    const result = await payDirectOrder(body);
    return NextResponse.json(result);
}