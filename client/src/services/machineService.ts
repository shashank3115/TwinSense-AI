/**
 * Machine Service - Handles machine state and digital twin data
 */

import {
  DigitalTwinState,
  FaultScenario,
  Machine,
  MachineHealth,
  MachineStatus,
  HealthStatus,
  RiskLevel,
} from "@/types";

// Mock machine database
const MOCK_MACHINES: Machine[] = [
  {
    id: "machine-001",
    name: "Industrial Motor",
    type: "Electric Motor",
    model: "MTR-001",
    status: MachineStatus.RUNNING,
    location: "Production Line A",
    installationDate: "2023-01-15",
    lastMaintenanceDate: "2024-06-20",
  },
];

/**
 * Get machine by ID
 */
export async function getMachineById(machineId: string): Promise<Machine | null> {
  await new Promise((resolve) => setTimeout(resolve, 50));
  return MOCK_MACHINES.find((m) => m.id === machineId) || null;
}

/**
 * Get all machines
 */
export async function getAllMachines(): Promise<Machine[]> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return MOCK_MACHINES;
}

/**
 * Get machine health status
 */
export async function getMachineHealth(
  machineId: string,
  degradationFactor: number = 1,
  activeFault: FaultScenario = FaultScenario.NORMAL
): Promise<MachineHealth> {
  await new Promise((resolve) => setTimeout(resolve, 100));

  // Calculate health score based on degradation
  let healthScore = 94.7 * degradationFactor;
  healthScore = Math.max(10, Math.min(100, healthScore));

  // Determine status
  let status: HealthStatus = HealthStatus.HEALTHY;
  let risk: RiskLevel = RiskLevel.LOW;

  if (healthScore < 50) {
    status = HealthStatus.CRITICAL;
    risk = RiskLevel.HIGH;
  } else if (healthScore < 75) {
    status = HealthStatus.WARNING;
    risk = RiskLevel.MEDIUM;
  }

  // Adjust for active fault
  if (activeFault !== FaultScenario.NORMAL) {
    status = HealthStatus.WARNING;
    risk = RiskLevel.HIGH;
    healthScore = Math.max(30, healthScore * 0.7);
  }

  return {
    machineId,
    healthScore: Math.round(healthScore * 10) / 10,
    status,
    risk,
    operatingState: activeFault === FaultScenario.NORMAL ? "NORMAL" : "DEGRADED",
    lastAnomalyTime: null,
    anomalyCount: 0,
  };
}

/**
 * Get digital twin state
 */
export async function getDigitalTwinState(
  machineId: string,
  degradationFactor: number = 1,
  activeFault: FaultScenario = FaultScenario.NORMAL
): Promise<DigitalTwinState> {
  await new Promise((resolve) => setTimeout(resolve, 120));

  // Baseline values
  let rpm = 1485;
  let temperature = 62.4;
  let vibration = 2.1;
  let current = 8.7;
  let pressure = 4.2;

  // Apply degradation
  const deg = degradationFactor - 1; // 0 when normal, increases with degradation

  // Fault-specific effects
  switch (activeFault) {
    case FaultScenario.BEARING_DEGRADATION:
      vibration += deg * 6; // Vibration increases significantly
      temperature += deg * 25; // Temperature rises
      current += deg * 2; // Slight current increase
      break;
    case FaultScenario.OVERHEATING:
      temperature += deg * 30; // Temperature rises significantly
      vibration += deg * 2; // Slight vibration increase
      break;
    case FaultScenario.ROTOR_IMBALANCE:
      vibration += deg * 8; // Vibration increases strongly
      rpm += deg * 50; // RPM fluctuates slightly
      break;
    case FaultScenario.MOTOR_OVERLOAD:
      current += deg * 8; // Current increases significantly
      temperature += deg * 20; // Temperature increases
      break;
  }

  // Clamp values to realistic ranges
  rpm = Math.max(0, Math.min(3000, rpm));
  temperature = Math.max(20, Math.min(120, temperature));
  vibration = Math.max(0, Math.min(15, vibration));
  current = Math.max(0, Math.min(20, current));
  pressure = Math.max(0, Math.min(10, pressure));

  // Calculate health and risk
  let health = 94.7 * degradationFactor;
  health = Math.max(10, Math.min(100, health));

  let anomalyScore = Math.min(1, deg * 0.5);
  let risk: RiskLevel = RiskLevel.LOW;

  if (health < 50) {
    risk = RiskLevel.HIGH;
    anomalyScore = Math.min(1, anomalyScore + 0.3);
  } else if (health < 75) {
    risk = RiskLevel.MEDIUM;
  }

  return {
    machineId,
    timestamp: Date.now(),
    operatingState: activeFault === FaultScenario.NORMAL ? "NORMAL" : "DEGRADED",
    rpm: Math.round(rpm),
    temperature: Math.round(temperature * 10) / 10,
    vibration: Math.round(vibration * 10) / 10,
    current: Math.round(current * 10) / 10,
    pressure: Math.round(pressure * 10) / 10,
    health: Math.round(health * 10) / 10,
    anomalyScore: Math.round(anomalyScore * 100) / 100,
    risk,
    activeFault,
    isSimulation: true,
  };
}

/**
 * Update machine status
 */
export async function updateMachineStatus(
  machineId: string,
  status: MachineStatus
): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 50));
  const machine = MOCK_MACHINES.find((m) => m.id === machineId);
  if (machine) {
    machine.status = status;
  }
}

/**
 * Get health timeline (recent history)
 */
export async function getHealthTimeline(
  machineId: string,
  degradationFactor: number = 1
): Promise<string[]> {
  await new Promise((resolve) => setTimeout(resolve, 50));

  const timeline: string[] = [];

  // Generate a realistic timeline based on degradation
  if (degradationFactor <= 1) {
    timeline.push("Normal", "Normal", "Normal", "Normal", "Normal");
  } else if (degradationFactor <= 1.2) {
    timeline.push("Normal", "Normal", "Normal", "Slight Deviation", "Normal");
  } else if (degradationFactor <= 1.5) {
    timeline.push("Normal", "Slight Deviation", "Slight Deviation", "Warning", "Warning");
  } else {
    timeline.push("Slight Deviation", "Warning", "Warning", "Critical", "Critical");
  }

  return timeline;
}
