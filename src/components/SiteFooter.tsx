import Link from "next/link";

import { NAV_LINKS } from "@/components/SiteHeader";
import { cn } from "@/lib/cn";

/** Bottom nav. On a phone this is the only nav, so it carries every link. */
export function SiteFooter({ className }: { className?: string }) {
  return (
    <footer className={cn("mt-10 bg-kai-900 px-5 py-6", className)}>
      <nav className="mx-auto flex max-w-(--container-column) flex-wrap gap-x-5 gap-y-2.5">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-[13.5px] font-medium text-cream-muted hover:text-cream"
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <p className="mx-auto mt-4 max-w-(--container-column) text-[12px] leading-[1.5] text-cream-dim">
        Every listing gets a call or a visit. If nobody has checked it in 30 days, it drops out of
        &ldquo;open now&rdquo; and shows as unconfirmed.
      </p>
    </footer>
  );
}
