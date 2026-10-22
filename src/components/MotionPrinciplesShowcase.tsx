import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Play, Layers, Compass, Eye, MoveRight } from 'lucide-react';
import { InteractiveTiltCard } from './InteractiveTiltCard';

interface Principle {
  id: string;
  number: string;
  title: string;
  tagline: string;
  explanation: string;
  focusApplication: string;
}

const PRINCIPLES: Principle[] = [
  {
    id: 'squash-stretch',
    number: '01',
    title: 'Squash & Stretch',
    tagline: 'Preserving organic volume through elastic deformation',
    explanation:
      'Gives weight, energy, and tactile feedback to digital objects. When clicked or dragged, elements distort dynamically while conserving area, signaling physical responsiveness.',
    focusApplication: 'Used in Focusflow when completing tasks and toggling focus blocks.',
  },
  {
    id: 'anticipation',
    number: '02',
    title: 'Anticipation & Recoil',
    tagline: 'The micro-recoil before purposeful cognitive acceleration',
    explanation:
      'Prepares the user’s mind for motion before the action begins. A subtle 40ms backward displacement gives natural momentum to sudden launches.',
    focusApplication: 'Powers the "Instant Focus" launcher and mode switchers.',
  },
  {
    id: 'staging-depth',
    number: '03',
    title: 'Staging & Spatial Depth',
    tagline: 'Directing cognitive attention with 3D perspective layers',
    explanation:
      'Isolates the single most vital element on screen by softly defocusing secondary clutter, ensuring zero cognitive friction and zero decision paralysis.',
    focusApplication: 'The dedicated Zen Focus Mode completely removes distracting rails.',
  },
  {
    id: 'continuity',
    number: '04',
    title: 'Kinetic Continuity',
    tagline: 'Unbroken spatial choreography across state transitions',
    explanation:
      'Nothing teleports or abruptly pops into existence. Elements fluidly morph from list items into hero counters, preserving user spatial memory.',
    focusApplication: 'Smooth transition from backlog task into active countdown timer.',
  },
];

