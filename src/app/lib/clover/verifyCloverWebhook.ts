import crypto from "node:crypto";


/**
 * Minimal HMAC-SHA256 verification.
 * Adjust header names / payload canonicalization per Clover webhook docs.
 */
export function verifyCloverWebhook(rawBody: string, signatureHeader?: string) {
    if (!signatureHeader) return false;
    const secret = process.env.CLOVER_WEBHOOK_SIGNING_SECRET;
    if (!secret) return false;
    const expected = crypto
        .createHmac("sha256", secret)
        .update(rawBody, "utf8")
        .digest("hex");
    return crypto.timingSafeEqual(Buffer.from(signatureHeader), Buffer.from(expected));
}