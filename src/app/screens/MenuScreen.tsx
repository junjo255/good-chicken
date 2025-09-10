'use client';

import React, {useEffect, useMemo, useState} from 'react';
import OrderingMenu from '@/app/components/Order/Menu/Menu';
import { StoreLocation } from '@/app/lib/types';
import { LOCATIONS } from '@/app/lib/locations';
import LocationPanel from '@/app/components/Location/LocationPanel';
import {useOrder} from "@/app/components/Order/Stepper/OrderCtx";

export default function MenuScreen() {
    const { selectedStoreId, setSelectedStoreId } = useOrder();

    const location: StoreLocation | null = useMemo(() => {
        if (!selectedStoreId) return null;
        return LOCATIONS.find((s) => s.id === selectedStoreId) || null;
    }, [selectedStoreId]);


    return (
        <section
            className="flex flex-col gap-6"
            style={{
                marginTop: 'var(--header-h, 96px)',
                scrollMarginTop: 'var(--header-h, 96px)',
                paddingTop: '2rem',
                paddingBottom: '4rem'
            }}
        >
            {location && (
                <div className="mx-auto max-w-6xl px-6 w-full">
                    <LocationPanel
                        location={location}
                        component={"menu"}
                    />
                </div>
            )}
            <OrderingMenu />
        </section>
    );
}
