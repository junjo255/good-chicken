'use client';

import React from 'react';
import OrderingMenu from "@/app/components/Order/Menu/Menu";
import ChosenLocation from "@/app/components/Order/Location/ChosenLocation";


export default function MenuScreen() {

    return (
        <section className="flex items-center justify-between flex-col gap-2">
            <ChosenLocation />
            <OrderingMenu />
        </section>
    );
}
