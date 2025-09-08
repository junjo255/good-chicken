"use client";

import PrimaryButton from "@/app/components/Order/Stepper/PrimaryButton";
import React from "react";

type Props = {
    selectedStore: { brand: string; address: string } | null;
    setStepIdx: (n: number) => void;
    orderType: "pickup" | "delivery" | null;
    partner: "uber" | "doordash" | null;
    scheduleLater: boolean;
    ctaLabel: string;
    canContinue: boolean;
    handlePrimaryClick: () => void;
};

function ChangeButton({
                          onClick,
                          disabled,
                      }: {
    onClick: () => void;
    disabled?: boolean;
}) {
    return (
        <button
            className="text-sm md:text-base underline text-[#6b7280] hover:text-[#262626] disabled:text-neutral-300 cursor-pointer"
            onClick={onClick}
            disabled={disabled}
        >
            Change
        </button>
    );
}

function InfoRow({
                     label,
                     value,
                     sub,
                     onChange,
                     changeDisabled,
                     valueClass,
                 }: {
    label: string;
    value: React.ReactNode;
    sub?: React.ReactNode;
    onChange?: () => void;
    changeDisabled?: boolean;
    valueClass?: string;
}) {
    return (
        <div className="flex items-start justify-between gap-4">
            <div>
                <div className="text-[#6b7280] text-sm md:text-base">{label}</div>
                <div className={`font-semibold text-[#262626] text-lg md:text-xl ${valueClass ?? ""}`}>
                    {value}
                </div>
                {sub && (
                    <div className="text-[#262626] text-sm md:text-base">{sub}</div>
                )}
            </div>

            {onChange && (
                <ChangeButton onClick={onChange} disabled={changeDisabled}/>
            )}
        </div>
    );
}

export default function SummaryRail({
                                        selectedStore,
                                        setStepIdx,
                                        orderType,
                                        partner,
                                        scheduleLater,
                                        ctaLabel,
                                        canContinue,
                                        handlePrimaryClick,
                                    }: Props) {
    const partnerLabel =
        partner === "uber" ? "Uber Eats" : partner === "doordash" ? "DoorDash" : "—";

    const eta =
        orderType === "pickup"
            ? "12–18 min"
            : orderType === "delivery"
                ? "25–40 min"
                : "—";

    const rows = [
        {
            label: "Location",
            value: selectedStore?.brand ?? "—",
            sub: selectedStore?.address,
            onChange: () => setStepIdx(0),
        },
        {
            label: "Order Type",
            value: orderType ?? "—",
            valueClass: "capitalize",
            onChange: () => setStepIdx(1),
            changeDisabled: !selectedStore,
        },
        ...(orderType === "delivery"
            ? [
                {
                    label: "Partner",
                    value: partnerLabel,
                    onChange: () => setStepIdx(2),
                    changeDisabled: !selectedStore,
                },
            ]
            : []),
        ...(orderType === "pickup"
            ? [
                {
                    label: "Pickup time",
                    value: scheduleLater ? "Scheduled" : "ASAP",
                },
            ]
            : []),
    ] as const;

    return (
        <aside className="col-span-12 lg:col-span-4 xl:col-span-3">
            <section
                style={{padding: "2rem 1rem"}}
                className="sticky top-28 rounded-2xl bg-white shadow-xl p-8 md:p-10
                text-base md:text-lg"
            >
                <h3 className="text-2xl md:text-3xl font-extrabold mb-4">Selection Summary</h3>

                <div className="space-y-5">
                    {rows.map((r) => (
                        <InfoRow key={r.label} {...r} />
                    ))}

                    <div className="pt-2"/>

                    <div className="mt-4 cursor-pointer">
                        <PrimaryButton disabled={!canContinue} onClick={handlePrimaryClick}>
                            {ctaLabel}
                        </PrimaryButton>
                    </div>
                </div>
            </section>
        </aside>
    );
}
