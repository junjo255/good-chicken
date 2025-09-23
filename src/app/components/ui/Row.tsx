"use client";
import React from "react";

export function Row({
                        icon: Icon,
                        showIcon = true,
                        title,
                        subtitle,
                        action = "Edit",
                        actionAlt,
                        onAction,
                    }: {
    icon: any;
    showIcon?: boolean;
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
                {showIcon &&
                    <div className="mt-0.5">
                        <Icon className="h-[18px] w-[18px] text-neutral-700"/>
                    </div>
                }
                <div>
                    <div className="text-[17px] md:text-[18px] font-bold text-[#AF3935]">{title}</div>
                    {subtitle &&
                        <div className="mt-0.5 text-[15px] font-medium md:text-[17px] text-[#3F3126]">{subtitle}</div>}
                </div>
            </div>
            {actionText && (
                <button
                    type="button"
                    onClick={onAction}
                    className="text-sm md:text-md font-medium text-[#6b7280]  hover:underline cursor-pointer"
                >
                    {actionText}
                </button>
            )}
        </div>
    );
}
