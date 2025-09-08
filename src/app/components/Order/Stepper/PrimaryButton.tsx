"use client";

import React from "react";


export default function PrimaryButton({children, disabled, onClick}: any) {
    return (
        <button
            className={`w-full h-11 rounded-xl font-semibold transition cursor-pointer ${
                disabled
                    ? "bg-[#E8E8E8] text-[#262626] cursor-not-allowed"
                    : "bg-[#AF3935] cursor-pointer text-white hover:opacity-90"
            }`}
            disabled={disabled}
            onClick={onClick}
        >
            {children}
        </button>
    );
}
