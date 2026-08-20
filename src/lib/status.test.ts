import { describe, expect, it } from "vitest";

import {
  type OpeningHours,
  type VerificationEvent,
  byStatusThenDistance,
  getFreshness,
  getMarketStatus,
  getStatus,
  nextMarketDates,
} from "./status";

/** An instant given as Hawaii wall-clock time. Hawaii is UTC-10 year round. */
const hst = (iso: string) => new Date(`${iso}:00-10:00`);

/** Wednesday, 9:41a in Hawaii, matching the mockups. */
const NOW = hst("2026-08-19T09:41");

const verifiedToday: VerificationEvent[] = [
  { verifiedAt: hst("2026-08-19T08:10"), method: "called", note: "hours confirmed" },
];

// Nāpua Lei Stand: Mon-Fri 7a-2p, Sat 6a-12p, closed Sun.
const napuaHours: OpeningHours[] = [
  { dayOfWeek: 1, opens: "07:00", closes: "14:00" },
  { dayOfWeek: 2, opens: "07:00", closes: "14:00" },
  { dayOfWeek: 3, opens: "07:00", closes: "14:00" },
  { dayOfWeek: 4, opens: "07:00", closes: "14:00" },
  { dayOfWeek: 5, opens: "07:00", closes: "14:00" },
  { dayOfWeek: 6, opens: "06:00", closes: "12:00" },
];

// Aunty D's Lei Table: Wed, Sat and Sun afternoons.
const auntyDsHours: OpeningHours[] = [
  { dayOfWeek: 3, opens: "15:00", closes: "20:00" },
  { dayOfWeek: 6, opens: "15:00", closes: "20:00" },
  { dayOfWeek: 0, opens: "15:00", closes: "20:00" },
];

describe("getFreshness", () => {
  it("reads a check from earlier today as verified today, with the time", () => {
    const freshness = getFreshness(verifiedToday, NOW);
    expect(freshness.kind).toBe("today");
    expect(freshness.label).toBe("VERIFIED TODAY 8:10A");
    expect(freshness.shortLabel).toBe("VERIFIED TODAY");
    expect(freshness.isFresh).toBe(true);
  });

  it("dates an older check", () => {
    const freshness = getFreshness(
      [{ verifiedAt: hst("2026-08-12T16:10"), method: "visited" }],
      NOW,
    );
    expect(freshness.label).toBe("VERIFIED AUG 12");
    expect(freshness.daysAgo).toBe(7);
    expect(freshness.isFresh).toBe(true);
  });

  it("uses only the newest event in the log", () => {
    const freshness = getFreshness(
      [
        { verifiedAt: hst("2026-07-27T08:45"), method: "visited" },
        { verifiedAt: hst("2026-08-12T16:10"), method: "visited" },
        { verifiedAt: hst("2026-08-03T10:05"), method: "no_answer" },
      ],
      NOW,
    );
    expect(freshness.label).toBe("VERIFIED AUG 12");
  });

  it("holds at exactly 30 days and drops on day 31", () => {
    const thirty = getFreshness([{ verifiedAt: hst("2026-07-20T08:00"), method: "called" }], NOW);
    expect(thirty.daysAgo).toBe(30);
    expect(thirty.isFresh).toBe(true);

    const thirtyOne = getFreshness([{ verifiedAt: hst("2026-07-19T08:00"), method: "called" }], NOW);
    expect(thirtyOne.daysAgo).toBe(31);
    expect(thirtyOne.isFresh).toBe(false);
    expect(thirtyOne.label).toBe("UNCONFIRMED");
  });

  it("treats a listing that was never checked as unconfirmed", () => {
    expect(getFreshness([], NOW).kind).toBe("never");
  });
});

