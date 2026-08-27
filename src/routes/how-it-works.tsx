import { createFileRoute, Link } from "@tanstack/react-router";
import { ClipboardList, UserCheck, Wrench, Globe2, ArrowRight } from "lucide-react";
import { SiteLayout } from "@/components/campsolver/SiteLayout";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: "How CampSolver Works — From Report to Public Resolution" },
      {
        name: "description",
        content:
          "Four steps: a student reports a campus issue, an admin reviews it, the responsible department resolves it, and the public dashboard reflects the approved status.",
      },
      { property: "og:title", content: "How CampSolver Works — From Report to Public Resolution" },
      {
        property: "og:description",
        content:
          "See the CampSolver workflow: student report, admin review, department resolution, and public publication of approved statuses.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HowItWorksPage,
});

const steps = [
  {
    Icon: ClipboardList,
    title: "A student reports the issue",
    body: "A campus member submits the problem with a description, category, priority and a general location. Contact details are collected privately for follow-up only.",
  },
  {
    Icon: UserCheck,
    title: "An admin reviews it",
    body: "Administrators verify the report, remove anything that shouldn't be public, and decide whether the issue is published on this site.",
  },
  {
    Icon: Wrench,
    title: "A department resolves it",
    body: "The issue is assigned to the responsible department. Their progress updates move it through assigned, in progress and resolved states.",
  },
  {
    Icon: Globe2,
    title: "The public dashboard updates",
    body: "Only approved statuses reach this site — updating live, so the public record matches the real state of the work.",
  },
];

function HowItWorksPage() {
  return (
    <SiteLayout>
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <h1 className="font-display text-4xl font-bold">How CampSolver works</h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
          Four stages, each one visible to the campus community once approved.
        </p>

        <ol className="mt-12 space-y-6">
          {steps.map(({ Icon, title, body }, index) => (
            <li key={title} className="card-elevated relative flex gap-5 p-6">
              <div className="flex flex-col items-center">
                <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Icon aria-hidden="true" className="size-6" />
                </span>
                {index < steps.length - 1 ? (
                  <span aria-hidden="true" className="mt-3 h-full w-px flex-1 bg-border" />
                ) : null}
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Step {index + 1}
                </p>
                <h2 className="mt-1 text-xl font-semibold">{title}</h2>
                <p className="mt-2 leading-relaxed text-muted-foreground">{body}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-12 flex flex-wrap gap-3">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
          >
            See issues in progress
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
          <Link
            to="/improvements"
            className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-3 text-sm font-semibold"
          >
            Browse campus improvements
          </Link>
        </div>
      </div>
    </SiteLayout>
  );
}
