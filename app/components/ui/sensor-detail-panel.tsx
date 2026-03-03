import { Activity, Droplets, Gauge, Thermometer, X, Zap } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, YAxis } from "recharts";
import type { Sensor, SensorType } from "~/data/mock-data";
import { sensorTypeConfig } from "~/data/mock-data";
import { StatusIndicator } from "./status-indicator";

const iconMap: Record<SensorType, typeof Thermometer> = {
  temperature: Thermometer,
  humidity: Droplets,
  pressure: Gauge,
  vibration: Activity,
  rpm: Zap,
};

interface SensorDetailPanelProps {
  sensor: Sensor | null;
  onClose: () => void;
}

export function SensorDetailPanel({ sensor, onClose }: SensorDetailPanelProps) {
  if (!sensor) return null;

  const config = sensorTypeConfig[sensor.type];
  const Icon = iconMap[sensor.type];
  const statusColor =
    sensor.status === "ok"
      ? "#34d399"
      : sensor.status === "warning"
      ? "#fbbf24"
      : "#f87171";

  const pct = clamp(((sensor.value - sensor.min) / (sensor.max - sensor.min)) * 100, 0, 100);

  const chartData = sensor.history.map((v, i) => ({ index: i, value: v }));

  return (
    <div className="animate-slide-in fixed top-0 right-0 h-full w-full sm:w-[420px] z-50
      bg-[var(--color-surface-800)]/95 backdrop-blur-xl border-l border-[var(--color-surface-500)]/30
      shadow-2xl shadow-black/50 flex flex-col">

      <div className="flex items-center justify-between p-5 border-b border-[var(--color-surface-500)]/20">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `color-mix(in srgb, ${statusColor} 15%, transparent)` }}>
            <Icon className="h-5 w-5" style={{ color: statusColor }} />
          </div>
          <div>
            <h3 className="text-base font-semibold">{sensor.name}</h3>
            <p className="text-xs text-[var(--color-text-muted)]">{config.label} · {sensor.id}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="h-8 w-8 rounded-lg flex items-center justify-center
            hover:bg-[var(--color-surface-600)] transition-colors text-[var(--color-text-muted)]
            hover:text-[var(--color-text-primary)]"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-6">

        <div className="text-center py-6 rounded-2xl bg-gradient-to-b from-[var(--color-surface-700)] to-transparent">
          <div className="inline-flex items-center gap-2 mb-3">
            <StatusIndicator status={sensor.status} size="lg" />
            <span className="text-xs uppercase tracking-widest font-medium text-[var(--color-text-muted)]">
              {sensor.status === "ok" ? "Normal" : sensor.status === "warning" ? "Attention" : "Critique"}
            </span>
          </div>
          <div className="text-5xl font-bold tracking-tight" style={{ color: statusColor }}>
            {sensor.value}
            <span className="text-lg ml-1 font-normal text-[var(--color-text-muted)]">{sensor.unit}</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs text-[var(--color-text-muted)]">
            <span>{sensor.min}{sensor.unit}</span>
            <span>{sensor.max}{sensor.unit}</span>
          </div>
          <div className="h-2.5 rounded-full bg-[var(--color-surface-600)] overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700 ease-out"
              style={{
                width: `${pct}%`,
                background: `linear-gradient(90deg, ${statusColor}88, ${statusColor})`,
                boxShadow: `0 0 8px ${statusColor}66`,
              }}
            />
          </div>
          <div className="flex justify-between text-[10px] font-medium">
            <span className="text-amber-400/70">Min: {sensor.thresholdLow}{sensor.unit}</span>
            <span className="text-red-400/70">Max: {sensor.thresholdHigh}{sensor.unit}</span>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-medium uppercase tracking-wider text-[var(--color-text-muted)] mb-3">Historique</h4>
          <div className="bg-[var(--color-surface-700)] rounded-xl p-4 border border-[var(--color-surface-500)]/20">
            <ResponsiveContainer width="100%" height={100}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id={`grad-${sensor.id}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={statusColor} stopOpacity={0.3} />
                    <stop offset="100%" stopColor={statusColor} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <YAxis domain={[sensor.min, sensor.max]} hide />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-surface-800)",
                    border: "1px solid var(--color-surface-500)",
                    borderRadius: "8px",
                    fontSize: "12px",
                    color: "var(--color-text-primary)",
                  }}
                  formatter={(val: number | string | undefined) => val !== undefined ? [`${val}${sensor.unit}`, config.label] : ["", ""]}
                  labelFormatter={() => ""}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={statusColor}
                  strokeWidth={2}
                  fill={`url(#grad-${sensor.id})`}
                  dot={false}
                  activeDot={{ r: 4, strokeWidth: 0, fill: statusColor }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-medium uppercase tracking-wider text-[var(--color-text-muted)] mb-3">Détails</h4>
          <div className="bg-[var(--color-surface-700)] rounded-xl divide-y divide-[var(--color-surface-500)]/20 border border-[var(--color-surface-500)]/20">
            {[
              ["Type", config.label],
              ["Unité", sensor.unit],
              ["Valeur actuelle", `${sensor.value}${sensor.unit}`],
              ["Seuil bas", `${sensor.thresholdLow}${sensor.unit}`],
              ["Seuil haut", `${sensor.thresholdHigh}${sensor.unit}`],
              ["Plage", `${sensor.min} - ${sensor.max}${sensor.unit}`],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between py-3 px-4 text-sm">
                <span className="text-[var(--color-text-muted)]">{k}</span>
                <span className="font-medium">{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}
