'use client';

import Hero from "@/app/components/Hero/Hero";
import OrderNow from "@/app/components/OrderNow/OrderNow";
import Menu from "@/app/components/Menu/Menu";
import AboutUs from "@/app/components/AboutUs/AboutUs";
import Locations from "@/app/components/Location/Locations";
import TempInstagramFeed from "@/app/components/InstagramFeed/TempInstagramFeed";
import InstagramFeed from "@/app/components/InstagramFeed/InstagramFeed";
import Catering from "@/app/components/Catering/Catering";
import ContactUs from "@/app/components/ContactUs/ContactUs";
import React, {useEffect} from "react";
import AOS from 'aos';
import "aos/dist/aos.css";

export default function MainScreen({locations}: { locations: any[]; }) {
    useEffect(() => {
        AOS.init();
        AOS.refresh();
    }, []);

    return (
        <>
            <Hero/>

            <OrderNow/>
            <Menu/>
            <AboutUs/>

            <Locations/>

            {/*<TempInstagramFeed/>*/}
            {/*<InstagramFeed/>*/}
            <Catering/>
            <ContactUs/>
        </>
    );
}
