export type SensorType = "temperature" | "humidity" | "pressure" | "vibration" | "rpm" | "flow";
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
  businessContext?: {
    risk: string;
    financialImpact: string;
    action: string;
  };
}

export interface Floor {
  id: string;
  name: string;
  description: string;
  iconName: "cog" | "snowflake" | "factory" | "milk";
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
  businessContext?: {
    risk: string;
    financialImpact: string;
    action: string;
  };
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
  businessContext?: {
    risk: string;
    financialImpact: string;
    action: string;
  }
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
    history: Array.from({ length: 20 }, (_, i) => {
      const timeOffset = Date.now() - (19 - i) * 2500;
      const time = timeOffset / 15000;
      const hash = id.split("").reduce((a, b) => a + b.charCodeAt(0), 0);
      const wave = Math.sin(time + hash) * (max - min) * 0.035;
      const noise = (Math.random() - 0.5) * (max - min) * 0.035;
      return +(value + wave + noise).toFixed(1);
    }),
    businessContext,
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

export const dairyFloors: Floor[] = [
  {
    id: "cold-chain",
    name: "Chaîne du Froid",
    description: "Chambres froides lait cru, produits laitiers finis et semi-finis",
    iconName: "snowflake",
    color: "var(--color-accent-cyan)",
    colorDim: "var(--color-accent-cyan-dim)",
    sensors: [
      makeSensor(
        "cf-temp-lait-cru",
        "Temp. Lait Cru",
        "temperature",
        "°C",
        -2,
        8,
        2,
        4,
        "cold-chain",
        15,
        25,
        {
          risk: "Développement bactérien accéléré",
          financialImpact: "15 000L × 0,40€/L = 6 000€ de perte",
          action: "Vérifier compresseur #1 + Appeler maintenance"
        }
      ),
      makeSensor(
        "cf-temp-yaourt",
        "Temp. Yaourts",
        "temperature",
        "°C",
        0,
        10,
        4,
        6,
        "cold-chain",
        50,
        25,
        {
          risk: "Rupture chaîne du froid - Non-conformité HACCP",
          financialImpact: "50 000 unités × 0,15€ = 7 500€",
          action: "Isoler le lot + Contrôle qualité immédiat"
        }
      ),
      makeSensor(
        "cf-temp-fromage",
        "Temp. Fromages",
        "temperature",
        "°C",
        0,
        12,
        6,
        8,
        "cold-chain",
        80,
        30,
        {
          risk: "Affinage compromis - Perte qualité",
          financialImpact: "2 tonnes × 8€/kg = 16 000€",
          action: "Vérifier réfrigération zone affinage"
        }
      ),
      makeSensor("cf-hum-1", "Humidité Ch. Lait", "humidity", "%HR", 30, 90, 40, 75, "cold-chain", 15, 55),
      makeSensor("cf-hum-2", "Humidité Ch. Yaourt", "humidity", "%HR", 30, 90, 40, 75, "cold-chain", 50, 55),
      makeSensor("cf-temp-corridor", "Temp. Corridor", "temperature", "°C", 5, 20, 8, 15, "cold-chain", 45, 80),
    ],
  },
  {
    id: "production",
    name: "Production Laitière",
    description: "Pasteurisation, homogénéisation, fermentation",
    iconName: "factory",
    color: "var(--color-accent-emerald)",
    colorDim: "var(--color-accent-emerald-dim)",
    sensors: [
      makeSensor(
        "past-temp",
        "Temp. Pasteurisation",
        "temperature",
        "°C",
        60,
        85,
        71,
        73,
        "production",
        20,
        25,
        {
          risk: "Pasteurisation inefficace - Risque sanitaire",
          financialImpact: "30 000L × 0,45€/L = 13 500€ + Rappel produit",
          action: "ARRÊT LIGNE + Vérifier échangeur thermique"
        }
      ),
      makeSensor(
        "homo-pres",
        "Pression Homogénéisateur",
        "pressure",
        "bar",
        150,
        250,
        180,
        220,
        "production",
        55,
        25,
        {
          risk: "Homogénéisation inadéquate",
          financialImpact: "20 000L non-conforme = 9 000€",
          action: "Régler pression pompe"
        }
      ),
      makeSensor(
        "ferm-temp",
        "Temp. Fermentation",
        "temperature",
        "°C",
        38,
        48,
        42,
        44,
        "production",
        25,
        55,
        {
          risk: "Fermentation ralentie - Délai production",
          financialImpact: "Retard 4h = 40 000 unités = 6 000€",
          action: "Vérifier ensemencement + Ajuster température"
        }
      ),
      makeSensor(
        "bottling-flow",
        "Débit Embouteillage",
        "flow",
        "L/min",
        0,
        500,
        100,
        450,
        "production",
        70,
        50,
        {
          risk: "Ralentissement ligne",
          financialImpact: "30% capacité perdue = 3 000€/h",
          action: "Vérifier buses + Nettoyer filtres"
        }
      ),
      makeSensor("prod-vib-1", "Vibration Remplisseuse", "vibration", "mm/s", 0, 15, 0, 10, "production", 70, 78),
      makeSensor("prod-temp-amb", "Temp. Atelier", "temperature", "°C", 15, 30, 16, 25, "production", 45, 85),
    ],
  },
  {
    id: "quality-lab",
    name: "Laboratoire Qualité",
    description: "Contrôle qualité microbiologique",
    iconName: "cog",
    color: "var(--color-accent-amber)",
    colorDim: "var(--color-accent-amber-dim)",
    sensors: [
      makeSensor(
        "lab-temp-incub",
        "Temp. Incubateur",
        "temperature",
        "°C",
        32,
        42,
        35,
        37,
        "quality-lab",
        20,
        30,
        {
          risk: "Résultats analyses faussés",
          financialImpact: "3 lots bloqués = 45 000€",
          action: "Recalibrer incubateur"
        }
      ),
      makeSensor("lab-temp-frigo", "Temp. Frigo Échantillons", "temperature", "°C", 0, 10, 2, 6, "quality-lab", 60, 30),
      makeSensor("lab-hum", "Humidité Labo", "humidity", "%HR", 30, 80, 35, 65, "quality-lab", 40, 60),
      makeSensor("lab-temp-amb", "Temp. Labo", "temperature", "°C", 18, 28, 20, 24, "quality-lab", 45, 85),
    ],
  },
];

export function generateInitialAlerts(floorsData: Floor[]): Alert[] {
  const alerts: Alert[] = [];
  let id = 1;
  for (const floor of floorsData) {
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
          businessContext: sensor.businessContext,
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
          businessContext: sensor.businessContext,
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
  flow: { label: "Débit", iconName: "waves" },
};
