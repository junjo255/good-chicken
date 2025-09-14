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

const ORDER: Weekday[] = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
const prevDay = (d: Weekday): Weekday => ORDER[(ORDER.indexOf(d) + 6) % 7];

const toMinutes = (hhmm: string) => {
    const [h, m] = hhmm.split(":").map(Number);
    return h * 60 + m;
};

function zonedNowParts(timeZone?: string) {
    const fmt = new Intl.DateTimeFormat("en-CA", {
        timeZone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        weekday: "short",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    });
    const parts = Object.fromEntries(fmt.formatToParts(new Date()).map(p => [p.type, p.value]));
    // weekday is like "Mon", "Tue"...
    const weekday = (parts.weekday as Weekday);
    const dateISO = `${parts.year}-${parts.month}-${parts.day}`; // YYYY-MM-DD in that TZ
    const minutes = parseInt(parts.hour, 10) * 60 + parseInt(parts.minute, 10);
    return { weekday, dateISO, minutes };
}

function isInRange(nowMin: number, r: TimeRange) {
    const start = toMinutes(r.open);
    const end = toMinutes(r.close);
    if (start === end) return false;        // zero-length guard
    if (start < end) return nowMin >= start && nowMin < end;       // same-day
    // overnight (e.g., 20:00–02:00): open if >= start OR < end
    return nowMin >= start || nowMin < end;
}

export function isOpenNow(hours: BusinessHours): {
    isOpen: boolean;
    until?: string;            // close time in "HH:mm" for the current open range
    sourceDay?: Weekday;       // which day’s range we’re currently in
    note?: string;             // exception note if applicable
} {
    const { timezone } = hours;
    const { weekday: today, dateISO, minutes: nowMin } = zonedNowParts(timezone);

    // 1) Exceptions (today only)
    const todayException = hours.exceptions?.find(ex => ex.date === dateISO);
    if (todayException) {
        if (todayException.ranges === "closed") return { isOpen: false, note: todayException.note };
        for (const r of todayException.ranges) {
            if (isInRange(nowMin, r)) return { isOpen: true, until: r.close, sourceDay: today, note: todayException.note };
        }
        return { isOpen: false, note: todayException.note };
    }

    // 2) Regular hours (today)
    const todayRanges = hours.regular[today];
    if (todayRanges !== "closed") {
        for (const r of todayRanges) {
            if (isInRange(nowMin, r)) return { isOpen: true, until: r.close, sourceDay: today };
        }
    }

    // 3) Overnight spill from yesterday (if any)
    const yday = prevDay(today);
    const yRanges = hours.regular[yday];
    if (yRanges !== "closed") {
        for (const r of yRanges) {
            const start = toMinutes(r.open);
            const end = toMinutes(r.close);
            if (start > end) { // overnight range e.g. 20:00–02:00
                if (nowMin < end) return { isOpen: true, until: r.close, sourceDay: yday };
            }
        }
    }

    return { isOpen: false };
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
    const wd = new Intl.DateTimeFormat("en-CA", { weekday: "short", timeZone: tz }).format(new Date());
    return wd as Weekday;
}