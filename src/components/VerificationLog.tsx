import type { LogEntry } from "@/lib/queries";
import { cn } from "@/lib/cn";
import { mailto } from "@/lib/site";
import { sentenceDate } from "@/lib/time";

const METHOD_COPY: Record<string, string> = {
  source_check: "checked the vendor's posted information",
  called: "called",
  visited: "visited",
  organizer_confirmed: "organizer confirmed",
  no_answer: "called, no answer",
};

/** The proof behind the status chip: what was done, when, and what was found. */
export function VerificationLog({ entries, onDark = false }: { entries: LogEntry[]; onDark?: boolean }) {
  if (entries.length === 0) {
    return (
      <p className={cn("text-[13px]", onDark ? "text-cream-dim" : "text-slate")}>
        We have not read this listing&rsquo;s source yet.
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-2 md:gap-0">
      {entries.map((entry, index) => (
        <li
          key={index}
          className={cn(
            "text-[13px] leading-[1.45] md:text-[13.5px] md:leading-[1.7]",
            "text-slate md:text-cream-muted",
          )}
        >
          <span className="font-mono text-[12px] font-medium text-kai-800 md:font-sans md:text-[13.5px] md:font-normal md:text-cream-muted">
            {sentenceDate(entry.verifiedAt)}
          </span>
          {" · "}
          {entry.note ?? METHOD_COPY[entry.method] ?? entry.method}
        </li>
      ))}
    </ul>
  );
}

/**
 * The log as it appears in the desktop side rail: a dark card with the report
 * link under a rule. On a phone it flattens back to plain text on cream.
 */
export function VerificationPanel({
  entries,
  subject,
}: {
  entries: LogEntry[];
  subject: string;
}) {
  return (
    <section className="md:rounded-[14px] md:bg-kai-800 md:p-[18px]">
      <h2 className="mono-label text-slate md:text-[11.5px] md:text-mint">Where this came from</h2>
      <div className="mt-3 md:mt-2.5">
        <VerificationLog entries={entries} />
      </div>
      <div className="md:mt-3.5 md:border-t md:border-mint-rule md:pt-3.5">
        <a
          className="mt-3 inline-block text-[13.5px] font-medium md:mt-0 md:font-semibold md:text-coral-light"
          href={mailto(`Something wrong: ${subject}`)}
        >
          Spot something wrong? Tell us →
        </a>
      </div>
    </section>
  );
}
