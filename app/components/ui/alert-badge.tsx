import { AlertCircle, AlertTriangle, Info } from "lucide-react";
import type { AlertSeverity } from "~/data/mock-data";

interface AlertBadgeProps {
  severity: AlertSeverity;
}

const config: Record<AlertSeverity, { label: string; classes: string; Icon: typeof AlertTriangle }> = {
  info: {
    label: "Info",
    classes: "bg-sky-500/10 text-sky-400 border-sky-500/20",
    Icon: Info,
  },
  warning: {
    label: "Warning",
    classes: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    Icon: AlertTriangle,
  },
  critical: {
    label: "Critique",
    classes: "bg-red-500/10 text-red-400 border-red-500/20",
    Icon: AlertCircle,
  },
};

export function AlertBadge({ severity }: AlertBadgeProps) {
  const { label, classes, Icon } = config[severity];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border ${classes}`}>
      <Icon className="h-3 w-3" />
      {label}
    </span>
  );
}
