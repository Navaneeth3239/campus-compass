import { AlertTriangle, ArrowUpCircle, CheckCircle2, Circle, Clock, Info, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";
import type { IssueStatus, Priority } from "@/lib/campsolver/types";

const priorityConfig: Record<Priority, { label: string; className: string; Icon: typeof Info }> = {
  LOW: { label: "Low priority", className: "bg-low text-low-foreground", Icon: Info },
  MEDIUM: {
    label: "Medium priority",
    className: "bg-medium text-medium-foreground",
    Icon: ArrowUpCircle,
  },
  HIGH: { label: "High priority", className: "bg-high text-high-foreground", Icon: AlertTriangle },
};

export function PriorityBadge({ priority }: { priority: Priority }) {
  const config = priorityConfig[priority] ?? priorityConfig.LOW;
  const { Icon } = config;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
        config.className,
      )}
    >
      <Icon aria-hidden="true" className="size-3.5" />
      {config.label}
    </span>
  );
}

const statusConfig: Record<string, { label: string; className: string; Icon: typeof Circle }> = {
  REPORTED: { label: "Reported", className: "bg-muted text-muted-foreground", Icon: Circle },
  UNDER_REVIEW: { label: "Under review", className: "bg-low text-low-foreground", Icon: Clock },
  ASSIGNED: { label: "Assigned", className: "bg-low text-low-foreground", Icon: ArrowUpCircle },
  IN_PROGRESS: { label: "In progress", className: "bg-medium text-medium-foreground", Icon: Wrench },
  RESOLVED: { label: "Resolved", className: "bg-success text-success-foreground", Icon: CheckCircle2 },
  CLOSED: { label: "Closed", className: "bg-muted text-muted-foreground", Icon: CheckCircle2 },
};

export function StatusPill({ status }: { status: IssueStatus | string }) {
  const config = statusConfig[status] ?? {
    label: String(status).replace(/_/g, " ").toLowerCase(),
    className: "bg-muted text-muted-foreground",
    Icon: Circle,
  };
  const { Icon } = config;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold capitalize",
        config.className,
      )}
    >
      <Icon aria-hidden="true" className="size-3.5" />
      <span>Status: {config.label}</span>
    </span>
  );
}
