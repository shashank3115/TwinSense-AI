import { useEffect, useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { getDigitalTwinState } from "@/services/machineService";
import { detectAnomalies, getAIAssessment } from "@/services/predictionService";
import { getDegradationFactor, getActiveFault } from "@/services/simulationService";
import { SensorType } from "@/types";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function AIInsights() {
  const { selectedMachine } = useApp();
  const [assessment, setAssessment] = useState<any>(null);
  const [anomalies, setAnomalies] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!selectedMachine) return;

      const degradation = getDegradationFactor();
      const activeFault = getActiveFault();

      const twin = await getDigitalTwinState(selectedMachine.id, degradation, activeFault);

      const [assess, anom] = await Promise.all([
        getAIAssessment(
          selectedMachine.id,
          {
            [SensorType.VIBRATION]: twin.vibration,
            [SensorType.TEMPERATURE]: twin.temperature,
            [SensorType.CURRENT]: twin.current,
            [SensorType.RPM]: twin.rpm,
            [SensorType.PRESSURE]: twin.pressure,
          },
          twin.anomalyScore,
          twin.health,
          activeFault
        ),
        detectAnomalies(
          selectedMachine.id,
          {
            [SensorType.VIBRATION]: twin.vibration,
            [SensorType.TEMPERATURE]: twin.temperature,
            [SensorType.CURRENT]: twin.current,
            [SensorType.RPM]: twin.rpm,
            [SensorType.PRESSURE]: twin.pressure,
          },
          activeFault,
          degradation
        ),
      ]);

      setAssessment(assess);
      setAnomalies(anom);
      setLoading(false);
    };

    loadData();
    const interval = setInterval(loadData, 2000);
    return () => clearInterval(interval);
  }, [selectedMachine]);

  if (loading || !assessment || !anomalies) {
    return <div className="p-6">Loading...</div>;
  }

  const getStatusColor = (status: string) => {
    if (status.includes("NORMAL")) return "text-green-400";
    if (status.includes("SLIGHT")) return "text-amber-400";
    if (status.includes("CRITICAL")) return "text-red-400";
    return "text-blue-400";
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">AI Sensor Fusion</h2>
        <p className="text-muted-foreground">
          Combining multiple sensor signals to detect abnormal machine behaviour.
        </p>
      </div>

      {/* Sensor Fusion Flow */}
      <Card className="bg-card border-border p-6">
        <h3 className="text-lg font-bold text-foreground mb-6">Sensor Fusion Pipeline</h3>

        <div className="space-y-4">
          {/* Input Sensors */}
          <div className="flex flex-wrap gap-3 justify-center mb-6">
            {[
              { name: "Vibration", icon: "📊" },
              { name: "Temperature", icon: "🌡️" },
              { name: "Current", icon: "⚡" },
              { name: "RPM", icon: "⚙️" },
              { name: "Pressure", icon: "🔧" },
            ].map((sensor) => (
              <div
                key={sensor.name}
                className="px-4 py-2 bg-secondary border border-border rounded-lg text-center"
              >
                <p className="text-2xl">{sensor.icon}</p>
                <p className="text-xs text-muted-foreground mt-1">{sensor.name}</p>
              </div>
            ))}
          </div>

          {/* Pipeline Steps */}
          <div className="space-y-3">
            {[
              "Feature Extraction",
              "Multi-Sensor Fusion",
              "AI Anomaly Detection",
              "Health & Risk Assessment",
            ].map((step, idx) => (
              <div key={step}>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                    {idx + 1}
                  </div>
                  <p className="text-foreground font-semibold">{step}</p>
                </div>
                {idx < 3 && (
                  <div className="ml-4 mb-3">
                    <div className="h-1 bg-gradient-to-r from-primary to-transparent rounded-full"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Current Assessment */}
      <Card className="bg-card border-border p-6">
        <h3 className="text-lg font-bold text-foreground mb-4">Current AI Assessment</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-muted-foreground mb-2 uppercase tracking-wide">Status</p>
            <p className={`text-2xl font-bold ${getStatusColor(assessment.status)}`}>
              {assessment.status}
            </p>
            <p className="text-xs text-muted-foreground mt-2">{assessment.description}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-2 uppercase tracking-wide">Confidence</p>
            <p className="text-2xl font-bold text-foreground">{(assessment.confidence * 100).toFixed(0)}%</p>
            <Progress
              value={assessment.confidence * 100}
              className="mt-2 h-2"
            />
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-2 uppercase tracking-wide">Anomaly Score</p>
            <p className="text-2xl font-bold text-foreground">{assessment.anomalyScore.toFixed(2)}</p>
            <Progress
              value={assessment.anomalyScore * 100}
              className="mt-2 h-2"
            />
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-2 uppercase tracking-wide">Risk Level</p>
            <p className="text-2xl font-bold text-foreground">{assessment.risk}</p>
          </div>
        </div>
      </Card>

      {/* Contributing Signals */}
      <Card className="bg-card border-border p-6">
        <h3 className="text-lg font-bold text-foreground mb-4">Contributing Signals</h3>

        <div className="space-y-4">
          {anomalies.contributingFactors.map((factor: any, idx: number) => (
            <div key={idx}>
              <div className="flex justify-between items-center mb-2">
                <p className="text-foreground font-medium">{factor.sensorType}</p>
                <p className="text-sm text-muted-foreground">
                  {(factor.weight * 100).toFixed(0)}% weight
                </p>
              </div>
              <Progress
                value={factor.weight * 100}
                className="h-2"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Deviation: {(factor.deviation * 100).toFixed(1)}%
              </p>
            </div>
          ))}
        </div>
      </Card>

      {/* Anomaly Detection Details */}
      <Card className="bg-card border-border p-6">
        <h3 className="text-lg font-bold text-foreground mb-4">Anomaly Detection Details</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-muted-foreground mb-2 uppercase tracking-wide">Is Anomaly</p>
            <p className="text-lg font-semibold text-foreground">
              {anomalies.isAnomaly ? "Yes" : "No"}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-2 uppercase tracking-wide">Confidence</p>
            <p className="text-lg font-semibold text-foreground">
              {(anomalies.confidence * 100).toFixed(0)}%
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-2 uppercase tracking-wide">Anomaly Score</p>
            <p className="text-lg font-semibold text-foreground">
              {anomalies.anomalyScore.toFixed(3)}
            </p>
          </div>
        </div>

        <div className="mt-4 p-4 bg-secondary border border-border rounded">
          <p className="text-sm text-foreground">{anomalies.description}</p>
        </div>
      </Card>

      {/* Info Box */}
      <Card className="bg-blue-500/10 border border-blue-500/30 p-4">
        <p className="text-sm text-blue-300">
          <span className="font-semibold">Demo Mode:</span> This AI assessment is based on simulated sensor data and
          demonstrates the sensor fusion pipeline. In production, this would connect to a real Python/FastAPI ML backend.
        </p>
      </Card>
    </div>
  );
}
