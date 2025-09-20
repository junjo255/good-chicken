import { NextResponse } from "next/server";


// Typically you don't need a server endpoint for publishable token use, but
// some iFrame/SDKs request a short-lived token negotiated by your server.
export async function GET() {
// Example: return your publishable key so the client can initialize the iFrame SDK
    return NextResponse.json({ publishableKey: process.env.CLOVER_ECOMM_PUBLISHABLE_KEY });
}