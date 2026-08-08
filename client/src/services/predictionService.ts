/**
 * Prediction Service - Handles AI predictions and anomaly detection
 * 
 * This service abstracts prediction logic, allowing easy replacement
 * with real FastAPI ML endpoints later.
 */

import {
  AnomalyResult,
  FaultScenario,
  Prediction,
  RiskLevel,
  SensorType,
} from "@/types";

/**
 * Calculate anomaly score based on sensor readings
 * In a real system, this would call a Python ML model
 */
export async function detectAnomalies(
  machineId: string,
  sensorReadings: Record<SensorType, number>,
  activeFault: FaultScenario = FaultScenario.NORMAL,
  degradationFactor: number = 1
): Promise<AnomalyResult> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 200));

  // Baseline "normal" values
  const baselines: Record<SensorType, number> = {
    [SensorType.VIBRATION]: 2.1,
    [SensorType.TEMPERATURE]: 62.4,
    [SensorType.CURRENT]: 8.7,
    [SensorType.RPM]: 1485,
    [SensorType.PRESSURE]: 4.2,
  };

  // Calculate deviations from baseline
  const deviations: Record<SensorType, number> = {} as Record<SensorType, number>;
  let totalDeviation = 0;

  for (const [sensorType, value] of Object.entries(sensorReadings)) {
    const baseline = baselines[sensorType as SensorType];
    const deviation = Math.abs(value - baseline) / baseline;
    deviations[sensorType as SensorType] = deviation;
    totalDeviation += deviation;
  }

  // Calculate anomaly score (0-1)
  let anomalyScore = Math.min(1, totalDeviation / 5);

  // Increase anomaly score if a fault is active
  if (activeFault !== FaultScenario.NORMAL) {
    anomalyScore = Math.min(1, anomalyScore + (degradationFactor - 1) * 0.3);
  }

  // Determine contributing factors
  const contributingFactors = Object.entries(deviations)
    .map(([sensorType, deviation]) => ({
      sensorType: sensorType as SensorType,
      deviation,
      weight: deviation / totalDeviation,
    }))
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 3); // Top 3 factors

  // Generate description
  let description = "Normal operating pattern";
  if (anomalyScore > 0.3) {
    description = "Slight deviation from baseline detected";
  }
  if (anomalyScore > 0.6) {
    description = "Significant anomaly detected - investigate recommended";
  }
  if (anomalyScore > 0.8) {
    description = "Critical anomaly - immediate action required";
  }

  return {
    machineId,
    timestamp: Date.now(),
    anomalyScore,
    isAnomaly: anomalyScore > 0.5,
    confidence: 0.85 + Math.random() * 0.1, // 85-95% confidence
    contributingFactors,
    description,
  };
}

/**
 * Predict maintenance needs based on current state
 */
export async function predictMaintenance(
  machineId: string,
  anomalyScore: number,
  healthScore: number,
  activeFault: FaultScenario = FaultScenario.NORMAL,
  degradationFactor: number = 1
): Promise<Prediction> {
  await new Promise((resolve) => setTimeout(resolve, 150));

  // Determine risk level based on anomaly and health
  let riskLevel: RiskLevel = RiskLevel.LOW;
  let daysUntilFailure: number | null = null;
  let confidence = 0.92;

  if (healthScore < 70) {
    riskLevel = RiskLevel.HIGH;
    daysUntilFailure = Math.max(1, Math.floor((healthScore / 100) * 30));
    confidence = 0.88;
  } else if (healthScore < 85) {
    riskLevel = RiskLevel.MEDIUM;
    daysUntilFailure = Math.floor((healthScore / 100) * 45);
    confidence = 0.90;
  } else {
    riskLevel = RiskLevel.LOW;
    daysUntilFailure = null;
    confidence = 0.94;
  }

  // Adjust based on active fault
  if (activeFault !== FaultScenario.NORMAL) {
    riskLevel = RiskLevel.HIGH;
    daysUntilFailure = Math.max(1, Math.floor(Math.random() * 30 + 5));
    confidence = 0.85;
  }

  // Generate recommendation
  let recommendedAction = "Continue monitoring";
  let reason = "Machine operating within normal parameters";

  if (riskLevel === RiskLevel.MEDIUM) {
    recommendedAction = "Schedule maintenance within 2 weeks";
    reason = "Sensor readings show gradual degradation";
  } else if (riskLevel === RiskLevel.HIGH) {
    recommendedAction = "Inspect bearing assembly immediately";
    reason =
      activeFault === FaultScenario.BEARING_DEGRADATION
        ? "Elevated vibration and rising temperature indicate bearing wear"
        : "Multiple sensor signals deviate from learned normal pattern";
  }

  return {
    machineId,
    timestamp: Date.now(),
    daysUntilFailure,
    riskLevel,
    confidence,
    recommendedAction,
    reason,
    isSimulation: true,
  };
}

