import { describe, expect, it } from "vitest";

import { resolveQuery } from "./search";

/** The live category rows, as the search sees them. */
const CATEGORIES = [
  { slug: "lei", name: "Lei" },
  { slug: "fish", name: "Fish" },
  { slug: "poi", name: "Poi" },
  { slug: "produce", name: "Produce" },
  { slug: "farmers-markets", name: "Farmers markets" },
];

const LABELS = ["Pīkake", "Maile", "Ti leaf", "ʻAhi", "Poke"];

const match = (query: string) => resolveQuery(query, CATEGORIES, LABELS);

describe("resolveQuery", () => {
  it("treats an empty query as everything", () => {
    expect(match("").kind).toBe("all");
    expect(match("   ").kind).toBe("all");
  });

  it("matches a lei type ahead of the lei category it sits in", () => {
    expect(match("pikake")).toEqual({ kind: "leiType", slug: "pikake", label: "Pīkake" });
    expect(match("pikake lei").kind).toBe("leiType");
  });

  it("matches a category by slug and by a word in the phrase", () => {
    expect(match("fish")).toMatchObject({ kind: "category", slug: "fish" });
    expect(match("fresh fish near me")).toMatchObject({ kind: "category", slug: "fish" });
  });

  it("sends market phrases to the markets listing", () => {
    expect(match("farmers market").kind).toBe("markets");
    expect(match("Farmers markets").kind).toBe("markets");
    expect(match("saturday market").kind).toBe("markets");
    expect(match("farmers").kind).toBe("markets");
  });

  /**
   * The trap this ordering exists for. "kalihi fish market" is a fish keyword
   * target, so a market-first match would have sent it to the wrong page.
   */
  it("keeps fish market queries on the fish category", () => {
    expect(match("fish market")).toMatchObject({ kind: "category", slug: "fish" });
    expect(match("kalihi fish market")).toMatchObject({ kind: "category", slug: "fish" });
    expect(match("chinatown honolulu fish market")).toMatchObject({
      kind: "category",
      slug: "fish",
    });
  });

  it("falls back to a product label", () => {
    expect(match("poke")).toEqual({ kind: "product", label: "Poke" });
  });

  // Maile is both a product label and a lei type with a page written about it,
  // and the page is the better answer, so the lei type has to win.
  it("prefers the lei type over the identically named product label", () => {
    expect(match("maile")).toMatchObject({ kind: "leiType", slug: "maile" });
  });

  it("reports an unmatched term rather than returning everything", () => {
    expect(match("snowboards")).toEqual({ kind: "none", term: "snowboards" });
  });
});
