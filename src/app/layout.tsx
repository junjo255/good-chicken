import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import "./globals.css";
import React from "react";
import Header from "@/app/components/Header/Header";
import Footer from "@/app/components/Footer/Footer";
import {headers} from "next/headers";
import 'mapbox-gl/dist/mapbox-gl.css';

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title:
        "Good Chicken",
    description:
        'Authentic BBQ chicken. Order online or visit one of our two locations.'
};

export default async function RootLayout({
                                             children,
                                         }: Readonly<{
    children: React.ReactNode;
}>) {
    const h = await headers();
    const proto = h.get("x-forwarded-proto") ?? "http";
    const host = h.get("host") ?? "localhost:3000";
    const base = `${proto}://${host}`;

    const res = await fetch(`${base}/api/locations`, {cache: "no-store"});
    const {locations} = await res.json();

    const footerLocations = locations.map((l: any) => ({
        id: l.id,
        name: l.name,
        mapsUrl: l.mapsUrl,
    }));
    return (
        <html lang="en">
        <head>
            <script async src="//www.instagram.com/embed.js"></script>
        </head>
        <body className={`${geistSans.variable} ${geistMono.variable}`}>
            <Header/>
            {children}
            <Footer locations={footerLocations}/>
        </body>
        </html>
    );
}
