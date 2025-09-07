import React from "react";
import Link from "next/link";

const Star = ({filled = false}: { filled?: boolean }) => (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4">
        <path
            d="M10 1.6l2.47 5.01 5.53.8-4 3.9.95 5.53L10 14.9 5.05 16.84 6 11.3l-4-3.9 5.53-.8L10 1.6z"
            className={filled ? "fill-current" : "fill-none stroke-current"}
            strokeWidth="1"
        />
    </svg>
);
const Info = () => (
    <svg viewBox="0 0 20 20" className="h-4 w-4">
        <circle cx="10" cy="10" r="9" className="fill-none stroke-current" strokeWidth="1.5"/>
        <circle cx="10" cy="6" r="1.25" className="fill-current"/>
        <path d="M10 9v6" className="stroke-current" strokeWidth="1.5"/>
    </svg>
);
const Clock = () => (
    <svg viewBox="0 0 20 20" className="h-4 w-4">
        <circle cx="10" cy="10" r="8.25" className="fill-none stroke-current" strokeWidth="1.5"/>
        <path d="M10 5.5V10l3 2" className="stroke-current" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
);
const MapPin = () => (
    <svg viewBox="0 0 24 24" className="h-4 w-4">
        <path
            d="M12 22s7-5.1 7-11.2A7 7 0 0 0 5 10.8C5 16.9 12 22 12 22Z"
            className="fill-none stroke-current"
            strokeWidth="1.5"
        />
        <circle cx="12" cy="10.5" r="2.5" className="fill-none stroke-current" strokeWidth="1.5"/>
    </svg>
);
const Copy = () => (
    <svg viewBox="0 0 24 24" className="h-4 w-4">
        <rect x="9" y="9" width="11" height="11" rx="2" className="fill-none stroke-current" strokeWidth="1.5"/>
        <rect x="4" y="4" width="11" height="11" rx="2" className="fill-none stroke-current" strokeWidth="1.5"/>
    </svg>
);

function Stars({value, outOf = 5}: { value: number; outOf?: number }) {
    const filled = Math.round(value);
    return (
        <div className="flex items-center gap-1 text-yellow-500">
            {Array.from({length: outOf}).map((_, i) => (
                <Star key={i} filled={i < filled}/>
            ))}
        </div>
    );
}

export const metadata = {
    title: "Good Chicken, Jersey City",
    description:
        "McDonald's (828 RT 17 N) in Paramus is a highly-rated fast food chain that offers budget-friendly options.",
};

export default function ChosenLocation() {
    return (
        <main className="mx-auto max-w-6xl px-4 py-6 text-[#212427] mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
            <section className="lg:col-span-2" style={{padding: 0}}>

                {/* Header */}
                <h1 className="text-3xl sm:text-4xl font-bold">Good Chicken, Jersey City</h1>

                {/* Meta row */}
                <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-neutral-700">
                    {/*<span className="font-semibold">4.6</span>*/}
                    {/*<span>★</span>*/}
                    {/*<span>(3,000+)</span>*/}
                    {/*<span>·</span>*/}
                    {/*<span className="inline-flex items-center gap-1">*/}
                    {/*  <span className="rounded-full border border-[#212427] px-2 py-0.5 text-xs">Uber One</span>*/}
                    {/*</span>*/}
                    {/*<span>·</span>*/}
                    {/*<span>American</span>*/}
                    {/*<span>·</span>*/}
                    {/*<span>Burgers</span>*/}
                    {/*<span>·</span>*/}
                    {/*<span>Fast Food</span>*/}
                    {/*<span>·</span>*/}
                    {/*<span>Group Friendly</span>*/}
                    {/*<span>·</span>*/}
                    {/*<span>$</span>*/}
                    {/*<span>·</span>*/}
                    {/*<Link href="#" className="underline">*/}
                    {/*    Info*/}
                    {/*</Link>*/}
                </div>

                {/* Address */}
                <div className="mt-1 text-sm text-neutral-700">414 Grand St Jersey City, NJ 07302</div>

                {/* Description */}
                <p className="mt-3 max-w-3xl text-sm leading-relaxed text-neutral-800">
                    Good Chicken, Jersey City in Jersey City ....
                    <Link href="#" className="ml-1 underline">
                        More
                    </Link>
                </p>
            </section>
            <aside className="lg:col-span-1">
                {/* Tabs */}
                <div className="flex items-center gap-2">

                    <button className="rounded-full border px-4 py-2 text-sm text-neutral-400">Pickup</button>
                    {/*<button*/}
                    {/*    className="rounded-full border border-[#212427] px-4 py-2 text-sm font-medium shadow-sm">Delivery*/}
                    {/*</button>*/}
                    {/*<button className="ml-auto rounded-full border border-[#212427] px-4 py-2 text-sm">Group order*/}
                    {/*</button>*/}
                </div>

                {/*/!* Availability / ETA card *!/*/}
                {/*<div className="mt-3 grid grid-cols-2 gap-3 rounded-xl border border-[#212427] bg-white p-4">*/}
                {/*    <div>*/}
                {/*        <div className="text-sm font-semibold">Unavailable</div>*/}
                {/*        <div className="mt-1 flex items-center gap-1 text-xs text-neutral-600">*/}
                {/*            <span>Other fees</span> <Info/>*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*    <div>*/}
                {/*        <div className="text-sm font-semibold">17 min</div>*/}
                {/*        <div className="mt-1 flex items-center gap-1 text-xs text-neutral-600">*/}
                {/*            <span>Earliest arrival</span> <Info/>*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*</div>*/}

                {/* Map card */}
                <div className="mt-3 overflow-hidden rounded-xl border border-[#212427] bg-white">
                    {/* Fake mini map */}
                    <div
                        className="h-40 w-full bg-[linear-gradient(135deg,#eef2f7_25%,#dfe7f1_25%,#dfe7f1_50%,#eef2f7_50%,#eef2f7_75%,#dfe7f1_75%,#dfe7f1_100%)] bg-[length:24px_24px] relative">
                        {/* pins */}
                        <div
                            className="absolute right-7 top-4 flex items-center gap-2 rounded-md bg-white/90 px-2 py-1 text-xs shadow">
                            1.9 mi
                        </div>
                        <div className="absolute left-1/2 top-8 -translate-x-1/2">
                            <div
                                className="flex h-6 w-6 items-center justify-center rounded-full bg-white shadow">
                                <MapPin/>
                            </div>
                        </div>
                        <div className="absolute left-1/3 bottom-6">
                            <div
                                className="flex h-6 w-6 items-center justify-center rounded-full bg-white shadow">
                                <MapPin/>
                            </div>
                        </div>
                    </div>

                    {/* Address & copy */}
                    <div className="flex items-start justify-between gap-3 p-4">
                        <div className="text-sm">
                            <div className="font-medium">414 Grand St</div>
                            <div className="text-neutral-600">Jersey City, NJ 07302</div>
                        </div>
                        <button className="inline-flex items-center gap-1 rounded-md border border-[#212427] px-2 py-1 text-xs">
                            <Copy/>
                            Copy
                        </button>
                    </div>

                    {/* Open / hours */}
                    <div className="border p-4">
                        <div className="flex items-center gap-2">
                            <span className="inline-flex h-2 w-2 rounded-full bg-green-500" aria-hidden="true"/>
                            <span className="text-sm font-medium">Open</span>
                        </div>
                        <div className="mt-1 flex items-center gap-2 text-xs text-neutral-600">
                            <Clock/>
                            <span>Open until 12:00 AM</span>
                        </div>
                    </div>
                </div>
            </aside>

        </main>
    );
}
