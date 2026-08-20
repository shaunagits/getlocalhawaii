import Link from "next/link";

import { cn } from "@/lib/cn";

/**
 * Dark teal chrome at the top of every page: wordmark, inline nav on desktop,
 * and the clock stamp. The clock is passed in rather than read here, so the
 * whole page renders against one instant in Hawaii.
 *
 * Each page supplies its own hero as children, because the four heroes differ
 * enough that a shared set of title props would fight every one of them.
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

export function NavLink({ href, label, className }: { href: string; label: string; className?: string }) {
  const classes = cn("text-[13.5px] font-medium text-cream-muted hover:text-cream", className);
  return href.startsWith("mailto:") ? (
    <a href={href} className={classes}>
      {label}
    </a>
  ) : (
    <Link href={href} className={classes}>
      {label}
    </Link>
  );
}

export interface SiteHeaderProps {
  /** "WED AUG 19 · 9:41A", from clockLabel. */
  clock?: string;
  /** Back link shown under the wordmark on inner pages. */
  back?: { href: string; label: string };
  /** Share and save affordances, opposite the back link. */
  actions?: React.ReactNode;
  /** The page's hero. */
  children?: React.ReactNode;
  /** Widen the inner shell to the 940px desktop frame. */
  wide?: boolean;
  className?: string;
}

export function SiteHeader({ clock, back, actions, children, wide = true, className }: SiteHeaderProps) {
  return (
    <header className={cn("bg-kai-800 px-5 pt-4 pb-5 md:px-8 md:pt-[18px] md:pb-[30px]", className)}>
      <div
        className={cn(
          "mx-auto max-w-(--container-column)",
          wide && "md:max-w-(--container-shell)",
        )}
      >
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/"
            className="font-display text-[19px] leading-none font-extrabold whitespace-nowrap text-cream hover:text-cream"
          >
            GET LOCAL <span className="text-coral-light">HAWAIʻI</span>
          </Link>

          {/* Inline on desktop; on a phone the footer carries the same links. */}
          <nav className="hidden items-center gap-5 md:flex">
            {NAV_LINKS.map((link) => (
              <NavLink key={link.href} {...link} />
            ))}
          </nav>

          {clock ? <span className="mono-label text-mint md:hidden">{clock}</span> : null}
        </div>

        {back || actions ? (
          <div className="mt-4 flex items-center justify-between gap-4 md:mt-5">
            {back ? (
              <Link href={back.href} className="text-[13px] font-medium text-cream-muted hover:text-cream">
                <span aria-hidden="true">‹ </span>
                {back.label}
              </Link>
            ) : (
              <span />
            )}
            {actions}
          </div>
        ) : null}

        {children ? <div className="mt-3.5 md:mt-[26px]">{children}</div> : null}
      </div>
    </header>
  );
}