describe("getStatus", () => {
  it("reports open with the closing time", () => {
    const status = getStatus({ hours: napuaHours, verifications: verifiedToday }, NOW);
    expect(status.kind).toBe("open");
    expect(status.label).toBe("OPEN · CLOSES 2P");
    expect(status.closesAt).toBe("2P");
    expect(status.isOpenNow).toBe(true);
  });

  it("reports a later opening today", () => {
    const status = getStatus({ hours: auntyDsHours, verifications: verifiedToday }, NOW);
    expect(status.kind).toBe("opens_later");
    expect(status.label).toBe("OPENS 3P");
    expect(status.isOpenNow).toBe(false);
  });

  it("closes at the closing minute, not after it", () => {
    const atClose = getStatus({ hours: napuaHours, verifications: verifiedToday }, hst("2026-08-19T14:00"));
    expect(atClose.kind).toBe("closed");

    const justBefore = getStatus({ hours: napuaHours, verifications: verifiedToday }, hst("2026-08-19T13:59"));
    expect(justBefore.kind).toBe("open");
  });

  it("points at the next open day once today is over", () => {
    // Sunday, when Nāpua is closed all day.
    const status = getStatus(
      {
        hours: napuaHours,
        verifications: [{ verifiedAt: hst("2026-08-23T08:00"), method: "called" }],
      },
      hst("2026-08-23T10:00"),
    );
    expect(status.kind).toBe("closed");
    expect(status.label).toBe("CLOSED · OPENS MON 7A");
  });

  it("keeps a stall open through a session that runs past midnight", () => {
    const nightHours: OpeningHours[] = [{ dayOfWeek: 3, opens: "18:00", closes: "01:00" }];
    const verifications: VerificationEvent[] = [
      { verifiedAt: hst("2026-08-19T17:00"), method: "visited" },
    ];
    // 12:30a Thursday, inside Wednesday's 6p-1a session.
    const status = getStatus({ hours: nightHours, verifications }, hst("2026-08-20T00:30"));
    expect(status.kind).toBe("open");
    expect(status.closesAt).toBe("1A");
  });

  it("lets a same-day sold-out report override the hours", () => {
    const status = getStatus(
      {
        hours: napuaHours,
        verifications: verifiedToday,
        reports: [
          {
            kind: "sold_out",
            reportedAt: hst("2026-08-19T08:41"),
            note: "Back tomorrow 7a, preorder by text",
          },
        ],
      },
      NOW,
    );
    expect(status.kind).toBe("sold_out");
    expect(status.label).toBe("SOLD OUT TODAY");
    expect(status.note).toBe("REPORTED 1H AGO");
    expect(status.isOpenNow).toBe(false);
  });

  it("ignores a report filed on an earlier day", () => {
    const status = getStatus(
      {
        hours: napuaHours,
        verifications: verifiedToday,
        reports: [{ kind: "sold_out", reportedAt: hst("2026-08-18T08:41") }],
      },
      NOW,
    );
    expect(status.kind).toBe("open");
  });

  it("drops out of open now once the 30-day window lapses", () => {
    const status = getStatus(
      {
        hours: napuaHours,
        verifications: [{ verifiedAt: hst("2026-07-01T08:00"), method: "called" }],
      },
      NOW,
    );
    expect(status.kind).toBe("unconfirmed");
    expect(status.isOpenNow).toBe(false);
  });

  it("lets a same-day report outrank a lapsed verification", () => {
    const input = {
      hours: napuaHours,
      verifications: [{ verifiedAt: hst("2026-07-01T08:00"), method: "called" as const }],
      reports: [{ kind: "sold_out" as const, reportedAt: hst("2026-08-19T08:41") }],
    };

    // Somebody stood there today, which beats hours nobody has checked since July.
    const status = getStatus(input, NOW);
    expect(status.kind).toBe("sold_out");
    expect(status.note).toBe("REPORTED 1H AGO");
    expect(status.isOpenNow).toBe(false);

    // Staleness does not vanish, it moves to the verification chip.
    expect(getFreshness(input.verifications, NOW).isFresh).toBe(false);
    expect(getFreshness(input.verifications, NOW).label).toBe("UNCONFIRMED");
  });

  it("still reads as unconfirmed when a lapsed listing has no report", () => {
    const status = getStatus(
      {
        hours: napuaHours,
        verifications: [{ verifiedAt: hst("2026-07-01T08:00"), method: "called" }],
      },
      NOW,
    );
    expect(status.kind).toBe("unconfirmed");
  });
});

describe("getMarketStatus", () => {
  // Kaimukī Neighborhood Market: Mon and Wed 6:30a-11a, Sat 6a-12p.
  const sessions = [
    { dayOfWeek: 1, starts: "06:30", ends: "11:00" },
    { dayOfWeek: 3, starts: "06:30", ends: "11:00" },
    { dayOfWeek: 6, starts: "06:00", ends: "12:00" },
  ];
  const verifications: VerificationEvent[] = [
    { verifiedAt: hst("2026-08-19T07:02"), method: "visited" },
  ];

  it("counts down the minutes left in today's session", () => {
    const status = getMarketStatus({ sessions, verifications }, NOW);
    expect(status.kind).toBe("on_now");
    expect(status.minutesLeft).toBe(79);
    expect(status.label).toBe("ON NOW · 1H 19M LEFT");
    expect(status.isOnNow).toBe(true);
  });

  it("shows the opening time before the market starts", () => {
    const status = getMarketStatus(
      // Checked yesterday, since today's 7:02a walk-through has not happened at 5a.
      { sessions, verifications: [{ verifiedAt: hst("2026-08-17T07:02"), method: "visited" }] },
      hst("2026-08-19T05:00"),
    );
    expect(status.kind).toBe("starts_later");
    expect(status.label).toBe("OPENS 6:30A");
  });

  it("points at the next market day once today's session ends", () => {
    const status = getMarketStatus({ sessions, verifications }, hst("2026-08-19T12:00"));
    expect(status.kind).toBe("closed");
    expect(status.label).toBe("CLOSED · SAT 6A");
  });

  it("lists the next dates, today first while it is still running", () => {
    const dates = nextMarketDates(sessions, NOW);
    expect(dates.map((d) => d.label)).toEqual([
      "Today, Wed Aug 19",
      "Sat Aug 22",
      "Mon Aug 24",
    ]);
    expect(dates[0].isToday).toBe(true);
  });

  it("drops today from the next dates once its session has ended", () => {
    const dates = nextMarketDates(sessions, hst("2026-08-19T12:00"));
    expect(dates[0].label).toBe("Sat Aug 22");
  });
});

describe("byStatusThenDistance", () => {
  it("sorts open first, then by distance", () => {
    const listings = [
      { name: "far open", distanceMi: 8.2, status: getStatus({ hours: napuaHours, verifications: verifiedToday }, NOW) },
      { name: "opens later", distanceMi: 0.4, status: getStatus({ hours: auntyDsHours, verifications: verifiedToday }, NOW) },
      { name: "near open", distanceMi: 1.2, status: getStatus({ hours: napuaHours, verifications: verifiedToday }, NOW) },
      { name: "unconfirmed", distanceMi: 0.1, status: getStatus({ hours: napuaHours, verifications: [] }, NOW) },
    ];

    expect([...listings].sort(byStatusThenDistance).map((l) => l.name)).toEqual([
      "near open",
      "far open",
      "opens later",
      "unconfirmed",
    ]);
  });
});
