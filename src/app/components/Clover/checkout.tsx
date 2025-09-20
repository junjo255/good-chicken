import CheckoutIframe from "@/app/components/Clover/CheckoutIframe";


export default function CheckoutPage() {
    async function createHostedSession() {
        const res = await fetch("/api/payments/hosted-checkout", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ amount: 1999, currency: "USD", orderId: "ORDER-123", customer: { email: "a@b.com" } })
        });
        const j = await res.json();
        if (j.checkoutUrl) window.location.href = j.checkoutUrl;
    }


    return (
        <main className="max-w-2xl mx-auto p-6 space-y-6">
            <h1 className="text-2xl font-semibold">Checkout</h1>


            <section className="space-y-2">
                <h2 className="text-xl font-medium">Option A: Hosted Checkout</h2>
                <button onClick={createHostedSession} className="px-3 py-2 rounded bg-black text-white">Pay via Hosted Page</button>
            </section>


            <section className="space-y-2">
                <h2 className="text-xl font-medium">Option B: Embedded iFrame</h2>
                <CheckoutIframe />
            </section>
        </main>
    );
}