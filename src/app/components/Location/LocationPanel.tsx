"use client";

import {StoreLocation} from "@/app/lib/types";
import React from "react";
import Badge from "@/app/classUtils";
import styles from './Locations.module.css';
import {Clock, Copy, MapPin} from "lucide-react";

type LocationPanelProps = {
    location: StoreLocation;
    component?: "main" | "stepper" | "menu";
    selectedStoreId?: string | null;
    setSelectedStoreId?: (id: string | null) => void;
};

export default function LocationPanel({
                                          location,
                                          component = "main",
                                          setSelectedStoreId,
                                          selectedStoreId,
                                      }: LocationPanelProps) {
    const renderStoreHeader = (s: { brand: string; city: string; open: boolean; prep?: string }) => {
        return (
            <div className="flex items-center gap-3">
                {s.open ? <Badge tone="open">Open</Badge> : <Badge tone="closed">Closed</Badge>}
            </div>
        );
    };

    const selected = selectedStoreId === location.id;
    const isStepper = component === 'stepper';
    const isMenu = component === 'menu'
    const telHref = (phone?: string) =>
        phone ? `tel:${phone.replace(/[^\d+]/g, "")}` : "";
    const mapHref = (address: string) =>
        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    return (
        <section
            className={`${isStepper || isMenu ? styles.stepperPadding : styles.locationPadding}
            ${isMenu ? "justify-evenly" : ""}
            flex flex-col md:flex-row md:flex-nowrap md:gap-8 gap-4
              bg-[#423023] md:px-10 py-8 rounded-xl ${isMenu ? "shadow-2xl" : ""}`}
            data-aos="zoom-in-up"
        >
            {/* LEFT WRAPPER */}
            <div
                className={`${isStepper ? "basis-full" : "md:basis-1/2"} w-full min-w-0 mt-6 md:mt-0`}
            >
                <div className="bg-white rounded-md p-8 flex flex-col justify-start">
                    <div className="flex flex-row justify-between">
                        <div className="flex flex-col ">
                            <h4 className="text-md font-semibold text-[#6b7280]">Picking up from</h4>

                            <h3 className="text-2xl md:text-3xl font-semibold text-[#423023] mt-1">
                                <span>{location.city}</span>
                            </h3>
                            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[#AF3935]">
                                {location.brand}
                            </h2>
                        </div>

                        {!isMenu &&
                            <div>
                                {renderStoreHeader(location)}
                            </div>
                        }

                    </div>

                    <dl className="mt-6 space-y-5 ">
                        <div>
                            <dt className="text-sm font-bold uppercase tracking-widest text-[#6b7280]">Address</dt>
                            <dd className="mt-1 text-[#262626]">
                                <a
                                    href={mapHref(location.address)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="underline underline-offset-4 hover:no-underline"
                                    aria-label={`Open map for ${location.address}`}
                                >
                                    {location.address}
                                </a>
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
                                <div>
                                    <dt className="text-sm font-bold uppercase tracking-widest text-[#6b7280]">We're
                                        Open
                                    </dt>
                                    <dd className="mt-1 text-[#262626]">{location.hours}</dd>
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
                                <span
                                    className="inline-flex items-center h-10 px-4 rounded-lg bg-[#3F3126] text-white font-semibold">
                                  {selected ? "Selected" : "Select"}
                                </span>
                                </div>
                            ) : (
                                <a
                                    href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(location.address)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center rounded-lg px-4 py-2 border border-neutral-300 hover:border-neutral-400 transition text-sm font-medium"
                                >
                                    Order Now
                                </a>
                            )}

                            <a
                                href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(location.address)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center rounded-lg px-4 py-2 border border-neutral-300 hover:border-neutral-400 transition text-md font-medium"
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
                            <div className="rounded-md m-0 pt-3  items-center flex flex-row justify-start gap-40 md:p-3 sm:gap-20">
                                <div className="flex items-center gap-2">
                                    <span className="inline-flex h-2 w-2  bg-green-500" aria-hidden="true"/>
                                    <span className="text-md font-medium text-[#262626]">Open</span>
                                </div>
                                <div className="flex items-center gap-2 text-md text-[#262626]">
                                    <div><Clock/></div>
                                    <div>Open until 12:00 AM</div>
                                </div>
                            </div>
                        </div>
                    </aside>) :

                !isStepper && (
                    <div className="w-full md:basis-1/2 min-w-0 mt-6 md:mt-0">
                        <div
                            className="aspect-[16/10] h-full w-full overflow-hidden rounded-md border border-neutral-300 bg-white">
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
