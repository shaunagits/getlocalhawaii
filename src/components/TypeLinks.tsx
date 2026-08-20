import Link from "next/link";

import { LEI_TYPES } from "@/content/lei-types";
import { DELIVERY, GRADUATION } from "@/content/pages";
import { cn } from "@/lib/cn";

/**
 * Links to the written pages.
 *
 * Those pages carry all the original prose on the site and, until this
 * existed, nothing linked to them: they were reachable only from sitemap.xml.
 * Orphan pages get crawled but rank poorly, because internal links are how
 * both readers and crawlers judge what matters here.
 */
export function TypeLinks({
  base = "/oahu/lei",
  className,
}: {
  base?: string;
  className?: string;
}) {
  const links = [
    ...LEI_TYPES.map((type) => ({ href: `${base}/${type.slug}`, label: type.name })),
    { href: `${base}/${DELIVERY.slug}`, label: "Delivery and shipping" },
    { href: `/guides/${GRADUATION.slug}`, label: "Graduation" },
  ];

  return (
    <nav className={cn("mt-6", className)} aria-label="Browse by flower">
      <h2 className="mono-label text-slate">Browse by flower</h2>
      <ul className="mt-2.5 flex flex-wrap gap-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="inline-block rounded-full border border-hairline bg-white px-3.5 py-2 text-[13px] font-medium text-kai-800 hover:border-coral hover:text-coral"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
