"use client";

import React from "react";
import { Card, Line, SectionTitle } from "@/app/components/ui/Card";
import {AppRouterInstance} from "next/dist/shared/lib/app-router-context.shared-runtime";

type ConfirmResetModalProps = {
    open: boolean;
    onConfirm: () => void;
    onCancel: () => void;
};

type ResetAndNavigateArgs = {
    setSelectedStoreId?: (id: string | null) => void;
    cart?: any;
    router: AppRouterInstance;
};

export function resetStoreAndCartAndGoToOrder({
                                                  cart,
                                                  router,
                                              }: ResetAndNavigateArgs) {

    if (cart?.clear) {
        cart.clear();
    } else if (cart?.reset) {
        cart.reset();
    } else if (cart?.items) {
        cart.items.forEach((item: any) => {
            if (cart.removeItem) cart.removeItem(item.id);
        });
    }

    router.push("/order");
}

export function ConfirmResetModal({ open, onConfirm, onCancel }: ConfirmResetModalProps) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <Card className="w-full max-w-md p-6">
                <SectionTitle>Change Store?</SectionTitle>
                <Line />
                <p className="mt-4 text-[15px] text-neutral-700">
                    Changing stores will reset all items in your cart. Do you want to continue?
                </p>
                <div className="mt-6 flex justify-end gap-3">
                    <button
                        onClick={onCancel}
                        className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="rounded-lg bg-[#AF3935] px-4 py-2 text-sm font-semibold text-white hover:bg-[#922f2b]"
                    >
                        Yes, Continue
                    </button>
                </div>
            </Card>
        </div>
    );
}
