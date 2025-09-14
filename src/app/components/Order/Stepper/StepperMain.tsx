"use client";

import React, {useEffect, useMemo, useState} from "react";
import {LOCATIONS} from "@/app/lib/locations";
import getSteps, {Ctx, OrderType, Partner} from "@/app/components/Order/Stepper/Steps";
import StepHeader from "@/app/components/Order/Stepper/StepHeader";
import SummaryRail from "@/app/components/Order/Stepper/SummaryRail";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import {OrderProvider, useOrder} from "@/app/components/Order/Stepper/OrderCtx";

export default function StepperMain() {
    const [stepIdx, setStepIdx] = useState<number>(0);

    const {
        selectedStoreId, setSelectedStoreId,
        orderType, setOrderType,
        partner, setPartner,
        scheduleLater, setScheduleLater,
    } = useOrder();

    const selectedStore = useMemo(() => {
        if (!selectedStoreId) return null;
        return LOCATIONS.find((s) => s.id === selectedStoreId) || null;
    }, [selectedStoreId]);

    const router = useRouter();

    function startMenu() {
        if (!selectedStoreId) {
            alert("Please choose a location first.");
            return;
        }

        if (orderType === "pickup") {
            router.push("/order/menu");
        } else {
            alert("Menu is only available for pickup orders.");
        }
    }

    function openPartner(p: Exclude<Partner, null>) {
        const url =
            p === "uber"
                ? selectedStore?.deliveryPartners.uberEats
                : selectedStore?.deliveryPartners.doordash;

        if (url) {
            window.open(url, "_blank");
        }
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

    const searchParams = useSearchParams();
    const [lcnHandled, setLcnHandled] = useState(false);

    const pathname = usePathname();
    useEffect(() => {
        if (lcnHandled) return;
        const lcn = searchParams.get("lcn");
        if (!lcn) return;

        setSelectedStoreId(lcn);
        setStepIdx(1);
        setLcnHandled(true);
        router.replace("/order");
    }, [searchParams, lcnHandled, setSelectedStoreId, router]);

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
