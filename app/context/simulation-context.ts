import { createContext, useContext } from "react";
import type { Alert, Floor, Sensor } from "~/data/mock-data";

interface SimulationContextType {
  floors: Floor[];
  alerts: Alert[];
  allSensors: Sensor[];
  activeCritical: number;
  activeWarning: number;
  acknowledgeAlert: (alertId: string) => void;
}

export const SimulationContext = createContext<SimulationContextType | null>(null);

export function useSimulationContext() {
  const ctx = useContext(SimulationContext);
  if (!ctx) throw new Error("useSimulationContext must be used inside SimulationProvider");
  return ctx;
}
