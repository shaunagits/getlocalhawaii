import Link from "next/link";

import { cn } from "@/lib/cn";

/**
 * Dark teal bar at the top of every page. The clock stamp is passed in rather
 * than read here, so the whole page renders against one instant in Hawaii.
 */

/**
 * The dedicated browse, calendar and in-season pages are out of scope for the
 * first deploy, so these point at the closest page that actually exists rather
 * than at a 404.
 */
export const NAV_LINKS = [
  { href: "/oahu/lei", label: "Browse all" },
  { href: "/markets/kaimuki-neighborhood", label: "Markets calendar" },
  { href: "/oahu/produce", label: "In season" },
  { href: "mailto:aloha@getlocalhawaii.org?subject=Add%20a%20listing", label: "Add a listing" },
];

export interface SiteHeaderProps {
  /** "WED AUG 19 · 9:41A", from clockLabel. */
  clock?: string;
  /** Back link shown above the title on inner pages. */
  back?: { href: string; label: string };
  title?: string;
  subtitle?: string;
  /** Rendered above the title, for the status and verification chips. */
  eyebrow?: React.ReactNode;
  /** Filter chips or other controls under the title. */
  children?: React.ReactNode;
  className?: string;
}

export function SiteHeader({
  clock,
  back,
  title,
  subtitle,
  eyebrow,
  children,
  className,
}: SiteHeaderProps) {
  return (
    <header className={cn("bg-kai-800 px-5 pt-4 pb-5", className)}>
      <div className="mx-auto max-w-(--container-column)">
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/"
            className="font-display text-[19px] leading-none font-extrabold text-cream hover:text-cream"
          >
            GET LOCAL <span className="text-coral-light">HAWAIʻI</span>
          </Link>
          {clock ? <span className="mono-label text-mint">{clock}</span> : null}
        </div>

        {back ? (
          <Link
            href={back.href}
            className="mt-4 inline-block text-[13px] font-medium text-cream-muted hover:text-cream"
          >
            <span aria-hidden="true">‹ </span>
            {back.label}
          </Link>
        ) : null}

        {eyebrow ? <div className="mt-3.5 flex flex-wrap items-center gap-2.5">{eyebrow}</div> : null}

        {title ? (
          <h1 className="mt-3 font-display text-[28px] leading-[1.1] tracking-[-0.6px] text-cream">
            {title}
          </h1>
        ) : null}

        {subtitle ? (
          <p className="mt-1.5 text-[13px] leading-[1.45] text-cream-dim">{subtitle}</p>
        ) : null}

        {children ? <div className="mt-3.5">{children}</div> : null}
      </div>
    </header>
  );
}
