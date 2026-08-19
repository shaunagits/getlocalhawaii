/**
 * Every clock decision on the site is made in Hawaii local time. Hawaii does
 * not observe DST, but the IANA zone is still used rather than a fixed -10
 * offset so the code stays correct if that ever changes.
 */

export const HAWAII_TZ = "Pacific/Honolulu";

/** A wall-clock reading in Hawaii, decomposed for date and time math. */
export interface HawaiiClock {
  /** Calendar date in Hawaii as YYYY-MM-DD. */
  date: string;
  year: number;
  /** 1-12. */
  month: number;
  day: number;
  /** 0 = Sunday .. 6 = Saturday, matching the day_of_week column. */
  dayOfWeek: number;
  /** Minutes since midnight in Hawaii. */
  minutes: number;
}

const WEEKDAY_INDEX: Record<string, number> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

const formatter = new Intl.DateTimeFormat("en-US", {
  timeZone: HAWAII_TZ,
  weekday: "short",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

/** Read an instant as Hawaii wall-clock time. */
export function hawaiiClock(instant: Date): HawaiiClock {
  const parts: Record<string, string> = {};
  for (const part of formatter.formatToParts(instant)) {
    if (part.type !== "literal") parts[part.type] = part.value;
  }

  const year = Number(parts.year);
  const month = Number(parts.month);
  const day = Number(parts.day);

  return {
    date: `${parts.year}-${parts.month}-${parts.day}`,
    year,
    month,
    day,
    dayOfWeek: WEEKDAY_INDEX[parts.weekday],
    minutes: Number(parts.hour) * 60 + Number(parts.minute),
  };
}

/** Calendar date in Hawaii as YYYY-MM-DD. */
export function hawaiiDate(instant: Date): string {
  return hawaiiClock(instant).date;
}

/** Whether two instants land on the same Hawaii calendar day. */
export function isSameHawaiiDay(a: Date, b: Date): boolean {
  return hawaiiDate(a) === hawaiiDate(b);
}

/** Whole Hawaii calendar days between two instants, ignoring time of day. */
export function hawaiiDaysBetween(earlier: Date, later: Date): number {
  const a = hawaiiClock(earlier);
  const b = hawaiiClock(later);
  const asUtc = (c: HawaiiClock) => Date.UTC(c.year, c.month - 1, c.day);
  return Math.round((asUtc(b) - asUtc(a)) / 86_400_000);
}

/** Parse a "HH:MM" or "HH:MM:SS" time column into minutes since midnight. */
export function minutesFromTime(time: string): number {
  const [hours, minutes] = time.split(":");
  return Number(hours) * 60 + Number(minutes);
}

/**
 * Short clock label used by every status chip: "2P", "6:30A", "12P".
 * The :00 is dropped because the mockups read "CLOSES 2P", not "CLOSES 2:00P".
 */
export function shortTime(totalMinutes: number): string {
  const normalized = ((totalMinutes % 1440) + 1440) % 1440;
  const hours24 = Math.floor(normalized / 60);
  const minutes = normalized % 60;
  const suffix = hours24 < 12 ? "A" : "P";
  const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
  return minutes === 0
    ? `${hours12}${suffix}`
    : `${hours12}:${String(minutes).padStart(2, "0")}${suffix}`;
}

/** Long clock label for the hours table: "7:00a", "12:00p". */
export function longTime(time: string): string {
  const totalMinutes = minutesFromTime(time);
  const hours24 = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const suffix = hours24 < 12 ? "a" : "p";
  const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
  return `${hours12}:${String(minutes).padStart(2, "0")}${suffix}`;
}

const MONTHS = [
  "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
  "JUL", "AUG", "SEP", "OCT", "NOV", "DEC",
];

/** Three-letter month name for a 1-12 month number: "AUG" or "Aug". */
export function monthAbbr(month: number, upper = true): string {
  const name = MONTHS[month - 1];
  return upper ? name : `${name[0]}${name.slice(1).toLowerCase()}`;
}

/** Uppercase month and day for mono labels: "AUG 12". */
export function shortDate(instant: Date): string {
  const clock = hawaiiClock(instant);
  return `${monthAbbr(clock.month)} ${clock.day}`;
}

/** Sentence-case month and day for body copy: "Aug 12". */
export function sentenceDate(instant: Date): string {
  const clock = hawaiiClock(instant);
  return `${monthAbbr(clock.month, false)} ${clock.day}`;
}

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/** Three-letter weekday name for a day_of_week value. */
export function dayName(dayOfWeek: number): string {
  return DAY_NAMES[((dayOfWeek % 7) + 7) % 7];
}

/** "1H 19M", "19M", "2H". Used by countdowns and relative timestamps. */
export function duration(totalMinutes: number): string {
  const safe = Math.max(0, Math.round(totalMinutes));
  const hours = Math.floor(safe / 60);
  const minutes = safe % 60;
  if (hours === 0) return `${minutes}M`;
  if (minutes === 0) return `${hours}H`;
  return `${hours}H ${minutes}M`;
}

/** "1H AGO", "45M AGO", "3D AGO". Used by report chips. */
export function relativeAgo(then: Date, now: Date): string {
  const minutes = Math.max(0, Math.round((now.getTime() - then.getTime()) / 60_000));
  if (minutes < 60) return `${Math.max(1, minutes)}M AGO`;
  if (minutes < 1440) return `${Math.floor(minutes / 60)}H AGO`;
  return `${Math.floor(minutes / 1440)}D AGO`;
}

/** Coerce a Supabase timestamptz string or Date into a Date. */
export function toDate(value: string | Date): Date {
  return value instanceof Date ? value : new Date(value);
}

/** Header stamp showing when the page was computed: "WED AUG 19 · 9:41A". */
export function clockLabel(instant: Date): string {
  const clock = hawaiiClock(instant);
  return `${dayName(clock.dayOfWeek).toUpperCase()} ${monthAbbr(clock.month)} ${clock.day} · ${shortTime(clock.minutes)}`;
}
