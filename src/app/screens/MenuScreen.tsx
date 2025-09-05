'use client';

import React from 'react';
import OrderingMenu from '@/app/components/Order/Menu/Menu';
import CartDrawer from '@/app/components/CartDrawer/CartDrawer';

export default function MenuScreen() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-6 mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <OrderingMenu />
      </div>
      <CartDrawer />
    </main>
  );
}
