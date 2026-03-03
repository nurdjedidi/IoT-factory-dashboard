import {
  Bell,
  Camera,
  Cog,
  Factory,
  LayoutDashboard,
  Menu,
  Radio,
  Snowflake,
  X,
} from "lucide-react";
import { useState } from "react";
import { NavLink, Outlet } from "react-router";

interface LayoutProps {
  alertCount?: number;
}

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/cameras", label: "Caméras", icon: Camera },
  { to: "/alerts", label: "Alertes", icon: Bell },
];

const floorItems = [
  { to: "/floor/assembly", label: "Assemblage", icon: Cog },
  { to: "/floor/cold-storage", label: "Stockage Froid", icon: Snowflake },
  { to: "/floor/machines", label: "Machines", icon: Factory },
];

export function DashboardLayout({ alertCount = 0 }: LayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--color-surface-900)]">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-[var(--color-surface-800)]
        border-r border-[var(--color-surface-500)]/20 shrink-0">
        <SidebarContent alertCount={alertCount} />
      </aside>

      <div className="flex flex-col flex-1 min-w-0">
        {/* Header - Mobile */}
        <header className="lg:hidden flex items-center justify-between p-4
          bg-[var(--color-surface-800)] border-b border-[var(--color-surface-500)]/20 z-30">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-cyan-500 to-emerald-500
              flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Radio className="h-4.5 w-4.5 text-white" />
            </div>
            <span className="font-bold tracking-tight text-sm">Dashboard IoT</span>
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 -mr-2 rounded-lg hover:bg-[var(--color-surface-700)] transition-colors
              text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
          >
            <Menu className="h-6 w-6" />
          </button>
        </header>

        {/* Mobile Sidebar / Drawer */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-fade-in"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Content */}
            <aside className="absolute top-0 left-0 bottom-0 w-[280px] bg-[var(--color-surface-800)]
              shadow-2xl flex flex-col animate-slide-in-left border-r border-[var(--color-surface-500)]/20">
              <div className="flex items-center justify-between p-5 border-b border-[var(--color-surface-500)]/20">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-cyan-500 to-emerald-500
                    flex items-center justify-center">
                    <Radio className="h-4.5 w-4.5 text-white" />
                  </div>
                  <span className="font-bold text-sm">IoT Dashboard</span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-lg hover:bg-[var(--color-surface-700)] transition-colors"
                >
                  <X className="h-5 w-5 text-[var(--color-text-muted)]" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto">
                <SidebarContent
                  alertCount={alertCount}
                  onItemClick={() => setIsMobileMenuOpen(false)}
                />
              </div>

              <div className="p-5 border-t border-[var(--color-surface-500)]/20">
                <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  Direct actif
                </div>
              </div>
            </aside>
          </div>
        )}

        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function SidebarContent({
  alertCount,
  onItemClick
}: {
  alertCount: number;
  onItemClick?: () => void;
}) {
  return (
    <div className="flex flex-col h-full">
      <div className="hidden lg:block p-6 border-b border-[var(--color-surface-500)]/20">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-500 to-emerald-500
            flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Radio className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-wide">IoT Dashboard</h1>
            <p className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-tighter">Usine Intelligente</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 pt-6 px-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            onClick={onItemClick}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200
              ${
                isActive
                  ? "bg-gradient-to-r from-cyan-500/10 to-transparent text-[var(--color-accent-cyan)] font-semibold border-l-2 border-[var(--color-accent-cyan)]"
                  : "text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-700)]/50"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon className={`h-4.5 w-4.5 ${isActive ? "text-[var(--color-accent-cyan)]" : ""}`} />
                <span>{item.label}</span>
                {item.to === "/alerts" && alertCount > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full shadow-lg shadow-red-500/20">
                    {alertCount}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}

        <div className="pt-8 pb-2 px-3">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-text-muted)]/40">
            Étages & Zones
          </span>
        </div>

        {floorItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onItemClick}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200
              ${
                isActive
                  ? "bg-gradient-to-r from-[var(--color-surface-600)] to-transparent text-[var(--color-text-primary)] font-semibold border-l-2 border-[var(--color-text-primary)]"
                  : "text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-700)]/50"
              }`
            }
          >
            <item.icon className="h-4.5 w-4.5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="hidden lg:block p-6 border-t border-[var(--color-surface-500)]/20">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-[var(--color-surface-700)]/30 border border-[var(--color-surface-500)]/10">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium truncate">Simulateur v1.4</p>
            <p className="text-[10px] text-emerald-400 flex items-center gap-1 mt-0.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Connecté
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
