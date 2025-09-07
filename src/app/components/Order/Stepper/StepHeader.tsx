"use client";

import React from "react";

type StepHeaderItem = { label: string };

export default function StepHeader({
                                       items,
                                       activeIndex,
                                       onGoTo,
                                       canReach,
                                   }: {
    items: { label: string, icon: React.ReactNode }[];
    activeIndex: number;
    onGoTo: (idx: number) => void;
    canReach: (idx: number) => boolean;
}) {
    return (
        <div className="sticky top-16 z-30 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70">
            <div className="max-w-7xl mx-auto px-6 py-4">

                {/* Row 1: markers + connectors */}
                <div className="flex items-center cursor-pointer">
                    {items.map((it, idx) => {
                        const isCurrent = idx === activeIndex;
                        const isComplete = idx < activeIndex;
                        const reachable = canReach(idx);

                        return (
                            <React.Fragment key={idx}>
                                <div
                                    style={{width: "5rem", fontSize: "1.5rem", fontWeight: "bold"}}
                                    className="flex justify-center"
                                >
                                    <button
                                        onClick={() => reachable && onGoTo(idx)}
                                        disabled={!reachable}
                                        aria-current={isCurrent ? "step" : undefined}
                                        className={[
                                            "grid place-items-center shrink-0 h-12 w-12 rounded-full ring-1 transition",
                                            isComplete
                                                ? "bg-[#AF3935] text-white"
                                                : isCurrent
                                                    ? "bg-[#AF3935] text-white"
                                                    : "bg-neutral-100 text-neutral-400 ring-neutral-200",
                                            reachable ? "hover:opacity-90" : "cursor-not-allowed opacity-60",
                                        ].join(" ")}
                                        title={it.label}
                                    >
                                        {it.icon}
                                    </button>
                                </div>

                                {idx < items.length - 1 && (
                                    <div
                                        className={[
                                            "h-[2px] flex-1 mx-6",
                                            idx < activeIndex ? "bg-[#AF3935]" : "bg-neutral-200",
                                        ].join(" ")}
                                    />
                                )}
                            </React.Fragment>
                        );
                    })}
                </div>

                <div className="mt-2 flex items-center">
                    {items.map((it, idx) => {
                        const isCurrent = idx === activeIndex;
                        const isComplete = idx < activeIndex;

                        return (
                            <React.Fragment key={it.label}>
                                <div
                                    style={{width: "5rem", fontSize: "1.5rem", fontWeight: "bold"}}
                                    className="flex justify-center"
                                >
                                  <span
                                      className={[
                                          "text-[12px] sm:text-md text-center truncate",
                                          isComplete || isCurrent ? "text-[#3F3126]" : "text-neutral-500",
                                      ].join(" ")}
                                      title={it.label}
                                  >
                                    {it.label}
                                  </span>
                                </div>

                                {idx < items.length - 1 && (
                                    <div className="flex-1 mx-6 invisible h-[2px]"/>
                                )}
                            </React.Fragment>
                        );
                    })}
                </div>

            </div>
        </div>
    );
}
