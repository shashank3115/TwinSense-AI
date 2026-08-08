/**
 * Application Context - Global state management for TwinSense AI
 * 
 * Manages:
 * - Selected machine
 * - Demo mode state
 * - Current simulation scenario
 * - Alerts
 */

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { Alert, AlertSeverity, FaultScenario, Machine } from "@/types";

interface AppContextType {
  // Machine selection
  selectedMachine: Machine | null;
  setSelectedMachine: (machine: Machine) => void;

  // Demo mode
  demoMode: boolean;
  setDemoMode: (enabled: boolean) => void;

  // Simulation
  currentSimulationScenario: FaultScenario;
  setCurrentSimulationScenario: (scenario: FaultScenario) => void;

  // Alerts
  alerts: Alert[];
  addAlert: (alert: Alert) => void;
  removeAlert: (alertId: string) => void;
  acknowledgeAlert: (alertId: string) => void;
  clearAlerts: () => void;

  // UI state
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [selectedMachine, setSelectedMachine] = useState<Machine | null>(null);
  const [demoMode, setDemoMode] = useState(true);
  const [currentSimulationScenario, setCurrentSimulationScenario] = useState<FaultScenario>(
    FaultScenario.NORMAL
  );
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const addAlert = useCallback((alert: Alert) => {
    setAlerts((prev) => [alert, ...prev]);

    // Auto-remove non-critical alerts after 5 seconds
    if (alert.severity !== AlertSeverity.CRITICAL) {
      setTimeout(() => {
        removeAlert(alert.id);
      }, 5000);
    }
  }, []);

  const removeAlert = useCallback((alertId: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== alertId));
  }, []);

  const acknowledgeAlert = useCallback((alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) =>
        a.id === alertId
          ? {
              ...a,
              acknowledged: true,
              acknowledgedAt: Date.now(),
            }
          : a
      )
    );
  }, []);

  const clearAlerts = useCallback(() => {
    setAlerts([]);
  }, []);

  const value: AppContextType = {
    selectedMachine,
    setSelectedMachine,
    demoMode,
    setDemoMode,
    currentSimulationScenario,
    setCurrentSimulationScenario,
    alerts,
    addAlert,
    removeAlert,
    acknowledgeAlert,
    clearAlerts,
    sidebarOpen,
    setSidebarOpen,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextType {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
}
