import React from 'react';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard,
  CalendarDays,
  Timer,
  BarChart2,
  Settings,
  ShieldCheck,
  Download,
  RotateCcw,
  Keyboard,
  Sparkles,
  Heart,
} from 'lucide-react';

export const AppFooter: React.FC = () => {
  const {
    setActiveTab,
    exportBackup,
    resetToDemo,
    openTaskModal,
    data,
  } = useApp();

  return (
    <footer
      aria-label="Application Footer"
      className="mt-16 pt-10 pb-8 border-t border-[var(--line)] bg-[var(--surface)] text-[var(--ink)] transition-colors"
    >
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 md:px-8 space-y-10">
        {/* Top Tier: Brand, Value Proposition, Navigation, and Quick Tools */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1: Brand & Purpose */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[var(--forest)] flex items-center justify-center text-[var(--surface)] relative shadow-xs">
                <span className="font-bold text-xs tracking-tighter">FF</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--lime)] absolute -top-0.5 -right-0.5 ring-2 ring-[var(--surface)]" />
              </div>
              <span className="text-base font-bold tracking-tight text-[var(--ink)]">
                FocusFlow
              </span>
            </div>
            <p className="text-xs text-[var(--muted)] leading-relaxed">
              An adaptive, humane productivity planner designed for students, freelancers, and knowledge workers. Focus on what matters without guilt or burnout.
            </p>
            <div className="flex items-center gap-2 pt-1 text-[11px] text-[var(--forest)] dark:text-[var(--lime)] font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>100% Private · Stored locally in your browser</span>
            </div>
          </div>

          {/* Column 2: Obvious Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--ink)]">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs text-[var(--ink-soft)]">
              <li>
                <button
                  onClick={() => {
                    setActiveTab('overview');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-[var(--forest)] dark:hover:text-[var(--lime)] transition-colors inline-flex items-center gap-2"
                >
                  <LayoutDashboard className="w-3.5 h-3.5 text-[var(--muted)]" />
                  <span>Overview (Today’s Plan)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab('planner');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-[var(--forest)] dark:hover:text-[var(--lime)] transition-colors inline-flex items-center gap-2"
                >
                  <CalendarDays className="w-3.5 h-3.5 text-[var(--muted)]" />
                  <span>Planner & Backlog</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab('focus');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-[var(--forest)] dark:hover:text-[var(--lime)] transition-colors inline-flex items-center gap-2"
                >
                  <Timer className="w-3.5 h-3.5 text-[var(--muted)]" />
                  <span>Focus Mode (Ambient Audio)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab('insights');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-[var(--forest)] dark:hover:text-[var(--lime)] transition-colors inline-flex items-center gap-2"
                >
                  <BarChart2 className="w-3.5 h-3.5 text-[var(--muted)]" />
                  <span>Weekly Insights & Trends</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab('settings');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-[var(--forest)] dark:hover:text-[var(--lime)] transition-colors inline-flex items-center gap-2"
                >
                  <Settings className="w-3.5 h-3.5 text-[var(--muted)]" />
                  <span>Preferences & Presets</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Keyboard Shortcuts Guide */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--ink)] flex items-center gap-1.5">
              <Keyboard className="w-3.5 h-3.5 text-[var(--muted)]" />
              <span>Keyboard Shortcuts</span>
            </h4>
            <div className="space-y-2 text-[11px] text-[var(--ink-soft)] font-mono">
              <div className="flex items-center justify-between py-0.5 border-b border-[var(--line)]/50">
                <span className="font-sans text-[var(--muted)]">Pause / Resume Focus</span>
                <kbd className="px-1.5 py-0.5 rounded bg-[var(--surface-soft)] border border-[var(--line)] text-[var(--ink)] font-semibold">
                  Space
                </kbd>
              </div>
              <div className="flex items-center justify-between py-0.5 border-b border-[var(--line)]/50">
                <span className="font-sans text-[var(--muted)]">Reset Current Timer</span>
                <kbd className="px-1.5 py-0.5 rounded bg-[var(--surface-soft)] border border-[var(--line)] text-[var(--ink)] font-semibold">
                  R
                </kbd>
              </div>
              <div className="flex items-center justify-between py-0.5 border-b border-[var(--line)]/50">
                <span className="font-sans text-[var(--muted)]">Exit Focus View</span>
                <kbd className="px-1.5 py-0.5 rounded bg-[var(--surface-soft)] border border-[var(--line)] text-[var(--ink)] font-semibold">
                  Esc
                </kbd>
              </div>
              <div className="flex items-center justify-between py-0.5">
                <span className="font-sans text-[var(--muted)]">Quick Create Task</span>
                <button
                  onClick={() => openTaskModal()}
                  className="px-1.5 py-0.5 rounded bg-[var(--forest)]/10 text-[var(--forest)] dark:text-[var(--lime)] hover:underline font-sans text-[10px] font-semibold"
                >
                  + Add New
                </button>
              </div>
            </div>
          </div>

          {/* Column 4: Data Sovereignty & Quick Actions */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--ink)]">
              Data Management
            </h4>
            <p className="text-xs text-[var(--muted)]">
              You own your data completely. Export anytime as a clean JSON backup or restore default sample data.
            </p>
            <div className="flex flex-col gap-2 pt-1">
              <button
                onClick={exportBackup}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[var(--ink)] bg-[var(--surface-soft)] hover:bg-[var(--surface-strong)] rounded-lg border border-[var(--line)] transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-[var(--forest)] dark:text-[var(--lime)]" />
                <span>Export Data Backup (JSON)</span>
              </button>
              <button
                onClick={() => {
                  if (window.confirm('Reset app data to the sample demo starter workspace? This clears customized tasks.')) {
                    resetToDemo();
                  }
                }}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs text-[var(--muted)] hover:text-[var(--danger)] transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset to Sample Workspace</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Tier: Copyright, Tone & Peace */}
        <div className="pt-6 border-t border-[var(--line)] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[var(--muted)]">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} FocusFlow</span>
            <span>·</span>
            <span>Quietly confident productivity</span>
            <span>·</span>
            <span className="font-mono text-[11px] tabular-nums">{data.tasks.length} total tasks</span>
          </div>

          <div className="flex items-center gap-1 text-[11px]">
            <span>Crafted for humane, pressure-free daily work</span>
            <Heart className="w-3 h-3 text-[var(--forest)] dark:text-[var(--lime)] fill-current inline ml-1" />
          </div>
        </div>
      </div>
    </footer>
  );
};
