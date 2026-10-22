import React from 'react';
import { useApp } from '../context/AppContext';
import { EnergyLevel } from '../types';
import { ArrowRight, Sparkles } from 'lucide-react';

export const CheckInBar: React.FC = () => {
  const { data, setEnergy, setAvailableMinutes, currentSuggestion, applySuggestedPlan } = useApp();

  const energyLevels: { level: EnergyLevel; label: string }[] = [
    { level: 'low', label: 'Low' },
    { level: 'steady', label: 'Steady' },
    { level: 'high', label: 'High' },
  ];

  const timePresets = [25, 45, 90, 120];

  return (
    <div className="bg-[var(--surface)] border border-[var(--line)] rounded-2xl p-4 sm:p-5 shadow-xs transition-colors">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Controls: Energy & Time */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          {/* Energy Segmented Control */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-medium text-[var(--muted)] mr-1">Energy:</span>
            <div className="inline-flex bg-[var(--surface-soft)] p-0.5 rounded-lg border border-[var(--line)]">
              {energyLevels.map((opt) => {
                const isSelected = data.checkIn.energy === opt.level;
                return (
                  <button
                    key={opt.level}
                    type="button"
                    onClick={() => setEnergy(opt.level)}
                    className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                      isSelected
                        ? 'bg-[var(--surface)] text-[var(--ink)] font-semibold shadow-xs'
                        : 'text-[var(--muted)] hover:text-[var(--ink)]'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time Presets */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-medium text-[var(--muted)] mr-1">Time:</span>
            <div className="inline-flex items-center gap-1">
              {timePresets.map((mins) => {
                const isSelected = data.checkIn.availableMinutes === mins;
                return (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setAvailableMinutes(mins)}
                    className={`px-2.5 py-1 rounded-md text-xs font-mono tabular-nums transition-colors ${
                      isSelected
                        ? 'bg-[var(--forest)] text-white font-medium shadow-xs'
                        : 'bg-[var(--surface-soft)] text-[var(--ink-soft)] hover:bg-[var(--surface-strong)]'
                    }`}
                  >
                    {mins}m
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Action & Strategy Hint */}
        <div className="flex items-center justify-between md:justify-end gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-[var(--line)]">
          {currentSuggestion.rationale && (
            <span className="text-xs text-[var(--muted)] truncate max-w-xs hidden xl:inline">
              {currentSuggestion.rationale}
            </span>
          )}

          <button
            onClick={() => applySuggestedPlan()}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-[var(--forest)] hover:bg-[var(--forest-hover)] rounded-lg transition-colors shadow-xs active:scale-[0.98] whitespace-nowrap ml-auto md:ml-0"
          >
            <span>Build plan</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
