import {AppRouterInstance} from "next/dist/shared/lib/app-router-context.shared-runtime";

export function formatUSD(amount?: number) {
    if (typeof amount !== "number" || Number.isNaN(amount)) return "";
    return amount.toLocaleString("en-US", {style: "currency", currency: "USD"});
}


type Weekday = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";
type TimeRange = { open: string; close: string };
type BusinessHours = {
    timezone?: string;
    regular: Record<Weekday, TimeRange[] | "closed">;
    exceptions?: Array<{ date: string; ranges: TimeRange[] | "closed"; note?: string }>;
};

const ORDER: Weekday[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
export const toMinutes = (hhmm: string) => {
    const [h, m] = hhmm.split(":").map(Number);
    return h * 60 + m;
};

const roundUpTo15 = (d: Date) => {
    const ms = 15 * 60 * 1000;
    return new Date(Math.ceil(d.getTime() / ms) * ms);
};

const prevDay = (d: Weekday): Weekday => ORDER[(ORDER.indexOf(d) + 6) % 7] as Weekday;
const nextDay = (d: Weekday): Weekday => ORDER[(ORDER.indexOf(d) + 1) % 7] as Weekday;

function isInRange(nowMin: number, r: TimeRange) {
    const start = toMinutes(r.open);
    const end = toMinutes(r.close);
    if (start === end) return false;
    if (start < end) return nowMin >= start && nowMin < end; // same-day
    return nowMin >= start || nowMin < end; // crosses midnight
}

export function isOpenNow(hours: BusinessHours): {
    isOpen: boolean;
    isOpenToday?: boolean;
    start?: string;
    until?: string;
    sourceDay?: Weekday;
    note?: string;
} {
    const {timezone} = hours;
    const {weekday: today, dateISO, minutes: nowMin} = zonedNowParts(timezone);

    // helper: map to the next weekday (adapt if your Weekday differs)
    const nextDay = (d: Weekday): Weekday => {
        const order: Weekday[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        return order[(order.indexOf(d) + 1) % 7] as Weekday;
    };


    // helper: first upcoming range (open > now)
    const firstUpcomingToday = (ranges: { open: string; close: string }[]) => {
        const upcoming = ranges.find(r => nowMin < toMinutes(r.open));
        return upcoming ? {start: upcoming.open} : null;
    };

    // 1) Exception for TODAY
    const todayException = hours.exceptions?.find(ex => ex.date === dateISO);

    if (todayException) {
        if (todayException.ranges === "closed") {
            // closed all day today → find next regular day
        } else {
            // open ranges today — if currently open, return OPEN
            for (const r of todayException.ranges) {
                if (isInRange(nowMin, r)) {
                    return {
                        isOpen: true,
                        isOpenToday: true,
                        start: r.open,
                        until: r.close,
                        sourceDay: today,
                        note: todayException.note
                    };
                }
            }
            // not open now → maybe opens later today under exception hours
            const next = firstUpcomingToday(todayException.ranges);
            if (next) return {
                isOpen: false,
                isOpenToday: true,
                start: next.start,
                sourceDay: today,
                note: todayException.note
            };
            // otherwise fall through to look at future days
        }
    }
    // 2) Regular hours (TODAY) — currently open?
    const todayRanges = hours.regular[today];
    if (todayRanges !== "closed") {
        for (const r of todayRanges) {
            if (isInRange(nowMin, r)) {
                return {isOpen: true, isOpenToday: true, start: r.open, until: r.close, sourceDay: today};
            }
        }
        // not open now → opens later today?
        const next = firstUpcomingToday(todayRanges);
        if (next) return {isOpen: false, isOpenToday: true, start: next.start, sourceDay: today};
    }

    // 3) Overnight spill from YESTERDAY (e.g., 20:00–02:00 and it's 00:30 today)
    const yday = prevDay(today);
    const yRanges = hours.regular[yday];
    if (yRanges !== "closed") {
        for (const r of yRanges) {
            const start = toMinutes(r.open);
            const end = toMinutes(r.close);
            if (start > end && nowMin < end) {
                return {isOpen: true, start: r.open, until: r.close, sourceDay: yday};
            }
        }
    }

    // 4) Find the NEXT DAY that opens (first range of that day)
    let d = today;
    for (let i = 0; i < 7; i++) {
        d = nextDay(d);
        const ranges = hours.regular[d];
        if (ranges !== "closed" && ranges.length > 0) {
            return {
                isOpen: false,
                isOpenToday: d === today,
                start: ranges[0].open,
                sourceDay: d,
            };
        }
    }
    return {isOpen: false};
}

function zonedNowParts(tz?: string) {
    const now = new Date();

    const dateParts = new Intl.DateTimeFormat("en-CA", {
        timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit"
    }).formatToParts(now);

    const get = (t: string) => dateParts.find(p => p.type === t)!.value;
    const dateISO = `${get("year")}-${get("month")}-${get("day")}`;

    const timeParts = new Intl.DateTimeFormat("en-CA", {
        timeZone: tz, hour: "2-digit", minute: "2-digit", hour12: false
    }).formatToParts(now);

    const h = Number(timeParts.find(p => p.type === "hour")!.value);
    const m = Number(timeParts.find(p => p.type === "minute")!.value);
    const minutes = h * 60 + m;

    const weekday = new Intl.DateTimeFormat("en-US", {timeZone: tz, weekday: "short"})
        .format(now) as Weekday;

    return {weekday, dateISO, minutes};
}

export function to12h(hhmm: string) {
    const [h, m] = hhmm.split(":").map(Number);
    const ampm = h >= 12 ? "PM" : "AM";
    const hh = ((h + 11) % 12) + 1;
    return `${hh}:${m.toString().padStart(2, "0")} ${ampm}`;
}

export function formatDay(ranges: TimeRange[] | "closed") {
    if (ranges === "closed") return "Closed";
    return ranges.map(r => `${to12h(r.open)} – ${to12h(r.close)}`).join(", ");
}

export function todayWeekday(tz?: string): Weekday {
    const wd = new Intl.DateTimeFormat("en-CA", {weekday: "short", timeZone: tz}).format(new Date());
    return wd as Weekday;
}

export function minutesToLabel(total: number | string | undefined) {
    if (typeof total === 'undefined') return '';

    let h24: number;
    let m: number;

    if (typeof total === "string") {
        // Expect format "HH:MM"
        const [hh, mm] = total.split(":").map(Number);
        h24 = hh;
        m = mm;
    } else {
        h24 = Math.floor(total / 60);
        m = total % 60;
    }

    const ampm = h24 >= 12 ? "PM" : "AM";
    const h12 = ((h24 + 11) % 12) + 1;

    return `${h12}:${String(m).padStart(2, "0")} ${ampm}`;
}


function formatYMDInTZ(d: Date, tz?: string) {
    const parts = new Intl.DateTimeFormat("en-CA", {
        timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit",
    }).formatToParts(d);
    const g = (t: string) => parts.find(p => p.type === t)!.value;
    return `${g("year")}-${g("month")}-${g("day")}`;
}

function dayKeyInTZ(d: Date, tz?: string): Weekday {
    return new Intl.DateTimeFormat("en-US", {timeZone: tz, weekday: "short"})
        .format(d) as Weekday;
}

function rangesForDate(hours: BusinessHours, date: Date): "closed" | TimeRange[] {
    const tz = hours.timezone;
    const ymd = formatYMDInTZ(date, tz);
    const ex = hours.exceptions?.find(e => e.date === ymd);
    if (ex) return ex.ranges;
    const dow = dayKeyInTZ(date, tz);
    return hours.regular[dow];
}

/**
 * Returns today's available pickup ticks in minutes since midnight.
 * - scheduleLater=true: open..close every 15m
 * - scheduleLater=false: now..close every 15m (and we add a "Now" pseudo-option)
 */
export function buildPickupTicks(
    selectedStore: { hours?: BusinessHours },
    scheduleLater: boolean,
    targetDate: Date
): { ticks: number[]; hasNow: boolean } {
    const hours = selectedStore?.hours;
    if (!hours) return {ticks: [], hasNow: false};

    const ranges = rangesForDate(hours, targetDate);
    if (ranges === "closed" || !ranges?.length) return {ticks: [], hasNow: false};

    // Determine the open/close bounds for the target date (flattened across ranges)
    const openMin = Math.min(...ranges.map(r => toMinutes(r.open)));
    const closeMin = Math.max(...ranges.map(r => toMinutes(r.close)));

    // Is the target date "today" in the store's timezone?
    const tz = hours.timezone;
    const todayYMD = formatYMDInTZ(new Date(), tz);
    const targetYMD = formatYMDInTZ(targetDate, tz);
    const isTodayInTZ = todayYMD === targetYMD;

    // Decide the starting minute and whether “now” was used
    let startMin = openMin;
    let hasNow = false;

    if (!scheduleLater && isTodayInTZ) {
        // Only consider “now” if we're looking at *today*
        const {minutes: nowMin} = zonedNowParts(tz);
        // If currently open (by any range), start at rounded-up now; else start at next opening
        const openNow = ranges.some(r => isInRange(nowMin, r));
        if (openNow) {
            const now = new Date();
            const rounded = roundUpTo15(now);
            startMin = rounded.getHours() * 60 + rounded.getMinutes();
            // Ensure we don't start before the day’s opening
            if (startMin < openMin) startMin = openMin;
            hasNow = true;
        } else {
            // Not open yet today → start at the first opening
            startMin = openMin;
        }
    } else {
        // For future days or when explicitly scheduling later, we don't use “now”
        startMin = openMin;
    }

    // Emit 15-minute ticks within [openMin, closeMin]
    const ticks: number[] = [];
    for (let t = Math.ceil(startMin / 15) * 15; t <= closeMin; t += 15) {
        if (t >= openMin && t <= closeMin) ticks.push(t);
    }

    return {ticks, hasNow};
}

const pad2 = (n: number) => String(n).padStart(2, "0");

export type PickupSlot = {
    /** Calendar day the user chose (store TZ) */
    targetDate: Date;
    /** Start minute-of-day in store TZ (0..1440) */
    startMin: number;
    /** Window length in minutes (e.g., 30) */
    durationMin: number;
    /** Store timezone like "America/New_York" */
    timezone?: string;
};

function ymdInTZParts(d: Date, tz?: string) {
    const parts = new Intl.DateTimeFormat("en-CA", {
        timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit",
    }).formatToParts(d);
    const get = (t: string) => Number(parts.find(p => p.type === t)!.value);
    return {y: get("year"), m: get("month"), d: get("day")};
}

function dateAtMinutesInTZ(base: Date, minutes: number, tz?: string) {
    const {y, m, d} = ymdInTZParts(base, tz);
    const utcMidnight = Date.UTC(y, m - 1, d, 0, 0, 0, 0);
    return new Date(utcMidnight + minutes * 60_000);
}

function formatDateLabel(d: Date, tz?: string) {
    // e.g., "Sat, Sep 27"
    return new Intl.DateTimeFormat("en-US", {
        timeZone: tz, weekday: "short", month: "short", day: "2-digit",
    }).format(d);
}

function formatTimeLabel(dt: Date, tz?: string) {
    // e.g., "11:45 AM"
    return new Intl.DateTimeFormat("en-US", {
        timeZone: tz, hour: "numeric", minute: "2-digit", hour12: true,
    }).format(dt);
}

/** Final label: "Sat, Sep 27, 11:45 AM — 12:15 PM" */
export function formatPickupLabel(slot: PickupSlot) {
    const {targetDate, startMin, durationMin, timezone} = slot;
    const start = dateAtMinutesInTZ(targetDate, startMin, timezone);
    const end = dateAtMinutesInTZ(targetDate, startMin + durationMin, timezone);
    return `${formatDateLabel(targetDate, timezone)}, ${formatTimeLabel(start, timezone)} — ${formatTimeLabel(end, timezone)}`;
}