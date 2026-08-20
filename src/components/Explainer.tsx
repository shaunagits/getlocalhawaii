import { mailto } from "@/lib/site";

/**
 * Where the information comes from, stated plainly wherever results are
 * listed. This site does not call vendors, so it must not imply that it does.
 */
export function Explainer() {
  return (
    <section className="mt-8 md:mt-0">
      <h2 className="mono-label text-slate md:text-[11.5px]">Where this comes from</h2>
      <p className="mt-2 text-[13.5px] leading-[1.6] text-slate">
        This directory is built from public listings. Hours, products and phone numbers come from
        each vendor&rsquo;s own posted information, and every listing shows the date we last read
        it. Where a vendor posts no hours, we leave it blank rather than guess.
      </p>

      <div className="mt-4 rounded-xl border border-hairline bg-white p-3.5">
        <p className="text-[13.5px] font-semibold text-kai-800">Spot something wrong?</p>
        <p className="mt-1 text-[13px] leading-[1.5] text-slate">
          Tell us and we will correct it. Vendors are welcome to send their own hours.
        </p>
        <a
          className="mt-3 inline-block rounded-[10px] bg-kai-800 px-4 py-2.5 text-[13.5px] font-semibold text-cream"
          href={mailto("Correction or new listing")}
        >
          Tell us
        </a>
      </div>
    </section>
  );
}
