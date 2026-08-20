import type { OpeningHours } from "@/lib/status";
import { dayName, longTime, minutesFromTime } from "@/lib/time";

/**
 * The week at a glance, with today on its own row so it is never buried in a
 * range. Days are ordered Monday first, matching the mockups. On desktop the
 * rows become a bordered card and today is picked out in mint.
 */

const WEEK = [1, 2, 3, 4, 5, 6, 0];

function hoursLabel(entries: OpeningHours[]): string {
  if (entries.length === 0) return "closed";
  return [...entries]
    .sort((a, b) => minutesFromTime(a.opens) - minutesFromTime(b.opens))
    .map((entry) => `${longTime(entry.opens)} to ${longTime(entry.closes)}`)
    .join(", ");
}

export function HoursTable({ hours, today }: { hours: OpeningHours[]; today: number }) {
  const byDay = WEEK.map((dayOfWeek) => ({
    dayOfWeek,
    label: hoursLabel(hours.filter((entry) => entry.dayOfWeek === dayOfWeek)),
  }));

  // Merge neighbouring days that keep the same hours, but never merge across
  // today, which always gets its own row.
  const rows: { days: number[]; label: string }[] = [];
  for (const day of byDay) {
    const last = rows[rows.length - 1];
    const canMerge =
      last !== undefined &&
      last.label === day.label &&
      day.dayOfWeek !== today &&
      !last.days.includes(today);

    if (canMerge) last.days.push(day.dayOfWeek);
    else rows.push({ days: [day.dayOfWeek], label: day.label });
  }

  return (
    <dl className="flex flex-col md:mt-2.5 md:overflow-hidden md:rounded-[14px] md:border md:border-hairline md:bg-white">
      {rows.map((row) => {
        const isToday = row.days.includes(today);
        const isClosed = row.label === "closed";
        const days =
          row.days.length === 1
            ? dayName(row.days[0])
            : `${dayName(row.days[0])} to ${dayName(row.days[row.days.length - 1])}`;

        return (
          <div
            key={days}
            className={[
              "flex items-baseline justify-between gap-4 border-b border-hairline-soft py-2.5",
              "md:border-b-0 md:border-t md:px-[18px] md:py-3 md:first:border-t-0",
              isToday
                ? "font-semibold text-kai-800 md:bg-mint-tint md:text-green-700"
                : isClosed
                  ? "text-slate md:text-slate-light"
                  : "text-slate md:text-kai-800",
            ].join(" ")}
          >
            <dt className="text-[13.5px] md:text-[14.5px]">
              {days}
              {isToday ? <span className="text-coral md:text-green-700">, today</span> : null}
            </dt>
            <dd
              className={[
                "text-[13.5px] md:font-mono md:text-[14px]",
                isToday ? "md:text-green-700" : isClosed ? "md:text-slate-light" : "md:text-slate",
              ].join(" ")}
            >
              {row.label}
            </dd>
          </div>
        );
      })}
    </dl>
  );
}
