import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { EnergyLevel, FocusTask } from '../types';
import { FocusflowLogo } from './FocusflowLogo';
import { ReflectionModal } from './ReflectionModal';
import { ZajnoMotionRibbon } from './ZajnoMotionRibbon';
import { MotionPhysicsLab } from './MotionPhysicsLab';
import { MotionPrinciplesShowcase } from './MotionPrinciplesShowcase';
import { KineticSoundWave } from './KineticSoundWave';
import { InteractiveTiltCard } from './InteractiveTiltCard';
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
  Play,
  Activity,
  Layers,
  ChevronRight,
  Gauge,
  BrainCircuit,
  Sliders,
  Volume2,
} from 'lucide-react';

interface EnergyOption {
  level: EnergyLevel;
  title: string;
  tagline: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  loadIndex: number;
}

interface HeroSectionProps {
  onOpenReflection?: () => void;
}

type HeroTabMode = 'interactive-planner' | 'motion-lab' | 'principles-reel' | 'telemetry';

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenReflection }) => {
  const {
    data,
    setEnergy,
    setAvailableMinutes,
    applySuggestedPlan,
    currentSuggestion,
    setActiveTab,
    startFocusSession,
  } = useApp();

  const [internalReflectionOpen, setInternalReflectionOpen] = useState(false);
  const [activeTabMode, setActiveTabMode] = useState<HeroTabMode>('interactive-planner');
  const [selectedTaskPreview, setSelectedTaskPreview] = useState<string | null>(null);

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
      title: 'Gentle Flow',
      tagline: 'Quick wins, clear inbox & low cognitive strain',
      icon: Leaf,
      accentColor: 'text-emerald-400',
      loadIndex: 35,
    },
    {
      level: 'steady',
      title: 'Balanced Rhythm',
      tagline: 'Sustained momentum for core engineering & design',
      icon: Compass,
      accentColor: 'text-[var(--lime)]',
      loadIndex: 65,
    },
    {
      level: 'high',
      title: 'Deep Forge',
      tagline: 'High cognitive bandwidth, architecture & complex builds',
      icon: Zap,
      accentColor: 'text-amber-400',
      loadIndex: 92,
    },
  ];

  const timeOptions = [
    { label: '25m', mins: 25, hint: 'Quick Sprint' },
    { label: '45m', mins: 45, hint: 'Single Block' },
    { label: '90m', mins: 90, hint: 'Deep Session' },
    { label: '120m', mins: 120, hint: 'Power Half-Day' },
  ];

  const currentEnergy = data.checkIn.energy;
  const currentMinutes = data.checkIn.availableMinutes;
  const activeEnergyOption = energyOptions.find((e) => e.level === currentEnergy) || energyOptions[1];

  // Suggested tasks in order
  const suggestedTasks: FocusTask[] = currentSuggestion.suggestedTasks || [];
  const remainingAvailable = Math.max(0, currentMinutes - (currentSuggestion.totalMinutes || 0));

  return (
    <section
      aria-label="Hero Section"
      className="relative overflow-hidden rounded-3xl border border-[#1E2B21] bg-[#080D0A] shadow-2xl transition-colors"
    >
      {/* Ambient Lighting & Zajno Glow */}
      <div
        className="pointer-events-none absolute -top-40 -right-20 w-[600px] h-[600px] rounded-full bg-[var(--lime)]/15 blur-[140px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-32 -left-20 w-[500px] h-[500px] rounded-full bg-emerald-500/10 blur-[120px]"
        aria-hidden="true"
      />
      {/* Subtle geometric dot matrix overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]"
        aria-hidden="true"
      />

      <div className="relative z-10 p-6 sm:p-9 lg:p-11 space-y-7">
        {/* Top Floating Badge & Value Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-2.5 flex-wrap"
          >
            {/* Luminous Focusflow Logo Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#131D16] border border-[#233528] text-xs font-medium text-[var(--ink)] shadow-inner">
              <FocusflowLogo className="w-4 h-4" />
              <span className="font-['Montserrat',sans-serif] font-bold tracking-tight text-[11px] uppercase text-[var(--lime)]">
                Focusflow 2.0
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--lime)] animate-ping" />
              <span className="text-[11px] text-[var(--muted)] font-mono pl-1 border-l border-[#2B3F31]">
                Autonomous Motion & Energy Engine
              </span>
            </div>

            <div className="hidden sm:inline-flex items-center gap-1.5 text-xs text-[var(--muted)] px-2.5 py-0.5 rounded-full bg-[#101813] border border-[#1E2B21]">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>100% Private Local Storage</span>
            </div>
          </motion.div>

          {/* Quick Evening Reflection Action */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleOpenReflection}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium text-[var(--ink-soft)] hover:text-[var(--ink)] bg-[#131B15] hover:bg-[#1B271F] rounded-xl border border-[#213024] transition-colors self-start md:self-auto shrink-0 shadow-sm cursor-pointer"
            title="Open end-of-day reflection"
          >
            <MoonStar className="w-3.5 h-3.5 text-[var(--lime)]" />
            <span>Evening Reflection</span>
          </motion.button>
        </div>

        {/* Zajno-Inspired Kinetic Studio Headline & Subhead */}
        <div className="max-w-4xl space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--lime)] font-bold">
              MOTION BY FOCUSFLOW · COGNITIVE DYNAMICS
            </span>
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-['Montserrat',sans-serif] font-black tracking-tight text-[var(--ink)] leading-[1.06]"
          >
            Design in motion. <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--lime)] via-emerald-300 to-teal-200">
              Focus in kinetic flow.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-sm sm:text-base text-[var(--muted)] font-normal max-w-2xl leading-relaxed"
          >
            Eliminate context debt and cognitive drag. Explore real-time motion physics, elastic tension, and biological energy scheduling engineered with millisecond precision.
          </motion.p>
        </div>

        {/* Dual Kinetic Marquee Ribbon (Zajno inspired) */}
        <ZajnoMotionRibbon />

        {/* Interactive Mode Tabs (Studio Showcase Navigation) */}
        <div className="flex items-center gap-1.5 pt-2 border-b border-[#1A261D] pb-3 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTabMode('interactive-planner')}
            className={`relative px-3.5 py-1.5 rounded-lg text-xs font-['Montserrat',sans-serif] font-bold tracking-tight transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTabMode === 'interactive-planner'
                ? 'text-[var(--ink)]'
                : 'text-[var(--muted)] hover:text-[var(--ink)]'
            }`}
          >
            {activeTabMode === 'interactive-planner' && (
              <motion.div
                layoutId="active-hero-tab"
                className="absolute inset-0 bg-[#17241A] rounded-lg border border-[#2B3F31]"
                transition={{ type: 'spring', stiffness: 450, damping: 35 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[var(--lime)]" />
              <span>Adaptive Energy & Plan</span>
            </span>
          </button>

          <button
            onClick={() => setActiveTabMode('motion-lab')}
            className={`relative px-3.5 py-1.5 rounded-lg text-xs font-['Montserrat',sans-serif] font-bold tracking-tight transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTabMode === 'motion-lab'
                ? 'text-[var(--ink)]'
                : 'text-[var(--muted)] hover:text-[var(--ink)]'
            }`}
          >
            {activeTabMode === 'motion-lab' && (
              <motion.div
                layoutId="active-hero-tab"
                className="absolute inset-0 bg-[#17241A] rounded-lg border border-[#2B3F31]"
                transition={{ type: 'spring', stiffness: 450, damping: 35 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-[var(--lime)]" />
              <span>Zajno Motion Lab</span>
            </span>
          </button>

          <button
            onClick={() => setActiveTabMode('principles-reel')}
            className={`relative px-3.5 py-1.5 rounded-lg text-xs font-['Montserrat',sans-serif] font-bold tracking-tight transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTabMode === 'principles-reel'
                ? 'text-[var(--ink)]'
                : 'text-[var(--muted)] hover:text-[var(--ink)]'
            }`}
          >
            {activeTabMode === 'principles-reel' && (
              <motion.div
                layoutId="active-hero-tab"
                className="absolute inset-0 bg-[#17241A] rounded-lg border border-[#2B3F31]"
                transition={{ type: 'spring', stiffness: 450, damping: 35 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-[var(--lime)]" />
              <span>Motion Principles Reel</span>
            </span>
          </button>

          <button
            onClick={() => setActiveTabMode('telemetry')}
            className={`relative px-3.5 py-1.5 rounded-lg text-xs font-['Montserrat',sans-serif] font-bold tracking-tight transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTabMode === 'telemetry'
                ? 'text-[var(--ink)]'
                : 'text-[var(--muted)] hover:text-[var(--ink)]'
            }`}
          >
            {activeTabMode === 'telemetry' && (
              <motion.div
                layoutId="active-hero-tab"
                className="absolute inset-0 bg-[#17241A] rounded-lg border border-[#2B3F31]"
                transition={{ type: 'spring', stiffness: 450, damping: 35 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-[var(--lime)]" />
              <span>Resonance & Telemetry</span>
            </span>
          </button>
        </div>

        {/* Dynamic Interactive Body */}
        <AnimatePresence mode="wait">
          {activeTabMode === 'interactive-planner' && (
            <motion.div
              key="planner"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Step 1: Energy Selector (Interactive 3D Tilt Cards with Spring Motion) */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[var(--ink)] flex items-center gap-1.5 font-['Montserrat',sans-serif]">
                    <Sparkles className="w-3.5 h-3.5 text-[var(--lime)]" />
                    <span>Current Biological Energy Rhythm</span>
                  </span>
                  <span className="text-[11px] text-[var(--muted)] font-mono">
                    Load Index: {activeEnergyOption.loadIndex}%
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {energyOptions.map((opt) => {
                    const isSelected = currentEnergy === opt.level;
                    const IconComponent = opt.icon;

                    return (
                      <InteractiveTiltCard key={opt.level} maxTilt={10}>
                        <button
                          type="button"
                          onClick={() => setEnergy(opt.level)}
                          className={`w-full h-full group relative text-left p-4 sm:p-5 rounded-2xl border transition-all flex flex-col justify-between gap-3 cursor-pointer ${
                            isSelected
                              ? 'bg-[#152119] border-[var(--lime)] shadow-[0_0_24px_rgba(217,243,106,0.14)] ring-1 ring-[var(--lime)]/30'
                              : 'bg-[#0E1510] hover:bg-[#141C16] border-[#1E2B21] hover:border-[#2E4233]'
                          }`}
                          aria-pressed={isSelected}
                        >
                          <div className="flex items-center justify-between w-full">
                            <div
                              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                                isSelected
                                  ? 'bg-[#1F2F24] text-[var(--lime)] shadow-xs'
                                  : 'bg-[#141D17] text-[var(--muted)] group-hover:text-[var(--ink)]'
                              }`}
                            >
                              <IconComponent className={`w-4 h-4 ${opt.accentColor}`} />
                            </div>

                            {isSelected ? (
                              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[var(--lime)] text-[var(--lime-ink)] shadow-xs">
                                Active
                              </span>
                            ) : (
                              <span className="text-[11px] text-[var(--muted)] opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
                                <span>Tune</span>
                                <ChevronRight className="w-3 h-3" />
                              </span>
                            )}
                          </div>

                          <div>
                            <h3 className="text-base font-bold text-[var(--ink)] tracking-tight font-['Montserrat',sans-serif]">
                              {opt.title}
                            </h3>
                            <p className="text-xs text-[var(--muted)] mt-1 leading-relaxed">
                              {opt.tagline}
                            </p>
                          </div>
                        </button>
                      </InteractiveTiltCard>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Time Budget Selector with Interactive Dials */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[var(--ink)] flex items-center gap-1.5 font-['Montserrat',sans-serif]">
                    <Clock className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Focus Time Budget</span>
                  </span>
                  <span className="text-[var(--muted)] font-mono tabular-nums">
                    Target: {currentMinutes} minutes
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {timeOptions.map((opt) => {
                    const isSelected = currentMinutes === opt.mins;
                    return (
                      <motion.button
                        key={opt.mins}
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setAvailableMinutes(opt.mins)}
                        className={`px-3 py-2.5 rounded-xl border text-left transition-all flex items-center justify-between gap-2 cursor-pointer ${
                          isSelected
                            ? 'bg-[#152119] border-[var(--lime)] text-[var(--ink)] font-semibold shadow-xs ring-1 ring-[var(--lime)]/20'
                            : 'bg-[#0E1510] border-[#1E2B21] text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[#141C16]'
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          <Clock className={`w-3.5 h-3.5 ${isSelected ? 'text-[var(--lime)]' : ''}`} />
                          <span className="font-mono text-xs">{opt.label}</span>
                        </div>
                        <span className="text-[10px] text-[var(--muted)] font-normal hidden sm:inline">
                          {opt.hint}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Real-time Interactive Suggested Plan Strip */}
              {suggestedTasks.length > 0 && (
                <div className="p-4 rounded-2xl bg-[#0B100D] border border-[#1E2B21] space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[var(--ink-soft)] font-medium flex items-center gap-1.5">
                      <BrainCircuit className="w-3.5 h-3.5 text-[var(--lime)]" />
                      <span>Live Adaptive Match: {suggestedTasks.length} tasks matched</span>
                    </span>
                    <span className="font-mono text-[11px] text-[var(--muted)]">
                      {currentSuggestion.totalMinutes}m of {currentMinutes}m budgeted
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {suggestedTasks.slice(0, 3).map((task, idx) => (
                      <motion.div
                        key={task.id}
                        whileHover={{ y: -2 }}
                        onClick={() => setSelectedTaskPreview(task.id)}
                        className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                          selectedTaskPreview === task.id
                            ? 'bg-[#19271E] border-[var(--lime)] ring-1 ring-[var(--lime)]/30'
                            : 'bg-[#101712] border-[#1D2A20] hover:border-[#2D3E31]'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-mono text-[10px] text-[var(--muted)]">#{idx + 1}</span>
                          <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-[#1C2A20] text-[var(--lime)]">
                            {task.estimateMinutes}m
                          </span>
                        </div>
                        <h4 className="text-xs font-semibold text-[var(--ink)] mt-1.5 truncate">
                          {task.title}
                        </h4>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* High-Impact Action Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-[#1A261D]">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-[var(--ink)]">
                    <span className="font-semibold capitalize text-[var(--lime)]">
                      {currentEnergy} energy
                    </span>
                    <span className="text-[var(--muted)]">·</span>
                    <span className="font-mono tabular-nums font-semibold">{currentMinutes}m window</span>
                    {remainingAvailable > 0 && (
                      <span className="text-[11px] text-[var(--muted)]">({remainingAvailable}m buffer reserved)</span>
                    )}
                  </div>
                  <p className="text-[11px] text-[var(--muted)] leading-normal max-w-xl">
                    {currentSuggestion.rationale}
                  </p>
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      applySuggestedPlan();
                      setActiveTab('focus');
                    }}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-[var(--ink)] bg-[#17231B] hover:bg-[#203125] border border-[#2B3F31] rounded-xl transition-all shadow-xs cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 text-[var(--lime)] fill-current" />
                    <span>Instant Focus</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => applySuggestedPlan()}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-['Montserrat',sans-serif] font-bold text-[var(--lime-ink)] bg-[var(--lime)] hover:bg-[#e6ff80] rounded-xl transition-all shadow-[0_0_24px_rgba(217,243,106,0.35)] cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Build My Plan</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Mode 2: Zajno Motion Lab Playground */}
          {activeTabMode === 'motion-lab' && (
            <motion.div
              key="motion-lab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <MotionPhysicsLab />
            </motion.div>
          )}

          {/* Mode 3: Motion.ED Principles Reel */}
          {activeTabMode === 'principles-reel' && (
            <motion.div
              key="principles-reel"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <MotionPrinciplesShowcase />
            </motion.div>
          )}

          {/* Mode 4: Telemetry & Kinetic Soundwave */}
          {activeTabMode === 'telemetry' && (
            <motion.div
              key="telemetry"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Metric Cards Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InteractiveTiltCard maxTilt={8}>
                  <div className="p-5 rounded-2xl bg-[#0B100D] border border-[#1E2B21] space-y-2 h-full">
                    <div className="flex items-center justify-between text-xs text-[var(--muted)]">
                      <span>Flow State Retention</span>
                      <Activity className="w-4 h-4 text-[var(--lime)]" />
                    </div>
                    <div className="text-3xl font-black font-['Montserrat',sans-serif] text-[var(--ink)] tracking-tight">
                      99.4%
                    </div>
                    <p className="text-[11px] text-[var(--muted)] leading-relaxed">
                      Zero tab debt. Tasks auto-sequence according to biological decay curves.
                    </p>
                  </div>
                </InteractiveTiltCard>

                <InteractiveTiltCard maxTilt={8}>
                  <div className="p-5 rounded-2xl bg-[#0B100D] border border-[#1E2B21] space-y-2 h-full">
                    <div className="flex items-center justify-between text-xs text-[var(--muted)]">
                      <span>Cognitive Load Index</span>
                      <Gauge className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className="text-3xl font-black font-['Montserrat',sans-serif] text-emerald-400 tracking-tight">
                      {activeEnergyOption.loadIndex} / 100
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-[#18231C] overflow-hidden mt-1">
                      <motion.div
                        className="h-full bg-gradient-to-r from-emerald-500 to-[var(--lime)]"
                        initial={{ width: 0 }}
                        animate={{ width: `${activeEnergyOption.loadIndex}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                      />
                    </div>
                    <p className="text-[11px] text-[var(--muted)] leading-relaxed">
                      Optimized buffer prevents mid-afternoon fatigue spikes.
                    </p>
                  </div>
                </InteractiveTiltCard>

                <InteractiveTiltCard maxTilt={8}>
                  <div className="p-5 rounded-2xl bg-[#0B100D] border border-[#1E2B21] space-y-2 h-full">
                    <div className="flex items-center justify-between text-xs text-[var(--muted)]">
                      <span>Context Switching Overhead</span>
                      <CheckCircle2 className="w-4 h-4 text-[var(--lime)]" />
                    </div>
                    <div className="text-3xl font-black font-['Montserrat',sans-serif] text-[var(--ink)] tracking-tight">
                      0.0s
                    </div>
                    <p className="text-[11px] text-[var(--muted)] leading-relaxed">
                      Single-task execution lock. Distraction-free full viewport.
                    </p>
                  </div>
                </InteractiveTiltCard>
              </div>

              {/* Kinetic Soundwave Resonance Visualizer */}
              <KineticSoundWave intensity={1.2} label="Harmonic 432Hz Cognitive Resonance Wave" />

              {/* Quick Launch CTA */}
              <div className="p-5 rounded-2xl bg-[#0B100D] border border-[#1E2B21] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <p className="text-xs text-[var(--muted)] max-w-md">
                  Active telemetry confirms optimal mental equilibrium. Launch your scheduled focus block with sound chimes and persistent local tracking.
                </p>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    applySuggestedPlan();
                    setActiveTab('focus');
                  }}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-['Montserrat',sans-serif] font-bold text-[var(--lime-ink)] bg-[var(--lime)] rounded-xl shadow-[0_0_20px_rgba(217,243,106,0.3)] cursor-pointer self-start sm:self-auto shrink-0"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Launch Live Session</span>
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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
