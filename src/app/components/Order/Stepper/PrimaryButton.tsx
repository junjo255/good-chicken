"use client";

import React from "react";


export default function PrimaryButton({children, disabled, onClick}: any) {
    return (
        <button
            className={`w-full h-11 rounded-xl font-semibold transition cursor-pointer ${
                disabled
                    ? "bg-neutral-200 text-neutral-500 cursor-not-allowed"
                    : "bg-[#3F3126] cursor-pointer text-white hover:opacity-90"
            }`}
            disabled={disabled}
            onClick={onClick}
        >
            {children}
        </button>
    );
}
