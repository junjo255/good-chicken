import React from "react";


export default function Badge({children, tone = "neutral"}: any) {
    const tones: Record<string, string> = {
        neutral: "bg-neutral-100 text-neutral-700",
        open: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100",
        closed: "bg-rose-50 text-rose-700 ring-1 ring-rose-100",
        info: "bg-blue-50 text-blue-700 ring-1 ring-blue-100",
    };
    return (
        <span
            className={`inline-flex items-center rounded-full px-2.5 py-1 text-md font-medium ${
                tones[tone] || tones.neutral
            }`}
        >
              {children}
            </span>
    );
}
