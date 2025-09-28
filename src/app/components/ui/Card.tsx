"use client";
import React from "react";

export function Card({ children, className = "" }: React.PropsWithChildren<{ className?: string }>) {
    return <div className={`rounded-2xl border-[#f3f3f3] p-4 bg-white shadow-xl ${className}`}>{children}</div>;
}
export function SectionTitle({ children }: React.PropsWithChildren) {
    return <div className="text-[1.5rem] font-bold text-[#3F3126]">{children}</div>;
}

export function Line({ className = "", ...rest }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={`h-px w-full bg-neutral-20 ${className}`}
            {...rest}
        />
    );
}