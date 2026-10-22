import React from 'react';
import { useApp, ActiveTab } from '../context/AppContext';
import {
  LayoutDashboard,
  CalendarDays,
  Timer,
  BarChart2,
  Settings,
  Plus,
  RotateCcw,
  Sun,
  Moon,
  Volume2,
  VolumeX,
} from 'lucide-react';

export const NavigationRail: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    openTaskModal,
    data,
    toggleTheme,
    resetToDemo,
    toggleSoundEnabled,
  } = useApp();

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'planner', label: 'Planner', icon: <CalendarDays className="w-4 h-4" /> },
    { id: 'focus', label: 'Focus', icon: <Timer className="w-4 h-4" /> },
    { id: 'insights', label: 'Insights', icon: <BarChart2 className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  const activePlanCount = data.planTaskIds.filter((id) => {
    const t = data.tasks.find((task) => task.id === id);
    return t && t.status !== 'completed';
  }).length;

  return (
    <aside className="w-[236px] shrink-0 border-r border-[var(--line)] bg-[var(--surface)] flex flex-col justify-between select-none transition-colors duration-150">
      {/* Top Brand & Actions */}
      <div className="p-6">
        <button
          onClick={() => setActiveTab('overview')}
          className="flex items-center gap-2.5 text-left group w-full"
        >
          <div className="w-7 h-7 rounded-lg bg-[var(--forest)] flex items-center justify-center text-[var(--surface)] relative shadow-xs">
            <span className="font-bold text-xs tracking-tighter">FF</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--lime)] absolute -top-0.5 -right-0.5 ring-2 ring-[var(--surface)]" />
          </div>
          <div>
            <div className="text-base font-bold tracking-tight text-[var(--ink)] leading-none">
              FocusFlow
            </div>
            <div className="text-[11px] text-[var(--muted)] mt-1 font-medium">
              Adaptive Day Planner
            </div>
          </div>
        </button>

        {/* Primary Action Button */}
        <div className="mt-6">
          <button
            onClick={() => openTaskModal()}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold text-white bg-[var(--forest)] hover:bg-[var(--forest-hover)] active:scale-[0.99] rounded-lg transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Task</span>
          </button>
        </div>

        {/* Navigation List */}
        <nav className="mt-6 space-y-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-[var(--surface-soft)] text-[var(--ink)] font-semibold'
                    : 'text-[var(--ink-soft)] hover:bg-[var(--surface-strong)] hover:text-[var(--ink)]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={
                      isActive
                        ? 'text-[var(--forest)] dark:text-[var(--lime)]'
                        : 'text-[var(--muted)]'
                    }
                  >
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {item.id === 'overview' && activePlanCount > 0 && (
                  <span className="font-mono text-[11px] tabular-nums text-[var(--muted)]">
                    {activePlanCount}
                  </span>
                )}
                {item.id === 'focus' && data.activeTimer.status === 'running' && (
                  <span className="w-2 h-2 rounded-full bg-[var(--lime)] animate-pulse" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Status Glance */}
      <div className="p-4 border-t border-[var(--line)] space-y-3 bg-[var(--surface-soft)]/50">
        <div className="px-2.5 py-2 rounded-lg bg-[var(--surface)] border border-[var(--line)] text-[11px] text-[var(--ink-soft)] space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[var(--muted)]">Energy</span>
            <span className="inline-flex items-center gap-1 font-medium capitalize text-[var(--forest)] dark:text-[var(--lime)]">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--lime)] inline-block" />
              {data.checkIn.energy}
            </span>
          </div>
          <div className="flex items-center justify-between text-[var(--muted)]">
            <span>Budget</span>
            <span className="font-mono tabular-nums font-semibold text-[var(--ink)]">
              {data.checkIn.availableMinutes}m
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1 px-1">
          <div className="flex items-center gap-1">
            <button
              onClick={toggleTheme}
              className="p-1.5 text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--surface-strong)] rounded-md transition-colors"
              title={
                data.preferences.theme === 'light'
                  ? 'Switch to Dark Mode'
                  : 'Switch to Light Mode'
              }
              aria-label="Toggle theme"
            >
              {data.preferences.theme === 'light' ? (
                <Moon className="w-4 h-4" />
              ) : (
                <Sun className="w-4 h-4 text-[var(--lime)]" />
              )}
            </button>

            <button
              onClick={toggleSoundEnabled}
              className="p-1.5 text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--surface-strong)] rounded-md transition-colors"
              title={data.preferences.soundEnabled ? 'Chime sound on' : 'Chime muted'}
              aria-label="Toggle chime"
            >
              {data.preferences.soundEnabled ? (
                <Volume2 className="w-4 h-4" />
              ) : (
                <VolumeX className="w-4 h-4" />
              )}
            </button>
          </div>

          <button
            onClick={() => {
              if (window.confirm('Reset app data to the sample demo starter workspace?')) {
                resetToDemo();
              }
            }}
            className="flex items-center gap-1 text-[11px] text-[var(--muted)] hover:text-[var(--ink)] p-1 rounded transition-colors"
            title="Reset demo data"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
