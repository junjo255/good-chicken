import React, {useMemo, useState} from "react";
import {X} from "lucide-react";
import {buildPickupTicks, minutesToLabel, isOpenNow, to12h, toMinutes} from "@/app/utils";
import {OpenBadge} from "@/app/classUtils";

type PickupMeta = {
    targetDate: Date;
    startMin: number;
    durationMin: number;
    timezone?: string;
};

export default function TimePickerModal({
                                            open,
                                            onClose,
                                            selectedStore,
                                            scheduleLater,
                                            onPick,
                                        }: {
    open: boolean;
    onClose: () => void;
    selectedStore: any;
    scheduleLater: boolean;
    onPick: (meta: PickupMeta) => void;
}) {

    const timezone: string | undefined = selectedStore?.hours?.timezone;

    const status = selectedStore?.hours ? isOpenNow(selectedStore.hours) : null;
    const storeIsOpen = !!status?.isOpen;
    const [selectedStart, setSelectedStart] = useState<number | null>(null);
    const [selectedDayOffset, setSelectedDayOffset] = useState<number>(0); // 0=Today, 1=Tomorrow, etc.

    const ceilTo15 = (m: number) => Math.ceil(m / 15) * 15;

    const nowMinutesInTZ = (tz?: string) => {
        const fmt = new Intl.DateTimeFormat("en-US", {
            timeZone: tz,
            hour12: false,
            hour: "2-digit",
            minute: "2-digit",
        });
        const [hh, mm] = fmt.format(new Date()).split(":").map(Number);
        return hh * 60 + mm;
    };

    const targetDate = useMemo(() => {
        const d = new Date();
        d.setDate(d.getDate() + selectedDayOffset); // 0 = today, 1 = tomorrow, ...
        return d;
    }, [selectedDayOffset]);

    const { ticks, hasNow } = useMemo(
        () => buildPickupTicks(selectedStore, scheduleLater, targetDate),
        [selectedStore, scheduleLater, targetDate]
    );

    const windows = useMemo(() => {
        if (!ticks?.length) return [];

        // Build the full set of 30-min windows from your ticks
        const max = Math.max(...ticks);
        let raw = ticks
            .filter((t) => t + 30 <= max + 15)
            .map((t) => ({
                start: t,
                end: t + 30,
                label: `${minutesToLabel(t)} - ${minutesToLabel(t + 30)}`,
            }));

        // We only trim "Today"
        if (selectedDayOffset === 0) {
            const nowM = nowMinutesInTZ(timezone);

            if (storeIsOpen) {
                // Open now -> start at next 15-min tick from now
                const nextTick = ceilTo15(nowM);
                raw = raw.filter((w) => w.start >= nextTick);
            } else {
                // Closed now: if it's BEFORE opening, start 30 mins after opening
                // status.start is the next opening time for today (string "HH:MM" or number)
                if (status?.start != null) {
                    const openMin =
                        typeof status.start === "number" ? status.start : toMinutes(status.start);
                    if (nowM < openMin) {
                        const firstStart = ceilTo15(openMin + 30); // 30 mins after open, rounded up
                        raw = raw.filter((w) => w.start >= firstStart);
                    }
                }
            }
        }

        return raw;
    }, [ticks, selectedDayOffset, timezone, storeIsOpen, status?.start]);

    const opensAt = useMemo(() => {
        const status = selectedStore?.hours ? isOpenNow(selectedStore.hours) : undefined;
        const openStr =
            status?.start ? minutesToLabel(status.start as unknown as number) : null;
        const storeLine = [
            selectedStore?.name,
            selectedStore?.address ? `(${selectedStore.address})` : "",
        ]
            .filter(Boolean)
            .join(" ");
        return {storeLine, openStr};
    }, [selectedStore]);

    const dayChips = useMemo(() => {
        const base = new Date();
        const fmt = (d: Date) => ({
            dow: d.toLocaleDateString(undefined, {weekday: "short"}),
            m: d.toLocaleDateString(undefined, {month: "short"}),
            day: d.toLocaleDateString(undefined, {day: "2-digit"}),
        });
        const add = (n: number) => {
            const d = new Date(base);
            d.setDate(base.getDate() + n);
            return fmt(d);
        };
        return [
            {title: "Today", ...fmt(base)},
            {title: "Tomorrow", ...add(1)},
            {title: add(2).dow, ...add(2)},
            {title: add(3).dow, ...add(3)},
        ];
    }, []);

    const handleConfirm = () => {
        if (selectedStart == null) return;

        const meta: PickupMeta = {
            targetDate,
            startMin: selectedStart,
            durationMin: 30,
            timezone,
        };

        onPick(meta);
        onClose();
    };


    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4 m-4">
            <div className="w-full max-w-xl bg-white rounded-2xl overflow-hidden">
                <div className="shadow-b">
                    {/* Header */}
                    <div className="flex items-start gap-2 pt-4 px-4 m-4">
                        <div className="flex-1">
                            <h2 className="text-[2rem] font-semibold pb-3">Schedule pickup time</h2>
                            <p className="text-[1.2rem] text-neutral-600 mt-1">
                                {opensAt.storeLine || "Selected location"}<br/>
                                <OpenBadge
                                    className={"justify-start"}
                                    hours={selectedStore.hours}
                                />
                            </p>
                        </div>

                        <button
                            onClick={onClose}
                            className="h-9 w-9 inline-flex items-center justify-center rounded-full hover:bg-neutral-100"
                            aria-label="Close"
                        >
                            <X/>
                        </button>
                    </div>

                    {/* Day chips (visual like screenshot) */}
                    <div className="pb-5 m-4 px-4">
                        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                            {dayChips.map((c, i) => {
                                const active = i === selectedDayOffset;
                                return (
                                    <button
                                        key={i}
                                        type="button"
                                        onClick={() => setSelectedDayOffset(i)}
                                        className={`flex-shrink-0 px-5 py-5 rounded-2xl border text-left min-w-[130px] transition
                                        ${active ? "bg-[#3F3126] text-white border-[#3F3126]" : "bg-white text-black border-neutral-200"}
                                      `}
                                    >
                                        <div className="text-[1.2rem] font-medium">{c.title}</div>
                                        <div className={`text-[1rem] opacity-80`}>{c.m} {c.day}</div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                </div>

                {/* Times list */}
                <div className="mt-4 max-h-[420px] overflow-y-auto  p-4 m-4">
                    {windows.length === 0 ? (
                        <div className="p-6 text-center text-[1.2rem] text-neutral-500">
                            No times available today.<br/>
                            The store is closed on this day!
                        </div>
                    ) : (
                        windows.map((w, idx) => {
                            const selected = selectedStart === w.start;
                            return (
                                <label
                                    key={`${w.start}-${idx}`}
                                    className={`flex items-center gap-4 px-5 py-7 cursor-pointer hover:bg-neutral-50 line-b transition
                                        ${selected ? "bg-neutral-100 border-l-4 border-l-[#3F3126]" : ""}
                                      `}
                                    onClick={() => setSelectedStart(w.start)}
                                >
                                    <div className="text-[1.2rem]">{w.label}</div>

                                    {/* Custom radio on the right */}
                                    <div className="ml-auto">
                                        <span
                                            aria-checked={selected}
                                            className={`inline-flex items-center justify-center h-5 w-5 rounded-full border-2 ${selected ? "border-[#3F3126]" : "border-neutral-300"}`}
                                        >
                                            <span
                                                className={`h-2.5 w-2.5 rounded-full ${selected ? "bg-[#3F3126]" : "bg-transparent"}`}
                                            />
                                        </span>
                                    </div>
                                </label>
                            );
                        })
                    )}
                </div>

                {/* Footer buttons */}
                <div className="grid gap-3 pb-3 shadow-t">
                    <div className="m-4 px-4">
                        <button
                            onClick={handleConfirm}
                            disabled={selectedStart == null}
                            className={`w-full rounded-xl py-3 my-3 text-white text-[1.3rem] font-medium ${
                                selectedStart == null
                                    ? "bg-neutral-300 cursor-not-allowed"
                                    : "bg-[#3F3126]"
                            }`}
                        >
                            Schedule
                        </button>
                        <button
                            onClick={onClose}
                            className="w-full rounded-xl py-3 font-[1.3rem] border border-neutral-300"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
