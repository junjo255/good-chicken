"use client";

import React from "react";


export default function Section({title, subtitle, children}: any) {
    return (
        <section
            className="rounded-2xl  bg-white p-5"
            style={{padding: 0}}
        >
            <div style={{paddingLeft: "5px"}} className="mb-4">
                <h2  className="text-3xl md:text-4xl font-semibold text-[#423023] tracking-tight">{title}</h2>
                {subtitle && (
                    <p className="md text-neutral-600 mt-1">{subtitle}</p>
                )}
            </div>
            {children}
        </section>
    );
}
