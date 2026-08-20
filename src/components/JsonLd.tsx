/**
 * Structured data. Rendered as a script tag rather than through next/script so
 * it is present in the server-rendered HTML that crawlers read.
 */
export function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      // The payload is built from our own database rows, not user input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
