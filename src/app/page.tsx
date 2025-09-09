import {headers} from "next/headers";
import React from "react";
import Hero from "@/app/components/Hero/Hero";
import OrderNow from "@/app/components/OrderNow/OrderNow";
import Menu from "@/app/components/Menu/Menu";
import AboutUs from "@/app/components/AboutUs/AboutUs";
import Locations from "@/app/components/Location/Locations";
import ContactUs from "@/app/components/ContactUs/ContactUs";
import Marquee from "react-fast-marquee";
import InstagramFeed from "@/app/components/InstagramFeed/InstagramFeed";

export default async function Home() {

    return (
        <>
            {/*<AOSInit />*/}
            <Hero/>

            <Menu/>
            <OrderNow/>
            <AboutUs/>

            <Locations />

            {/*<TempInstagramFeed/>*/}
            <InstagramFeed/>
            {/*<Catering/>*/}
            <ContactUs/>
            <Marquee
                speed={160}
                style={{ fontSize: "100px", color: "#F4BB1C", fontWeight: 900}}
            >
                {` YOUR NEW FAVORITE `}<span style={{color: "#AF3935"}}> KOREAN FRIED CHICKEN</span> STARTS HERE!
                {` YOUR NEW FAVORITE `}<span style={{color: "#AF3935"}}> KOREAN FRIED CHICKEN</span> STARTS HERE!

            </Marquee>
        </>
);
}
