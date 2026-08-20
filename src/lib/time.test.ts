import { describe, expect, it } from "vitest";

import {
  dayName,
  hawaiiInstant,
  icsStamp,
  duration,
  hawaiiClock,
  hawaiiDate,
  hawaiiDaysBetween,
  isSameHawaiiDay,
  longTime,
  minutesFromTime,
  relativeAgo,
  sentenceDate,
  shortDate,
  shortTime,
} from "./time";

/** An instant given as Hawaii wall-clock time. Hawaii is UTC-10 year round. */
const hst = (iso: string) => new Date(`${iso}:00-10:00`);

describe("hawaiiClock", () => {
  it("reads an instant as Hawaii wall-clock time", () => {
    const clock = hawaiiClock(hst("2026-08-19T09:41"));
    expect(clock.date).toBe("2026-08-19");
    expect(clock.dayOfWeek).toBe(3); // Wednesday
    expect(clock.minutes).toBe(9 * 60 + 41);
  });

  it("stays on the Hawaii day when UTC has already rolled over", () => {
    // 11:30p in Hawaii is the next morning in UTC.
    const late = hst("2026-08-19T23:30");
    expect(late.toISOString().startsWith("2026-08-20")).toBe(true);
    expect(hawaiiDate(late)).toBe("2026-08-19");
    expect(isSameHawaiiDay(late, hst("2026-08-19T06:00"))).toBe(true);
  });

  it("reports midnight as minute zero, not 1440", () => {
    expect(hawaiiClock(hst("2026-08-19T00:00")).minutes).toBe(0);
  });
});

describe("hawaiiDaysBetween", () => {
  it("counts calendar days, not elapsed hours", () => {
    // Under two hours apart, but two different Hawaii days.
    expect(hawaiiDaysBetween(hst("2026-08-18T23:30"), hst("2026-08-19T01:00"))).toBe(1);
    expect(hawaiiDaysBetween(hst("2026-07-20T08:00"), hst("2026-08-19T09:41"))).toBe(30);
  });
});

describe("time labels", () => {
  it("drops :00 from chip times", () => {
    expect(shortTime(minutesFromTime("14:00"))).toBe("2P");
    expect(shortTime(minutesFromTime("06:30"))).toBe("6:30A");
    expect(shortTime(minutesFromTime("12:00"))).toBe("12P");
    expect(shortTime(minutesFromTime("00:00"))).toBe("12A");
  });

  it("wraps times that ran past midnight", () => {
    expect(shortTime(1440 + 60)).toBe("1A");
  });

  it("keeps :00 in the hours table", () => {
    expect(longTime("07:00")).toBe("7:00a");
    expect(longTime("12:00")).toBe("12:00p");
    expect(longTime("18:30")).toBe("6:30p");
  });

  it("adds the year to a date from an earlier year", () => {
    const now = hst("2026-08-19T09:41");
    expect(sentenceDate(hst("2026-01-25T09:00"), now)).toBe("Jan 25");
    expect(sentenceDate(hst("2021-01-25T09:00"), now)).toBe("Jan 25 2021");
  });

  it("formats dates and weekdays for mono labels", () => {
    expect(shortDate(hst("2026-08-12T16:10"))).toBe("AUG 12");
    expect(dayName(6)).toBe("Sat");
  });
});

describe("hawaiiInstant", () => {
  it("resolves a Hawaii wall-clock date and time to the right instant", () => {
    expect(hawaiiInstant("2026-08-19", "06:30").toISOString()).toBe("2026-08-19T16:30:00.000Z");
    expect(hawaiiInstant("2026-08-19", "06:30:00").toISOString()).toBe("2026-08-19T16:30:00.000Z");
  });

  it("round-trips back to the same Hawaii wall clock", () => {
    const instant = hawaiiInstant("2026-08-19", "23:30");
    const clock = hawaiiClock(instant);
    expect(clock.date).toBe("2026-08-19");
    expect(clock.minutes).toBe(23 * 60 + 30);
  });

  it("handles a time that lands on the previous UTC day", () => {
    // Midnight in Hawaii is 10:00 UTC the same morning.
    expect(hawaiiInstant("2026-08-19", "00:00").toISOString()).toBe("2026-08-19T10:00:00.000Z");
  });

  it("formats a calendar stamp", () => {
    expect(icsStamp(hawaiiInstant("2026-08-19", "06:30"))).toBe("20260819T163000Z");
  });
});

describe("duration and relativeAgo", () => {
  it("formats countdowns", () => {
    expect(duration(79)).toBe("1H 19M");
    expect(duration(19)).toBe("19M");
    expect(duration(120)).toBe("2H");
    expect(duration(-5)).toBe("0M");
  });

  it("formats report ages", () => {
    const now = hst("2026-08-19T09:41");
    expect(relativeAgo(hst("2026-08-19T08:41"), now)).toBe("1H AGO");
    expect(relativeAgo(hst("2026-08-19T08:56"), now)).toBe("45M AGO");
    expect(relativeAgo(hst("2026-08-16T09:41"), now)).toBe("3D AGO");
    // Just now still reads as a minute, never "0M AGO".
    expect(relativeAgo(hst("2026-08-19T09:41"), now)).toBe("1M AGO");
  });
});
