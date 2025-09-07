export function formatUSD(amount?: number) {
    if (typeof amount !== "number" || Number.isNaN(amount)) return "";
    return amount.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

