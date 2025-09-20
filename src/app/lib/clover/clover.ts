import { z } from "zod";
const env = process.env.CLOVER_ENV === "prod" ? "prod" : "sandbox";

export const CLOVER_PLATFORM_BASE = env === "prod"
    ? "https://api.clover.com"
    : "https://apisandbox.dev.clover.com";


// Ecommerce services (card-not-present)
export const CLOVER_ECOMM_BASE = env === "prod"
    ? "https://scl.clover.com"
    : "https://scl-sandbox.dev.clover.com";


export const CLOVER_TOKEN_BASE = env === "prod"
    ? "https://token.clover.com"
    : "https://token-sandbox.dev.clover.com";


export const CloverTokenSchema = z.object({
    merchantId: z.string(),
    access_token: z.string(),
    refresh_token: z.string().optional(),
    expires_at: z.number().optional() // epoch seconds
});
export type CloverToken = z.infer<typeof CloverTokenSchema>;


export async function cloverOAuthTokenExchange(code: string) {
    const url = new URL(`${CLOVER_PLATFORM_BASE}/oauth/token`);
    url.searchParams.set("client_id", process.env.CLOVER_APP_CLIENT_ID!);
    if (process.env.CLOVER_APP_CLIENT_SECRET) {
        url.searchParams.set("client_secret", process.env.CLOVER_APP_CLIENT_SECRET);
    }
    url.searchParams.set("code", code);
    url.searchParams.set("redirect_uri", process.env.CLOVER_OAUTH_REDIRECT_URL!);


    const res = await fetch(url.toString(), { method: "POST" });
    if (!res.ok) throw new Error(`OAuth token exchange failed: ${res.status}`);
    return res.json();
}


export async function cloverGet<T>(merchantId: string, path: string, accessToken: string, init?: RequestInit): Promise<T> {
    const res = await fetch(`${CLOVER_PLATFORM_BASE}${path.replace(/^/,'')}`, {
        ...init,
        method: init?.method ?? "GET",
        headers: {
            "Accept": "application/json",
            "Authorization": `Bearer ${accessToken}`,
            ...(init?.headers || {})
        }
    });
    if (!res.ok) throw new Error(`GET ${path} failed: ${res.status}`);
    return res.json() as Promise<T>;
}

export async function cloverPost<T>(merchantId: string, path: string, accessToken: string, body?: unknown): Promise<T> {
    const res = await fetch(`${CLOVER_PLATFORM_BASE}${path}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${accessToken}`
        },
        body: body ? JSON.stringify(body) : undefined
    });
    if (!res.ok) throw new Error(`POST ${path} failed: ${res.status}`);
    return res.json() as Promise<T>;
}


// === Inventory convenience wrappers (Platform v3) ===
export async function listItems(merchantId: string, accessToken: string, limit = 100, offset = 0) {
// Supports pagination; you can also use expand= to pull related stocks
    const path = `/v3/merchants/${merchantId}/items?limit=${limit}&offset=${offset}`;
    return cloverGet<{ elements: any[]; count: number }>(merchantId, path, accessToken);
}


export async function getItemStock(merchantId: string, accessToken: string, itemId: string) {
    const path = `/v3/merchants/${merchantId}/item_stocks/${itemId}`;
    return cloverGet<any>(merchantId, path, accessToken);
}


export async function updateItemStock(merchantId: string, accessToken: string, itemId: string, quantity: number) {
    const path = `/v3/merchants/${merchantId}/item_stocks/${itemId}`;
    return cloverPost<any>(merchantId, path, accessToken, { quantity });
}


// === Ecommerce helpers (skeletons) ===
export async function createHostedCheckoutSession(payload: Record<string, unknown>) {
// NOTE: Exact endpoint/shape depends on your Ecommerce feature (Hosted Checkout / Orders API).
// Keep secret key server-side only.
    const res = await fetch(`${CLOVER_ECOMM_BASE}/v1/hosted-checkout/sessions`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.CLOVER_ECOMM_SECRET_KEY}`
        },
        body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error(`Hosted checkout session failed: ${res.status}`);
    return res.json();
}


export async function payDirectOrder(payload: Record<string, unknown>) {
    const res = await fetch(`${CLOVER_ECOMM_BASE}/v1/orders/pay`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.CLOVER_ECOMM_SECRET_KEY}`
        },
        body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error(`Direct pay failed: ${res.status}`);
    return res.json();
}


export function platformBaseForLogs() {
    return CLOVER_PLATFORM_BASE;
}