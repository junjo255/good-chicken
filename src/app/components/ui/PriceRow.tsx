"use client";
import React from "react";
import { Info } from "lucide-react";

export function PriceRow({
                             label, value, muted = false, negative = false, info = false,
                         }: {
    label: string;
    value: string;
    muted?: boolean;
    negative?: boolean;
    info?: boolean;
}) {
    return (
        <div className="flex items-center justify-between py-2 text-[17px]">
            <div className={`flex items-center gap-1 ${muted ? "text-neutral-600" : "text-neutral-800"}`}>
                <span>{label}</span>
                {info && <Info className="h-4 w-4 text-neutral-400" />}
            </div>
            <div className={`${negative ? "text-[#1A8F3D]" : "text-neutral-800"}`}>{value}</div>
        </div>
    );
}
