import type {Metadata} from "next";
import "./globals.css";
import React from "react";
import Header from "@/app/components/Header/Header";
import Footer from "@/app/components/Footer/Footer";
import {headers} from "next/headers";
import 'mapbox-gl/dist/mapbox-gl.css';

export const metadata: Metadata = {
    title:
        "Good Chicken",
    description:
        'Authentic BBQ chicken. Order online or visit one of our two locations.'
};

export default function RootLayout({
                                             children,
                                         }: Readonly<{
    children: React.ReactNode;
}>) {
    // const h = await headers();
    // const proto = h.get("x-forwarded-proto") ?? "http";
    // const host = h.get("host") ?? "localhost:3000";
    // const base = `${proto}://${host}`;
    //
    // const res = await fetch(`${base}/api/locations`, {cache: "no-store"});
    // const {locations} = await res.json();
    //
    // const footerLocations = locations.map((l: any) => ({
    //     id: l.id,
    //     name: l.name,
    //     mapsUrl: l.mapsUrl,
    // }));
    return (
        <html lang="en">
        <head>
            <script async src="//www.instagram.com/embed.js"></script>
        </head>
        <body className="min-h-screen flex flex-col">
        <Header/>
        <main className="flex-1">
            {children}
        </main>
        <Footer
            // locations={[]} // use when locations are in the db
        />
        </body>
        </html>
    );
}
