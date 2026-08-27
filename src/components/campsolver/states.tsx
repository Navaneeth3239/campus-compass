import { Inbox, WifiOff, Radio, AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function IssueCardSkeleton() {
  return (
    <div className="card-elevated space-y-4 p-5">
      <div className="flex gap-2">
        <Skeleton className="h-6 w-28 rounded-full" />
        <Skeleton className="h-6 w-32 rounded-full" />
      </div>
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <div className="flex gap-4 pt-2">
        <Skeleton className="h-9 w-24" />
        <Skeleton className="h-9 w-24" />
      </div>
    </div>
  );
}

export function CardGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" aria-hidden="true">
      {Array.from({ length: count }).map((_, index) => (
        <IssueCardSkeleton key={index} />
      ))}
    </div>
  );
}

export function EmptyState({
  title = "No public issues yet",
  description = "Once issues are approved for public visibility, they will appear here.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="card-elevated flex flex-col items-center gap-3 px-6 py-16 text-center">
      <Inbox aria-hidden="true" className="size-10 text-muted-foreground" />
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="max-w-md text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

export function ErrorState({ message }: { message?: string }) {
  return (
    <div className="card-elevated flex flex-col items-center gap-3 px-6 py-16 text-center">
      <AlertCircle aria-hidden="true" className="size-10 text-destructive" />
      <h3 className="text-lg font-semibold">We couldn't load this data</h3>
      <p className="max-w-md text-sm text-muted-foreground">
        {message ?? "The public data service is unreachable right now. Please try again shortly."}
      </p>
    </div>
  );
}

export function LiveIndicator({ connected }: { connected: boolean }) {
  return (
    <p
      className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold"
      aria-live="polite"
    >
      {connected ? (
        <>
          <Radio aria-hidden="true" className="size-3.5 text-success-foreground" />
          <span className="text-success-foreground">Live updates on</span>
        </>
      ) : (
        <>
          <WifiOff aria-hidden="true" className="size-3.5 text-muted-foreground" />
          <span className="text-muted-foreground">Offline — refreshing every 45s</span>
        </>
      )}
    </p>
  );
}
