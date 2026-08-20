import { NAV_LINKS, NavLink } from "@/components/SiteHeader";
import { cn } from "@/lib/cn";
import { FRESHNESS_WINDOW_DAYS } from "@/lib/status";

/**
 * Phone-only nav. On desktop the same links sit inline in the header, so the
 * stacked footer would just repeat them.
 */
export function SiteFooter({ className }: { className?: string }) {
  return (
    <footer className={cn("mt-10 bg-kai-900 px-5 py-6 md:hidden", className)}>
      <nav className="mx-auto flex max-w-(--container-column) flex-wrap gap-x-5 gap-y-2.5">
        {NAV_LINKS.map((link) => (
          <NavLink key={link.href} {...link} />
        ))}
      </nav>
      <p className="mx-auto mt-4 max-w-(--container-column) text-[12px] leading-[1.5] text-cream-dim">
        Every listing gets a call or a visit. If nobody has checked it in{" "}
        {FRESHNESS_WINDOW_DAYS} days, it drops out of &ldquo;open now&rdquo; and shows as
        unconfirmed.
      </p>
    </footer>
  );
}
