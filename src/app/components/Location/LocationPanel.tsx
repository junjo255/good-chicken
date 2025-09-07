"use client";

import {StoreLocation} from "@/app/lib/types";
import React from "react";
import Badge from "@/app/classUtils";
import styles from './Locations.module.css';

type LocationPanelProps = {
    location: StoreLocation;
    isStepper?: boolean;
    selectedStoreId?: string | null;
    setSelectedStoreId?: (id: string | null) => void;
};

export default function LocationPanel({
                                          location,
                                          isStepper = false,
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

    return (
        <section
            className={`${isStepper? styles.stepperPadding : styles.locationPadding } flex flex-row md:flex-row md:flex-nowrap md:gap-8 gap-4
             bg-[#423023] md:px-10 py-8 rounded-xl`}
            data-aos="zoom-in-up"
        >
            {/* LEFT WRAPPER */}
            <div
                className={`${isStepper? "basis-full" : "md:basis-1/2"} w-full min-w-0 mt-6 md:mt-0`}
            >
                <div className="bg-white rounded-md p-8 flex flex-col justify-start">
                    <div className="flex flex-row justify-between">
                        <div className="flex flex-col ">
                            <h3 className="text-2xl md:text-3xl font-semibold text-[#423023] mt-1">
                                <span>{location.city}</span>
                            </h3>
                            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[#AF3935]">
                                {location.brand}
                            </h2>
                        </div>

                        <div>
                            {renderStoreHeader(location)}
                        </div>

                    </div>

                    <dl className="mt-6 space-y-5 text-neutral-800">
                        <div>
                            <dt className="text-sm font-bold uppercase tracking-widest">Address</dt>
                            <dd className="mt-1">{location.address}</dd>
                        </div>
                        {location.phone && (
                            <div>
                                <dt className="text-sm font-bold uppercase tracking-widest">Phone</dt>
                                <dd className="mt-1">{location.phone}</dd>
                            </div>
                        )}
                        {location.hours && (
                            <div>
                                <dt className="text-sm font-bold uppercase tracking-widest">We're Open</dt>
                                <dd className="mt-1">{location.hours}</dd>
                            </div>
                        )}
                        {location.services && location.services.length > 0 && (
                            <div>
                                <dt className="text-sm font-bold uppercase tracking-widest">Available Services</dt>
                                <dd className="mt-1">{location.services.join(", ")}</dd>
                            </div>
                        )}
                    </dl>

                    <div className="mt-6 flex flex-row gap-2">
                        {isStepper ? (
                            <div className="shrink-0">
                                <span className="inline-flex items-center h-10 px-4 rounded-lg bg-[#3F3126] text-white font-semibold">
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
                </div>
            </div>

            {/* RIGHT WRAPPER */}
            {!isStepper && (
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
