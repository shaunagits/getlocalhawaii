import type { OpeningHours } from "@/lib/status";
import { dayName, longTime, minutesFromTime } from "@/lib/time";

/**
 * The week at a glance, with today on its own row so it is never buried in a
 * range. Days are ordered Monday first, matching the mockups.
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
    <dl className="flex flex-col">
      {rows.map((row) => {
        const isToday = row.days.includes(today);
        const days =
          row.days.length === 1
            ? dayName(row.days[0])
            : `${dayName(row.days[0])} to ${dayName(row.days[row.days.length - 1])}`;

        return (
          <div
            key={days}
            className={`flex items-baseline justify-between gap-4 border-b border-hairline-soft py-2.5 ${
              isToday ? "font-semibold text-kai-800" : "text-slate"
            }`}
          >
            <dt className="text-[13.5px]">
              {days}
              {isToday ? <span className="text-coral">, today</span> : null}
            </dt>
            <dd className="text-[13.5px]">{row.label}</dd>
          </div>
        );
      })}
    </dl>
  );
}
