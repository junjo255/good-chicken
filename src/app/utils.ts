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
    return nowMin >= start || nowMin < end;
}

export function isOpenNow(hours: BusinessHours): {
    isOpen: boolean;
    start?: string;
    until?: string;
    sourceDay?: Weekday;
    note?: string;
} {
    const { timezone } = hours;
    const { weekday: today, dateISO, minutes: nowMin } = zonedNowParts(timezone);

    // helper: map to the next weekday (adapt if your Weekday differs)
    const nextDay = (d: Weekday): Weekday => {
        const order: Weekday[] = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
        return order[(order.indexOf(d) + 1) % 7] as Weekday;
    };

    // helper: first upcoming range (open > now)
    const firstUpcomingToday = (ranges: { open: string; close: string }[]) => {
        const upcoming = ranges.find(r => nowMin < toMinutes(r.open));
        return upcoming ? { start: upcoming.open } : null;
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
                    return { isOpen: true, start: r.open, until: r.close, sourceDay: today, note: todayException.note };
                }
            }
            // not open now → maybe opens later today under exception hours
            const next = firstUpcomingToday(todayException.ranges);
            if (next) return { isOpen: false, start: next.start, sourceDay: today, note: todayException.note };
            // otherwise fall through to look at future days
        }
    }

    // 2) Regular hours (TODAY) — currently open?
    const todayRanges = hours.regular[today];
    if (todayRanges !== "closed") {
        for (const r of todayRanges) {
            if (isInRange(nowMin, r)) {
                return { isOpen: true, start: r.open, until: r.close, sourceDay: today };
            }
        }
        // not open now → opens later today?
        const next = firstUpcomingToday(todayRanges);
        if (next) return { isOpen: false, start: next.start, sourceDay: today };
    }

    // 3) Overnight spill from YESTERDAY (e.g., 20:00–02:00 and it's 00:30 today)
    const yday = prevDay(today);
    const yRanges = hours.regular[yday];
    if (yRanges !== "closed") {
        for (const r of yRanges) {
            const start = toMinutes(r.open);
            const end = toMinutes(r.close);
            if (start > end && nowMin < end) {
                return { isOpen: true, start: r.open, until: r.close, sourceDay: yday };
            }
        }
    }

    // 4) Find the NEXT DAY that opens (first range of that day)
    let d = today;
    for (let i = 0; i < 7; i++) {
        d = nextDay(d);
        const ranges = hours.regular[d];
        if (ranges !== "closed" && ranges.length > 0) {
            return { isOpen: false, start: ranges[0].open, sourceDay: d };
        }
    }

    // no hours found at all
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