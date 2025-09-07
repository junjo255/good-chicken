import React from "react";
import {StoreLocation} from "@/app/lib/types";
import {LOCATIONS} from "@/app/lib/locations";

function LocationPanel({location}: { location: StoreLocation }) {
    return (
        <section className="grid grid-cols-1 md:grid-cols-2 gap-0 bg-[#423023] px-6 md:px-10 py-8 rounded-xl border border-neutral-400 shadow-sm" data-aos="fade-up">

            <div
                className="bg-white md:ml-8 mt-6 md:mt-0 rounded-md border border-neutral-300 p-8 flex flex-col justify-start">
                <div>
                    <h3 className="text-2xl md:text-3xl font-semibold text-[#423023] mt-1">
                        {location.city}
                    </h3>
                    <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[#AF3935]">
                        {location.brand}
                    </h2>
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


                <div className="mt-6 flex flex-row gap-2 ">
                    <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                            location.address
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center rounded-lg px-4 py-2 border border-neutral-300 hover:border-neutral-400 transition text-sm font-medium"
                    >
                        Order Now
                    </a>
                    <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                            location.address
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center rounded-lg px-4 py-2 border border-neutral-300 hover:border-neutral-400 transition text-sm font-medium"
                    >
                        Get Directions
                    </a>
                </div>
            </div>

            <div className="md:pr-6">
                <div className="aspect-[16/10] h-full w-full overflow-hidden rounded-md border border-neutral-300 bg-white">
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
        </section>
    );
}

export default function FindUsSection() {
    return (
        <section className="mx-auto max-w-6xl px-4 md:px-6 py-10 md:py-14">
            <header className="text-center mb-10">
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[#423023]">
                    Find Us Near You
                </h1>
                {/*<p className="mt-3 text-neutral-700 max-w-xl mx-auto">*/}
                {/*say something??*/}
                {/*</p>*/}
            </header>

            <div className="space-y-10">
                {LOCATIONS.map((loc) => (
                    <LocationPanel key={loc.id} location={loc} />
                ))}
            </div>
        </section>
    );
}
