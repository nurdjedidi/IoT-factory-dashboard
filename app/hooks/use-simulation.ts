import { useCallback, useEffect, useRef, useState } from "react";
import type { Alert, Floor, Sensor, SensorStatus } from "~/data/mock-data";
import {
  dairyFloors,
  generateInitialAlerts,
  floors as industrialFloors
} from "~/data/mock-data";

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}

function getStatus(value: number, sensor: Sensor): SensorStatus {
  if (value >= sensor.thresholdHigh || value <= sensor.thresholdLow) return "critical";
  if (value >= sensor.thresholdHigh * 0.9 || value <= sensor.thresholdLow * 1.1) return "warning";
  return "ok";
}

export function useSimulation(intervalMs = 2500) {
  const alertIdRef = useRef(100);

  const [isDairyMode, setIsDairyMode] = useState(false);

  const [floors, setFloors] = useState<Floor[]>(() =>
    JSON.parse(JSON.stringify(isDairyMode ? dairyFloors : industrialFloors))
  );
  const [alerts, setAlerts] = useState<Alert[]>(() =>
    generateInitialAlerts(isDairyMode ? dairyFloors : industrialFloors)
  );

  const toggleMode = useCallback(() => {
    setIsDairyMode(prev => {
      const newMode = !prev;
      const newData = newMode ? dairyFloors : industrialFloors;
      setFloors(JSON.parse(JSON.stringify(newData)));
      setAlerts(generateInitialAlerts(newData));
      return newMode;
    });
  }, []);

  const tick = useCallback(() => {
    setFloors((prev) =>
      prev.map((floor) => ({
        ...floor,
        sensors: floor.sensors.map((sensor) => {
          const drift = (Math.random() - 0.48) * (sensor.max - sensor.min) * 0.08;
          const newValue = +clamp(sensor.value + drift, sensor.min, sensor.max).toFixed(1);
          const newStatus = getStatus(newValue, sensor);
          const newHistory = [...sensor.history.slice(1), newValue];

          if (newStatus !== "ok" && newStatus !== sensor.status) {
            const id = `alert-${alertIdRef.current++}`;
            setAlerts((a) => [
              {
                id,
                sensorId: sensor.id,
                sensorName: sensor.name,
                floorId: floor.id,
                floorName: floor.name,
                severity: newStatus,
                message:
                  newStatus === "critical"
                    ? `${sensor.name} a dépassé le seuil : ${newValue}${sensor.unit}`
                    : `${sensor.name} approche du seuil : ${newValue}${sensor.unit}`,
                value: newValue,
                threshold: newValue >= sensor.thresholdHigh ? sensor.thresholdHigh : sensor.thresholdLow,
                timestamp: new Date(),
                acknowledged: false,
                businessContext: sensor.businessContext,
              },
              ...a,
            ].slice(0, 50));
          }

          return { ...sensor, value: newValue, status: newStatus, history: newHistory };
        }),
      }))
    );
  }, []);

  useEffect(() => {
    const id = setInterval(tick, intervalMs);
    return () => clearInterval(id);
  }, [tick, intervalMs]);

  const acknowledgeAlert = useCallback((alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, acknowledged: true } : a))
    );
  }, []);

  const allSensors = floors.flatMap((f) => f.sensors);
  const activeCritical = alerts.filter((a) => a.severity === "critical" && !a.acknowledged).length;
  const activeWarning = alerts.filter((a) => a.severity === "warning" && !a.acknowledged).length;

  return {
    floors,
    alerts,
    allSensors,
    activeCritical,
    activeWarning,
    acknowledgeAlert,
    isDairyMode,
    toggleMode,
  };
}
