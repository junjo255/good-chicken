"use client";

import React from "react";
import {Clock} from "lucide-react";

export default function OpenHours() {

    return (
        <div className="border p-4">
            <div className="flex items-center gap-2">
                <span className="inline-flex h-2 w-2 rounded-full bg-green-500" aria-hidden="true"/>
                <span className="text-sm font-medium">Open</span>
            </div>
            <div className="mt-1 flex items-center gap-2 text-xs text-neutral-600">
                <Clock/>
                <span>Open until 12:00 AM</span>
            </div>
        </div>
    );
}