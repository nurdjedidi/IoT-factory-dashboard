import {
  Bell,
  Camera,
  Cog,
  Factory,
  LayoutDashboard,
  Radio,
  Snowflake,
} from "lucide-react";
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
  return (
    <div className="flex h-screen overflow-hidden">
      <aside className="hidden md:flex flex-col w-64 bg-[var(--color-surface-800)]
        border-r border-[var(--color-surface-500)]/20 shrink-0">

        <div className="p-5 border-b border-[var(--color-surface-500)]/20">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-500 to-emerald-500
              flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Radio className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-wide">IoT Dashboard</h1>
              <p className="text-xs text-[var(--color-text-muted)]">Monitoring temps réel</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200
                ${
                  isActive
                    ? "bg-gradient-to-r from-[var(--color-surface-600)] to-[var(--color-surface-700)] text-[var(--color-text-primary)] font-medium shadow-sm border border-[var(--color-surface-500)]/20"
                    : "text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-700)]"
                }`
              }
            >
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
              {item.to === "/alerts" && alertCount > 0 && (
                <span className="ml-auto bg-red-500/20 text-red-400 text-xs font-medium px-2 py-0.5 rounded-full border border-red-500/20">
                  {alertCount}
                </span>
              )}
            </NavLink>
          ))}

          <div className="pt-3 pb-1 px-3">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]/50">
              Zones
            </span>
          </div>

          {floorItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200
                ${
                  isActive
                    ? "bg-gradient-to-r from-[var(--color-surface-600)] to-[var(--color-surface-700)] text-[var(--color-text-primary)] font-medium shadow-sm border border-[var(--color-surface-500)]/20"
                    : "text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-700)]"
                }`
              }
            >
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>


        <div className="p-4 border-t border-[var(--color-surface-500)]/20">
          <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            Simulation active
          </div>
        </div>
      </aside>

      <div className="flex flex-col flex-1 min-w-0">
        <header className="md:hidden flex items-center justify-between p-3
          bg-[var(--color-surface-800)] border-b border-[var(--color-surface-500)]/20">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-cyan-500 to-emerald-500
              flex items-center justify-center">
              <Radio className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-bold">IoT Dashboard</span>
          </div>
          <MobileNav alertCount={alertCount} />
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function MobileNav({ alertCount }: { alertCount: number }) {
  return (
    <nav className="flex items-center gap-0.5">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === "/"}
          className={({ isActive }) =>
            `relative p-2 rounded-lg transition-colors
            ${isActive ? "bg-[var(--color-surface-600)] text-[var(--color-text-primary)]" : "text-[var(--color-text-muted)] hover:bg-[var(--color-surface-700)]"}`
          }
        >
          <item.icon className="h-4 w-4" />
          {item.to === "/alerts" && alertCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-red-500
              text-[8px] text-white flex items-center justify-center font-bold">
              {alertCount > 9 ? "9+" : alertCount}
            </span>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
