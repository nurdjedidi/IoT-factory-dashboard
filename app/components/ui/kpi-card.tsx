import type { ReactNode } from "react";

interface KpiCardProps {
  label: string;
  value: string | number;
  icon: ReactNode;
  trend?: "up" | "down" | "stable";
  accentColor?: string;
  delay?: number;
}

export function KpiCard({ label, value, icon, accentColor = "var(--color-accent-cyan)", delay = 0 }: KpiCardProps) {
  return (
    <div
      className="animate-fade-in-up rounded-2xl p-5 flex items-center gap-4
        bg-gradient-to-br from-[var(--color-surface-700)] to-[var(--color-surface-800)]
        border border-[var(--color-surface-500)]/20
        hover:border-[var(--color-surface-500)]/40 transition-all duration-300
        hover:shadow-xl hover:shadow-black/30 group"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div
        className="flex items-center justify-center h-12 w-12 rounded-xl transition-transform duration-300 group-hover:scale-110"
        style={{
          backgroundColor: `color-mix(in srgb, ${accentColor} 12%, transparent)`,
          color: accentColor,
          boxShadow: `0 0 20px color-mix(in srgb, ${accentColor} 10%, transparent)`,
        }}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium uppercase tracking-wider text-[var(--color-text-muted)] mb-1">{label}</p>
        <p className="text-2xl font-bold tracking-tight">{value}</p>
      </div>
    </div>
  );
}