/**
 * Get AI assessment of current machine state
 */
export async function getAIAssessment(
  machineId: string,
  sensorReadings: Record<SensorType, number>,
  anomalyScore: number,
  healthScore: number,
  activeFault: FaultScenario = FaultScenario.NORMAL
): Promise<{
  status: string;
  confidence: number;
  anomalyScore: number;
  risk: RiskLevel;
  description: string;
}> {
  await new Promise((resolve) => setTimeout(resolve, 100));

  let status = "NORMAL OPERATING PATTERN";
  let risk = RiskLevel.LOW;
  let confidence = 0.92;
  let description = "All sensor signals within expected range";

  if (anomalyScore > 0.3) {
    status = "SLIGHT DEVIATION DETECTED";
    risk = RiskLevel.MEDIUM;
    confidence = 0.88;
    description = "Some sensor values show minor deviation from baseline";
  }

  if (anomalyScore > 0.6) {
    status = "ANOMALY DETECTED";
    risk = RiskLevel.HIGH;
    confidence = 0.85;
    description = "Multiple sensor signals indicate abnormal operating behavior";
  }

  if (activeFault !== FaultScenario.NORMAL) {
    status = "AI ANOMALY DETECTED";
    risk = RiskLevel.HIGH;
    confidence = 0.87;
    description = "Multiple sensor signals deviate from the learned normal operating pattern";
  }

  return {
    status,
    confidence,
    anomalyScore,
    risk,
    description,
  };
}

/**
 * Get model evaluation metrics (placeholder for demo)
 */
export async function getModelEvaluation(): Promise<
  Array<{
    metric: string;
    classicalBaseline: number | null;
    twinSenseAI: number | null;
    unit: string;
    isDemo: boolean;
  }>
> {
  await new Promise((resolve) => setTimeout(resolve, 100));

  return [
    {
      metric: "Accuracy",
      classicalBaseline: 82,
      twinSenseAI: 94,
      unit: "%",
      isDemo: true,
    },
    {
      metric: "Precision",
      classicalBaseline: 78,
      twinSenseAI: 91,
      unit: "%",
      isDemo: true,
    },
    {
      metric: "Recall",
      classicalBaseline: 75,
      twinSenseAI: 89,
      unit: "%",
      isDemo: true,
    },
    {
      metric: "F1 Score",
      classicalBaseline: 76,
      twinSenseAI: 90,
      unit: "%",
      isDemo: true,
    },
    {
      metric: "False Alarm Rate",
      classicalBaseline: 12,
      twinSenseAI: 4,
      unit: "%",
      isDemo: true,
    },
    {
      metric: "Detection Lead Time",
      classicalBaseline: 6,
      twinSenseAI: 18,
      unit: "hours",
      isDemo: true,
    },
    {
      metric: "Inference Latency",
      classicalBaseline: 250,
      twinSenseAI: 45,
      unit: "ms",
      isDemo: true,
    },
  ];
}
