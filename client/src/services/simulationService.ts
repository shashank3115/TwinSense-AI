/**
 * Simulation Service - Manages fault injection and degradation simulation
 * 
 * This service handles the core simulation logic for the digital twin,
 * allowing realistic fault scenarios to be injected and monitored.
 */

import { FaultScenario, FaultSeverity } from "@/types";

export interface SimulationState {
  activeFault: FaultScenario;
  severity: FaultSeverity;
  degradationFactor: number; // 1.0 = normal, > 1.0 = degraded
  elapsedSeconds: number;
  isRunning: boolean;
  startTime: number | null;
}

export interface SimulationConfig {
  faultType: FaultScenario;
  severity: FaultSeverity;
  durationSeconds: number;
}

// Simulation state
let simulationState: SimulationState = {
  activeFault: FaultScenario.NORMAL,
  severity: FaultSeverity.LOW,
  degradationFactor: 1.0,
  elapsedSeconds: 0,
  isRunning: false,
  startTime: null,
};

// Interval for simulation updates
let simulationInterval: NodeJS.Timeout | null = null;

/**
 * Get current simulation state
 */
export function getSimulationState(): SimulationState {
  return { ...simulationState };
}

/**
 * Start a fault simulation
 */
export function startSimulation(config: SimulationConfig): void {
  simulationState = {
    activeFault: config.faultType,
    severity: config.severity,
    degradationFactor: 1.0,
    elapsedSeconds: 0,
    isRunning: true,
    startTime: Date.now(),
  };

  // Clear any existing interval
  if (simulationInterval) {
    clearInterval(simulationInterval);
  }

  // Update simulation every 100ms
  simulationInterval = setInterval(() => {
    if (!simulationState.isRunning) {
      clearInterval(simulationInterval!);
      return;
    }

    simulationState.elapsedSeconds += 0.1;

    // Calculate degradation factor based on severity and elapsed time
    const severityMultiplier: Record<FaultSeverity, number> = {
      [FaultSeverity.LOW]: 0.01,
      [FaultSeverity.MEDIUM]: 0.02,
      [FaultSeverity.HIGH]: 0.04,
    };

    const multiplier = severityMultiplier[simulationState.severity];
    simulationState.degradationFactor = 1.0 + simulationState.elapsedSeconds * multiplier;

    // Stop simulation after duration
    if (simulationState.elapsedSeconds >= config.durationSeconds) {
      stopSimulation();
    }
  }, 100);
}

/**
 * Stop the current simulation
 */
export function stopSimulation(): void {
  if (simulationInterval) {
    clearInterval(simulationInterval);
    simulationInterval = null;
  }

  simulationState = {
    activeFault: FaultScenario.NORMAL,
    severity: FaultSeverity.LOW,
    degradationFactor: 1.0,
    elapsedSeconds: 0,
    isRunning: false,
    startTime: null,
  };
}

/**
 * Reset simulation to normal state
 */
export function resetSimulation(): void {
  stopSimulation();
}

/**
 * Inject a fault immediately (for testing)
 */
export function injectFault(
  faultType: FaultScenario,
  severity: FaultSeverity
): void {
  startSimulation({
    faultType,
    severity,
    durationSeconds: 120, // 2 minutes
  });
}

/**
 * Get degradation factor for current state
 */
export function getDegradationFactor(): number {
  return simulationState.degradationFactor;
}

/**
 * Get active fault
 */
export function getActiveFault(): FaultScenario {
  return simulationState.activeFault;
}

/**
 * Check if simulation is running
 */
export function isSimulationRunning(): boolean {
  return simulationState.isRunning;
}

/**
 * Run a predefined demo scenario
 * This simulates a complete story: healthy → degradation → anomaly → alert → recommendation
 */
export async function runDemoScenario(onUpdate?: (state: SimulationState) => void): Promise<void> {
  // Phase 1: Healthy state (5 seconds)
  resetSimulation();
  for (let i = 0; i < 50; i++) {
    await new Promise((resolve) => setTimeout(resolve, 100));
    if (onUpdate) onUpdate(getSimulationState());
  }

  // Phase 2: Begin degradation (Bearing Degradation, Medium severity, 30 seconds)
  startSimulation({
    faultType: FaultScenario.BEARING_DEGRADATION,
    severity: FaultSeverity.MEDIUM,
    durationSeconds: 30,
  });

  for (let i = 0; i < 300; i++) {
    await new Promise((resolve) => setTimeout(resolve, 100));
    if (onUpdate) onUpdate(getSimulationState());
  }

  // Phase 3: Continue monitoring (10 more seconds at high degradation)
  for (let i = 0; i < 100; i++) {
    await new Promise((resolve) => setTimeout(resolve, 100));
    if (onUpdate) onUpdate(getSimulationState());
  }

  // Reset
  resetSimulation();
}

/**
 * Get scenario description
 */
export function getScenarioDescription(fault: FaultScenario): string {
  const descriptions: Record<FaultScenario, string> = {
    [FaultScenario.NORMAL]: "Normal operation - all systems healthy",
    [FaultScenario.BEARING_DEGRADATION]:
      "Bearing wear detected - vibration and temperature increasing",
    [FaultScenario.OVERHEATING]: "Thermal stress - temperature rising significantly",
    [FaultScenario.ROTOR_IMBALANCE]: "Rotor imbalance - vibration increasing",
    [FaultScenario.MOTOR_OVERLOAD]: "Motor overload - current and temperature rising",
  };

  return descriptions[fault];
}

/**
 * Get recommended action for a fault
 */
export function getRecommendedAction(fault: FaultScenario): string {
  const actions: Record<FaultScenario, string> = {
    [FaultScenario.NORMAL]: "Continue monitoring",
    [FaultScenario.BEARING_DEGRADATION]: "Inspect bearing assembly immediately",
    [FaultScenario.OVERHEATING]: "Check cooling system and reduce load",
    [FaultScenario.ROTOR_IMBALANCE]: "Perform rotor balancing procedure",
    [FaultScenario.MOTOR_OVERLOAD]: "Reduce operating load or increase cooling",
  };

  return actions[fault];
}
