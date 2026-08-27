import { CalendarCheck, MapPin, Sparkles } from "lucide-react";
import { formatDate } from "@/lib/campsolver/format";
import type { CampusImprovement } from "@/lib/campsolver/types";

export function CampusImprovementCard({ improvement }: { improvement: CampusImprovement }) {
  return (
    <article className="card-elevated flex h-full flex-col overflow-hidden">
      <div className="grid grid-cols-1 sm:grid-cols-2">
        <figure className="relative">
          <span className="absolute left-3 top-3 rounded-full bg-high px-2.5 py-1 text-xs font-semibold text-high-foreground">
            Before
          </span>
          {improvement.beforeImageUrl ? (
            <img
              src={improvement.beforeImageUrl}
              alt="Campus location before the issue was resolved"
              loading="lazy"
              className="h-44 w-full object-cover"
            />
          ) : (
            <div className="flex h-44 w-full items-center justify-center bg-muted px-4 text-center text-xs text-muted-foreground">
              No before image available
            </div>
          )}
        </figure>
        <figure className="relative">
          <span className="absolute left-3 top-3 rounded-full bg-success px-2.5 py-1 text-xs font-semibold text-success-foreground">
            After
          </span>
          {improvement.afterImageUrl ? (
            <img
              src={improvement.afterImageUrl}
              alt="Campus location after the issue was resolved"
              loading="lazy"
              className="h-44 w-full object-cover"
            />
          ) : (
            <div className="flex h-44 w-full items-center justify-center bg-muted px-4 text-center text-xs text-muted-foreground">
              No after image available
            </div>
          )}
        </figure>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
        {improvement.title ? (
          <h3 className="text-lg font-semibold leading-snug">{improvement.title}</h3>
        ) : null}

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wide text-high-foreground">
            The problem
          </h4>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            {improvement.problemDescription}
          </p>
        </div>

        <div>
          <h4 className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-success-foreground">
            <Sparkles aria-hidden="true" className="size-3.5" /> How it was resolved
          </h4>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            {improvement.resolutionDescription}
          </p>
        </div>

        <div className="mt-auto flex flex-wrap items-center gap-4 border-t border-border pt-4 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <CalendarCheck aria-hidden="true" className="size-3.5" />
            Resolved {formatDate(improvement.resolvedAt)}
          </span>
          {improvement.location ? (
            <span className="inline-flex items-center gap-1.5">
              <MapPin aria-hidden="true" className="size-3.5" />
              {improvement.location}
            </span>
          ) : null}
        </div>
      </div>
    </article>
  );
}
