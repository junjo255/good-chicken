"use client";
import React from "react";

export function Card({ children, className = "" }: React.PropsWithChildren<{ className?: string }>) {
    return <div className={`rounded-2xl border-[#f3f3f3] bg-white shadow-xl ${className}`}>{children}</div>;
}
export function SectionTitle({ children }: React.PropsWithChildren) {
    return <div className="text-[15px] font-medium text-neutral-900">{children}</div>;
}
export function Line() {
    return <div className="h-px w-full bg-neutral-200" />;
}
