import { NextResponse } from "next/server";
import {saveMerchant} from "@/app/lib/clover/storage";
import {cloverOAuthTokenExchange} from "@/app/lib/clover/clover";


export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");
    const merchant_id = searchParams.get("merchant_id") || searchParams.get("merchantId");


    if (!code || !merchant_id) {
        return new NextResponse("Missing code or merchant_id", { status: 400 });
    }


    const tokenJson = await cloverOAuthTokenExchange(code);
// tokenJson typically includes access_token, merchant_id, expires_in, refresh_token (depending on your app type)
    await saveMerchant({
        merchantId: merchant_id,
        access_token: tokenJson.access_token,
        refresh_token: tokenJson.refresh_token,
        expires_at: tokenJson.expires_in ? Math.floor(Date.now()/1000) + tokenJson.expires_in : undefined
    });

    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/checkout`);
}