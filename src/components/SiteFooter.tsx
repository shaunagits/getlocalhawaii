import { NAV_LINKS, NavLink } from "@/components/SiteHeader";
import { cn } from "@/lib/cn";
import { mailto } from "@/lib/site";

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
        Built from public listings. Hours and products come from each vendor&rsquo;s own posted
        information, and each listing shows when we last read it.{" "}
        <a href={mailto("Correction")} className="font-medium text-coral-light">
          Spot something wrong? Tell us
        </a>
        .
      </p>
    </footer>
  );
}
