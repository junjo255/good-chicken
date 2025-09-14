"use client";
import React from "react";

export function Row({
                        icon: Icon,
                        title,
                        subtitle,
                        action = "Edit",
                        actionAlt,
                        onAction,
                    }: {
    icon: any;
    title: React.ReactNode;
    subtitle?: React.ReactNode;
    action?: string;
    actionAlt?: React.ReactNode;
    onAction?: () => void;
}) {
    const actionText = actionAlt ?? action;
    return (
        <div className="flex items-start justify-between gap-3 p-4">
            <div className="flex items-start gap-3">
                <div className="mt-0.5">
                    <Icon className="h-[18px] w-[18px] text-neutral-700" />
                </div>
                <div>
                    <div className="text-[15px] font-medium text-neutral-900">{title}</div>
                    {subtitle && <div className="mt-0.5 text-sm text-neutral-600">{subtitle}</div>}
                </div>
            </div>
            {actionText && (
                <button
                    type="button"
                    onClick={onAction}
                    className="text-sm font-medium text-neutral-700 hover:text-black cursor-pointer"
                >
                    {actionText}
                </button>
            )}
        </div>
    );
}
