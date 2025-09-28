"use client";

import React, {useMemo, useState} from "react";
import Section from "@/app/components/Order/Stepper/Section";
import {LOCATIONS} from "@/app/lib/locations";
import LocationPanel from "@/app/components/Location/LocationPanel";
import {Shuffle, Store, Truck} from "lucide-react";
import {DoorDashLogo, UberLogo} from "@/app/components/Order/Stepper/PartnerLogos";
import {Badge} from "@/app/classUtils";
import {useCart} from "@/app/lib/cart";
import {ConfirmResetModal} from "@/app/components/Order/OrderReset/OrderReset";

export type OrderType = "pickup" | "delivery" | null;
export type OrderTiming = "now" | "schedule" | null;

export type Partner = "uber" | "doordash" | null;

export type Ctx = {
    selectedStoreId: string | null;
    setSelectedStoreId: (id: string | null) => void;
    orderType: OrderType;
    setOrderType: (t: OrderType) => void;
    partner: Partner;
    setPartner: (p: Partner) => void;
    scheduleLater: boolean;
    setScheduleLater: (b: boolean) => void;
    startMenu: () => void;
    openPartner: (p: Exclude<Partner, null>) => void;
};

export type StepDef = {
    id: string;
    label: string;
    icon: React.ReactNode;
    isEnabled?: (ctx: Ctx) => boolean;
    canContinue?: (ctx: Ctx) => boolean;
    ctaLabel?: (ctx: Ctx) => string;
    onContinue?: (ctx: Ctx, goNext: () => void) => void;
    render: (ctx: Ctx) => React.ReactNode;
};

const partners: { id: Exclude<Partner, null>; label: string; Logo: React.FC }[] = [
    {id: "uber", label: "Uber Eats", Logo: UberLogo},
    {id: "doordash", label: "DoorDash", Logo: DoorDashLogo},
];

