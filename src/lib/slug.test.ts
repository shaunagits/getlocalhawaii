import { describe, expect, it } from "vitest";

import { asciiSlug } from "./slug";

describe("asciiSlug", () => {
  it("strips kahakō so a label matches its URL spelling", () => {
    expect(asciiSlug("Pīkake")).toBe("pikake");
    expect(asciiSlug("Lūʻau leaf")).toBe("luau-leaf");
  });

  it("strips the ʻokina rather than turning it into a separator", () => {
    expect(asciiSlug("ʻAhi")).toBe("ahi");
    expect(asciiSlug("Oʻahu")).toBe("oahu");
  });

  it("handles apostrophes and punctuation in shop names", () => {
    expect(asciiSlug("Cindy's Lei Shoppe")).toBe("cindys-lei-shoppe");
    expect(asciiSlug("Nita's Leis & Flower Shoppe")).toBe("nitas-leis-flower-shoppe");
  });

  it("leaves an already-ascii slug alone", () => {
    expect(asciiSlug("puakenikeni")).toBe("puakenikeni");
  });
});
