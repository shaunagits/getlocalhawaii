import type { LogEntry } from "@/lib/queries";
import { sentenceDate } from "@/lib/time";

const METHOD_COPY: Record<string, string> = {
  called: "called",
  visited: "visited",
  organizer_confirmed: "organizer confirmed",
  no_answer: "called, no answer",
};

/** The proof behind the status chip: what was done, when, and what was found. */
export function VerificationLog({ entries }: { entries: LogEntry[] }) {
  if (entries.length === 0) {
    return <p className="text-[13px] text-slate">Nobody has checked this listing yet.</p>;
  }

  return (
    <ul className="flex flex-col gap-2">
      {entries.map((entry, index) => (
        <li key={index} className="text-[13px] leading-[1.45] text-slate">
          <span className="font-mono text-[12px] font-medium text-kai-800">
            {sentenceDate(entry.verifiedAt)}
          </span>
          {" · "}
          {entry.note ?? METHOD_COPY[entry.method] ?? entry.method}
        </li>
      ))}
    </ul>
  );
}