export default function getSteps(
    ctx: Ctx,
    isStoreClosed: boolean,
    isStoreOpenToday: boolean | undefined,
    handlePrimaryClick: () => void,
    guardedSetSelectedStoreId: (currentId: string | null, nextId: string) => void,
    confirmModal: React.ReactNode
): StepDef[] {

    return [
        {
            id: "location",
            label: "Location",
            icon: <Store/>,
            isEnabled: () => true,
            canContinue: ({selectedStoreId}) => !!selectedStoreId,
            ctaLabel: () => "Continue",
            render: ({selectedStoreId, setSelectedStoreId}) => (
                <Section title="Choose a location" subtitle="Pick the store you’d like to order from.">
                    <div className="grid gap-3">
                        {LOCATIONS.map((s) => {
                            const selected = selectedStoreId === s.id;

                            return (
                                <button
                                    key={s.id}
                                    onClick={() => guardedSetSelectedStoreId(selectedStoreId, s.id)}
                                    className={`text-left rounded-2xl   p-1 transition shadow-xl hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-black ${
                                        selected ? "ring-2 ring-[#AF3935]" : ""
                                    }`}
                                >
                                    <LocationPanel
                                        location={s}
                                        component={"stepper"}
                                        setSelectedStoreId={setSelectedStoreId}
                                        selectedStoreId={selectedStoreId}
                                        handlePrimaryClick={handlePrimaryClick}
                                    />
                                </button>

                            );
                        })}
                    </div>
                    {confirmModal}
                </Section>
            ),
        },
        {
            id: "type",
            label: "Order Type",
            icon: <Shuffle/>,
            isEnabled: ({selectedStoreId}) => !!selectedStoreId,
            canContinue: ({orderType}) => orderType === "pickup" || orderType === "delivery",
            ctaLabel: ({orderType}) =>
                orderType === "pickup" ? "Start Order" : "Continue",
            onContinue: (ctx, goNext) => {
                if (ctx.orderType === "pickup") ctx.startMenu();
                else goNext();
            },
            render: ({selectedStoreId, orderType, setOrderType, setPartner, scheduleLater, setScheduleLater}) => {
                const selectedStore = LOCATIONS.find((s) => s.id === selectedStoreId) || null;
                return (
                    <Section
                        title="How would you like to get your order?"
                        subtitle={
                            selectedStore
                                ? `${selectedStore.brand} - ${selectedStore.city}` : undefined
                        }
                    >
                        <div className="grid md:grid-cols-2 gap-4 ">
                            {/* Pickup Card */}
                            <button
                                onClick={() => {
                                    setOrderType("pickup")
                                }}
                                className={`text-left rounded-2xl  p-5 transition shadow-xl hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-black ${
                                    orderType === "pickup" ? "ring-2 ring-black" : ""
                                }`}
                            >
                                <div className="flex items-start justify-between">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-lg font-semibold">Pickup</h3>
                                            <Badge tone="open">Fastest</Badge>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-3 flex items-center gap-3 text-md">
                                    <label className="inline-flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="time"
                                            className="accent-black"
                                            checked={!scheduleLater && !isStoreClosed}
                                            onChange={() => setScheduleLater(false)}
                                            disabled={isStoreClosed}
                                        />
                                        ASAP
                                    </label>
                                    <label className="inline-flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="time"
                                            className="accent-black"
                                            checked={scheduleLater || isStoreClosed}
                                            onChange={() => setScheduleLater(true)}
                                        />
                                        Schedule time

                                    </label>
                                </div>
                                {isStoreClosed && (
                                    <p className="text-md text-neutral-600 mt-3">
                                        {`Store is closed ${isStoreOpenToday ? "now" : "today"}.`} <br/> Please schedule a pickup time.
                                    </p>
                                )}
                            </button>

                            {/* Delivery Card */}
                            <button
                                onClick={() => {
                                    setOrderType("delivery");
                                }}
                                className={`text-left  rounded-2xl  p-5 transition shadow-xl hover:shadow-md focus:outline-none focus:ring-2 focus:ring-black ${
                                    orderType === "delivery" ? "ring-2 ring-black" : ""
                                }`}
                            >
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="text-lg font-semibold">Delivery</h3>
                                        <p className="text-md text-neutral-600 mt-1">
                                            Delivered by partners. Estimated 25–40 min.
                                        </p>
                                    </div>
                                </div>
                            </button>
                        </div>
                    </Section>
                );
            },
        },

        {
            id: "menu-partner",
            label: "Menu/Partner",
            icon: <Truck/>,
            isEnabled: ({orderType}) => orderType !== null,
            canContinue: ({orderType, partner}) =>
                orderType === "pickup" || (orderType === "delivery" && !!partner),
            ctaLabel: ({orderType, partner}) => {
                if (orderType === "pickup") return "Start Order";
                if (orderType === "delivery")
                    return partner
                        ? `Continue on ${partner === "uber" ? "Uber Eats" : "DoorDash"}`
                        : "Continue";
                return "Continue";
            },
            onContinue: (ctx) => {
                if (ctx.orderType === "pickup") ctx.startMenu();
                else if (ctx.partner) ctx.openPartner(ctx.partner);
            },
            render: ({orderType, selectedStoreId, partner, setPartner}) => {
                const selectedStore = LOCATIONS.find((s) => s.id === selectedStoreId) || null;
                if (orderType === "delivery") {
                    return (
                        <Section
                            title="Select a delivery partner"
                            subtitle="You’ll complete checkout on the partner site in a new tab."
                        >
                            <div className="grid md:grid-cols-2 gap-4 p-5">
                                {partners.map(({id, label, Logo}) => (
                                    <button
                                        key={id}
                                        onClick={() => setPartner(id)}
                                        className={`text-left rounded-2xl p-9 transition shadow-xl  hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-[#3F3126] ${
                                            partner === id ? "ring-2 ring-[#3F3126]" : ""
                                        }`}
                                        aria-label={`Order delivery via ${label}`}
                                    >
                                        <div className="flex items-center justify-center">
                                            <Logo/>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </Section>
                    );
                }

                return (
                    <Section title="Start your pickup order">
                        <div className="rounded-xl  bg-neutral-50 p-5 text-md text-neutral-700">
                            You chose <b>Pickup</b> at <b>{selectedStore?.brand}</b>. Use the primary button in the
                            right rail to start your order (this prototype shows an alert).
                        </div>
                    </Section>
                );
            },
        },
    ];
}
