import { useEffect, useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { getDigitalTwinState } from "@/services/machineService";
import { getDegradationFactor, getActiveFault, injectFault, resetSimulation } from "@/services/simulationService";
import { FaultScenario, FaultSeverity } from "@/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function SimulationLab() {
  const { selectedMachine } = useApp();
  const [twinState, setTwinState] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedFault, setSelectedFault] = useState<FaultScenario>(FaultScenario.BEARING_DEGRADATION);
  const [selectedSeverity, setSelectedSeverity] = useState<FaultSeverity>(FaultSeverity.MEDIUM);
  const [chartData, setChartData] = useState<any[]>([]);
  const [operatingLoad, setOperatingLoad] = useState(50);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      if (!selectedMachine) return;

      const degradation = getDegradationFactor();
      const activeFault = getActiveFault();

      const twin = await getDigitalTwinState(selectedMachine.id, degradation, activeFault);
      setTwinState(twin);
      setLoading(false);

      // Add to chart
      setChartData((prev) => [
        ...prev.slice(-59),
        {
          time: new Date().toLocaleTimeString(),
          vibration: twin.vibration,
          temperature: twin.temperature,
          current: twin.current,
          health: twin.health,
        },
      ]);
    };

    loadData();
    const interval = setInterval(loadData, 500);
    return () => clearInterval(interval);
  }, [selectedMachine]);

  const handleRunSimulation = () => {
    injectFault(selectedFault, selectedSeverity);
    setIsRunning(true);
    setTimeout(() => setIsRunning(false), 120000); // 2 minutes
  };

  const handleReset = () => {
    resetSimulation();
    setChartData([]);
    setIsRunning(false);
  };

  if (loading || !twinState) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Simulation Lab</h2>
        <p className="text-muted-foreground">
          Test equipment behaviour under controlled operating conditions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Controls */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="bg-card border-border p-4">
            <h3 className="text-lg font-bold text-foreground mb-4">Simulation Controls</h3>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground block mb-2">Machine</label>
                <p className="px-3 py-2 bg-secondary border border-border rounded text-foreground text-sm">
                  {selectedMachine?.name} {selectedMachine?.model}
                </p>
              </div>

              <div>
                <label className="text-sm text-muted-foreground block mb-2">Operating Load: {operatingLoad}%</label>
                <Slider
                  value={[operatingLoad]}
                  onValueChange={(val) => setOperatingLoad(val[0])}
                  min={0}
                  max={100}
                  step={5}
                  className="w-full"
                />
              </div>

              <div>
                <label className="text-sm text-muted-foreground block mb-2">Fault Type</label>
                <select
                  value={selectedFault}
                  onChange={(e) => setSelectedFault(e.target.value as FaultScenario)}
                  className="w-full px-3 py-2 bg-secondary border border-border rounded text-foreground text-sm"
                >
                  <option value={FaultScenario.BEARING_DEGRADATION}>Bearing Degradation</option>
                  <option value={FaultScenario.OVERHEATING}>Overheating</option>
                  <option value={FaultScenario.ROTOR_IMBALANCE}>Rotor Imbalance</option>
                  <option value={FaultScenario.MOTOR_OVERLOAD}>Motor Overload</option>
                </select>
              </div>

              <div>
                <label className="text-sm text-muted-foreground block mb-2">Severity</label>
                <select
                  value={selectedSeverity}
                  onChange={(e) => setSelectedSeverity(e.target.value as FaultSeverity)}
                  className="w-full px-3 py-2 bg-secondary border border-border rounded text-foreground text-sm"
                >
                  <option value={FaultSeverity.LOW}>Low</option>
                  <option value={FaultSeverity.MEDIUM}>Medium</option>
                  <option value={FaultSeverity.HIGH}>High</option>
                </select>
              </div>

              <Button
                onClick={handleRunSimulation}
                disabled={isRunning}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {isRunning ? "Running..." : "Run Simulation"}
              </Button>

              <Button
                onClick={handleReset}
                variant="outline"
                className="w-full"
              >
                Reset
              </Button>
            </div>
          </Card>

          {/* Current State */}
          <Card className="bg-card border-border p-4">
            <h3 className="text-sm font-bold text-foreground mb-3">Current State</h3>

            <div className="space-y-2 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">RPM</p>
                <p className="font-semibold text-foreground">{twinState.rpm}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Temperature</p>
                <p className="font-semibold text-foreground">{twinState.temperature}°C</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Vibration</p>
                <p className="font-semibold text-foreground">{twinState.vibration} mm/s</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Current</p>
                <p className="font-semibold text-foreground">{twinState.current} A</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Health</p>
                <p className="font-semibold text-foreground">{twinState.health.toFixed(1)}%</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Chart */}
        <div className="lg:col-span-3">
          <Card className="bg-card border-border p-6">
            <h3 className="text-lg font-bold text-foreground mb-4">Sensor Behaviour During Simulation</h3>

            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="time" stroke="rgba(255,255,255,0.5)" />
                  <YAxis stroke="rgba(255,255,255,0.5)" />
                  <Tooltip contentStyle={{ backgroundColor: "#1a1a2e", border: "1px solid #333" }} />
                  <Legend />
                  <Line type="monotone" dataKey="vibration" stroke="#4ade80" dot={false} />
                  <Line type="monotone" dataKey="temperature" stroke="#fbbf24" dot={false} />
                  <Line type="monotone" dataKey="current" stroke="#60a5fa" dot={false} />
                  <Line type="monotone" dataKey="health" stroke="#a78bfa" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-96 flex items-center justify-center bg-secondary border border-border rounded">
                <p className="text-muted-foreground">Run a simulation to see sensor data</p>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Info */}
      <Card className="bg-blue-500/10 border border-blue-500/30 p-4">
        <p className="text-sm text-blue-300">
          <span className="font-semibold">Simulation Lab:</span> Use this lab to test how the system responds to different
          fault scenarios. Select a fault type and severity, then run the simulation to watch sensor values change in real-time
          and observe how the AI detects anomalies.
        </p>
      </Card>
    </div>
  );
}
