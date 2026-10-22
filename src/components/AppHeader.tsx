import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Menu,
  Plus,
  Sparkles,
  Calendar,
  Sun,
  Moon,
  Volume2,
  VolumeX,
} from 'lucide-react';

import { FocusflowLogo } from './FocusflowLogo';

export const AppHeader: React.FC = () => {
  const {
    openTaskModal,
    data,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    toggleSoundEnabled,
  } = useApp();

  const today = new Date();
  const dateStr = today.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <header className="h-[68px] sm:h-[72px] shrink-0 border-b border-[var(--line)] bg-[var(--surface)]/95 backdrop-blur-md px-4 sm:px-6 lg:px-8 flex items-center justify-between transition-colors z-20">
      {/* Left zone: Hamburger (tablet & mobile) + Brand/Breadcrumb */}
      <div className="flex items-center gap-3">
        {/* Responsive Mobile/Tablet Drawer Toggle */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle navigation menu"
          aria-expanded={isMobileMenuOpen}
          className="lg:hidden p-2 -ml-1 text-[var(--ink)] hover:bg-[var(--surface-soft)] rounded-lg transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Small Brand Logo on mobile when sidebar rail is hidden */}
        <div className="lg:hidden flex items-center gap-2">
          <FocusflowLogo className="w-6 h-6" />
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <h1 className="text-base sm:text-lg font-bold tracking-tight text-[var(--ink)] font-['Montserrat',sans-serif]">
            Focusflow
          </h1>
          <span className="text-[var(--line)] hidden sm:inline" aria-hidden="true">
            /
          </span>
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-[var(--muted)]">
            <Calendar className="w-3.5 h-3.5" />
            <span>{dateStr}</span>
          </div>
        </div>
      </div>

      {/* Right zone: Status Budget + Chime quick utility + Action */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Available Budget Pill */}
        <div className="hidden md:flex items-center gap-1.5 text-xs text-[var(--ink-soft)] px-2.5 py-1 rounded-md bg-[var(--surface-soft)] border border-[var(--line)]">
          <Sparkles className="w-3.5 h-3.5 text-[var(--lime)]" />
          <span className="font-mono tabular-nums font-semibold text-[var(--ink)]">
            {data.checkIn.availableMinutes}m
          </span>
          <span>budget</span>
        </div>

        {/* Quick chime sound toggle */}
        <button
          onClick={toggleSoundEnabled}
          aria-label="Toggle sound"
          className="p-2 text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--surface-soft)] rounded-lg transition-colors hidden sm:inline-flex"
          title={data.preferences.soundEnabled ? 'Chime on' : 'Chime muted'}
        >
          {data.preferences.soundEnabled ? (
            <Volume2 className="w-4 h-4" />
          ) : (
            <VolumeX className="w-4 h-4" />
          )}
        </button>

        {/* Primary "+ Add Task" button */}
        <button
          onClick={() => openTaskModal()}
          className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 sm:py-2 text-xs font-semibold text-white bg-[var(--forest)] hover:bg-[var(--forest-hover)] rounded-lg transition-colors shadow-xs active:scale-[0.98]"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden xs:inline">New Task</span>
          <span className="xs:hidden">Add</span>
        </button>
      </div>
    </header>
  );
};
