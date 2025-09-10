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

    return (
        <html lang="en">
        <head>
            <script async src="//www.instagram.com/embed.js"></script>
        </head>
        <body className="min-h-screen flex flex-col">
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
