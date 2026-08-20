/** Canonical origin. Every absolute URL on the site is built from this. */
export const SITE_URL = "https://getlocalhawaii.com";

export const SITE_NAME = "Get Local Hawaiʻi";

/** Where corrections and new listings go. */
export const CONTACT_EMAIL = "aloha@getlocalhawaii.com";

export function mailto(subject: string): string {
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}`;
}

/** Absolute URL for a canonical tag or a sitemap entry. */
export function absoluteUrl(path: string): string {
  return new URL(path, SITE_URL).toString();
}
