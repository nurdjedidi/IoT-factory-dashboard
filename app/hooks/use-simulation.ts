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

  const tickCountRef = useRef(0);

  const tick = useCallback(() => {
    tickCountRef.current++;
    let floorStatuses: { floor: Floor; isOk: boolean }[] = [];

    setFloors((prev) => {
      const newFloors = prev.map((floor) => {
        let allOk = true;
        const newSensors = floor.sensors.map((sensor) => {
          // Dérive plus réaliste avec onde sinusoïdale + léger bruit (amplitude augmentée pour le dynamisme visuel)
          const time = Date.now() / 15000; // Plus rapide
          const hash = sensor.id.split("").reduce((a, b) => a + b.charCodeAt(0), 0);
          const wave = Math.sin(time + hash) * (sensor.max - sensor.min) * 0.035;
          const noise = (Math.random() - 0.5) * (sensor.max - sensor.min) * 0.035;
          const pullToCenter = ((sensor.max + sensor.min) / 2 - sensor.value) * 0.005;
          const drift = wave + noise + pullToCenter;

          const newValue = +clamp(sensor.value + drift, sensor.min, sensor.max).toFixed(1);
          const newStatus = getStatus(newValue, sensor);
          const newHistory = [...sensor.history.slice(1), newValue];

          if (newStatus !== "ok") allOk = false;

          if (newStatus !== sensor.status) {
            let severity: "critical" | "warning" | "info" | null = null;
            let message = "";

            if (newStatus === "critical") {
              severity = "critical";
              message = `${sensor.name} a dépassé le seuil : ${newValue}${sensor.unit}`;
            } else if (newStatus === "warning") {
              severity = "warning";
              message = sensor.status === "critical"
                ? `${sensor.name} redescend en avertissement : ${newValue}${sensor.unit}`
                : `${sensor.name} approche du seuil : ${newValue}${sensor.unit}`;
            } else if (newStatus === "ok") {
              severity = "info";
              message = `Retour à la normale pour ${sensor.name} : ${newValue}${sensor.unit}`;
            }

            if (severity) {
              const id = `alert-${alertIdRef.current++}`;
              setAlerts((a) => [
                {
                  id,
                  sensorId: sensor.id,
                  sensorName: sensor.name,
                  floorId: floor.id,
                  floorName: floor.name,
                  severity: severity as "critical" | "warning" | "info",
                  message,
                  value: newValue,
                  threshold: newValue >= sensor.thresholdHigh ? sensor.thresholdHigh : sensor.thresholdLow,
                  timestamp: new Date(),
                  acknowledged: false,
                  businessContext: newStatus !== "ok" ? sensor.businessContext : undefined,
                },
                ...a,
              ].slice(0, 50));
            }
          }

          return { ...sensor, value: newValue, status: newStatus, history: newHistory };
        });

        floorStatuses.push({ floor, isOk: allOk });
        return { ...floor, sensors: newSensors };
      });

      // Génération d'alertes "info" périodiques si tout va bien
      if (tickCountRef.current % 15 === 0) {
        const okFloors = floorStatuses.filter((fs) => fs.isOk).map((fs) => fs.floor);
        if (okFloors.length > 0) {
          const randomFloor = okFloors[Math.floor(Math.random() * okFloors.length)];
          const id = `alert-${alertIdRef.current++}`;
          setAlerts((a) => [
            {
              id,
              sensorId: "system",
              sensorName: "Système",
              floorId: randomFloor.id,
              floorName: randomFloor.name,
              severity: "info" as const,
              message: `Données nominales. Performance optimale sur la zone.`,
              value: 100,
              threshold: 100,
              timestamp: new Date(),
              acknowledged: false,
            },
            ...a,
          ].slice(0, 50));
        }
      }

      return newFloors;
    });
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
