import { Bell, Check, Filter } from "lucide-react";
import { useState } from "react";
import { AlertBadge } from "~/components/ui/alert-badge";
import { useSimulationContext } from "~/context/simulation-context";
import type { AlertSeverity } from "~/data/mock-data";

export const meta = () => {
  return [
    { title: "Alertes" },
  ];
};

export default function Alerts() {
  const { alerts, acknowledgeAlert, floors } = useSimulationContext();
  const [filterSeverity, setFilterSeverity] = useState<AlertSeverity | "all">("all");
  const [filterFloor, setFilterFloor] = useState<string>("all");

  const filtered = alerts.filter((a) => {
    if (filterSeverity !== "all" && a.severity !== filterSeverity) return false;
    if (filterFloor !== "all" && a.floorId !== filterFloor) return false;
    return true;
  });

  const critCount = alerts.filter((a) => a.severity === "critical" && !a.acknowledged).length;
  const warnCount = alerts.filter((a) => a.severity === "warning" && !a.acknowledged).length;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-red-500/10 flex items-center justify-center">
          <Bell className="h-5 w-5 text-red-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Alertes</h1>
          <p className="text-sm text-[var(--color-text-muted)]">
            {critCount} critique{critCount !== 1 ? "s" : ""} · {warnCount} avertissement{warnCount !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1.5">
          <Filter className="h-3.5 w-3.5 text-[var(--color-text-muted)]" />
          <span className="text-xs text-[var(--color-text-muted)]">Filtres</span>
        </div>

        <div className="flex items-center gap-1 bg-[var(--color-surface-700)] rounded-xl p-1 border border-[var(--color-surface-500)]/20">
          {(["all", "critical", "warning", "info"] as const).map((sev) => (
            <button
              key={sev}
              onClick={() => setFilterSeverity(sev)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all
                ${filterSeverity === sev
                  ? "bg-[var(--color-surface-500)] text-[var(--color-text-primary)] shadow-sm"
                  : "text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
                }`}
            >
              {sev === "all" ? "Tout" : sev === "critical" ? "Critique" : sev === "warning" ? "Warning" : "Info"}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1 bg-[var(--color-surface-700)] rounded-xl p-1 border border-[var(--color-surface-500)]/20">
          <button
            onClick={() => setFilterFloor("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all
              ${filterFloor === "all"
                ? "bg-[var(--color-surface-500)] text-[var(--color-text-primary)] shadow-sm"
                : "text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
              }`}
          >
            Tous
          </button>
          {floors.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilterFloor(f.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all
                ${filterFloor === f.id
                  ? "bg-[var(--color-surface-500)] text-[var(--color-text-primary)] shadow-sm"
                  : "text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
                }`}
            >
              {f.name}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        {filtered.length === 0 && (
          <div className="text-center py-20 text-[var(--color-text-muted)]">
            <Check className="h-10 w-10 mx-auto mb-3 text-emerald-400" />
            <p className="text-sm">Aucune alerte correspondant aux filtres</p>
          </div>
        )}
        {filtered.map((alert, i) => (
          <div
            key={alert.id}
            className={`animate-fade-in-up flex items-center gap-4 p-4 rounded-2xl
              border transition-all duration-200
              ${alert.acknowledged
                ? "bg-[var(--color-surface-800)]/40 border-[var(--color-surface-500)]/10 opacity-50"
                : "bg-gradient-to-r from-[var(--color-surface-700)] to-[var(--color-surface-800)] border-[var(--color-surface-500)]/20"
              }`}
            style={{ animationDelay: `${i * 30}ms` }}
          >
            <AlertBadge severity={alert.severity} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{alert.message}</p>
              <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                {alert.floorName} · {alert.sensorName} · {formatTime(alert.timestamp)}
              </p>
            </div>
            {!alert.acknowledged && (
              <button
                onClick={() => acknowledgeAlert(alert.id)}
                className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                  bg-[var(--color-surface-600)] border border-[var(--color-surface-500)]/30
                  hover:bg-emerald-500/15 hover:border-emerald-500/30 hover:text-emerald-400
                  transition-all text-[var(--color-text-secondary)]"
              >
                <Check className="h-3 w-3" />
                Acquitter
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function formatTime(date: Date) {
  return date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}
