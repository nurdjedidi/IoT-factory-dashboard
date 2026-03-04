import { createContext, useContext } from "react";
import type { ReactNode } from "react";
import type { Alert, Floor, Sensor } from "~/data/mock-data";
import { useSimulation } from "~/hooks/use-simulation";

interface SimulationContextType {
  floors: Floor[];
  alerts: Alert[];
  allSensors: Sensor[];
  activeCritical: number;
  activeWarning: number;
  acknowledgeAlert: (alertId: string) => void;
  isDairyMode: boolean;
  toggleMode: () => void;
}

export const SimulationContext = createContext<SimulationContextType | null>(null);

export function SimulationProvider({ children }: { children: ReactNode }) {
  const simulation = useSimulation(2500);

  return (
    <SimulationContext.Provider value={simulation}>
      {children}
    </SimulationContext.Provider>
  );
}

export function useSimulationContext() {
  const ctx = useContext(SimulationContext);
  if (!ctx) throw new Error("useSimulationContext must be used within SimulationProvider");
  return ctx;
}
