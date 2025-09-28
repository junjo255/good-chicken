"use client";

import React from "react";
import {BusinessHours} from "@/app/lib/types";
import {isOpenNow, to12h} from "@/app/utils";

export function Badge({children, tone = "neutral"}: any) {
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

export function EditButton({
                               onClick,
                               disabled = false,
                           }: {
    onClick?: () => void;
    disabled?: boolean;
}) {
    return (
        <button
            className="text-sm md:text-base underline text-[#6b7280] hover:text-[#262626] disabled:text-neutral-300 "
            onClick={onClick}
            disabled={disabled}
        >
            Edit
        </button>
    );
}

export function OpenBadge({
                              hours,
                              className = "justify-end"
                          }: {
    hours?: BusinessHours,
    className?: string;
}) {
    if (!hours) return null;
    const status = isOpenNow(hours);

    if (!status.isOpenToday) {
        return (
            <div
                className={`items-start flex md:${className} py-1 text-md min-w-[150px]`}>
                <span className="text-red-800">Closed</span>
            </div>
        );
    } else if (status.isOpen) {
        return (
            <div
                className={`items-start flex md:${className} py-1 text-md gap-1 min-w-[150px]`}>
                <span className="text-green-800">Open</span>
                {status.until ? ` until ${to12h(status.until)}` : null}
            </div>
        );
    }
    return (
        <div className={`items-start flex ${className} rounded-full min-w-[150px] gap-1 py-1 text-md`}>
            <span className="text-red-800">Opens</span>
            {status.start ? ` at ${to12h(status.start)}` : "Closed"}
        </div>
    );
}