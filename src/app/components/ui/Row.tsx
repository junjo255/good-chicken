"use client";
import React from "react";
import {EditButton} from "@/app/classUtils";

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
                    <div className="text-[1.1rem] md:text-[1.2rem] font-bold text-[#AF3935]">{title}</div>
                    {subtitle &&
                        <div className="mt-0.5 text-[0.9rem] md:text-[1rem] font-medium text-[#3F3126]">{subtitle}</div>}
                </div>
            </div>
            {actionText && (

                <EditButton
                    onClick={onAction}
                    disabled={false}
                />
                // <button
                //     type="button"
                //     onClick={onAction}
                //     className="text-sm md:text-md font-medium text-[#6b7280]  hover:underline "
                // >
                //     {actionText}
                // </button>
            )}
        </div>
    );
}
