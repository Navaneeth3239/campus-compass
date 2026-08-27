import { CalendarDays, MapPin, RefreshCcw, Tag } from "lucide-react";
import { PriorityBadge, StatusPill } from "./badges";
import { formatDate } from "@/lib/campsolver/format";
import type { PublicIssue } from "@/lib/campsolver/types";

export function PublicIssueCard({ issue }: { issue: PublicIssue }) {
  return (
    <article className="card-elevated flex h-full flex-col overflow-hidden transition-shadow hover:shadow-lift">
      {issue.imageUrl ? (
        <img
          src={issue.imageUrl}
          alt={`Reported issue: ${issue.title}`}
          loading="lazy"
          className="h-44 w-full object-cover"
        />
      ) : null}

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex flex-wrap items-center gap-2">
          <PriorityBadge priority={issue.priority} />
          <StatusPill status={issue.status} />
        </div>

        <h3 className="text-lg leading-snug font-semibold">{issue.title}</h3>

        <p className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
          <Tag aria-hidden="true" className="size-4" />
          {issue.category}
        </p>

        <p className="text-sm leading-relaxed text-muted-foreground">{issue.description}</p>

        <p className="inline-flex items-center gap-1.5 text-sm font-medium">
          <MapPin aria-hidden="true" className="size-4 text-primary" />
          {issue.location}
        </p>

        <dl className="mt-auto grid grid-cols-2 gap-3 border-t border-border pt-4 text-xs text-muted-foreground">
          <div>
            <dt className="inline-flex items-center gap-1 font-semibold uppercase tracking-wide">
              <CalendarDays aria-hidden="true" className="size-3.5" /> Reported
            </dt>
            <dd className="mt-1 text-foreground">{formatDate(issue.reportedAt)}</dd>
          </div>
          <div>
            <dt className="inline-flex items-center gap-1 font-semibold uppercase tracking-wide">
              <RefreshCcw aria-hidden="true" className="size-3.5" /> Last updated
            </dt>
            <dd className="mt-1 text-foreground">{formatDate(issue.updatedAt)}</dd>
          </div>
        </dl>
      </div>
    </article>
  );
}
