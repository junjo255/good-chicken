export type MerchantRecord = {
    merchantId: string;
    access_token: string;
    refresh_token?: string;
    expires_at?: number;
};


const store = new Map<string, MerchantRecord>();


export async function saveMerchant(rec: MerchantRecord) {
    store.set(rec.merchantId, rec);
    return rec;
}


export async function getMerchant(merchantId: string) {
    return store.get(merchantId) || null;
}