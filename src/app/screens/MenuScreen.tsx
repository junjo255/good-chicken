'use client';

import React, { useEffect, useState } from 'react';
import OrderingMenu from '@/app/components/Order/Menu/Menu';
import { StoreLocation } from '@/app/lib/types';
import { LOCATIONS } from '@/app/lib/locations';
import LocationPanel from '@/app/components/Location/LocationPanel';

export default function MenuScreen() {
    const [location, setLocation] = useState<StoreLocation | null>(null);

    useEffect(() => {
        try {
            const id = localStorage.getItem('gc_location');
            if (id) setLocation(LOCATIONS.find(s => s.id === id) || null);
        } catch {}
    }, []);

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
