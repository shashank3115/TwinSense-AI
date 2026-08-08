import { useEffect, useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { getDigitalTwinState } from "@/services/machineService";
import { predictMaintenance } from "@/services/predictionService";
import { getDegradationFactor, getActiveFault } from "@/services/simulationService";
import { Prediction, RiskLevel } from "@/types";
import { Card } from "@/components/ui/card";

export default function PredictiveMaintenance() {
  const { selectedMachine } = useApp();
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [twinState, setTwinState] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!selectedMachine) return;

      const degradation = getDegradationFactor();
      const activeFault = getActiveFault();

      const twin = await getDigitalTwinState(selectedMachine.id, degradation, activeFault);
      const pred = await predictMaintenance(
        selectedMachine.id,
        twin.anomalyScore,
        twin.health,
        activeFault,
        degradation
      );

      setTwinState(twin);
      setPrediction(pred);
      setLoading(false);
    };

    loadData();
    const interval = setInterval(loadData, 2000);
    return () => clearInterval(interval);
  }, [selectedMachine]);

  if (loading || !prediction || !twinState) {
    return <div className="p-6">Loading...</div>;
  }

  const getRiskColor = (risk: RiskLevel) => {
    if (risk === RiskLevel.LOW) return "bg-green-500/20 text-green-400 border-green-500/30";
    if (risk === RiskLevel.MEDIUM) return "bg-amber-500/20 text-amber-400 border-amber-500/30";
    return "bg-red-500/20 text-red-400 border-red-500/30";
  };

  const getTimelineStatus = (idx: number, risk: RiskLevel) => {
    if (risk === RiskLevel.LOW) return "bg-green-500";
    if (risk === RiskLevel.MEDIUM) return "bg-amber-500";
    return "bg-red-500";
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Predictive Maintenance</h2>
        <p className="text-muted-foreground">
          AI-driven equipment risk assessment and maintenance recommendations.
        </p>
      </div>

      {/* Risk Assessment */}
      <Card className={`border p-6 ${getRiskColor(prediction.riskLevel)}`}>
        <h3 className="text-lg font-bold mb-4">Equipment Risk Assessment</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm opacity-75 mb-2 uppercase tracking-wide">Risk Level</p>
            <p className="text-3xl font-bold">{prediction.riskLevel}</p>
          </div>

          {prediction.daysUntilFailure !== null && (
            <div>
              <p className="text-sm opacity-75 mb-2 uppercase tracking-wide">Days Until Failure</p>
              <p className="text-3xl font-bold">{prediction.daysUntilFailure}</p>
            </div>
          )}

          <div>
            <p className="text-sm opacity-75 mb-2 uppercase tracking-wide">AI Confidence</p>
            <p className="text-3xl font-bold">{(prediction.confidence * 100).toFixed(0)}%</p>
          </div>
        </div>
      </Card>

      {/* Maintenance Recommendation */}
      <Card className="bg-card border-border p-6">
        <h3 className="text-lg font-bold text-foreground mb-4">Recommended Action</h3>

        <div className="space-y-4">
          <div className="p-4 bg-secondary border border-border rounded-lg">
            <p className="text-lg font-bold text-foreground mb-2">{prediction.recommendedAction}</p>
            <p className="text-sm text-muted-foreground">{prediction.reason}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2 uppercase tracking-wide">Current Health</p>
              <p className="text-2xl font-bold text-foreground">{twinState.health.toFixed(1)}%</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-2 uppercase tracking-wide">Anomaly Score</p>
              <p className="text-2xl font-bold text-foreground">{twinState.anomalyScore.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Maintenance Timeline */}
      <Card className="bg-card border-border p-6">
        <h3 className="text-lg font-bold text-foreground mb-6">Maintenance Timeline</h3>

        <div className="relative">
          {/* Timeline */}
          <div className="space-y-6">
            {[
              { label: "Last Maintenance", date: "2024-06-20", status: "completed" },
              { label: "Current Monitoring", date: "Now", status: "active" },
              { label: "Early Warning", date: "Next 7 days", status: prediction.riskLevel !== RiskLevel.LOW ? "alert" : "pending" },
              { label: "Recommended Inspection", date: prediction.daysUntilFailure ? `${prediction.daysUntilFailure} days` : "TBD", status: prediction.riskLevel === RiskLevel.HIGH ? "urgent" : "pending" },
              { label: "Scheduled Maintenance", date: "To be scheduled", status: "pending" },
            ].map((event, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-4 h-4 rounded-full border-2 ${
                      event.status === "completed"
                        ? "bg-green-500 border-green-500"
                        : event.status === "active"
                          ? "bg-blue-500 border-blue-500 animate-pulse"
                          : event.status === "alert"
                            ? "bg-amber-500 border-amber-500"
                            : event.status === "urgent"
                              ? "bg-red-500 border-red-500"
                              : "border-muted-foreground"
                    }`}
                  />
                  {idx < 4 && (
                    <div className="w-1 h-12 bg-gradient-to-b from-current to-transparent opacity-30 mt-2"></div>
                  )}
                </div>

                <div className="pb-6">
                  <p className="font-semibold text-foreground">{event.label}</p>
                  <p className="text-sm text-muted-foreground">{event.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Current Sensor Status */}
      <Card className="bg-card border-border p-6">
        <h3 className="text-lg font-bold text-foreground mb-4">Current Sensor Status</h3>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { name: "Vibration", value: `${twinState.vibration} mm/s`, status: "normal" },
            { name: "Temperature", value: `${twinState.temperature}°C`, status: "normal" },
            { name: "Current", value: `${twinState.current} A`, status: "normal" },
            { name: "RPM", value: `${twinState.rpm}`, status: "normal" },
            { name: "Pressure", value: `${twinState.pressure} bar`, status: "normal" },
          ].map((sensor) => (
            <div key={sensor.name} className="p-3 bg-secondary border border-border rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">{sensor.name}</p>
              <p className="font-semibold text-foreground">{sensor.value}</p>
              <p className="text-xs text-green-400 mt-1">● Normal</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Info Box */}
      <Card className="bg-blue-500/10 border border-blue-500/30 p-4">
        <p className="text-sm text-blue-300">
          <span className="font-semibold">Demo Mode:</span> This prediction is based on simulated sensor data. The
          recommendation is AI-generated from the simulation scenario. In production, this would use real ML models trained on
          historical maintenance data.
        </p>
      </Card>
    </div>
  );
}
