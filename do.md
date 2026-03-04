# 🥛 MODE LAITERIE - Guide d'Implémentation

## 📋 MODIFICATIONS À FAIRE

### 1️⃣ **Fichier: `app/data/mock-data.ts`**

#### A) Ajouter le type "flow" dans SensorType
```typescript
// LIGNE 1 - Remplacer
export type SensorType = "temperature" | "humidity" | "pressure" | "vibration" | "rpm";

// PAR
export type SensorType = "temperature" | "humidity" | "pressure" | "vibration" | "rpm" | "flow";
```

#### B) Ajouter businessContext dans les interfaces
```typescript
// Dans interface Sensor, AJOUTER cette propriété
export interface Sensor {
  // ... propriétés existantes
  businessContext?: {
    risk: string;
    financialImpact: string;
    action: string;
  };
}

// Dans interface Alert, AJOUTER cette propriété
export interface Alert {
  // ... propriétés existantes
  businessContext?: {
    risk: string;
    financialImpact: string;
    action: string;
  };
}

// Dans interface Floor, MODIFIER iconName
export interface Floor {
  // ...
  iconName: "cog" | "snowflake" | "factory" | "milk";  // Ajouter "milk"
  // ...
}
```

#### C) Modifier la fonction makeSensor
```typescript
// REMPLACER la fonction makeSensor complète par:
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
  businessContext?: {           // AJOUTER ce paramètre
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
    history: Array.from({ length: 20 }, () => +(min + Math.random() * (max - min)).toFixed(1)),
    businessContext,  // AJOUTER cette ligne
  };
}
```

#### D) AJOUTER après la définition de `floors`, créer `dairyFloors`
```typescript
// APRÈS export const floors: Floor[] = [...]
// AJOUTER ce nouveau constant:

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
```

#### E) Modifier generateInitialAlerts pour accepter floorsData
```typescript
// REMPLACER
export function generateInitialAlerts(): Alert[] {
  const alerts: Alert[] = [];
  let id = 1;
  for (const floor of floors) {  // floors en dur
    // ...
  }
}

// PAR
export function generateInitialAlerts(floorsData: Floor[]): Alert[] {
  const alerts: Alert[] = [];
  let id = 1;
  for (const floor of floorsData) {  // floorsData en paramètre
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
          businessContext: sensor.businessContext,  // AJOUTER
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
          businessContext: sensor.businessContext,  // AJOUTER
        });
      }
    }
  }
  return alerts;
}
```

#### F) Ajouter "flow" dans sensorTypeConfig
```typescript
export const sensorTypeConfig: Record<SensorType, { label: string; iconName: string }> = {
  temperature: { label: "Température", iconName: "thermometer" },
  humidity: { label: "Humidité", iconName: "droplets" },
  pressure: { label: "Pression", iconName: "gauge" },
  vibration: { label: "Vibration", iconName: "activity" },
  rpm: { label: "Vitesse", iconName: "zap" },
  flow: { label: "Débit", iconName: "waves" },  // AJOUTER cette ligne
};
```

---

### 2️⃣ **Fichier: `app/context/simulation-context.tsx`**

#### Créer le fichier si n'existe pas, sinon MODIFIER:
```typescript
import { createContext, useContext, ReactNode } from "react";
import { useSimulation } from "~/hooks/use-simulation";
import type { Alert, Floor, Sensor } from "~/data/mock-data";

interface SimulationContextType {
  floors: Floor[];
  alerts: Alert[];
  allSensors: Sensor[];
  activeCritical: number;
  activeWarning: number;
  acknowledgeAlert: (alertId: string) => void;
  isDairyMode: boolean;              // AJOUTER
  toggleMode: () => void;            // AJOUTER
}

const SimulationContext = createContext<SimulationContextType | null>(null);

export function SimulationProvider({ children }: { children: ReactNode }) {
  const simulation = useSimulation();

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
```

---

### 3️⃣ **Fichier: `app/hooks/use-simulation.ts`**

