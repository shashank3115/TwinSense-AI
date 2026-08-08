import { useEffect, useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { getMachineHealth, getDigitalTwinState } from "@/services/machineService";
import { detectAnomalies, getAIAssessment } from "@/services/predictionService";
import { getSensorReadings } from "@/services/sensorService";
import { MachineHealth, DigitalTwinState, SensorType, SensorReading } from "@/types";
import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { getDegradationFactor, getActiveFault } from "@/services/simulationService";

export default function Overview() {
  const { selectedMachine } = useApp();
  const [machineHealth, setMachineHealth] = useState<MachineHealth | null>(null);
  const [twinState, setTwinState] = useState<DigitalTwinState | null>(null);
  const [sensorData, setSensorData] = useState<Partial<Record<SensorType, SensorReading[]>>>({});
  const [aiAssessment, setAIAssessment] = useState<any>(null);
  const [timeRange, setTimeRange] = useState(60);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!selectedMachine) return;

      const degradation = getDegradationFactor();
      const activeFault = getActiveFault();

      // First get the twin state to use its anomaly score
      const twin = await getDigitalTwinState(selectedMachine.id, degradation, activeFault);

      const [health, vibrationData, tempData, currentData, assessment] = await Promise.all([
        getMachineHealth(selectedMachine.id, degradation, activeFault),
        getSensorReadings("sensor-vibration-001", timeRange, twin.anomalyScore, degradation),
        getSensorReadings("sensor-temp-001", timeRange, twin.anomalyScore, degradation),
        getSensorReadings("sensor-current-001", timeRange, twin.anomalyScore, degradation),
        getAIAssessment(
          selectedMachine.id,
          {
            [SensorType.VIBRATION]: 2.1,
            [SensorType.TEMPERATURE]: 62.4,
            [SensorType.CURRENT]: 8.7,
            [SensorType.RPM]: 1485,
            [SensorType.PRESSURE]: 4.2,
          },
          0,
          94.7,
          activeFault
        ),
      ]);

      setMachineHealth(health);
      setTwinState(twin);
      setSensorData({
        [SensorType.VIBRATION]: vibrationData,
        [SensorType.TEMPERATURE]: tempData,
        [SensorType.CURRENT]: currentData,
      });
      setAIAssessment(assessment);
      setLoading(false);
    };

    loadData();
    const interval = setInterval(loadData, 2000);
    return () => clearInterval(interval);
  }, [selectedMachine, timeRange]);

  if (loading || !machineHealth || !twinState) {
    return <div className="p-6">Loading...</div>;
  }

  // Prepare chart data
  const chartData = (sensorData[SensorType.VIBRATION] || []).map((reading, idx) => ({
    time: new Date(reading.timestamp).toLocaleTimeString(),
    vibration: reading.value,
    temperature: (sensorData[SensorType.TEMPERATURE]?.[idx]?.value || 0),
    current: (sensorData[SensorType.CURRENT]?.[idx]?.value || 0),
  }));

  const getHealthColor = (score: number) => {
    if (score >= 80) return "text-green-400";
    if (score >= 60) return "text-amber-400";
    return "text-red-400";
  };

  const getRiskColor = (risk: string) => {
    if (risk === "LOW") return "bg-green-500/20 text-green-400 border-green-500/30";
    if (risk === "MEDIUM") return "bg-amber-500/20 text-amber-400 border-amber-500/30";
    return "bg-red-500/20 text-red-400 border-red-500/30";
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          {selectedMachine?.name} {selectedMachine?.model}
        </h2>
        <p className="text-muted-foreground">
          Real-time equipment health, AI anomaly detection and digital-twin insights.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Machine Health */}
        <Card className="bg-card border-border p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Machine Health</p>
          <p className={`text-3xl font-bold ${getHealthColor(machineHealth.healthScore)}`}>
            {machineHealth.healthScore.toFixed(1)}%
          </p>
          <p className="text-sm text-foreground mt-2">
            Status: <span className="font-semibold">{machineHealth.status}</span>
          </p>
        </Card>

        {/* Anomaly Score */}
        <Card className="bg-card border-border p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Anomaly Score</p>
          <p className="text-3xl font-bold text-foreground">{twinState.anomalyScore.toFixed(2)}</p>
          <p className="text-sm text-foreground mt-2">
            Status: <span className="font-semibold">Normal</span>
          </p>
        </Card>

        {/* Failure Risk */}
        <Card className="bg-card border-border p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Failure Risk</p>
          <p className={`text-2xl font-bold ${getRiskColor(twinState.risk).split(" ")[2]}`}>
            {twinState.risk}
          </p>
          <p className="text-sm text-muted-foreground mt-2">Current level</p>
        </Card>

        {/* Predicted Maintenance */}
        <Card className="bg-card border-border p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Predicted Maintenance</p>
          <p className="text-3xl font-bold text-foreground">18</p>
          <p className="text-xs text-muted-foreground mt-2">days (Simulation estimate)</p>
        </Card>

        {/* Sensor Streams */}
        <Card className="bg-card border-border p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Sensor Streams</p>
          <p className="text-3xl font-bold text-foreground">5</p>
          <p className="text-sm text-foreground mt-2">
            <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            Active
          </p>
        </Card>
      </div>

      {/* AI Assessment */}
      <Card className="bg-card border-border p-6">
        <h3 className="text-lg font-bold text-foreground mb-4">Current AI Assessment</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <p className="text-sm text-muted-foreground mb-2">Status</p>
            <p className="text-lg font-semibold text-foreground">{aiAssessment?.status}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">Confidence</p>
            <p className="text-lg font-semibold text-foreground">{(aiAssessment?.confidence * 100).toFixed(0)}%</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">Anomaly Score</p>
            <p className="text-lg font-semibold text-foreground">{aiAssessment?.anomalyScore.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">Risk Level</p>
            <p className={`text-lg font-semibold ${getRiskColor(aiAssessment?.risk).split(" ")[2]}`}>
              {aiAssessment?.risk}
            </p>
          </div>
        </div>
      </Card>

      {/* Live Sensor Telemetry */}
      <Card className="bg-card border-border p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-foreground">Live Sensor Telemetry</h3>
          <div className="flex gap-2">
            {[1, 5, 30, 60].map((minutes) => (
              <button
                key={minutes}
                onClick={() => setTimeRange(minutes)}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  timeRange === minutes
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-secondary"
                }`}
              >
                Last {minutes}m
              </button>
            ))}
          </div>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="time" stroke="rgba(255,255,255,0.5)" />
            <YAxis stroke="rgba(255,255,255,0.5)" />
            <Tooltip contentStyle={{ backgroundColor: "#1a1a2e", border: "1px solid #333" }} />
            <Legend />
            <Line type="monotone" dataKey="vibration" stroke="#4ade80" dot={false} />
            <Line type="monotone" dataKey="temperature" stroke="#fbbf24" dot={false} />
            <Line type="monotone" dataKey="current" stroke="#60a5fa" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Machine State Details */}
      <Card className="bg-card border-border p-6">
        <h3 className="text-lg font-bold text-foreground mb-4">Digital Twin State</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">RPM</p>
            <p className="text-2xl font-bold text-foreground">{twinState.rpm}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Temperature</p>
            <p className="text-2xl font-bold text-foreground">{twinState.temperature}°C</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Vibration</p>
            <p className="text-2xl font-bold text-foreground">{twinState.vibration} mm/s</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Current</p>
            <p className="text-2xl font-bold text-foreground">{twinState.current} A</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Pressure</p>
            <p className="text-2xl font-bold text-foreground">{twinState.pressure} bar</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Health</p>
            <p className={`text-2xl font-bold ${getHealthColor(twinState.health)}`}>{twinState.health}%</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
