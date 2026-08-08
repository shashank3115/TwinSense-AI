import { useLocation } from "wouter";
import { useApp } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const NAV_ITEMS = [
  { label: "Overview", href: "/overview", icon: "📊" },
  { label: "Digital Twin", href: "/digital-twin", icon: "🔧" },
  { label: "Live Monitoring", href: "/live-monitoring", icon: "📈" },
  { label: "AI Insights", href: "/ai-insights", icon: "🧠" },
  { label: "Predictive Maintenance", href: "/predictive-maintenance", icon: "⚠️" },
  { label: "Simulation Lab", href: "/simulation-lab", icon: "🧪" },
  { label: "Model Evaluation", href: "/model-evaluation", icon: "📋" },
  { label: "Data Sources", href: "/data-sources", icon: "📡" },
  { label: "Settings", href: "/settings", icon: "⚙️" },
];

export default function Sidebar() {
  const [, navigate] = useLocation();
  const { sidebarOpen, setSidebarOpen, demoMode } = useApp();

  return (
    <>
      {/* Mobile menu button */}
      <div className="hidden max-md:flex fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="bg-card border-border"
        >
          {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </Button>
      </div>

      {/* Sidebar */}
      <aside
        className={`
          fixed md:static inset-y-0 left-0 z-40 w-64 bg-sidebar border-r border-sidebar-border
          transition-transform duration-300 ease-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          flex flex-col
        `}
      >
        {/* Logo Section */}
        <div className="p-6 border-b border-sidebar-border">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded bg-sidebar-primary flex items-center justify-center">
              <img
                src="/manus-storage/twinsense-logo_7a3c57cf.png"
                alt="TwinSense AI"
                className="w-8 h-8"
              />
            </div>
            <div>
              <h1 className="font-bold text-sidebar-foreground text-lg">TwinSense AI</h1>
              <p className="text-xs text-sidebar-accent-foreground/70">
                Industrial Intelligence Platform
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.href}
              onClick={() => {
                navigate(item.href);
                setSidebarOpen(false);
              }}
              className="w-full text-left px-4 py-3 rounded-md text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors text-sm font-medium"
            >
              <span className="mr-3">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        {/* Status Footer */}
        <div className="border-t border-sidebar-border p-4 space-y-3">
          <div>
            <p className="text-xs text-sidebar-accent-foreground/60 uppercase tracking-wide">
              System Status
            </p>
            <p className="text-sm text-sidebar-foreground mt-1">
              <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              All systems operational
            </p>
          </div>

          <div>
            <p className="text-xs text-sidebar-accent-foreground/60 uppercase tracking-wide">
              Demo Mode
            </p>
            <p className="text-sm text-sidebar-foreground mt-1">
              <span
                className={`inline-block w-2 h-2 rounded-full mr-2 ${
                  demoMode ? "bg-amber-500" : "bg-green-500"
                }`}
              ></span>
              {demoMode ? "Simulation active" : "Live mode"}
            </p>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  );
}
