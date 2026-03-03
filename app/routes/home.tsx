import {
  Activity,
  AlertCircle, AlertTriangle,
  ArrowRight,
  Cog,
  Factory,
  Radio,
  Snowflake,
  Thermometer,
} from "lucide-react";
import { Link } from "react-router";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis, YAxis,
} from "recharts";
import { AlertBadge } from "~/components/ui/alert-badge";
import { KpiCard } from "~/components/ui/kpi-card";
import { StatusIndicator } from "~/components/ui/status-indicator";
import { useSimulationContext } from "~/context/simulation-context";
import type { Route } from "./+types/home";

const floorIcons = { cog: Cog, snowflake: Snowflake, factory: Factory } as const;

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Dashboard IoT — Vue d'ensemble" },
    { name: "description", content: "Monitoring temps réel des capteurs industriels" },
  ];
}

export default function Home() {
  const { floors, alerts, allSensors, activeCritical, activeWarning } = useSimulationContext();

  const tempSensors = allSensors.filter((s) => s.type === "temperature");
  const avgTemp = tempSensors.length
    ? (tempSensors.reduce((sum, s) => sum + s.value, 0) / tempSensors.length).toFixed(1)
    : "—";

  const okCount = allSensors.filter((s) => s.status === "ok").length;
  const warnCount = allSensors.filter((s) => s.status === "warning").length;
  const critCount = allSensors.filter((s) => s.status === "critical").length;

  const pieData = [
    { name: "Normal", value: okCount, color: "#34d399" },
    { name: "Attention", value: warnCount, color: "#fbbf24" },
    { name: "Critique", value: critCount, color: "#f87171" },
  ];

  const floorBarData = floors.map((f) => ({
    name: f.name,
    ok: f.sensors.filter((s) => s.status === "ok").length,
    warning: f.sensors.filter((s) => s.status === "warning").length,
    critical: f.sensors.filter((s) => s.status === "critical").length,
  }));

  const tempHistoryData = Array.from({ length: 20 }, (_, i) => {
    const entry: Record<string, number | string> = { index: `${i}` };
    for (const floor of floors) {
      const temps = floor.sensors.filter((s) => s.type === "temperature");
      if (temps.length) {
        entry[floor.name] = +(temps.reduce((sum, s) => sum + s.history[i], 0) / temps.length).toFixed(1);
      }
    }
    return entry;
  });

  const chartColors = ["#22d3ee", "#34d399", "#fbbf24"];

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl md:text-2xl font-bold tracking-tight">Vue d'ensemble</h1>
        <p className="text-xs md:text-sm text-[var(--color-text-muted)]">Monitoring temps réel de l'usine</p>
      </div>

      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard
          label="Capteurs actifs"
          value={allSensors.length}
          icon={<Radio className="h-5 w-5" />}
          accentColor="var(--color-accent-cyan)"
          delay={0}
        />
        <KpiCard
          label="Alertes critiques"
          value={activeCritical}
          icon={<AlertCircle className="h-5 w-5" />}
          accentColor="var(--color-accent-red)"
          delay={80}
        />
        <KpiCard
          label="Avertissements"
          value={activeWarning}
          icon={<AlertTriangle className="h-5 w-5" />}
          accentColor="var(--color-accent-amber)"
          delay={160}
        />
        <KpiCard
          label="Température moy."
          value={`${avgTemp}°C`}
          icon={<Thermometer className="h-5 w-5" />}
          accentColor="var(--color-accent-emerald)"
          delay={240}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {floors.map((floor, i) => {
          const FloorIcon = floorIcons[floor.iconName];
          const fOk = floor.sensors.filter((s) => s.status === "ok").length;
          const fWarn = floor.sensors.filter((s) => s.status === "warning").length;
          const fCrit = floor.sensors.filter((s) => s.status === "critical").length;

          return (
            <Link
              key={floor.id}
              to={`/floor/${floor.id}`}
              className="animate-fade-in-up group rounded-2xl p-4 md:p-5
                bg-gradient-to-br from-[var(--color-surface-700)] to-[var(--color-surface-800)]
                border border-[var(--color-surface-500)]/20
                hover:border-[var(--color-surface-500)]/40 transition-all duration-300
                hover:shadow-xl hover:shadow-black/30 hover:-translate-y-0.5"
              style={{ animationDelay: `${300 + i * 80}ms` }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="h-10 w-10 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                    style={{
                      backgroundColor: `color-mix(in srgb, ${floor.color} 12%, transparent)`,
                      color: floor.color,
                    }}
                  >
                    <FloorIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold group-hover:text-[var(--color-accent-cyan)] transition-colors text-sm md:text-base">{floor.name}</h3>
                    <p className="text-[10px] md:text-xs text-[var(--color-text-muted)]">{floor.sensors.length} capteurs</p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-[var(--color-text-muted)] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
              </div>
              <p className="text-xs text-[var(--color-text-secondary)] mb-4 line-clamp-2 leading-relaxed">{floor.description}</p>
              <div className="flex gap-4 text-[10px] md:text-xs">
                <span className="flex items-center gap-1.5 font-medium"><StatusIndicator status="ok" size="sm" /> {fOk} OK</span>
                <span className="flex items-center gap-1.5 font-medium"><StatusIndicator status="warning" size="sm" /> {fWarn}</span>
                <span className="flex items-center gap-1.5 font-medium"><StatusIndicator status="critical" size="sm" /> {fCrit}</span>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

        <div className="lg:col-span-7 rounded-2xl p-4 md:p-5 bg-gradient-to-br from-[var(--color-surface-700)] to-[var(--color-surface-800)] border border-[var(--color-surface-500)]/20 animate-fade-in-up" style={{ animationDelay: "600ms" }}>
          <div className="flex items-center gap-2 mb-4">
            <Thermometer className="h-4 w-4 text-[var(--color-text-muted)]" />
            <h3 className="text-sm font-medium text-[var(--color-text-secondary)]">Températures moyennes</h3>
          </div>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={tempHistoryData}>
                <defs>
                  {floors.map((f, i) => (
                    <linearGradient key={f.id} id={`temp-${f.id}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={chartColors[i]} stopOpacity={0.2} />
                      <stop offset="100%" stopColor={chartColors[i]} stopOpacity={0} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-surface-500)" strokeOpacity={0.2} />
                <YAxis
                  tick={{ fill: "var(--color-text-muted)", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  width={35}
                  domain={["auto", "auto"]}
                />
                <XAxis hide />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-surface-800)",
                    border: "1px solid var(--color-surface-500)",
                    borderRadius: "10px",
                    fontSize: "12px",
                    color: "var(--color-text-primary)",
                  }}
                  formatter={(value: number | string | undefined) => (value !== undefined ? [`${value}°C`, "Température"] : ["", ""])}
                />
                <ReferenceLine y={0} stroke="var(--color-surface-500)" strokeDasharray="3 3" opacity={0.5} />
                {floors.map((f, i) => (
                  <Area
                    key={f.id}
                    type="monotone"
                    dataKey={f.name}
                    stroke={chartColors[i]}
                    strokeWidth={2}
                    fill={`url(#temp-${f.id})`}
                    dot={false}
                    activeDot={{ r: 3, strokeWidth: 0 }}
                    isAnimationActive={true}
                    animationDuration={1500}
                  />
                ))}
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-4 justify-center">
            {floors.map((f, i) => (
              <div key={f.id} className="flex items-center gap-1.5 text-[10px] md:text-xs text-[var(--color-text-muted)]">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: chartColors[i] }} />
                {f.name}
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
          <div className="rounded-2xl p-4 md:p-5 bg-gradient-to-br from-[var(--color-surface-700)] to-[var(--color-surface-800)] border border-[var(--color-surface-500)]/20 animate-fade-in-up" style={{ animationDelay: "700ms" }}>
            <h3 className="text-sm font-medium text-[var(--color-text-secondary)] mb-4">État des capteurs</h3>
            <div className="flex items-center gap-6">
              <div className="shrink-0 h-[100px] w-[100px] md:h-[110px] md:w-[110px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={30}
                      outerRadius={45}
                      paddingAngle={4}
                      dataKey="value"
                      strokeWidth={0}
                    >
                      {pieData.map((d) => (
                        <Cell key={d.name} fill={d.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2.5 flex-1">
                {pieData.map((d) => (
                  <div key={d.name} className="flex items-center justify-between text-[11px] md:text-sm">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                      <span className="text-[var(--color-text-muted)]">{d.name}</span>
                    </div>
                    <span className="font-bold">{d.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-2xl p-4 md:p-5 bg-gradient-to-br from-[var(--color-surface-700)] to-[var(--color-surface-800)] border border-[var(--color-surface-500)]/20 animate-fade-in-up" style={{ animationDelay: "800ms" }}>
            <div className="flex items-center gap-2 mb-4">
              <Activity className="h-4 w-4 text-[var(--color-text-muted)]" />
              <h3 className="text-sm font-medium text-[var(--color-text-secondary)]">Par étage</h3>
            </div>
            <div className="h-[90px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={floorBarData} layout="vertical" barSize={8}>
                  <XAxis type="number" hide />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fill: "var(--color-text-muted)", fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                    width={70}
                  />
                  <Bar dataKey="ok" stackId="a" fill="#34d399" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="warning" stackId="a" fill="#fbbf24" />
                  <Bar dataKey="critical" stackId="a" fill="#f87171" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl p-5 bg-gradient-to-br from-[var(--color-surface-700)] to-[var(--color-surface-800)] border border-[var(--color-surface-500)]/20 animate-fade-in-up" style={{ animationDelay: "900ms" }}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-[var(--color-text-muted)]" />
            <h3 className="text-sm font-medium text-[var(--color-text-secondary)]">Alertes récentes</h3>
          </div>
          <Link to="/alerts" className="text-xs text-[var(--color-accent-cyan)] hover:underline flex items-center gap-1">
            Voir tout <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {alerts.slice(0, 8).map((alert) => (
            <div
              key={alert.id}
              className="flex items-center gap-3 p-3 rounded-xl bg-[var(--color-surface-800)]/60 text-sm
                border border-[var(--color-surface-500)]/10 hover:border-[var(--color-surface-500)]/20 transition-colors"
            >
              <AlertBadge severity={alert.severity} />
              <span className="flex-1 truncate text-[var(--color-text-secondary)]">{alert.message}</span>
              <span className="text-xs text-[var(--color-text-muted)] whitespace-nowrap">{formatTimeAgo(alert.timestamp)}</span>
            </div>
          ))}
          {alerts.length === 0 && (
            <p className="text-center text-sm text-[var(--color-text-muted)] py-8">Aucune alerte</p>
          )}
        </div>
      </div>
    </div>
  );
}

function formatTimeAgo(date: Date) {
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "à l'instant";
  if (mins < 60) return `il y a ${mins}min`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `il y a ${hrs}h`;
  return `il y a ${Math.floor(hrs / 24)}j`;
}
