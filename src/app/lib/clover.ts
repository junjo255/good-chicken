export type CloverLineItem = { name: string; price: number; quantity: number };


const BASE = process.env.CLOVER_API_BASE!;
const MID = process.env.CLOVER_MERCHANT_ID!;
const TOKEN = process.env.CLOVER_API_TOKEN!;


async function cloverFetch(path: string, init?: RequestInit) {
    const res = await fetch(`${BASE}/v3/merchants/${MID}${path}`, {
        ...init,
        headers: {
            'Authorization': `Bearer ${TOKEN}`,
            'Content-Type': 'application/json',
            ...(init?.headers || {})
        },
        cache: 'no-store'
    });
    if (!res.ok) throw new Error(`Clover ${path} ${res.status}`);
    return res.json();
}


export async function ensureTenderId(preferredId?: string): Promise<string> {
    if (preferredId) return preferredId;
    try {
        const data = await cloverFetch(`/tenders`);
        const tenders: any[] = data?.elements || [];
        const found = tenders.find(t => /other|external|authorize/i.test(`${t.label || t.name || ''}`));
        if (found?.id) return found.id;
    } catch {}
    throw new Error('No Clover tender found. Set CLOVER_TENDER_ID in env or create a custom tender.');
}


export async function createOrder(title: string) {
    return cloverFetch(`/orders`, {
        method: 'POST',
        body: JSON.stringify({ state: 'OPEN', title })
    });
}


export async function addLineItems(orderId: string, items: CloverLineItem[]) {
    return cloverFetch(`/orders/${orderId}/bulk_line_items`, {
        method: 'POST',
        body: JSON.stringify({
            items: items.map(i => ({ name: i.name, price: i.price, quantity: i.quantity }))
        })
    });
}


export async function recordExternalPayment(orderId: string, amount: number, tenderId: string, externalPaymentId: string) {
    return cloverFetch(`/orders/${orderId}/payments`, {
        method: 'POST',
        body: JSON.stringify({ amount, tender: { id: tenderId }, externalPaymentId })
    });
}


export async function printToKitchen(orderId: string) {
// Optional: fire to default device
    const res = await fetch(`${BASE}/v3/merchants/${MID}/print_event`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId })
    });
// non-fatal if fails
    return res.ok;
}