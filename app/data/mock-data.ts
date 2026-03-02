export type SensorType = "temperature" | "humidity" | "pressure" | "vibration" | "rpm";
export type SensorStatus = "ok" | "warning" | "critical";
export type AlertSeverity = "info" | "warning" | "critical";

export interface Sensor {
  id: string;
  name: string;
  type: SensorType;
  unit: string;
  value: number;
  min: number;
  max: number;
  thresholdLow: number;
  thresholdHigh: number;
  status: SensorStatus;
  floorId: string;
  x: number;
  y: number;
  history: number[];
}

export interface Floor {
  id: string;
  name: string;
  description: string;
  iconName: "cog" | "snowflake" | "factory";
  color: string;
  colorDim: string;
  sensors: Sensor[];
}

export interface Alert {
  id: string;
  sensorId: string;
  sensorName: string;
  floorId: string;
  floorName: string;
  severity: AlertSeverity;
  message: string;
  value: number;
  threshold: number;
  timestamp: Date;
  acknowledged: boolean;
}

function makeSensor(
  id: string,
  name: string,
  type: SensorType,
  unit: string,
  min: number,
  max: number,
  thresholdLow: number,
  thresholdHigh: number,
  floorId: string,
  x: number,
  y: number,
): Sensor {
  const value = +(min + Math.random() * (max - min)).toFixed(1);
  return {
    id,
    name,
    type,
    unit,
    value,
    min,
    max,
    thresholdLow,
    thresholdHigh,
    status: value >= thresholdHigh ? "critical" : value >= thresholdHigh * 0.9 ? "warning" : value <= thresholdLow ? "critical" : value <= thresholdLow * 1.1 ? "warning" : "ok",
    floorId,
    x,
    y,
    history: Array.from({ length: 20 }, () => +(min + Math.random() * (max - min)).toFixed(1)),
  };
}

export const floors: Floor[] = [
  {
    id: "assembly",
    name: "Assemblage",
    description: "Lignes d'assemblage robotisées, convoyeurs et postes de soudure",
    iconName: "cog",
    color: "var(--color-accent-cyan)",
    colorDim: "var(--color-accent-cyan-dim)",
    sensors: [
      makeSensor("a-temp-1", "Temp. Robot A1", "temperature", "°C", 20, 95, 25, 80, "assembly", 15, 25),
      makeSensor("a-temp-2", "Temp. Soudure B2", "temperature", "°C", 30, 200, 40, 180, "assembly", 50, 20),
      makeSensor("a-vib-1", "Vibration Conv. C1", "vibration", "mm/s", 0, 15, 0, 10, "assembly", 70, 45),
      makeSensor("a-vib-2", "Vibration Robot A2", "vibration", "mm/s", 0, 12, 0, 8, "assembly", 25, 60),
      makeSensor("a-temp-3", "Temp. Ambiante", "temperature", "°C", 18, 35, 16, 30, "assembly", 45, 78),
      makeSensor("a-pres-1", "Pression Pneum.", "pressure", "bar", 4, 10, 5, 9, "assembly", 82, 30),
    ],
  },
  {
    id: "cold-storage",
    name: "Stockage Froid",
    description: "Chambres froides pour matériaux sensibles et produits finis",
    iconName: "snowflake",
    color: "var(--color-accent-emerald)",
    colorDim: "var(--color-accent-emerald-dim)",
    sensors: [
      makeSensor("c-temp-1", "Temp. Chambre A", "temperature", "°C", -25, 5, -22, -2, "cold-storage", 20, 30),
      makeSensor("c-temp-2", "Temp. Chambre B", "temperature", "°C", -30, 0, -25, -5, "cold-storage", 65, 30),
      makeSensor("c-hum-1", "Humidité Ch. A", "humidity", "%HR", 30, 90, 35, 75, "cold-storage", 20, 55),
      makeSensor("c-hum-2", "Humidité Ch. B", "humidity", "%HR", 30, 90, 35, 75, "cold-storage", 65, 55),
      makeSensor("c-temp-3", "Temp. Corridor", "temperature", "°C", 5, 20, 5, 15, "cold-storage", 45, 80),
    ],
  },
  {
    id: "machines",
    name: "Machines",
    description: "Machines CNC, presses hydrauliques et tours d'usinage",
    iconName: "factory",
    color: "var(--color-accent-amber)",
    colorDim: "var(--color-accent-amber-dim)",
    sensors: [
      makeSensor("m-rpm-1", "RPM CNC Alpha", "rpm", "tr/min", 0, 8000, 500, 7000, "machines", 15, 25),
      makeSensor("m-rpm-2", "RPM Tour Beta", "rpm", "tr/min", 0, 5000, 300, 4500, "machines", 55, 25),
      makeSensor("m-temp-1", "Temp. Presse Gamma", "temperature", "°C", 30, 150, 35, 130, "machines", 80, 45),
      makeSensor("m-pres-1", "Pression Hydr.", "pressure", "bar", 50, 300, 60, 280, "machines", 35, 55),
      makeSensor("m-vib-1", "Vibration CNC Alpha", "vibration", "mm/s", 0, 20, 0, 15, "machines", 15, 50),
      makeSensor("m-temp-2", "Temp. Ambiante", "temperature", "°C", 20, 45, 18, 38, "machines", 45, 78),
    ],
  },
];

export function generateInitialAlerts(): Alert[] {
  const alerts: Alert[] = [];
  let id = 1;
  for (const floor of floors) {
    for (const sensor of floor.sensors) {
      if (sensor.status === "critical") {
        alerts.push({
          id: `alert-${id++}`,
          sensorId: sensor.id,
          sensorName: sensor.name,
          floorId: floor.id,
          floorName: floor.name,
          severity: "critical",
          message: `${sensor.name} a dépassé le seuil : ${sensor.value}${sensor.unit}`,
          value: sensor.value,
          threshold: sensor.thresholdHigh,
          timestamp: new Date(Date.now() - Math.random() * 3600000),
          acknowledged: false,
        });
      } else if (sensor.status === "warning") {
        alerts.push({
          id: `alert-${id++}`,
          sensorId: sensor.id,
          sensorName: sensor.name,
          floorId: floor.id,
          floorName: floor.name,
          severity: "warning",
          message: `${sensor.name} approche du seuil : ${sensor.value}${sensor.unit}`,
          value: sensor.value,
          threshold: sensor.thresholdHigh,
          timestamp: new Date(Date.now() - Math.random() * 7200000),
          acknowledged: false,
        });
      }
    }
  }
  return alerts;
}

export const sensorTypeConfig: Record<SensorType, { label: string; iconName: string }> = {
  temperature: { label: "Température", iconName: "thermometer" },
  humidity: { label: "Humidité", iconName: "droplets" },
  pressure: { label: "Pression", iconName: "gauge" },
  vibration: { label: "Vibration", iconName: "activity" },
  rpm: { label: "Vitesse", iconName: "zap" },
};
