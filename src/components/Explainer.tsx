import { mailto } from "@/lib/site";

/** The 30-day rule, stated plainly wherever results are listed. */
export function Explainer() {
  return (
    <section className="mt-8 md:mt-0">
      <h2 className="mono-label text-slate md:text-[11.5px]">How we keep this current</h2>
      <p className="mt-2 text-[13.5px] leading-[1.6] text-slate">
        Each listing gets a call or a visit. If nobody has checked it in {FRESHNESS_WINDOW_DAYS}{" "}
        days, it drops out of &ldquo;open now&rdquo; and shows as unconfirmed.
      </p>

      <div className="mt-4 rounded-xl border border-hairline bg-white p-3.5">
        <p className="text-[13.5px] font-semibold text-kai-800">Know a seller we are missing?</p>
        <p className="mt-1 text-[13px] leading-[1.5] text-slate">
          Send us the name and we will call to confirm before it goes up.
        </p>
        <a
          className="mt-3 inline-block rounded-[10px] bg-kai-800 px-4 py-2.5 text-[13.5px] font-semibold text-cream"
          href={mailto("Add a listing")}
        >
          Add a listing
        </a>
      </div>
    </section>
  );
}
