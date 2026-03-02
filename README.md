# IoT Factory Dashboard — Vue Industrielle Temps-Réel

Un dashboard moderne et performant conçu pour le monitoring industriel, offrant une visualisation interactive des capteurs répartis sur plusieurs étages d'une usine.

![Aperçu du Dashboard](https://github.com/nurdjedidi/IoT-factory-dashboard/raw/main/public/preview.png)

## ✨ Fonctionnalités Clés

- **📊 Vue d'Ensemble Dynamique** : KPI globaux (températures moyennes, alertes critiques) avec graphiques de tendances sur 24h.
- **🗺️ Plans d'Étage Interactifs** : Visualisez l'état des machines directement sur les cartes (Assemblage, Stockage Froid, Zone Machines).
- **⚡ Simulation Temps-Réel** : Données générées dynamiquement (Température, Humidité, Pression, Vibration, RPM) avec dérives aléatoires réalistes.
- **🚨 Gestion des Alertes** : Système d'alertes avec trois niveaux de sévérité (Normal, Attention, Critique) et historique des incidents.
- **🔍 Analyse de Capteur** : Panel latéral détaillé pour chaque capteur avec graphique d'historique 20-points et jauges de seuils.
- **📹 Surveillance Caméra (En cours)** : Intégration de flux vidéo pour superviser les zones à risque.

## 🛠️ Stack Technique

- **Framework** : [React Router v7](https://reactrouter.com/) (Vite)
- **Styling** : [Tailwind CSS](https://tailwindcss.com/) pour une interface responsive et ultra-premium.
- **Visualisation** : [Recharts](https://recharts.org/) pour des graphiques fluides.
- **Icones** : [Lucide React](https://lucide.dev/) pour une sémiologie claire.
- **State Management** : React Context API & Hooks personnalisés (`useSimulation`).

## 🚀 Installation & Lancement

1. **Cloner le repository** :
   ```bash
   git clone https://github.com/nurdjedidi/IoT-factory-dashboard.git
   cd IoT-factory-dashboard
   ```

2. **Installer les dépendances** :
   ```bash
   npm install
   ```

3. **Lancer le serveur de développement** :
   ```bash
   npm run dev
   ```

4. **Vérifier les types (TS)** :
   ```bash
   npm run typecheck
   ```

## 🏗️ Architecture du Projet

- `app/components/ui` : Composants atomiques réutilisables (KpiCard, AlertBadge, etc.).
- `app/components/floor-plans` : SVG interactifs et layouts pour les zones de l'usine.
- `app/hooks` : Logique métier et moteur de simulation.
- `app/context` : État global synchronisé entre les pages.
- `app/data` : Configuration initiale et types TypeScript.

---

*Projet développé par [Nur](https://github.com/nurdjedidi).*