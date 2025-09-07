import React from "react";
import {LOCATIONS} from "@/app/lib/locations";
import LocationPanel from "@/app/components/Location/LocationPanel";


export default function Locations() {
    return (
        <section id="FindUs" className="mx-auto max-w-6xl px-4 md:px-6 py-10 md:py-14">
            <header className="text-center mb-10">
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[#423023]">
                    Find Us Near You
                </h1>
            </header>

            <div className="space-y-10">
                {LOCATIONS.map((loc) => (
                    <LocationPanel
                        key={loc.id}
                        location={loc}
                    />
                ))}
            </div>
        </section>
    );
}
