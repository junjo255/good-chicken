import {headers} from "next/headers";
import React from "react";
import Hero from "@/app/components/Hero/Hero";
import OrderNow from "@/app/components/OrderNow/OrderNow";
import Menu from "@/app/components/Menu/Menu";
import AboutUs from "@/app/components/AboutUs/AboutUs";
import Locations from "@/app/components/Location/Locations";
import Catering from "@/app/components/Catering/Catering";
import ContactUs from "@/app/components/ContactUs/ContactUs";
import AOSInit from "@/app/AOSInit";
import Marquee from "react-fast-marquee";

export default async function Home() {
    const h = await headers();
    const proto = h.get("x-forwarded-proto") ?? "http";
    const host = h.get("host") ?? "localhost:3000";
    const base = `${proto}://${host}`;

    const res = await fetch(`${base}/api/locations`, {cache: "no-store"});
    const {locations} = await res.json();

    return (
        <>
            <AOSInit />
            <Hero/>

            <Menu/>
            <OrderNow/>
            <AboutUs/>

            <Locations />

            {/*<TempInstagramFeed/>*/}
            {/*<InstagramFeed/>*/}
            <Catering/>
            <ContactUs/>
            <Marquee
                speed={160}
                style={{ fontSize: "100px", color: "#F4BB1C", fontWeight: 900}}
            >


                YOUR NEW FAVORITE <span style={{color: "#C02A2E"}}> KOREAN FRIED CHICKEN</span> STARTS HERE!
                YOUR NEW FAVORITE <span style={{color: "#C02A2E"}}> KOREAN FRIED CHICKEN</span> STARTS HERE!


            </Marquee>
        </>
);
}
