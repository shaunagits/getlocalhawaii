/**
 * Diacritical-free key for matching and for URLs.
 *
 * Slugs and meta titles use ASCII spellings (pikake, puakenikeni) because that
 * is how people search, while page copy keeps the ʻokina and kahakō. This is
 * the one place the two forms meet, so "Pīkake" in the database still matches
 * /oahu/lei/pikake in the URL.
 */
export function asciiSlug(value: string): string {
  return asciiText(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * The same stripping, but keeping words and case: "Oʻahu" becomes "Oahu".
 *
 * For meta titles, which follow the same ASCII rule as slugs because that is
 * how the phrase gets typed into a search box, while the page copy underneath
 * keeps the ʻokina and kahakō.
 */
export function asciiText(value: string): string {
  return (
    value
      .normalize("NFD")
      // Strip combining marks, then the ʻokina and the straight-quote stand-ins.
      .replace(/[̀-ͯ]/g, "")
      .replace(/[ʻʼ‘’']/g, "")
  );
}
