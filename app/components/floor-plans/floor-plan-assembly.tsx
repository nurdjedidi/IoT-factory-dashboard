import {
    ArrowUpDown,
    Cog, Flame,
    Wind,
} from "lucide-react";
import { StatusIndicator } from "~/components/ui/status-indicator";
import type { Sensor } from "~/data/mock-data";

interface FloorPlanAssemblyProps {
  sensors: Sensor[];
  onSensorClick: (sensor: Sensor) => void;
  selectedSensorId?: string | null;
}

interface ZoneProps {
  label: string;
  icon: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}

function Zone({ label, icon, className = "", children }: ZoneProps) {
  return (
    <div className={`relative rounded-xl border border-[var(--color-surface-500)]/25 p-3 ${className}`}>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-[var(--color-accent-cyan)]/60">{icon}</span>
        <span className="text-[10px] uppercase tracking-wider font-semibold text-[var(--color-text-muted)]">{label}</span>
      </div>
      {children}
    </div>
  );
}

function SensorChip({ sensor, onClick, selected }: { sensor: Sensor; onClick: () => void; selected: boolean }) {
  const statusColor = sensor.status === "ok" ? "emerald" : sensor.status === "warning" ? "amber" : "red";
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium
        transition-all duration-200 cursor-pointer
        ${selected
          ? `bg-${statusColor}-500/15 ring-1 ring-${statusColor}-400/40 scale-105 z-10`
          : "bg-[var(--color-surface-800)]/60 hover:bg-[var(--color-surface-700)] hover:scale-[1.02]"
        }
        border border-[var(--color-surface-500)]/20`}
    >
      <StatusIndicator status={sensor.status} size="sm" />
      <span className="text-[var(--color-text-secondary)]">{sensor.name.split(" ").slice(-1)}</span>
      <span className="font-bold">{sensor.value}<span className="font-normal text-[var(--color-text-muted)]">{sensor.unit}</span></span>
    </button>
  );
}

export function FloorPlanAssembly({ sensors, onSensorClick, selectedSensorId }: FloorPlanAssemblyProps) {
  const sensorMap = Object.fromEntries(sensors.map((s) => [s.id, s]));

  return (
    <div className="rounded-2xl bg-gradient-to-br from-[var(--color-surface-700)] to-[var(--color-surface-800)] border border-[var(--color-surface-500)]/20 p-5">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Zone label="Cellule Robot A" icon={<Cog className="h-3.5 w-3.5" />} className="bg-[var(--color-accent-cyan)]/[0.03]">
          <div className="space-y-2">
            {["a-temp-1", "a-vib-2"].map((id) => sensorMap[id] && (
              <SensorChip key={id} sensor={sensorMap[id]} onClick={() => onSensorClick(sensorMap[id])} selected={selectedSensorId === id} />
            ))}
          </div>
        </Zone>

        <Zone label="Station Soudure B" icon={<Flame className="h-3.5 w-3.5" />} className="bg-[var(--color-accent-cyan)]/[0.03]">
          <div className="space-y-2">
            {["a-temp-2"].map((id) => sensorMap[id] && (
              <SensorChip key={id} sensor={sensorMap[id]} onClick={() => onSensorClick(sensorMap[id])} selected={selectedSensorId === id} />
            ))}
          </div>
        </Zone>

        <Zone label="Pneumatique" icon={<Wind className="h-3.5 w-3.5" />} className="bg-[var(--color-accent-cyan)]/[0.03]">
          <div className="space-y-2">
            {["a-pres-1"].map((id) => sensorMap[id] && (
              <SensorChip key={id} sensor={sensorMap[id]} onClick={() => onSensorClick(sensorMap[id])} selected={selectedSensorId === id} />
            ))}
          </div>
        </Zone>

        <Zone label="Convoyeur Principal" icon={<ArrowUpDown className="h-3.5 w-3.5" />} className="bg-[var(--color-accent-cyan)]/[0.03] md:col-span-2">
          <div className="flex flex-wrap gap-2">
            {["a-vib-1"].map((id) => sensorMap[id] && (
              <SensorChip key={id} sensor={sensorMap[id]} onClick={() => onSensorClick(sensorMap[id])} selected={selectedSensorId === id} />
            ))}
          </div>
        </Zone>

        <Zone label="Zone Ambiante" icon={<Cog className="h-3.5 w-3.5" />} className="bg-[var(--color-surface-600)]/20">
          <div className="space-y-2">
            {["a-temp-3"].map((id) => sensorMap[id] && (
              <SensorChip key={id} sensor={sensorMap[id]} onClick={() => onSensorClick(sensorMap[id])} selected={selectedSensorId === id} />
            ))}
          </div>
        </Zone>
      </div>
    </div>
  );
}
