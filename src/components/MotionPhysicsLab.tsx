import React, { useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Sliders, RotateCcw, Zap, Compass, Sparkles, Move, Play } from 'lucide-react';

interface Preset {
  id: string;
  name: string;
  tension: number;
  damping: number;
  mass: number;
  description: string;
}

const PRESETS: Preset[] = [
  {
    id: 'snappy',
    name: 'Snappy Pop',
    tension: 520,
    damping: 24,
    mass: 0.8,
    description: 'Crisp micro-interactions & high-urgency focus switches',
  },
  {
    id: 'fluid',
    name: 'Fluid Jelly',
    tension: 200,
    damping: 14,
    mass: 1.4,
    description: 'Organic, elastic breathing pace for gentle creative flow',
  },
  {
    id: 'mechanical',
    name: 'Tactile Studio',
    tension: 400,
    damping: 38,
    mass: 1.0,
    description: 'Balanced, non-overshooting industrial engineering precision',
  },
  {
    id: 'orbital',
    name: 'Anti-Gravity',
    tension: 110,
    damping: 26,
    mass: 2.5,
    description: 'Deep spatial drift for long undisturbed deep-focus blocks',
  },
];

export const MotionPhysicsLab: React.FC = () => {
  const [activePreset, setActivePreset] = useState<string>('snappy');
  const [tension, setTension] = useState(520);
  const [damping, setDamping] = useState(24);
  const [mass, setMass] = useState(0.8);
  const [bounceCount, setBounceCount] = useState(0);
  const [shockwaveTrigger, setShockwaveTrigger] = useState(0);

  // Drag physics target
  const dragX = useMotionValue(0);
  const dragY = useMotionValue(0);

  // Configured spring physics
  const springX = useSpring(dragX, { stiffness: tension, damping, mass });
  const springY = useSpring(dragY, { stiffness: tension, damping, mass });

  // Dynamic squash & stretch deformation based on spring position
  const scaleX = useTransform(springX, [-150, 0, 150], [1.3, 1, 1.3]);
  const scaleY = useTransform(springY, [-150, 0, 150], [0.75, 1, 0.75]);
  const rotatePuck = useTransform(springX, [-150, 150], [-25, 25]);

  const applyPreset = (preset: Preset) => {
    setActivePreset(preset.id);
    setTension(preset.tension);
    setDamping(preset.damping);
    setMass(preset.mass);
  };

  const triggerShockwave = () => {
    setShockwaveTrigger((prev) => prev + 1);
    setBounceCount((c) => c + 1);
    // Displace puck temporarily
    dragX.set((Math.random() - 0.5) * 160);
    dragY.set((Math.random() - 0.5) * 120);
    setTimeout(() => {
      dragX.set(0);
      dragY.set(0);
    }, 50);
  };

  return (
    <div className="space-y-6">
      {/* Header bar with Zajno Motion Studio identity */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1A261D]">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[var(--lime)] animate-ping" />
            <h3 className="text-sm font-['Montserrat',sans-serif] font-bold text-[var(--ink)] uppercase tracking-wider flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[var(--lime)]" />
              <span>Zajno Interactive Motion Laboratory</span>
            </h3>
          </div>
          <p className="text-xs text-[var(--muted)] mt-0.5">
            Real-time spring physics, kinetic squash & stretch, and cognitive tension tuning.
          </p>
        </div>

        {/* Quick Presets */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {PRESETS.map((p) => (
            <button
              key={p.id}
              onClick={() => applyPreset(p)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-['Montserrat',sans-serif] font-semibold transition-all cursor-pointer ${
                activePreset === p.id
                  ? 'bg-[var(--lime)] text-[var(--lime-ink)] shadow-[0_0_12px_rgba(217,243,106,0.3)]'
                  : 'bg-[#121A15] border border-[#202E23] text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[#18231C]'
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Physics Grid: Interactive Playground + Live Parameter Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left: Interactive Drag & Spring Arena (7 cols) */}
        <div className="lg:col-span-7 bg-[#0A0F0C] border border-[#1E2B21] rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden group min-h-[320px]">
          {/* Subtle cosmic grid background */}
          <div className="pointer-events-none absolute inset-0 opacity-[0.06] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] [background-size:20px_20px]" />

          {/* Shockwave Rings on trigger */}
          {shockwaveTrigger > 0 && (
            <motion.div
              key={shockwaveTrigger}
              initial={{ scale: 0.2, opacity: 0.9 }}
              animate={{ scale: 3, opacity: 0 }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
              className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border-2 border-[var(--lime)]"
            />
          )}

          {/* Top arena telemetry info */}
          <div className="relative z-10 flex items-center justify-between text-xs">
            <span className="text-[11px] font-mono text-[var(--muted)] flex items-center gap-1.5">
              <Move className="w-3.5 h-3.5 text-[var(--lime)]" />
              <span>Interactive Puck · Drag & Release anywhere</span>
            </span>
            <span className="font-mono text-[10px] text-[var(--lime)] bg-[#132017] px-2 py-0.5 rounded-md border border-[#223527]">
              Bounces: {bounceCount}
            </span>
          </div>

          {/* Center Spring Interactive Puck */}
          <div className="relative z-10 my-8 flex items-center justify-center">
            {/* Target Origin Ghost */}
            <div className="absolute w-28 h-28 rounded-full border border-dashed border-[#243527] flex items-center justify-center pointer-events-none">
              <span className="text-[10px] font-mono text-[#3D5242]">REST POINT</span>
            </div>

            {/* Draggable Spring Object */}
            <motion.div
              drag
              dragConstraints={{ left: -140, right: 140, top: -100, bottom: 100 }}
              dragElastic={0.4}
              onDrag={(_, info) => {
                dragX.set(info.offset.x);
                dragY.set(info.offset.y);
              }}
              onDragEnd={() => {
                dragX.set(0);
                dragY.set(0);
                setBounceCount((c) => c + 1);
              }}
              style={{
                x: springX,
                y: springY,
                scaleX,
                scaleY,
                rotate: rotatePuck,
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ cursor: 'grabbing', scale: 0.95 }}
              className="w-28 h-28 rounded-2xl bg-gradient-to-br from-[#1C2C20] via-[#152319] to-[#0D1610] border-2 border-[var(--lime)] shadow-[0_0_35px_rgba(217,243,106,0.22)] cursor-grab flex flex-col items-center justify-center text-center p-2 select-none group/puck"
            >
              <div className="w-2.5 h-2.5 rounded-full bg-[var(--lime)] mb-1 shadow-[0_0_8px_var(--lime)]" />
              <span className="font-['Montserrat',sans-serif] font-black text-xs text-[var(--ink)] tracking-tight">
                PULL ME
              </span>
              <span className="text-[9px] font-mono text-[var(--muted)] group-hover/puck:text-[var(--lime)] transition-colors">
                Kinetic Spring
              </span>
            </motion.div>
          </div>

          {/* Bottom trigger bar */}
          <div className="relative z-10 flex items-center justify-between pt-2 border-t border-[#17221A] text-xs">
            <span className="text-[11px] text-[var(--muted)] font-mono">
              Formula: F = -k·x - c·v
            </span>
            <button
              onClick={triggerShockwave}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#16231A] hover:bg-[#203125] text-[var(--lime)] border border-[#283C2C] text-xs font-semibold cursor-pointer transition-colors"
            >
              <Zap className="w-3 h-3" />
              <span>Fire Kinetic Shock</span>
            </button>
          </div>
        </div>

        {/* Right: Real-time Physics Sliders & Telemetry (5 cols) */}
        <div className="lg:col-span-5 bg-[#0A0F0C] border border-[#1E2B21] rounded-2xl p-5 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-1 border-b border-[#18241C]">
              <span className="text-xs font-bold font-['Montserrat',sans-serif] uppercase tracking-wider text-[var(--ink)]">
                Dynamic Coefficients
              </span>
              <button
                onClick={() => applyPreset(PRESETS[0])}
                className="text-[10px] text-[var(--muted)] hover:text-[var(--ink)] inline-flex items-center gap-1 font-mono cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

            {/* Slider 1: Tension / Stiffness */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-[var(--ink-soft)] flex items-center gap-1">
                  <span>Stiffness / Tension (k)</span>
                </span>
                <span className="font-mono text-xs font-bold text-[var(--lime)]">
                  {tension}
                </span>
              </div>
              <input
                type="range"
                min="80"
                max="700"
                step="10"
                value={tension}
                onChange={(e) => {
                  setTension(Number(e.target.value));
                  setActivePreset('custom');
                }}
                className="w-full h-1.5 bg-[#18231C] rounded-lg appearance-none cursor-pointer accent-[var(--lime)]"
              />
              <div className="flex justify-between text-[10px] text-[var(--muted)] font-mono">
                <span>Floaty (80)</span>
                <span>Hyper-Snappy (700)</span>
              </div>
            </div>

            {/* Slider 2: Damping / Friction */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-[var(--ink-soft)]">
                  Friction / Damping (c)
                </span>
                <span className="font-mono text-xs font-bold text-emerald-400">
                  {damping}
                </span>
              </div>
              <input
                type="range"
                min="8"
                max="60"
                step="1"
                value={damping}
                onChange={(e) => {
                  setDamping(Number(e.target.value));
                  setActivePreset('custom');
                }}
                className="w-full h-1.5 bg-[#18231C] rounded-lg appearance-none cursor-pointer accent-emerald-400"
              />
              <div className="flex justify-between text-[10px] text-[var(--muted)] font-mono">
                <span>Oscillating (8)</span>
                <span>Critical Rest (60)</span>
              </div>
            </div>

            {/* Slider 3: Mass / Weight */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-[var(--ink-soft)]">
                  Inertial Mass (m)
                </span>
                <span className="font-mono text-xs font-bold text-amber-300">
                  {mass.toFixed(1)}kg
                </span>
              </div>
              <input
                type="range"
                min="0.4"
                max="3.0"
                step="0.1"
                value={mass}
                onChange={(e) => {
                  setMass(Number(e.target.value));
                  setActivePreset('custom');
                }}
                className="w-full h-1.5 bg-[#18231C] rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
              <div className="flex justify-between text-[10px] text-[var(--muted)] font-mono">
                <span>Feather (0.4)</span>
                <span>Heavy Metal (3.0)</span>
              </div>
            </div>
          </div>

          {/* Active Preset Rationale */}
          <div className="p-3 rounded-xl bg-[#121A15] border border-[#202E23] text-xs">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--lime)] block">
              Kinetic Character
            </span>
            <p className="text-[11px] text-[var(--ink-soft)] mt-0.5 leading-relaxed">
              {PRESETS.find((p) => p.id === activePreset)?.description ||
                'Custom spring configuration tuned directly by your tactile input.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
