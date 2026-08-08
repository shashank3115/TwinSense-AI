import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Settings() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Settings</h2>
        <p className="text-muted-foreground">Configuration and system status.</p>
      </div>

      {/* Simulation Settings */}
      <Card className="bg-card border-border p-6">
        <h3 className="text-lg font-bold text-foreground mb-4">Simulation Settings</h3>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-muted-foreground block mb-2">Simulation Frequency</label>
            <select className="w-full px-3 py-2 bg-secondary border border-border rounded text-foreground">
              <option>1 Hz (1 update/second)</option>
              <option>2 Hz (2 updates/second)</option>
              <option>5 Hz (5 updates/second)</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-muted-foreground block mb-2">Theme</label>
            <select className="w-full px-3 py-2 bg-secondary border border-border rounded text-foreground">
              <option>Dark (Default)</option>
              <option>Light</option>
              <option>Auto</option>
            </select>
          </div>

          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-4 h-4" />
              <span className="text-sm text-foreground">Enable notifications</span>
            </label>
          </div>
        </div>
      </Card>

      {/* Backend Status */}
      <Card className="bg-card border-border p-6">
        <h3 className="text-lg font-bold text-foreground mb-4">Backend Status</h3>

        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-secondary border border-border rounded">
            <span className="text-foreground">Demo Mode</span>
            <span className="text-green-400 font-semibold">Connected</span>
          </div>

          <div className="flex justify-between items-center p-3 bg-secondary border border-border rounded">
            <span className="text-foreground">ML API</span>
            <span className="text-gray-400 font-semibold">Not connected</span>
          </div>

          <div className="flex justify-between items-center p-3 bg-secondary border border-border rounded">
            <span className="text-foreground">Database</span>
            <span className="text-gray-400 font-semibold">Not configured</span>
          </div>
        </div>
      </Card>

      {/* API Configuration */}
      <Card className="bg-card border-border p-6">
        <h3 className="text-lg font-bold text-foreground mb-4">API Configuration</h3>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-muted-foreground block mb-2">API Base URL</label>
            <input
              type="text"
              placeholder="https://api.example.com"
              className="w-full px-3 py-2 bg-secondary border border-border rounded text-foreground placeholder-muted-foreground"
            />
          </div>

          <div>
            <label className="text-sm text-muted-foreground block mb-2">API Key</label>
            <input
              type="password"
              placeholder="Enter your API key"
              className="w-full px-3 py-2 bg-secondary border border-border rounded text-foreground placeholder-muted-foreground"
            />
          </div>

          <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
            Save Configuration
          </Button>
        </div>
      </Card>

      {/* Model Configuration */}
      <Card className="bg-card border-border p-6">
        <h3 className="text-lg font-bold text-foreground mb-4">Model Configuration</h3>

        <div className="space-y-3">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Model Version</p>
            <p className="text-foreground font-semibold">v1.0.0 (Demo)</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-1">Dataset Version</p>
            <p className="text-foreground font-semibold">2024-Q2</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-1">Last Updated</p>
            <p className="text-foreground font-semibold">2024-06-20</p>
          </div>
        </div>
      </Card>

      {/* Info */}
      <Card className="bg-blue-500/10 border border-blue-500/30 p-4">
        <p className="text-sm text-blue-300">
          <span className="font-semibold">Production Setup:</span> To connect to a real FastAPI backend, configure the API Base
          URL and API Key above. The application will automatically use your backend for sensor data, predictions, and model
          evaluation.
        </p>
      </Card>
    </div>
  );
}
