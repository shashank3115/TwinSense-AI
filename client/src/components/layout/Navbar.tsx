import { useApp } from "@/contexts/AppContext";
import { Bell, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavbarProps {
  pageTitle: string;
}

export default function Navbar({ pageTitle }: NavbarProps) {
  const { demoMode, alerts } = useApp();
  const unreadAlerts = alerts.filter((a) => !a.acknowledged).length;

  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6 sticky top-0 z-30">
      {/* Left: Page Title */}
      <h1 className="text-xl font-bold text-foreground">{pageTitle}</h1>

      {/* Right: Controls */}
      <div className="flex items-center gap-4">
        {/* Demo Mode Indicator */}
        {demoMode && (
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30">
            <span className="inline-block w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span>
            <span className="text-xs font-semibold text-amber-400">DEMO SIMULATION</span>
          </div>
        )}

        {/* Search */}
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
          <Search className="w-5 h-5" />
        </Button>

        {/* Notifications */}
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground relative"
          >
            <Bell className="w-5 h-5" />
            {unreadAlerts > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            )}
          </Button>
        </div>

        {/* User Menu */}
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
          <User className="w-5 h-5" />
        </Button>
      </div>
    </header>
  );
}
