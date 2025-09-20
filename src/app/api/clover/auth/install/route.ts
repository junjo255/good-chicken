import { NextResponse } from "next/server";
import {platformBaseForLogs} from "@/app/lib/clover/clover";


export async function GET() {
    const base = platformBaseForLogs();
    const params = new URLSearchParams({
        client_id: process.env.CLOVER_APP_CLIENT_ID!,
        response_type: "code",
        redirect_uri: process.env.CLOVER_OAUTH_REDIRECT_URL!,
        scope: "MERCHANT_READ INVENTORY_READ INVENTORY_WRITE ORDERS_READ ORDERS_WRITE PAYMENTS_READ PAYMENTS_WRITE CUSTOMERS_READ CUSTOMERS_WRITE" // tailor as needed
    });
    const url = `${base}/oauth/authorize?${params.toString()}`;
    return NextResponse.redirect(url);
}