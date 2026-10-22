import React from 'react';
import { useApp } from '../context/AppContext';
import { EnergyLevel } from '../types';
import {
  Leaf,
  Compass,
  Zap,
  ArrowRight,
  MoonStar,
  Clock,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { ReflectionModal } from './ReflectionModal';

interface EnergyOption {
  level: EnergyLevel;
  title: string;
  tagline: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
}

interface HeroSectionProps {
  onOpenReflection?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenReflection }) => {
  const {
    data,
    setEnergy,
    setAvailableMinutes,
    applySuggestedPlan,
    currentSuggestion,
    setActiveTab,
  } = useApp();
  const [internalReflectionOpen, setInternalReflectionOpen] = React.useState(false);

  const handleOpenReflection = () => {
    if (onOpenReflection) {
      onOpenReflection();
    } else {
      setInternalReflectionOpen(true);
    }
  };

  const energyOptions: EnergyOption[] = [
    {
      level: 'low',
      title: 'Low',
      tagline: 'Gentle pace · Quick wins & low-friction tasks',
      icon: Leaf,
      accentColor: 'text-[#5B8266] dark:text-[#78A885]',
    },
    {
      level: 'steady',
      title: 'Steady',
      tagline: 'Balanced flow · Sustainable rhythm for core work',
      icon: Compass,
      accentColor: 'text-[var(--forest)] dark:text-[var(--lime)]',
    },
    {
      level: 'high',
      title: 'High',
      tagline: 'Deep focus · Complex problem-solving & heavy lift',
      icon: Zap,
      accentColor: 'text-[#D97706] dark:text-[var(--lime)]',
    },
  ];

  const timeOptions = [
    { label: '25m', mins: 25, hint: 'Quick Sprint' },
    { label: '45m', mins: 45, hint: 'Single Block' },
    { label: '90m', mins: 90, hint: 'Deep Session' },
    { label: '120m', mins: 120, hint: 'Half Day' },
  ];

  const currentEnergy = data.checkIn.energy;
  const currentMinutes = data.checkIn.availableMinutes;

  return (
    <section
      aria-label="Daily Check-In & Plan Generator"
      className="relative overflow-hidden bg-[var(--surface)] border border-[var(--line)] rounded-3xl p-6 sm:p-8 md:p-9 shadow-xs transition-colors"
    >
      {/* Ambient decorative glow */}
      <div
        className="pointer-events-none absolute -top-28 -right-28 w-96 h-96 rounded-full bg-[var(--lime)]/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-col gap-6 sm:gap-7">
        {/* Top Header Row: Value Proposition & Purpose */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[var(--surface-soft)] border border-[var(--line)] text-[11px] font-medium text-[var(--ink-soft)]">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--lime)] animate-pulse" />
                Adaptive Day Planner
              </span>
              <span className="text-xs text-[var(--muted)]">·</span>
              <span className="text-xs text-[var(--muted)] flex items-center gap-1 font-['Montserrat',sans-serif]">
                <ShieldCheck className="w-3.5 h-3.5 text-[var(--forest)] dark:text-[var(--lime)]" />
                100% Private Local Storage
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-['Montserrat',sans-serif] font-bold tracking-tight text-[var(--ink)] leading-tight">
              Make room for what matters.
            </h1>
          </div>

          {/* Quick Evening Reflection Action */}
          <button
            onClick={handleOpenReflection}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-[var(--ink-soft)] hover:text-[var(--ink)] bg-[var(--surface-soft)] hover:bg-[var(--surface-strong)] rounded-xl border border-[var(--line)] transition-colors self-start md:self-auto shrink-0 shadow-2xs"
            title="Open end-of-day reflection"
          >
            <MoonStar className="w-3.5 h-3.5 text-[var(--forest)] dark:text-[var(--lime)]" />
            <span>Evening Reflection</span>
          </button>
        </div>

        {/* Step 1: Energy Level Selector (Core Posture) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-[var(--ink)] flex items-center gap-1.5">
              <span>How is your energy right now?</span>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {energyOptions.map((opt) => {
              const isSelected = currentEnergy === opt.level;
              const IconComponent = opt.icon;

              return (
                <button
                  key={opt.level}
                  type="button"
                  onClick={() => setEnergy(opt.level)}
                  className={`group relative text-left p-4 sm:p-5 rounded-2xl border transition-all flex flex-col justify-between gap-3 cursor-pointer ${
                    isSelected
                      ? 'bg-[var(--surface-soft)] border-[var(--forest)] dark:border-[var(--lime)] shadow-xs ring-1 ring-[var(--forest)]/15 dark:ring-[var(--lime)]/20'
                      : 'bg-[var(--surface)] hover:bg-[var(--surface-soft)]/60 border-[var(--line)] hover:border-[var(--muted)]/40'
                  }`}
                  aria-pressed={isSelected}
                >
                  <div className="flex items-center justify-between w-full">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                        isSelected
                          ? 'bg-[var(--surface)] shadow-xs'
                          : 'bg-[var(--surface-soft)] group-hover:bg-[var(--surface)]'
                      }`}
                    >
                      <IconComponent className={`w-4 h-4 ${opt.accentColor}`} />
                    </div>

                    {isSelected ? (
                      <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[var(--forest)] text-white dark:bg-[var(--lime)] dark:text-[var(--lime-ink)] shadow-xs">
                        Active
                      </span>
                    ) : (
                      <span className="text-[11px] text-[var(--muted)] opacity-0 group-hover:opacity-100 transition-opacity">
                        Select
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-[var(--ink)] tracking-tight">
                      {opt.title}
                    </h3>
                    <p className="text-xs text-[var(--muted)] mt-0.5 leading-relaxed">
                      {opt.tagline}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Available Time Budget Selector */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-[var(--ink)] flex items-center gap-1.5">
              <span>How much focus time do you have?</span>
            </span>
            <span className="text-[var(--muted)] font-mono tabular-nums">
              Budget: {currentMinutes} minutes
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {timeOptions.map((opt) => {
              const isSelected = currentMinutes === opt.mins;
              return (
                <button
                  key={opt.mins}
                  type="button"
                  onClick={() => setAvailableMinutes(opt.mins)}
                  className={`px-3 py-2.5 rounded-xl border text-left transition-all flex items-center justify-between gap-2 cursor-pointer ${
                    isSelected
                      ? 'bg-[var(--surface-soft)] border-[var(--forest)] dark:border-[var(--lime)] ring-1 ring-[var(--forest)]/10 text-[var(--ink)] font-semibold shadow-xs'
                      : 'bg-[var(--surface)] border-[var(--line)] text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--surface-soft)]/50'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 shrink-0" />
                    <span className="font-mono text-xs">{opt.label}</span>
                  </div>
                  <span className="text-[10px] text-[var(--muted)] font-normal hidden sm:inline">
                    {opt.hint}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Primary Call to Action: Build Plan & Guidance */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-[var(--line)]">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 text-xs text-[var(--ink)]">
              <span className="font-semibold capitalize text-[var(--forest)] dark:text-[var(--lime)]">
                {currentEnergy} energy
              </span>
              <span>·</span>
              <span className="font-mono tabular-nums font-semibold">{currentMinutes}m window</span>
            </div>
            <p className="text-[11px] text-[var(--muted)]">
              {currentSuggestion.rationale}
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => applySuggestedPlan()}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-[var(--forest)] hover:bg-[var(--forest-hover)] active:scale-[0.98] rounded-xl transition-all shadow-xs hover:shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-[var(--lime)]" />
              <span>Build My Plan</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Reflection Modal fallback */}
      {!onOpenReflection && (
        <ReflectionModal
          isOpen={internalReflectionOpen}
          onClose={() => setInternalReflectionOpen(false)}
        />
      )}
    </section>
  );
};
