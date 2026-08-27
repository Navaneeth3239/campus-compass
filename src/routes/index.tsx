import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, CheckCircle2, Clock, Building2, LockKeyhole, Eye, Gauge } from "lucide-react";
import { SiteLayout } from "@/components/campsolver/SiteLayout";
import { Skeleton } from "@/components/ui/skeleton";
import { countersQueryOptions, POLL_INTERVAL_MS } from "@/lib/campsolver/api";
import { formatHours, formatNumber } from "@/lib/campsolver/format";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CampSolver — Public Campus Issue Transparency" },
      {
        name: "description",
        content:
          "Track campus issues from report to resolution. CampSolver publishes live counters, public issue status and before/after campus improvements — no login required.",
      },
      { property: "og:title", content: "CampSolver — Public Campus Issue Transparency" },
      {
        property: "og:description",
        content:
          "Live campus issue reporting and resolution data, open to everyone: statuses, resolution times and verified campus improvements.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: async ({ context }) => {
    await context.queryClient
      .ensureQueryData(countersQueryOptions())
      .catch(() => null);
  },
  component: HomePage,
});

function Counter({
  label,
  value,
  Icon,
  loading,
}: {
  label: string;
  value: string;
  Icon: typeof Clock;
  loading: boolean;
}) {
  return (
    <div className="rounded-xl border border-border/40 bg-surface-foreground/10 p-5 text-left backdrop-blur">
      <Icon aria-hidden="true" className="size-5 text-accent" />
      {loading ? (
        <Skeleton className="mt-3 h-9 w-24 bg-surface-foreground/20" />
      ) : (
        <p className="mt-3 font-display text-3xl font-bold text-surface-foreground">{value}</p>
      )}
      <p className="mt-1 text-sm text-surface-foreground/75">{label}</p>
    </div>
  );
}

function HomePage() {
  const counters = useQuery({
    ...countersQueryOptions(),
    refetchInterval: POLL_INTERVAL_MS,
  });

  const data = counters.data;
  const loading = counters.isPending;

  return (
    <SiteLayout>
      <section className="surface-hero">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:py-28">
          <p className="inline-flex items-center gap-2 rounded-full border border-surface-foreground/25 px-3 py-1.5 text-xs font-semibold text-surface-foreground/85">
            <Eye aria-hidden="true" className="size-3.5" />
            Public transparency record — no login required
          </p>
          <h1 className="mt-6 max-w-3xl font-display text-4xl font-bold text-surface-foreground sm:text-5xl lg:text-6xl">
            Every campus issue, tracked in the open until it's fixed.
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-surface-foreground/80">
            CampSolver is where students report campus problems and anyone can follow what happens
            next — reviewed, assigned to a department, resolved, and published with proof. Personal
            details stay private; accountability stays public.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground transition-transform hover:-translate-y-0.5"
            >
              View public dashboard
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
            <Link
              to="/how-it-works"
              className="inline-flex items-center gap-2 rounded-lg border border-surface-foreground/35 px-5 py-3 text-sm font-semibold text-surface-foreground transition-colors hover:bg-surface-foreground/10"
            >
              How it works
            </Link>
          </div>

          <div className="mt-14 grid gap-4 sm:grid-cols-3">
            <Counter
              label="Issues resolved"
              value={formatNumber(data?.issuesResolved)}
              Icon={CheckCircle2}
              loading={loading}
            />
            <Counter
              label="Average resolution time"
              value={formatHours(data?.avgResolutionHours)}
              Icon={Clock}
              loading={loading}
            />
            <Counter
              label="Active departments"
              value={formatNumber(data?.activeDepartments)}
              Icon={Building2}
              loading={loading}
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <h2 className="font-display text-3xl font-bold">Why a public site at all?</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {[
            {
              Icon: Eye,
              title: "Visible progress",
              body: "Each approved issue shows its current status and last update date, so nothing quietly disappears.",
            },
            {
              Icon: Gauge,
              title: "Measured performance",
              body: "Resolution rate, average resolution time and monthly trends are published, not summarised.",
            },
            {
              Icon: LockKeyhole,
              title: "Private by design",
              body: "No reporter identity, no exact GPS, no internal comments — only what the campus community needs to see.",
            },
          ].map(({ Icon, title, body }) => (
            <article key={title} className="card-elevated p-6">
              <Icon aria-hidden="true" className="size-6 text-primary" />
              <h3 className="mt-4 text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
            </article>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
