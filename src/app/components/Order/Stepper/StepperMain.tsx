"use client";

import React, {useEffect, useMemo, useState} from "react";
import {LOCATIONS} from "@/app/lib/locations";
import getSteps, {Ctx, OrderTiming, Partner} from "@/app/components/Order/Stepper/Steps";
import StepHeader from "@/app/components/Order/Stepper/StepHeader";
import SummaryRail from "@/app/components/Order/Stepper/SummaryRail";
import {useRouter} from "next/navigation";
import {useOrder} from "@/app/components/Order/Stepper/OrderCtx";
import {isOpenNow} from "@/app/utils";
import {useCart} from "@/app/lib/cart";
import {ConfirmResetModal} from "@/app/components/Order/OrderReset/OrderReset";

export default function StepperMain({initialLcn}: { initialLcn: string | null }) {
    const [stepIdx, setStepIdx] = useState<number>(0);

    const {
        selectedStoreId, setSelectedStoreId,
        orderType, setOrderType,
        partner, setPartner,
        scheduleLater, setScheduleLater,
    } = useOrder();

    const [orderTiming, setOrderTiming] = useState<OrderTiming>(null);
    const selectedStore = useMemo(() => {
        if (!selectedStoreId) return null;
        return LOCATIONS.find((s) => s.id === selectedStoreId) || null;
    }, [selectedStoreId]);

    useEffect(() => {
        if (stepIdx === 1 && selectedStore?.hours) {
            const status = isOpenNow(selectedStore.hours);
            if (!status.isOpen && orderTiming == null) {
                setOrderTiming("schedule");
            }
        }
    }, [stepIdx, selectedStore, orderTiming]);


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
    const cart = useCart() as any;
    const hasItems = useMemo(
        () => Array.isArray(cart?.items) && cart.items.length > 0,
        [cart?.items]
    );

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [pendingStoreId, setPendingStoreId] = useState<string | null>(null);

    const guardedSetSelectedStoreId = (currentId: string | null, nextId: string) => {
        if (!currentId || currentId === nextId || !hasItems) {
            setSelectedStoreId(nextId);
            return;
        }
        setPendingStoreId(nextId);
        setConfirmOpen(true);
    };

    const handleConfirmChangeStore = () => {
        resetCart();
        if (pendingStoreId) setSelectedStoreId(pendingStoreId);
        setPendingStoreId(null);
        setConfirmOpen(false);
    };

    const handleCancelChangeStore = () => {
        setPendingStoreId(null);
        setConfirmOpen(false);
    };

    const resetCart = () => {
        if (cart?.clearCart) cart.clearCart();
        else if (cart?.empty) cart.empty();
        else if (cart?.removeAll) cart.removeAll();
        else if (Array.isArray(cart?.items)) {
            cart.items.forEach((it: any) => {
                if (cart.removeItem) cart.removeItem(it.id);
                else if (cart.remove) cart.remove(it.id);
            });
        }
    };

    const confirmModal = (
        <ConfirmResetModal
            open={confirmOpen}
            onConfirm={handleConfirmChangeStore}
            onCancel={handleCancelChangeStore}
        />
    );

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

    const [lcnHandled, setLcnHandled] = useState(false);

    const [isStoreClosed, isStoreOpenToday] = useMemo(() => {
        if (!selectedStore?.hours) return [false, false];

        const store = isOpenNow(selectedStore.hours);
        return [!store.isOpen, store.isOpenToday];
    }, [selectedStore?.hours]);

    useEffect(() => {
        if (lcnHandled || !initialLcn) return;

        setSelectedStoreId(initialLcn);
        setStepIdx(1);
        setLcnHandled(true);
        router.replace("/order");
    }, [initialLcn, lcnHandled, setSelectedStoreId, router]);

    const steps = useMemo(
        () =>
            getSteps(
                ctx,
                isStoreClosed,
                isStoreOpenToday,
                handlePrimaryClick,
                guardedSetSelectedStoreId,
                confirmModal
            ),
        [
            ctx,
            isStoreClosed,
            isStoreOpenToday,
            handlePrimaryClick,
            guardedSetSelectedStoreId,
            confirmModal
        ]
    );

    useEffect(() => {
        if (stepIdx === 1) {
            setScheduleLater(!!isStoreClosed);
        }
    }, [stepIdx, isStoreClosed, setScheduleLater]);

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
        if (typeof window !== "undefined" && window.innerWidth < 768) {
            window.scrollTo({top: 0, behavior: "smooth"});
        }

        if (curr.onContinue) curr.onContinue(ctx, goNext);
        else goNext();
    }

    // useEffect(() => {
    //     if (!selectedStoreId) return;
    //     const hasItems = Array.isArray(cart?.items) && cart.items.length > 0;
    //
    //     console.log("haha: ", hasItems)
    //     if (hasItems) router.push("/order/menu");
    // }, [selectedStoreId, cart?.items?.length, router]);

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
                    <div className="col-span-12 lg:col-span-8 space-y-6">
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