export const MotionPrinciplesShowcase: React.FC = () => {
  const [activePrincipleId, setActivePrincipleId] = useState<string>('squash-stretch');
  const [triggerAnim, setTriggerAnim] = useState<number>(0);

  const activePrinciple =
    PRINCIPLES.find((p) => p.id === activePrincipleId) || PRINCIPLES[0];

  const handleTestPrinciple = (id: string) => {
    setActivePrincipleId(id);
    setTriggerAnim((c) => c + 1);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1A261D]">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--lime)] block">
            Motion.ED Educational System
          </span>
          <h3 className="text-sm font-['Montserrat',sans-serif] font-bold text-[var(--ink)] uppercase tracking-wider flex items-center gap-2 mt-0.5">
            <Compass className="w-4 h-4 text-[var(--lime)]" />
            <span>The 4 Kinetic Laws of Cognitive Flow</span>
          </h3>
        </div>
        <span className="text-xs text-[var(--muted)] font-mono">
          Interactive Principles Demo
        </span>
      </div>

      {/* Grid: 4 Interactive 3D Principle Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {PRINCIPLES.map((principle) => {
          const isSelected = activePrincipleId === principle.id;

          return (
            <InteractiveTiltCard key={principle.id} maxTilt={12}>
              <button
                type="button"
                onClick={() => handleTestPrinciple(principle.id)}
                className={`group w-full h-full text-left p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                  isSelected
                    ? 'bg-[#142017] border-[var(--lime)] ring-1 ring-[var(--lime)]/30 shadow-[0_0_24px_rgba(217,243,106,0.12)]'
                    : 'bg-[#0B100D] border-[#1C2A20] hover:bg-[#111913] hover:border-[#2C3F30]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-xs pb-2 border-b border-[#19241C]">
                    <span className="font-mono text-xs font-bold text-[var(--lime)]">
                      {principle.number}
                    </span>
                    <span
                      className={`text-[10px] font-mono uppercase px-1.5 py-0.5 rounded ${
                        isSelected
                          ? 'bg-[var(--lime)] text-[var(--lime-ink)] font-bold'
                          : 'text-[var(--muted)] group-hover:text-[var(--ink)]'
                      }`}
                    >
                      {isSelected ? 'Active Demo' : 'Inspect'}
                    </span>
                  </div>
                  <h4 className="text-sm font-['Montserrat',sans-serif] font-bold text-[var(--ink)] tracking-tight mt-2.5">
                    {principle.title}
                  </h4>
                  <p className="text-[11px] text-[var(--muted)] mt-1 line-clamp-2 leading-relaxed">
                    {principle.tagline}
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-between text-[11px] text-[var(--muted)] group-hover:text-[var(--lime)] transition-colors">
                  <span className="font-mono text-[10px]">Test Motion</span>
                  <MoveRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </button>
            </InteractiveTiltCard>
          );
        })}
      </div>

      {/* Interactive Motion Sandbox Demo Box for Active Principle */}
      <div className="bg-[#090E0B] border border-[#1E2B21] rounded-2xl p-6 relative overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Explanation (7 cols) */}
          <div className="md:col-span-7 space-y-3">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-[#16231A] text-[var(--lime)] font-mono text-xs font-bold border border-[#273B2C]">
                LAW {activePrinciple.number}
              </span>
              <h4 className="text-lg font-['Montserrat',sans-serif] font-extrabold text-[var(--ink)] tracking-tight">
                {activePrinciple.title}
              </h4>
            </div>

            <p className="text-xs sm:text-sm text-[var(--ink-soft)] leading-relaxed">
              {activePrinciple.explanation}
            </p>

            <div className="p-3 rounded-xl bg-[#101712] border border-[#1F2C22] text-xs space-y-1">
              <span className="text-[10px] font-mono text-[var(--lime)] uppercase tracking-wider block">
                Focusflow Architecture Integration:
              </span>
              <p className="text-[11px] text-[var(--muted)]">
                {activePrinciple.focusApplication}
              </p>
            </div>
          </div>

          {/* Interactive Visual Playback Canvas (5 cols) */}
          <div className="md:col-span-5 bg-[#050806] border border-[#1D2B20] rounded-xl p-5 min-h-[180px] flex flex-col items-center justify-center relative overflow-hidden">
            {/* Visual demo for Squash & Stretch */}
            {activePrinciple.id === 'squash-stretch' && (
              <motion.div
                key={`squash-${triggerAnim}`}
                animate={{
                  scaleX: [1, 1.4, 0.7, 1.15, 0.95, 1],
                  scaleY: [1, 0.6, 1.3, 0.85, 1.05, 1],
                  y: [0, 20, -30, 10, -5, 0],
                }}
                transition={{ duration: 1.1, ease: 'easeInOut' }}
                className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[var(--forest)] to-[var(--lime)] flex items-center justify-center text-[var(--lime-ink)] font-black text-xs font-['Montserrat',sans-serif] shadow-[0_0_25px_rgba(217,243,106,0.35)]"
              >
                VOLUME
              </motion.div>
            )}

            {/* Visual demo for Anticipation */}
            {activePrinciple.id === 'anticipation' && (
              <motion.div
                key={`anticipation-${triggerAnim}`}
                animate={{
                  x: [0, -35, 65, 0],
                  scale: [1, 0.9, 1.15, 1],
                  rotate: [0, -12, 10, 0],
                }}
                transition={{ duration: 1.2, times: [0, 0.3, 0.7, 1], ease: 'easeInOut' }}
                className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-400 to-[var(--lime)] flex items-center justify-center text-[var(--lime-ink)] font-black text-xs font-['Montserrat',sans-serif] shadow-[0_0_25px_rgba(245,158,11,0.3)]"
              >
                RECOIL
              </motion.div>
            )}

            {/* Visual demo for Staging & Depth */}
            {activePrinciple.id === 'staging-depth' && (
              <div key={`staging-${triggerAnim}`} className="relative w-44 h-28 flex items-center justify-center">
                <motion.div
                  animate={{ filter: ['blur(0px)', 'blur(4px)', 'blur(0px)'] }}
                  transition={{ duration: 1.6, repeat: Infinity }}
                  className="absolute left-2 w-14 h-14 rounded-xl bg-[#16231A] border border-[#273B2C] -z-10"
                />
                <motion.div
                  animate={{ filter: ['blur(0px)', 'blur(4px)', 'blur(0px)'] }}
                  transition={{ duration: 1.6, repeat: Infinity, delay: 0.3 }}
                  className="absolute right-2 w-14 h-14 rounded-xl bg-[#16231A] border border-[#273B2C] -z-10"
                />
                <motion.div
                  animate={{ scale: [1, 1.15, 1], zIndex: 20 }}
                  transition={{ duration: 1.6, repeat: Infinity }}
                  className="w-18 h-18 rounded-2xl bg-[var(--lime)] text-[var(--lime-ink)] font-black text-xs font-['Montserrat',sans-serif] flex items-center justify-center shadow-[0_0_30px_rgba(217,243,106,0.4)]"
                >
                  FOCUS
                </motion.div>
              </div>
            )}

            {/* Visual demo for Kinetic Continuity */}
            {activePrinciple.id === 'continuity' && (
              <motion.div
                key={`continuity-${triggerAnim}`}
                animate={{
                  borderRadius: ['12px', '50%', '24px', '12px'],
                  width: ['140px', '72px', '120px', '140px'],
                  height: ['40px', '72px', '60px', '40px'],
                }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                className="bg-gradient-to-r from-emerald-400 via-[var(--lime)] to-teal-400 text-[var(--lime-ink)] font-black text-xs font-['Montserrat',sans-serif] flex items-center justify-center shadow-[0_0_25px_rgba(16,185,129,0.3)]"
              >
                MORPH
              </motion.div>
            )}

            <button
              onClick={() => setTriggerAnim((c) => c + 1)}
              className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#141F17] hover:bg-[#1E2E23] text-[var(--lime)] text-[10px] font-mono border border-[#26382B] cursor-pointer transition-colors"
            >
              <Play className="w-3 h-3 fill-current" />
              <span>Re-trigger Animation</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
