import {
  Activity,
  ArrowLeft, Cog,
  Droplets,
  Factory,
  Gauge,
  Milk,
  Snowflake,
  Thermometer,
  Waves,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "react-router";
import { Area, AreaChart, ResponsiveContainer } from "recharts";
import { FloorPlanAssembly } from "~/components/floor-plans/floor-plan-assembly";
import { FloorPlanColdStorage } from "~/components/floor-plans/floor-plan-cold-storage";
import { FloorPlanMachines } from "~/components/floor-plans/floor-plan-machines";
import { SensorDetailPanel } from "~/components/ui/sensor-detail-panel";
import { StatusIndicator } from "~/components/ui/status-indicator";
import { useSimulationContext } from "~/context/simulation-context";
import type { Sensor, SensorType } from "~/data/mock-data";
import { sensorTypeConfig } from "~/data/mock-data";

const floorIcons = { cog: Cog, snowflake: Snowflake, factory: Factory, milk: Milk } as const;
const sensorIcons: Record<SensorType, typeof Thermometer> = {
  temperature: Thermometer, humidity: Droplets, pressure: Gauge, vibration: Activity, rpm: Zap, flow: Waves,
};

export const meta = () => {
  return [
    { title: 'Zones' },
  ];
};

export default function FloorDetail() {
  const { floorId } = useParams();
  const { floors } = useSimulationContext();
  const [selectedSensor, setSelectedSensor] = useState<Sensor | null>(null);

  const floor = floors.find((f) => f.id === floorId);
  if (!floor) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-center">
        <p className="text-lg font-medium">Étage introuvable</p>
        <Link to="/" className="mt-4 text-sm text-[var(--color-accent-cyan)] hover:underline">Retour au dashboard</Link>
      </div>
    );
  }

  const FloorIcon = floorIcons[floor.iconName];
  const FloorPlanComponent =
    (floorId === "assembly" || floorId === "production") ? FloorPlanAssembly
    : (floorId === "cold-storage" || floorId === "cold-chain") ? FloorPlanColdStorage
    : FloorPlanMachines;

  const handleSensorClick = (sensor: Sensor) => {
    setSelectedSensor((prev) => (prev?.id === sensor.id ? null : sensor));
  };

  const liveSensor = selectedSensor
    ? floor.sensors.find((s) => s.id === selectedSensor.id) ?? selectedSensor
    : null;

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="h-9 w-9 rounded-xl flex items-center justify-center
              bg-[var(--color-surface-700)] border border-[var(--color-surface-500)]/20
              hover:bg-[var(--color-surface-600)] transition-colors shrink-0"
          >
            <ArrowLeft className="h-4 w-4 text-[var(--color-text-muted)]" />
          </Link>
          <div
            className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0"
            style={{
              backgroundColor: `color-mix(in srgb, ${floor.color} 12%, transparent)`,
              color: floor.color,
            }}
          >
            <FloorIcon className="h-5 w-5" />
          </div>
        </div>
        <div className="min-w-0">
          <h1 className="text-xl md:text-2xl font-bold tracking-tight">{floor.name}</h1>
          <p className="text-xs md:text-sm text-[var(--color-text-muted)] mt-0.5 leading-relaxed">{floor.description}</p>
        </div>
      </div>

      <FloorPlanComponent
        sensors={floor.sensors}
        onSensorClick={handleSensorClick}
        selectedSensorId={selectedSensor?.id}
      />

      <div>
        <h2 className="text-xs font-medium uppercase tracking-wider text-[var(--color-text-muted)] mb-3">
          Capteurs · {floor.sensors.length}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {floor.sensors.map((sensor) => {
            const config = sensorTypeConfig[sensor.type];
            const SensorIcon = sensorIcons[sensor.type];
            const statusColor =
              sensor.status === "ok" ? "#34d399"
              : sensor.status === "warning" ? "#fbbf24"
              : "#f87171";

            const chartData = sensor.history.map((v, i) => ({ i, v }));

            return (
              <button
                key={sensor.id}
                onClick={() => handleSensorClick(sensor)}
                className={`text-left rounded-2xl p-4
                  bg-gradient-to-br from-[var(--color-surface-700)] to-[var(--color-surface-800)]
                  border transition-all duration-200
                  hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/30 cursor-pointer
                  ${selectedSensor?.id === sensor.id
                    ? "border-[var(--color-accent-cyan)]/40 shadow-lg shadow-cyan-500/10"
                    : "border-[var(--color-surface-500)]/20 hover:border-[var(--color-surface-500)]/40"
                  }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <StatusIndicator status={sensor.status} size="sm" />
                    <span className="text-sm font-medium truncate">{sensor.name}</span>
                  </div>
                  <SensorIcon className="h-3.5 w-3.5 text-[var(--color-text-muted)]" />
                </div>
                <div className="flex items-end justify-between">
                  <span className="text-2xl font-bold" style={{ color: statusColor }}>
                    {sensor.value}
                    <span className="text-xs ml-0.5 font-normal text-[var(--color-text-muted)]">{sensor.unit}</span>
                  </span>
                  <div className="w-20 h-8">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id={`sg-${sensor.id}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={statusColor} stopOpacity={0.25} />
                            <stop offset="100%" stopColor={statusColor} stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <Area type="monotone" dataKey="v" stroke={statusColor} strokeWidth={1.5} fill={`url(#sg-${sensor.id})`} dot={false} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {liveSensor && (
        <>
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" onClick={() => setSelectedSensor(null)} />
          <SensorDetailPanel sensor={liveSensor} onClose={() => setSelectedSensor(null)} />
        </>
      )}
    </div>
  );
}
