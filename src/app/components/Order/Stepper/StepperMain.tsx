"use client";

import React, {useEffect, useMemo, useState} from "react";
import {LOCATIONS} from "@/app/lib/locations";
import getSteps, {Ctx, OrderType, Partner} from "@/app/components/Order/Stepper/Steps";
import StepHeader from "@/app/components/Order/Stepper/StepHeader";
import SummaryRail from "@/app/components/Order/Stepper/SummaryRail";
import {useRouter} from "next/navigation";
import LocationPanel from "@/app/components/Location/LocationPanel";


export default function StepperMain() {
    const [stepIdx, setStepIdx] = useState<number>(0);
    const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null);
    const [orderType, setOrderType] = useState<OrderType>(null);
    const [partner, setPartner] = useState<Partner>(null);
    const [scheduleLater, setScheduleLater] = useState<boolean>(false);

    const selectedStore = useMemo(
        () => LOCATIONS.find((s) => s.id === selectedStoreId) || null,
        [selectedStoreId]
    );

    const router = useRouter();

    function startMenu() {
        if (!selectedStoreId) {
            alert("Please choose a location first.");
            return;
        }

        try {
            localStorage.setItem("gc_location", selectedStoreId);
            localStorage.setItem("gc_order_type", orderType ?? "");

            let userId = localStorage.getItem("gc_user_id");
            if (!userId) {
                userId = crypto.randomUUID();
                localStorage.setItem("gc_user_id", userId);
            }
            fetch("/api/preferences", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, key: "location", value: selectedStoreId }),
            });
        } catch {}

        if (orderType === "pickup") {
            router.push("/order/menu");
        } else {
            alert("Menu is only available for pickup orders.");
        }
    }

    function openPartner(p: Exclude<Partner, null>) {
        const url = p === "uber" ? "#uber-eats-link" : "#doordash-link";
        alert(
            `Would open ${p === "uber" ? "Uber Eats" : "DoorDash"} for ${
                selectedStore?.brand
            }.`
        );
        console.log("Deep link:", url);
    }

    const ctx: Ctx = {
        selectedStoreId,
        setSelectedStoreId,
        orderType,
        setOrderType,
        partner,
        setPartner,
        scheduleLater,
        setScheduleLater,
        startMenu,
        openPartner,
    };

    const steps = useMemo(() => getSteps(ctx), [selectedStoreId, orderType, partner, scheduleLater]);
    const curr = steps[stepIdx];

    useEffect(() => {
        if (stepIdx >= steps.length) setStepIdx(steps.length - 1);
    }, [steps.length, stepIdx]);

    const canReach = (idx: number) => {
        if (idx <= stepIdx) return true;
        for (let i = 0; i < idx; i++) {
            const s = steps[i];
            const enabled = s.isEnabled ? s.isEnabled(ctx) : true;
            const ok = s.canContinue ? s.canContinue(ctx) : true;
            if (!enabled || !ok) return false;
        }
        return (steps[idx].isEnabled ? steps[idx].isEnabled(ctx) : true) === true;
    };

    const canContinue = curr.canContinue ? curr.canContinue(ctx) : true;
    const ctaLabel = curr.ctaLabel ? curr.ctaLabel(ctx) : "Continue";
    const goNext = () => setStepIdx((i) => Math.min(i + 1, steps.length - 1));

    function handlePrimaryClick() {
        if (curr.onContinue) curr.onContinue(ctx, goNext);
        else goNext();
    }

    return (
        <>
            <StepHeader
                items={steps.map((s) => ({label: s.label, icon: s.icon}))}
                activeIndex={stepIdx}
                onGoTo={(n) => canReach(n) && setStepIdx(n)}
                canReach={canReach}
            />

            <main className="max-w-7xl mx-auto px-6 py-6">
                <div className="grid grid-cols-12 gap-6">
                    {/* Main */}
                    <div className="col-span-12 lg:col-span-8 xl:col-span-9 space-y-6">
                        {curr.render(ctx)}
                    </div>

                    <SummaryRail
                        selectedStore={selectedStore}
                        setStepIdx={setStepIdx}
                        orderType={orderType}
                        partner={partner}
                        scheduleLater={scheduleLater}
                        ctaLabel={ctaLabel}
                        canContinue={canContinue}
                        handlePrimaryClick={handlePrimaryClick}
                    />

                </div>
            </main>
        </>
    );
}
