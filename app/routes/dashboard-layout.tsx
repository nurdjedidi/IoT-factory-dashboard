import { DashboardLayout } from "~/components/layout";
import { SimulationContext } from "~/context/simulation-context";
import { useSimulation } from "~/hooks/use-simulation";

export default function DashboardRoot() {
  const simulation = useSimulation(2500);
  const unacknowledgedAlerts = simulation.alerts.filter((a) => !a.acknowledged).length;

  return (
    <SimulationContext.Provider value={simulation}>
      <DashboardLayout alertCount={unacknowledgedAlerts} />
    </SimulationContext.Provider>
  );
}
