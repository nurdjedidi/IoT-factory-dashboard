import { DashboardLayout } from "~/components/layout";
import { SimulationProvider, useSimulationContext } from "~/context/simulation-context";

export default function DashboardRoot() {
  return (
    <SimulationProvider>
      <DashboardContent />
    </SimulationProvider>
  );
}

function DashboardContent() {
  const { alerts } = useSimulationContext();
  const unacknowledgedAlerts = alerts.filter((a) => !a.acknowledged).length;

  return <DashboardLayout alertCount={unacknowledgedAlerts} />;
}
