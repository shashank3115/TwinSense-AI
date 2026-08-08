import { useEffect, useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { getDigitalTwinState } from "@/services/machineService";
import { getDegradationFactor, getActiveFault } from "@/services/simulationService";
import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function LiveMonitoring() {
  const { selectedMachine } = useApp();
  const [twinState, setTwinState] = useState<any>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [timeRange, setTimeRange] = useState(60);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!selectedMachine) return;

      const degradation = getDegradationFactor();
      const activeFault = getActiveFault();

      const twin = await getDigitalTwinState(selectedMachine.id, degradation, activeFault);
      setTwinState(twin);
      setLoading(false);

      setChartData((prev) => [
        ...prev.slice(-59),
        {
          time: new Date().toLocaleTimeString(),
          vibration: twin.vibration,
          temperature: twin.temperature,
          current: twin.current,
          rpm: twin.rpm / 100, // Scale for chart visibility
        },
      ]);
    };

    loadData();
    const interval = setInterval(loadData, 1000);
    return () => clearInterval(interval);
  }, [selectedMachine, timeRange]);

  if (loading || !twinState) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Live Monitoring</h2>
        <p className="text-muted-foreground">Real-time sensor telemetry and AI monitoring status.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* AI Monitor Panel */}
        <Card className="bg-card border-border p-4">
          <h3 className="text-lg font-bold text-foreground mb-4">AI Monitor</h3>

          <div className="space-y-3">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Status</p>
              <p className="text-lg font-semibold text-green-400">Monitoring</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Anomaly Score</p>
              <p className="text-lg font-semibold text-foreground">{twinState.anomalyScore.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Health</p>
              <p className="text-lg font-semibold text-foreground">{twinState.health.toFixed(1)}%</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Risk</p>
              <p className="text-lg font-semibold text-foreground">{twinState.risk}</p>
            </div>
          </div>
        </Card>

        {/* Recent Events */}
        <Card className="bg-card border-border p-4 lg:col-span-3">
          <h3 className="text-lg font-bold text-foreground mb-4">Recent Events</h3>

          <div className="space-y-2 text-sm">
            {[
              { time: "Now", event: "AI inference completed" },
              { time: "1s ago", event: "Sensor synchronization complete" },
              { time: "2s ago", event: "Normal operating pattern detected" },
              { time: "3s ago", event: "Temperature variation within expected range" },
              { time: "4s ago", event: "All sensors reporting nominal values" },
            ].map((log, idx) => (
              <div key={idx} className="flex justify-between text-muted-foreground">
                <span className="text-xs">{log.time}</span>
                <span className="text-xs text-foreground">{log.event}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Telemetry Chart */}
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
    </div>
  );
}
