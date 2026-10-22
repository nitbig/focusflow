import React, { useEffect } from 'react';
import { useApp, ActiveTab } from '../context/AppContext';
import {
  LayoutDashboard,
  CalendarDays,
  Timer,
  BarChart2,
  Settings,
  Plus,
  RotateCcw,
  Volume2,
  VolumeX,
  X,
  Sparkles,
} from 'lucide-react';
import { FocusflowBrand } from './FocusflowLogo';

export const MobileDrawer: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    openTaskModal,
    data,
    resetToDemo,
    toggleSoundEnabled,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
  } = useApp();

  // Close on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileMenuOpen, setIsMobileMenuOpen]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  if (!isMobileMenuOpen) return null;

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'planner', label: 'Planner', icon: <CalendarDays className="w-4 h-4" /> },
    { id: 'focus', label: 'Focus Session', icon: <Timer className="w-4 h-4" /> },
    { id: 'insights', label: 'Insights', icon: <BarChart2 className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  const activePlanCount = data.planTaskIds.filter((id) => {
    const t = data.tasks.find((task) => task.id === id);
    return t && t.status !== 'completed';
  }).length;

  const handleNavClick = (id: ActiveTab) => {
    setActiveTab(id);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsMobileMenuOpen(false)}
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        aria-hidden="true"
      />

      {/* Off-Canvas Drawer Panel */}
      <div
        className="fixed top-0 bottom-0 left-0 w-[280px] max-w-[85vw] bg-[var(--surface)] border-r border-[var(--line)] shadow-2xl flex flex-col justify-between z-10 animate-in slide-in-from-left duration-200"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation Menu"
      >
        <div className="p-6">
          {/* Header & Close */}
          <div className="flex items-center justify-between pb-4 border-b border-[var(--line)]">
            <FocusflowBrand onClick={() => handleNavClick('overview')} />

            <button
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="Close menu"
              className="p-1.5 text-[var(--muted)] hover:text-[var(--ink)] rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Primary Action Button */}
          <div className="mt-5">
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                openTaskModal();
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-3 text-xs font-semibold text-white bg-[var(--forest)] hover:bg-[var(--forest-hover)] active:scale-[0.99] rounded-xl transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create New Task</span>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="mt-6 space-y-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-3 rounded-xl text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-[var(--surface-soft)] text-[var(--ink)] font-semibold'
                      : 'text-[var(--ink-soft)] hover:bg-[var(--surface-strong)] hover:text-[var(--ink)]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={
                        isActive
                          ? 'text-[var(--forest)] dark:text-[var(--lime)]'
                          : 'text-[var(--muted)]'
                      }
                    >
                      {item.icon}
                    </span>
                    <span className="text-sm">{item.label}</span>
                  </div>
                  {item.id === 'overview' && activePlanCount > 0 && (
                    <span className="font-mono text-xs tabular-nums px-2 py-0.5 rounded-full bg-[var(--surface-strong)] text-[var(--ink)] font-semibold">
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

        {/* Bottom Status & Utilities */}
        <div className="p-4 border-t border-[var(--line)] space-y-3 bg-[var(--surface-soft)]/50">
          <div className="px-3 py-2.5 rounded-xl bg-[var(--surface)] border border-[var(--line)] text-xs text-[var(--ink-soft)] space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[var(--muted)]">Energy Mode</span>
              <span className="inline-flex items-center gap-1.5 font-medium capitalize text-[var(--forest)] dark:text-[var(--lime)]">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--lime)] inline-block" />
                {data.checkIn.energy}
              </span>
            </div>
            <div className="flex items-center justify-between text-[var(--muted)]">
              <span>Time Budget</span>
              <span className="font-mono tabular-nums font-semibold text-[var(--ink)]">
                {data.checkIn.availableMinutes} min
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1 px-1">
            <div className="flex items-center gap-1.5">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-medium bg-[var(--surface-strong)] text-[var(--ink-soft)] border border-[var(--line)]">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--lime)]" />
                <span>Dark Flow</span>
              </span>

              <button
                onClick={toggleSoundEnabled}
                className="p-2 text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--surface-strong)] rounded-lg transition-colors"
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
                if (window.confirm('Reset app data to sample demo starter workspace?')) {
                  resetToDemo();
                  setIsMobileMenuOpen(false);
                }
              }}
              className="flex items-center gap-1.5 text-xs text-[var(--muted)] hover:text-[var(--ink)] p-2 rounded-lg transition-colors"
              title="Reset demo data"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