#### MODIFIER pour supporter le mode laiterie:
```typescript
import { useCallback, useEffect, useRef, useState } from "react";
import type { Alert, Floor, Sensor, SensorStatus } from "~/data/mock-data";
import { 
  generateInitialAlerts, 
  floors as industrialFloors,
  dairyFloors  // AJOUTER cet import
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
  
  // AJOUTER ces états
  const [isDairyMode, setIsDairyMode] = useState(false);
  const initialData = isDairyMode ? dairyFloors : industrialFloors;
  
  const [floors, setFloors] = useState<Floor[]>(() =>
    JSON.parse(JSON.stringify(initialData))
  );
  const [alerts, setAlerts] = useState<Alert[]>(() => 
    generateInitialAlerts(initialData)  // Passer initialData
  );

  // AJOUTER cette fonction
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
                businessContext: sensor.businessContext,  // AJOUTER
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
    isDairyMode,      // AJOUTER
    toggleMode,       // AJOUTER
  };
}
```

---

### 4️⃣ **Fichier: `app/routes/alerts.tsx`**

#### MODIFIER l'affichage des alertes pour inclure le contexte business:
```typescript
// Dans la fonction qui affiche une alerte, AJOUTER après le message principal:

{alert.businessContext && (
  <div className="mt-3 space-y-2 text-sm border-t border-white/10 pt-3">
    <div className="flex items-start gap-2">
      <AlertTriangle className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
      <div>
        <div className="font-medium text-red-400">Risque</div>
        <div className="text-[var(--color-text-muted)]">{alert.businessContext.risk}</div>
      </div>
    </div>
    
    <div className="flex items-start gap-2">
      <DollarSign className="h-4 w-4 text-amber-400 mt-0.5 flex-shrink-0" />
      <div>
        <div className="font-medium text-amber-400">Impact Financier</div>
        <div className="text-[var(--color-text-muted)]">{alert.businessContext.financialImpact}</div>
      </div>
    </div>
    
    <div className="flex items-start gap-2">
      <Wrench className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
      <div>
        <div className="font-medium text-emerald-400">Action Recommandée</div>
        <div className="text-[var(--color-text-muted)]">{alert.businessContext.action}</div>
      </div>
    </div>
  </div>
)}

// AJOUTER ces imports en haut du fichier:
import { DollarSign, Wrench } from "lucide-react";
```

---

### 5️⃣ **Fichier: `app/routes/dashboard-layout.tsx` (ou navbar)**

#### AJOUTER un bouton toggle pour changer de mode:
```typescript
// Dans la navbar, AJOUTER:
import { useSimulationContext } from "~/context/simulation-context";

// Dans le composant:
const { isDairyMode, toggleMode } = useSimulationContext();

// AJOUTER ce bouton dans la navbar:
<button
  onClick={toggleMode}
  className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-sm font-medium"
>
  {isDairyMode ? "🥛 Mode Laiterie" : "🏭 Mode Industriel"}
</button>
```

---

## ✅ CHECKLIST

- [ ] Modifier `mock-data.ts` - Ajouter types et interfaces
- [ ] Ajouter `dairyFloors` dans `mock-data.ts`
- [ ] Modifier `generateInitialAlerts` pour accepter floorsData
- [ ] Ajouter "flow" dans `sensorTypeConfig`
- [ ] Modifier `use-simulation.ts` - Ajouter toggleMode
- [ ] Modifier `alerts.tsx` - Afficher businessContext
- [ ] Ajouter bouton toggle dans navbar
- [ ] Tester le passage entre modes
- [ ] Vérifier que les alertes affichent l'impact financier

---

## 🎯 RÉSULTAT ATTENDU

✅ **Bouton "Mode Laiterie" / "Mode Industriel"** dans navbar

✅ **Mode Laiterie affiche:**
- Chaîne du Froid (lait cru, yaourts, fromages)
- Production Laitière (pasteurisation, homogénéisation...)
- Laboratoire Qualité

✅ **Alertes critiques affichent:**
- 🚨 Risque métier
- 💰 Impact financier chiffré
- 🔧 Action recommandée

✅ **Exemple d'alerte:**
```
🚨 ALERTE CRITIQUE
Temp. Lait Cru : 6.2°C (seuil: 4°C)

⚠️ Risque: Développement bactérien accéléré
💰 Impact: 15 000L × 0,40€/L = 6 000€ de perte
🔧 Action: Vérifier compresseur #1 + Appeler maintenance
```