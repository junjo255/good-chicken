"use client";

import {BusinessHours, StoreLocation, Weekday} from "@/app/lib/types";
import React from "react";
import styles from './Locations.module.css';
import {ChevronDown, Clock, Copy, MapPin} from "lucide-react";
import Link from "next/link";
import {formatDay, isOpenNow, to12h, todayWeekday} from "@/app/utils";

type LocationPanelProps = {
    location: StoreLocation;
    component?: "main" | "stepper" | "menu";
    selectedStoreId?: string | null;
    setSelectedStoreId?: (id: string | null) => void;
    handlePrimaryClick?: () => void;
};

const ORDER: Weekday[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];


export default function LocationPanel({
                                          location,
                                          component = "main",
                                          setSelectedStoreId,
                                          selectedStoreId,
                                          handlePrimaryClick
                                      }: LocationPanelProps) {

    function OpenBadge({hours}: { hours?: BusinessHours }) {
        if (!hours) return null;
        const status = isOpenNow(hours);

        if (!status.isOpenToday) {
            return (
                <div
                    className="items-start flex justify-end py-1 text-md min-w-[150px] ">
                    {/*<span className="h-2 w-2 rounded-full bg-green-800"/>*/}
                    <span className="text-red-800">Closed</span>
                    {/*{status.until ? ` until ${to12h(status.until)}` : null}*/}
                </div>
            );
        } else if (status.isOpen) {
            return (
                <div
                    className="items-start flex justify-end py-1 text-md gap-1 min-w-[150px]">
                    {/*<span className="h-2 w-2 rounded-full bg-green-800"/>*/}
                    <span className="text-green-800">Open</span>
                    {status.until ? ` until ${to12h(status.until)}` : null}
                </div>
            );
        }
        return (
            <div className=" items-start flex justify-end rounded-full min-w-[150px] gap-1 py-1 text-md">
                {/*<span className="h-2 w-2 rounded-full bg-red-500"/>*/}
                <span className="text-red-800">Opens</span>
                {status.start ? ` at ${to12h(status.start)}` : "Closed"}
            </div>
        );
    }

    function orderCTA({hours}: { hours?: BusinessHours }) {
        if (!hours) return "Order Now";
        const status = isOpenNow(hours);
        return status?.isOpen ? "Order Now" : "Schedule Your Order";
    }

    const selected = selectedStoreId === location.id;
    const isStepper = component === 'stepper';
    const isMenu = component === 'menu'
    const telHref = (phone?: string) =>
        phone ? `tel:${phone.replace(/[^\d+]/g, "")}` : "";
    const mapHref = (address: string) =>
        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

    const regular = (location.hours as BusinessHours).regular;
    const [expanded, setExpanded] = React.useState(false);
    if (typeof location.hours === "string") {
        return <div>{location.hours}</div>;
    }

    const hours = location.hours as BusinessHours;
    const today = todayWeekday(hours.timezone);
    const daysToShow: Weekday[] = expanded ? ORDER : [today];

    return (
        <section
            className={`${isStepper || isMenu ? styles.stepperPadding : styles.locationPadding}
            ${isMenu ? "justify-evenly" : ""}
            ${!isStepper ? "shadow-2xl hover:shadow-3xl" : ""}
            flex flex-col md:flex-row md:flex-nowrap md:gap-8 gap-4 md:px-10 py-8 rounded-xl `}
            data-aos="zoom-in-up"
        >
            {/* LEFT WRAPPER */}
            <div
                className={`${isStepper ? "basis-full" : "md:basis-1/2"} w-full min-w-0 mt-6 md:mt-0`}
            >
                <div className="bg-white rounded-md p-4 sm:p-8 flex flex-col justify-start">
                    <div className="flex flex-row justify-between">
                        <div className="flex flex-col ">
                            {isMenu && <h4 className="text-md font-semibold text-[#6b7280]">Picking up from</h4>}
                            <h3 className="text-2xl md:text-3xl font-semibold text-[#423023] mt-1">
                                <span>{location.city}</span>
                            </h3>
                            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[#AF3935]">
                                {location.brand}
                            </h2>
                        </div>
                        {!isMenu &&
                            <OpenBadge hours={location.hours}/>
                        }

                    </div>

                    <dl className="mt-6 space-y-5 ">
                        <div>
                            <dt className="text-sm font-bold uppercase tracking-widest text-[#6b7280]">Address</dt>
                            <dd className="mt-1 text-[#262626]">
                                {location.address}
                            </dd>
                        </div>
                        {location.phone && (
                            <div>
                                <dt className="text-sm font-bold uppercase tracking-widest text-[#6b7280]">Phone</dt>
                                <dd className="mt-1 text-[#262626]">
                                    <a
                                        href={telHref(location.phone)}
                                        className="underline underline-offset-4 hover:no-underline"
                                        aria-label={`Call ${location.phone}`}
                                    >
                                        {location.phone}
                                    </a>
                                </dd>
                            </div>
                        )}

                        {!isMenu &&
                            location.hours && (
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-bold uppercase tracking-widest text-[#6b7280]">
                                              Hours
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => setExpanded(v => !v)}
                                                aria-expanded={expanded}
                                                aria-label={expanded ? "Hide hours" : "Show all hours"}
                                                className="inline-flex items-center cursor-pointer"
                                            >
                                                <ChevronDown
                                                    className={`h-4 w-4 transition-transform ${expanded ? "rotate-180" : ""}`}
                                                />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Day + time close together */}
                                    <ul className="space-y-1">
                                        {daysToShow.map((d) => (
                                            <li key={d} className="flex items-center p-1 text-[15px]">
                                                <span className="font-bold">{d}</span>
                                                <span className="mx-2 text-neutral-400">•</span>
                                                <span>{formatDay(hours.regular[d])}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )
                        }
                        {!isMenu && location.services && location.services.length > 0 && (
                            <div>
                                <dt className="text-sm font-bold uppercase tracking-widest text-[#6b7280]">Available
                                    Services
                                </dt>
                                <dd className="mt-1 text-[#262626]">{location.services.join(", ")}</dd>
                            </div>
                        )}
                    </dl>
                    {!isMenu &&
                        <div className="mt-6 flex flex-row gap-2">
                            {isStepper ? (
                                <div className="shrink-0">
                                    {selected ?
                                    <button
                                        type="button"
                                        onClick={handlePrimaryClick}
                                        className="inline-flex items-center h-10 px-4 rounded-lg bg-[#AF3935] text-white font-semibold cursor-pointer"
                                    >
                                         Continue
                                    </button> : null
                                    }
                                </div>
                            ) : (
                                <Link
                                    href={`/order?lcn=${location.id}`}
                                    rel="noopener noreferrer"
                                    style={{color: "#fff"}}
                                    className="inline-flex items-center justify-center rounded-lg px-4 py-2 button bg-[#AF3935] transition font-bold"
                                >
                                    {orderCTA({hours: location?.hours})}
                                </Link>
                            )}

                            <a
                                href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(location.address)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center rounded-lg px-4 py-2 border border-[#3f3126]-300 hover:border-neutral-400 button transition text-md font-bold"
                            >
                                Get Directions
                            </a>
                        </div>
                    }
                </div>
            </div>

            {/* RIGHT WRAPPER */}
            {isMenu ? (
                    <aside className="flex flex-col w-full rounded-md ">
                        {/* Map card */}
                        <div className="overflow-hidden bg-white m-0 p-0 h-full rounded-md">
                            <iframe
                                title={`${location.city} map`}
                                src={location.mapsEmbedUrl}
                                className="w-full h-4/5 block"
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                allowFullScreen
                            />

                            {/* Open / hours */}
                            <div
                                className="rounded-md m-0 pt-3  items-center flex flex-row mb-4 justify-evenly sm:justify-start gap-15 md:p-3 sm:gap-20"
                            >
                                <OpenBadge hours={location.hours}/>
                            </div>
                        </div>
                    </aside>) :

                !isStepper && (
                    <div className="w-full md:basis-1/2 min-w-0 mt-6 md:mt-0">
                        <div
                            className="aspect-[16/10] h-full w-full overflow-hidden rounded-md  bg-white">
                            <iframe
                                title={`${location.city} map`}
                                src={location.mapsEmbedUrl}
                                className="w-full h-full"
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                allowFullScreen
                            />
                        </div>
                    </div>
                )}
        </section>
    );
}
