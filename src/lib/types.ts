import type { Freshness, VendorStatus } from "./status";

export type ContactMethod = "call" | "text";

/** Everything a result card needs, with status already computed. */
export interface VendorSummary {
  slug: string;
  name: string;
  categorySlug: string;
  /** One-line description shown under the name. */
  description: string | null;
  area: string;
  distanceMi: number | null;
  paymentNotes: string | null;
  phone: string | null;
  contactMethod: ContactMethod;
  /** Product labels, used by the category filter chips. */
  productLabels: string[];
  status: VendorStatus;
  freshness: Freshness;
  /** Note from today's report, which replaces the description when present. */
  reportNote?: string | null;
}

/** Digits only, so tel: and sms: links work from a formatted phone number. */
export function dialable(phone: string): string {
  return phone.replace(/[^\d+]/g, "");
}

/** Maps link. Coordinates are not seeded yet, so this searches by name and area. */
export function directionsUrl(name: string, area: string): string {
  const query = encodeURIComponent(`${name}, ${area}, Hawaii`);
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}
