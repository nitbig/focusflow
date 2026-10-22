import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, Volume2 } from 'lucide-react';

interface KineticSoundWaveProps {
  intensity?: number;
  label?: string;
}

export const KineticSoundWave: React.FC<KineticSoundWaveProps> = ({
  intensity = 1,
  label = 'Kinetic Focus Frequency',
}) => {
  const [hovered, setHovered] = useState(false);
  const [pulseSpeed, setPulseSpeed] = useState<'calm' | 'hyper' | 'harmonic'>('harmonic');

  const barCount = 28;
  const bars = Array.from({ length: barCount }, (_, i) => i);

  const getMultiplier = (index: number) => {
    // Wave envelope: higher in center, lower at edges
    const center = barCount / 2;
    const dist = Math.abs(index - center) / center;
    return Math.max(0.2, 1 - dist * 0.7);
  };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="p-4 rounded-2xl bg-[#0B100D] border border-[#1E2B21] transition-all hover:border-[var(--lime)]/50 space-y-3 group"
    >
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[var(--lime)] animate-ping" />
          <span className="font-['Montserrat',sans-serif] font-bold tracking-tight text-[var(--ink)] flex items-center gap-1.5 text-[11px] uppercase">
            <Volume2 className="w-3.5 h-3.5 text-[var(--lime)]" />
            <span>{label}</span>
          </span>
        </div>

        {/* Speed toggle pills */}
        <div className="flex items-center gap-1 bg-[#131D16] p-0.5 rounded-lg border border-[#202E23]">
          {(['calm', 'harmonic', 'hyper'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setPulseSpeed(mode)}
              className={`px-2 py-0.5 rounded-md text-[10px] font-mono capitalize transition-all cursor-pointer ${
                pulseSpeed === mode
                  ? 'bg-[var(--lime)] text-[var(--lime-ink)] font-bold shadow-xs'
                  : 'text-[var(--muted)] hover:text-[var(--ink)]'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Kinetic Wave Bars */}
      <div className="h-14 flex items-end justify-between gap-1 px-1 pt-2 overflow-hidden">
        {bars.map((bar) => {
          const mult = getMultiplier(bar);
          const duration =
            pulseSpeed === 'hyper'
              ? 0.4 + (bar % 5) * 0.1
              : pulseSpeed === 'calm'
              ? 1.4 + (bar % 5) * 0.2
              : 0.8 + (bar % 6) * 0.15;

          const baseHeight = 12;
          const peakHeight = Math.round((hovered ? 48 : 38) * mult * intensity);

          return (
            <motion.div
              key={bar}
              className="flex-1 rounded-full transition-colors"
              animate={{
                height: [
                  `${baseHeight}px`,
                  `${peakHeight}px`,
                  `${baseHeight + 6}px`,
                  `${peakHeight * 0.8}px`,
                  `${baseHeight}px`,
                ],
                backgroundColor: hovered
                  ? bar % 4 === 0
                    ? '#D9F36A'
                    : '#10B981'
                  : bar % 3 === 0
                  ? '#D9F36A'
                  : '#203A27',
              }}
              transition={{
                duration,
                repeat: Infinity,
                repeatType: 'mirror',
                ease: 'easeInOut',
                delay: (bar * 0.04) % 0.6,
              }}
            />
          );
        })}
      </div>

      <div className="flex items-center justify-between text-[10px] text-[var(--muted)] font-mono border-t border-[#19241C] pt-2">
        <span className="flex items-center gap-1">
          <Activity className="w-3 h-3 text-[var(--lime)]" />
          <span>Binaural 432Hz Harmonic</span>
        </span>
        <span className="text-[var(--ink-soft)]">
          {hovered ? 'Interactive Resonance Active' : 'Hover to Amplify'}
        </span>
      </div>
    </div>
  );
};
