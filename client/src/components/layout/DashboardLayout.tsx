import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useApp } from "@/contexts/AppContext";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Overview from "@/pages/Overview";
import DigitalTwin from "@/pages/DigitalTwin";
import LiveMonitoring from "@/pages/LiveMonitoring";
import AIInsights from "@/pages/AIInsights";
import PredictiveMaintenance from "@/pages/PredictiveMaintenance";
import ModelEvaluation from "@/pages/ModelEvaluation";
import SimulationLab from "@/pages/SimulationLab";
import DataSources from "@/pages/DataSources";
import Settings from "@/pages/Settings";
import { getAllMachines } from "@/services/machineService";

const PAGES: Record<string, { title: string; component: React.ComponentType }> = {
  overview: { title: "Industrial Intelligence Overview", component: Overview },
  "digital-twin": { title: "Digital Twin", component: DigitalTwin },
  "live-monitoring": { title: "Live Monitoring", component: LiveMonitoring },
  "ai-insights": { title: "AI Sensor Fusion", component: AIInsights },
  "predictive-maintenance": {
    title: "Predictive Maintenance",
    component: PredictiveMaintenance,
  },
  "model-evaluation": { title: "AI vs Classical Baseline", component: ModelEvaluation },
  "simulation-lab": { title: "Simulation Lab", component: SimulationLab },
  "data-sources": { title: "Data Sources", component: DataSources },
  settings: { title: "Settings", component: Settings },
};

export default function DashboardLayout() {
  const [location] = useLocation();
  const { selectedMachine, setSelectedMachine } = useApp();
  const [isLoading, setIsLoading] = useState(true);

  // Extract page from URL
  const pathSegments = location.split("/").filter(Boolean);
  const pageKey = pathSegments[pathSegments.length - 1] || "overview";
  const page = PAGES[pageKey] || PAGES.overview;
  const PageComponent = page.component;

  // Initialize selected machine
  useEffect(() => {
    const initializeMachine = async () => {
      if (!selectedMachine) {
        const machines = await getAllMachines();
        if (machines.length > 0) {
          setSelectedMachine(machines[0]);
        }
      }
      setIsLoading(false);
    };

    initializeMachine();
  }, [selectedMachine, setSelectedMachine]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar pageTitle={page.title} />
        <main className="flex-1 overflow-auto">
          <PageComponent />
        </main>
      </div>
    </div>
  );
}
