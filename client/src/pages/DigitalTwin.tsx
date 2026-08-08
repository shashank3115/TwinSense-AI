import { useEffect, useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { getDigitalTwinState, getMachineHealth } from "@/services/machineService";
import { getActiveFault, getDegradationFactor, injectFault, resetSimulation } from "@/services/simulationService";
import { DigitalTwinState, FaultScenario, FaultSeverity } from "@/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function DigitalTwin() {
  const { selectedMachine } = useApp();
  const [twinState, setTwinState] = useState<DigitalTwinState | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedFault, setSelectedFault] = useState<FaultScenario>(FaultScenario.BEARING_DEGRADATION);
  const [selectedSeverity, setSelectedSeverity] = useState<FaultSeverity>(FaultSeverity.MEDIUM);

  useEffect(() => {
    const loadData = async () => {
      if (!selectedMachine) return;

      const degradation = getDegradationFactor();
      const activeFault = getActiveFault();

      const twin = await getDigitalTwinState(selectedMachine.id, degradation, activeFault);
      setTwinState(twin);
      setLoading(false);
    };

    loadData();
    const interval = setInterval(loadData, 1000);
    return () => clearInterval(interval);
  }, [selectedMachine]);

  const handleInjectFault = () => {
    injectFault(selectedFault, selectedSeverity);
  };

  const handleReset = () => {
    resetSimulation();
  };

  if (loading || !twinState) {
    return <div className="p-6">Loading...</div>;
  }

  const getHealthColor = (score: number) => {
    if (score >= 80) return "#4ade80"; // green
    if (score >= 60) return "#fbbf24"; // amber
    return "#ef4444"; // red
  };

  const getSensorStatusColor = (status: string) => {
    if (status === "NORMAL") return "#4ade80";
    if (status === "ANOMALY") return "#fbbf24";
    return "#ef4444";
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Digital Twin</h2>
        <p className="text-muted-foreground">
          Virtual representation of {selectedMachine?.name} {selectedMachine?.model}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Schematic */}
        <div className="lg:col-span-2">
          <Card className="bg-card border-border p-8">
            <h3 className="text-lg font-bold text-foreground mb-6">Motor Schematic</h3>

            {/* SVG Motor Schematic */}
            <svg viewBox="0 0 400 300" className="w-full h-auto mb-6" style={{ maxHeight: "400px" }}>
              {/* Motor Housing */}
              <rect x="50" y="80" width="300" height="140" fill="none" stroke="#60a5fa" strokeWidth="2" />

              {/* Rotor */}
              <circle cx="200" cy="150" r="50" fill="none" stroke="#fbbf24" strokeWidth="2" />
              <line x1="200" y1="100" x2="200" y2="200" stroke="#fbbf24" strokeWidth="1" />
              <line x1="150" y1="150" x2="250" y2="150" stroke="#fbbf24" strokeWidth="1" />

              {/* Shaft */}
              <line x1="100" y1="150" x2="300" y2="150" stroke="#e5e7eb" strokeWidth="3" />

              {/* Bearings */}
              <circle cx="100" cy="150" r="15" fill="none" stroke="#60a5fa" strokeWidth="2" />
              <circle cx="300" cy="150" r="15" fill="none" stroke="#60a5fa" strokeWidth="2" />

              {/* Stator */}
              <g opacity="0.5">
                <path d="M 80 100 L 70 80 L 80 60" fill="none" stroke="#60a5fa" strokeWidth="1" />
                <path d="M 320 100 L 330 80 L 320 60" fill="none" stroke="#60a5fa" strokeWidth="1" />
                <path d="M 80 200 L 70 220 L 80 240" fill="none" stroke="#60a5fa" strokeWidth="1" />
                <path d="M 320 200 L 330 220 L 320 240" fill="none" stroke="#60a5fa" strokeWidth="1" />
              </g>

              {/* Sensor Labels */}
              <text x="20" y="60" fill="#92e3a9" fontSize="12" fontWeight="bold">
                Vibration
              </text>
              <circle cx="15" cy="70" r="4" fill={getSensorStatusColor("NORMAL")} />

              <text x="20" y="120" fill="#92e3a9" fontSize="12" fontWeight="bold">
                Temperature
              </text>
              <circle cx="15" cy="130" r="4" fill={getSensorStatusColor("NORMAL")} />

              <text x="20" y="180" fill="#92e3a9" fontSize="12" fontWeight="bold">
                Current
              </text>
              <circle cx="15" cy="190" r="4" fill={getSensorStatusColor("NORMAL")} />

              {/* Health Gauge */}
              <text x="200" y="280" textAnchor="middle" fill="#e5e7eb" fontSize="14" fontWeight="bold">
                Health: {twinState.health.toFixed(1)}%
              </text>
              <rect
                x="120"
                y="290"
                width="160"
                height="8"
                fill="none"
                stroke="#444"
                strokeWidth="1"
                rx="4"
              />
              <rect
                x="120"
                y="290"
                width={(twinState.health / 100) * 160}
                height="8"
                fill={getHealthColor(twinState.health)}
                rx="4"
              />
            </svg>
          </Card>
        </div>

        {/* State Panel */}
        <div className="space-y-4">
          <Card className="bg-card border-border p-4">
            <h3 className="text-lg font-bold text-foreground mb-4">Operating State</h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">State</p>
                <p className="text-lg font-semibold text-foreground">{twinState.operatingState}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">RPM</p>
                <p className="text-lg font-semibold text-foreground">{twinState.rpm}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Temperature</p>
                <p className="text-lg font-semibold text-foreground">{twinState.temperature}°C</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Vibration</p>
                <p className="text-lg font-semibold text-foreground">{twinState.vibration} mm/s</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Current</p>
                <p className="text-lg font-semibold text-foreground">{twinState.current} A</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Risk</p>
                <p className="text-lg font-semibold text-foreground">{twinState.risk}</p>
              </div>
            </div>
          </Card>

          {/* Simulation Controls */}
          <Card className="bg-card border-border p-4">
            <h3 className="text-lg font-bold text-foreground mb-4">Fault Injection</h3>

            <div className="space-y-3">
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
                onClick={handleInjectFault}
                className="w-full bg-red-600 hover:bg-red-700 text-white"
              >
                Inject Fault
              </Button>

              <Button
                onClick={handleReset}
                variant="outline"
                className="w-full"
              >
                Reset to Normal
              </Button>
            </div>
          </Card>

          {/* Active Fault Info */}
          {twinState.activeFault !== FaultScenario.NORMAL && (
            <Card className="bg-red-500/10 border border-red-500/30 p-4">
              <p className="text-sm text-red-400 font-semibold mb-2">SIMULATION SCENARIO</p>
              <p className="text-xs text-red-300">
                {twinState.activeFault.replace(/_/g, " ")} is active. Sensor values are degrading.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
