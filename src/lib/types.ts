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
  /** True where a source says the vendor ships lei to the mainland. */
  shipsMainland: boolean | null;
  /** Product labels, used by the category filter chips and the type pages. */
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

/** Maps link. Most listings have no coordinates, so this searches by name and area. */
export function directionsUrl(name: string, area: string): string {
  const query = encodeURIComponent(`${name}, ${area}, Hawaii`);
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}

/**
 * Maps link that uses real coordinates when the source gave them.
 *
 * The City pins each People's Open Market site on its own schedule page, so
 * those listings can point at the pin rather than at a name search, which for
 * a market inside a large park lands people in the wrong corner of it.
 */
export function mapUrl(place: {
  name: string;
  area: string;
  lat: number | null;
  lng: number | null;
}): string {
  if (place.lat === null || place.lng === null) return directionsUrl(place.name, place.area);
  return `https://www.google.com/maps/search/?api=1&query=${place.lat},${place.lng}`;
}
