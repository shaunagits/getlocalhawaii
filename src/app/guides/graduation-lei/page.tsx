import type { Metadata } from "next";

import { ListingPage } from "@/components/ListingPage";
import { GRADUATION } from "@/content/pages";
import { getCategoryListing } from "@/lib/queries";

export const dynamic = "force-dynamic";

const PATH = "/guides/graduation-lei";

export const metadata: Metadata = {
  title: GRADUATION.title,
  description: GRADUATION.description,
  alternates: { canonical: PATH },
  openGraph: {
    title: GRADUATION.title,
    description: GRADUATION.description,
    url: PATH,
  },
};

export default async function GraduationGuide() {
  const now = new Date();
  const listing = await getCategoryListing("oahu", "lei", now);

  return (
    <ListingPage
      heading={GRADUATION.heading}
      intro={GRADUATION.intro}
      body={GRADUATION.body}
      vendors={listing?.vendors ?? []}
      now={now}
      path={PATH}
      back={{ href: "/oahu/lei", label: "All lei" }}
      breadcrumbs={[
        { name: "Home", path: "/" },
        { name: "Guides", path: "/guides/graduation-lei" },
        { name: GRADUATION.heading, path: PATH },
      ]}
      emptyMessage="No lei shops are listed yet."
    />
  );
}
