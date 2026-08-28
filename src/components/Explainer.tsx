import { mailto } from "@/lib/site";

/**
 * Where the information comes from, stated plainly wherever results are
 * listed. This site does not call vendors, so it must not imply that it does.
 *
 * Two variants, because markets do not have vendors' problems. A market has an
 * operator publishing one weekly schedule, not a shop posting its own hours
 * and phone number, and the vendor wording read as boilerplate on a page where
 * none of it was true.
 */
export interface ExplainerProps {
  variant?: "vendors" | "markets";
}

export function Explainer({ variant = "vendors" }: ExplainerProps) {
  const isMarkets = variant === "markets";

  return (
    <section className="mt-8 md:mt-0">
      <h2 className="mono-label text-slate md:text-[11.5px]">Where this comes from</h2>
      <p className="mt-2 text-[13.5px] leading-[1.6] text-slate">
        {isMarkets ? (
          <>
            Every market here is read from its operator&rsquo;s own published schedule, and each
            listing shows the date we last read it. We have not called or visited, so the days and
            times are theirs. Where an operator publishes no address, we leave it blank rather than
            guess.
          </>
        ) : (
          <>
            This directory is built from public listings. Hours, products and phone numbers come
            from each vendor&rsquo;s own posted information, and every listing shows the date we
            last read it. Where a vendor posts no hours, we leave it blank rather than guess.
          </>
        )}
      </p>

      <div className="mt-4 rounded-xl border border-hairline bg-white p-3.5">
        <p className="text-[13.5px] font-semibold text-kai-800">Spot something wrong?</p>
        <p className="mt-1 text-[13px] leading-[1.5] text-slate">
          {isMarkets
            ? "Tell us and we will correct it. Schedules change and the official pages do not always keep up."
            : "Tell us and we will correct it. Vendors are welcome to send their own hours."}
        </p>
        <a
          className="mt-3 inline-block rounded-[10px] bg-kai-800 px-4 py-2.5 text-[13.5px] font-semibold text-cream"
          href={mailto(isMarkets ? "Market correction" : "Correction or new listing")}
        >
          Tell us
        </a>
      </div>
    </section>
  );
}
