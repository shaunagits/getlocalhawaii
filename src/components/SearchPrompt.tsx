import { cn } from "@/lib/cn";

/**
 * The hero sentence, as a form.
 *
 * The design draws the query as prose with the variable words underlined in
 * coral, so the controls are styled to be those words rather than dropped in
 * beside them. Plain GET form, no client JavaScript: the whole site is server
 * rendered and a search box is not a good reason to change that.
 *
 * All three terms are live. The third replaces the mockup's "this afternoon",
 * which described a filter that never existed; open-now is real and already
 * computed, so the slot now does what it looks like it does.
 */

// px-0 matters: a select carries browser padding that makes the underline run
// wider than the word and pushes the closing period away from it.
const TERM =
  "border-b-2 border-coral-light bg-transparent px-0 py-0 align-baseline " +
  "text-coral-light outline-none focus-visible:border-cream focus-visible:text-cream " +
  "md:border-b-[3px]";

export interface SearchPromptProps {
  subject: string;
  near?: string;
  when?: string;
  areas: { slug: string; name: string; count: number }[];
  /** Categories and product labels offered as typing suggestions. */
  subjects: string[];
}

export function SearchPrompt({ subject, near, when, areas, subjects }: SearchPromptProps) {
  return (
    <form action="/" method="get" className="md:mx-auto md:max-w-[760px] md:text-center">
      <p className="font-display text-[30px] leading-[1.35] tracking-[-0.8px] text-cream md:text-[46px] md:leading-[1.4] md:tracking-[-1.2px] md:text-balance">
        I need{" "}
        <input
          type="text"
          name="q"
          defaultValue={subject}
          list="search-subjects"
          aria-label="What are you looking for"
          placeholder="lei"
          autoComplete="off"
          // Sized to its content so the sentence stays a sentence. size counts
          // average characters, and this display face is wider than average, so
          // it needs headroom or a long word renders clipped.
          size={Math.max((subject.length || 3) + 2, 5)}
          className={cn(TERM, "w-auto max-w-full font-display placeholder:text-coral-light/60")}
        />
        <datalist id="search-subjects">
          {subjects.map((value) => (
            <option key={value} value={value} />
          ))}
        </datalist>{" "}
        near{" "}
        <select
          name="near"
          defaultValue={near ?? ""}
          aria-label="Where"
          className={cn(TERM, "appearance-none font-display")}
        >
          <option value="" className="text-kai-800">
            Oʻahu
          </option>
          {areas.map((area) => (
            <option key={area.slug} value={area.slug} className="text-kai-800">
              {area.name}
            </option>
          ))}
        </select>{" "}
        <select
          name="when"
          defaultValue={when ?? ""}
          aria-label="When"
          className={cn(TERM, "appearance-none font-display")}
        >
          <option value="" className="text-kai-800">
            any time
          </option>
          <option value="open" className="text-kai-800">
            open now
          </option>
        </select>
        <span aria-hidden="true">.</span>
      </p>

      <button
        type="submit"
        className="mt-4 rounded-full bg-coral-light px-5 py-2.5 text-[13px] font-semibold text-coral-ink md:mt-[26px]"
      >
        Find it
      </button>
    </form>
  );
}
