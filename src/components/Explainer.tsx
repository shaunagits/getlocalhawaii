import { FRESHNESS_WINDOW_DAYS } from "@/lib/status";

/** The 30-day rule, stated plainly wherever results are listed. */
export function Explainer() {
  return (
    <section className="mt-8 rounded-2xl bg-sand p-4">
      <h2 className="mono-label text-slate">How we keep this current</h2>
      <p className="mt-2 text-[13.5px] leading-[1.5] text-kai-800">
        Each listing gets a call or a visit. If nobody has checked it in {FRESHNESS_WINDOW_DAYS}{" "}
        days, it drops out of &ldquo;open now&rdquo; and shows as unconfirmed.
      </p>
      <p className="mt-3 text-[13.5px] leading-[1.5] text-slate">
        Know a seller we are missing? Send us the name and we will call to confirm before it goes
        up.
      </p>
      <a
        className="mt-3 inline-block rounded-[11px] bg-kai-800 px-4 py-3 text-[14px] font-semibold text-cream"
        href="mailto:aloha@getlocalhawaii.org?subject=Add%20a%20listing"
      >
        Add a listing
      </a>
    </section>
  );
}
