import React, { useState } from 'react';
import { motion } from 'framer-motion';

export const ZajnoMotionRibbon: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);

  const wordsRow1 = [
    'FOCUS IN MOTION',
    '●',
    'ELASTIC INERTIA',
    '✦',
    'ZERO COGNITIVE FRICTION',
    '●',
    'KINETIC CHOREOGRAPHY',
    '✦',
    'ADAPTIVE FLOW',
    '●',
    'SQUASH & STRETCH',
    '✦',
  ];

  const wordsRow2 = [
    'COGNITIVE MOMENTUM',
    '✦',
    'MICRO-PHYSICS',
    '●',
    'MILLI-SECOND CLARITY',
    '✦',
    'AUTONOMOUS SEQUENCING',
    '●',
    '432HZ HARMONIC',
    '✦',
    'ZAJNO MOTION LAB',
    '●',
  ];

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative w-full overflow-hidden py-3 space-y-2 border-y border-[#18261C] bg-[#070B08] select-none group"
    >
      {/* Ambient gradient masks at edges */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#070B08] to-transparent z-10" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#070B08] to-transparent z-10" />

      {/* Row 1: Marquee scrolling LEFT */}
      <div className="flex overflow-hidden whitespace-nowrap">
        <motion.div
          animate={{ x: ['0%', '-50%'] }}
          transition={{
            duration: isHovered ? 40 : 22,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="flex items-center gap-6 text-[11px] font-['Montserrat',sans-serif] font-black uppercase tracking-widest text-[#66806B] group-hover:text-[var(--ink)] transition-colors"
        >
          {Array.from({ length: 4 }).flatMap(() => wordsRow1).map((item, idx) => (
            <span
              key={`row1-${idx}`}
              className={item === '●' ? 'text-[var(--lime)] text-[8px]' : item === '✦' ? 'text-emerald-400 text-[10px]' : ''}
            >
              {item}
            </span>
          ))}
        </motion.div>
      </div>

      {/* Row 2: Marquee scrolling RIGHT */}
      <div className="flex overflow-hidden whitespace-nowrap">
        <motion.div
          animate={{ x: ['-50%', '0%'] }}
          transition={{
            duration: isHovered ? 40 : 25,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="flex items-center gap-6 text-[10px] font-mono uppercase tracking-widest text-[#4A6050] group-hover:text-[var(--lime)] transition-colors"
        >
          {Array.from({ length: 4 }).flatMap(() => wordsRow2).map((item, idx) => (
            <span
              key={`row2-${idx}`}
              className={item === '●' ? 'text-[var(--forest)] text-[8px]' : item === '✦' ? 'text-[var(--lime)] text-[9px]' : ''}
            >
              {item}
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  );
};
