import { createFileRoute } from "@tanstack/react-router";
import { ShieldOff, Target, Scale } from "lucide-react";
import { SiteLayout } from "@/components/campsolver/SiteLayout";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About CampSolver — Mission & Privacy Commitments" },
      {
        name: "description",
        content:
          "CampSolver's mission, how campus issues stay accountable after they are reported, and exactly which personal details are never published.",
      },
      { property: "og:title", content: "About CampSolver — Mission & Privacy Commitments" },
      {
        property: "og:description",
        content:
          "Learn how CampSolver keeps campus issue resolution accountable while never publishing reporter identity, exact GPS or internal comments.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AboutPage,
});

const neverPublished = [
  "Student name",
  "Student email address",
  "Student phone number",
  "Exact GPS location of a report",
  "Internal staff or department comments",
];

function AboutPage() {
  return (
    <SiteLayout>
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
        <h1 className="font-display text-4xl font-bold">About CampSolver</h1>
        <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
          CampSolver connects the people who notice campus problems with the departments who can fix
          them — and keeps the record of that work public. Anyone can read this site: prospective
          students, parents, staff, and student bodies, without an account.
        </p>

        <section className="mt-12">
          <h2 className="inline-flex items-center gap-2 font-display text-2xl font-bold">
            <Target aria-hidden="true" className="size-6 text-primary" />
            Our mission
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Make campus maintenance and safety issues impossible to ignore. When a broken light,
            flooded corridor or unsafe walkway is reported, it should be traceable from report to
            repair — with dates the community can check.
          </p>
        </section>

        <section className="mt-12">
          <h2 className="inline-flex items-center gap-2 font-display text-2xl font-bold">
            <Scale aria-hidden="true" className="size-6 text-primary" />
            How issues stay accountable
          </h2>
          <ul className="mt-4 space-y-3 text-muted-foreground">
            <li className="card-elevated p-4">
              <strong className="text-foreground">Every approved issue is timestamped.</strong> The
              reported date and last updated date are both public, so stalled work is visible.
            </li>
            <li className="card-elevated p-4">
              <strong className="text-foreground">Status changes are published.</strong> Reviewed,
              assigned, in progress and resolved states appear here as they happen.
            </li>
            <li className="card-elevated p-4">
              <strong className="text-foreground">Resolutions require evidence.</strong> Campus
              improvements are shown with before and after context, not just a "closed" label.
            </li>
            <li className="card-elevated p-4">
              <strong className="text-foreground">Aggregate performance is open.</strong> Resolution
              rate and average resolution time are published for the whole campus.
            </li>
          </ul>
        </section>

        <section className="mt-12 rounded-xl border border-primary/25 bg-secondary p-6">
          <h2 className="inline-flex items-center gap-2 font-display text-2xl font-bold">
            <ShieldOff aria-hidden="true" className="size-6 text-primary" />
            Privacy statement
          </h2>
          <p className="mt-4 text-secondary-foreground">
            Transparency applies to the issue, never to the person who reported it. The following are{" "}
            <strong>never published</strong> on this website:
          </p>
          <ul className="mt-4 space-y-2">
            {neverPublished.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-secondary-foreground">
                <span
                  aria-hidden="true"
                  className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-high text-xs font-bold text-high-foreground"
                >
                  ✕
                </span>
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-secondary-foreground">
            Locations are shown only as a general campus area (for example "Central Library, Block
            B"). Images appear publicly only after they have been approved for publication.
          </p>
        </section>
      </div>
    </SiteLayout>
  );
}
