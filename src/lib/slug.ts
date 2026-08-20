/**
 * Diacritical-free key for matching and for URLs.
 *
 * Slugs and meta titles use ASCII spellings (pikake, puakenikeni) because that
 * is how people search, while page copy keeps the ʻokina and kahakō. This is
 * the one place the two forms meet, so "Pīkake" in the database still matches
 * /oahu/lei/pikake in the URL.
 */
export function asciiSlug(value: string): string {
  return value
    .normalize("NFD")
    // Strip combining marks, then the ʻokina and the straight-quote stand-ins.
    .replace(/[̀-ͯ]/g, "")
    .replace(/[ʻʼ‘’']/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
