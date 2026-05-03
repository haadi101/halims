import { motion, AnimatePresence } from 'motion/react';
import { useMicrophoneBlow } from '../hooks/useMicrophoneBlow';
import { Wind, Mic, Sparkles } from 'lucide-react';
import { useState } from 'react';
import FloatingHearts from './FloatingHearts';
import { playDing } from '../hooks/useSound';
import { haptic } from '../utils/haptic';

interface CakeProps {
  onComplete: () => void;
}

// Confetti particles
const CONFETTI = Array.from({ length: 32 }, (_, i) => ({
  id: i,
  angle: (i / 32) * 360,
  distance: 60 + (i % 4) * 30,
  color: ['#219EED', '#F2A7C3', '#f59e0b', '#ffffff', '#1338BE', '#fb923c'][i % 6],
  size: 5 + (i % 4) * 3,
  isRect: i % 3 === 0,
}));

// SVG flame component for a single candle
function Flame({ active, delay = 0 }: { active: boolean; delay?: number }) {
  return (
    <AnimatePresence>
      {active && (
        <motion.g
          initial={{ opacity: 0, scaleY: 0 }}
          animate={{ opacity: 1, scaleY: 1 }}
          exit={{ opacity: 0, scaleY: 0, transition: { duration: 0.3 } }}
        >
          {/* Outer glow */}
          <motion.ellipse
            cx="0" cy="-4" rx="7" ry="10"
            fill="rgba(251,146,60,0.25)"
            animate={{ ry: [10, 13, 10], rx: [7, 6, 7] }}
            transition={{ duration: 0.6 + delay, repeat: Infinity, ease: 'easeInOut' }}
          />
          {/* Outer flame */}
          <motion.path
            d="M0,0 C-5,-4 -5,-14 0,-20 C5,-14 5,-4 0,0 Z"
            fill="url(#flameOuter)"
            animate={{
              d: [
                "M0,0 C-5,-4 -5,-14 0,-20 C5,-14 5,-4 0,0 Z",
                "M0,0 C-4,-5 -6,-13 0,-21 C6,-13 4,-5 0,0 Z",
                "M0,0 C-5,-3 -4,-15 0,-19 C4,-15 5,-3 0,0 Z",
                "M0,0 C-5,-4 -5,-14 0,-20 C5,-14 5,-4 0,0 Z",
              ],
              skewX: [0, 3, -2, 0],
            }}
            transition={{ duration: 0.5 + delay * 0.3, repeat: Infinity, ease: 'easeInOut' }}
          />
          {/* Inner core */}
          <motion.path
            d="M0,-2 C-2.5,-6 -2.5,-13 0,-17 C2.5,-13 2.5,-6 0,-2 Z"
            fill="url(#flameInner)"
            animate={{ d: [
              "M0,-2 C-2.5,-6 -2.5,-13 0,-17 C2.5,-13 2.5,-6 0,-2 Z",
              "M0,-2 C-2,-7 -3,-12 0,-16 C3,-12 2,-7 0,-2 Z",
              "M0,-2 C-2.5,-6 -2.5,-13 0,-17 C2.5,-13 2.5,-6 0,-2 Z",
            ]}}
            transition={{ duration: 0.4 + delay * 0.2, repeat: Infinity, ease: 'easeInOut' }}
          />
          {/* White hot tip */}
          <motion.circle
            cx="0" cy="-15" r="2"
            fill="rgba(255,255,240,0.9)"
            animate={{ cy: [-15, -16, -14, -15], r: [2, 1.5, 2.5, 2] }}
            transition={{ duration: 0.45 + delay, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.g>
      )}
    </AnimatePresence>
  );
}

// SVG Smoke puff at a candle tip
function SmokePuff({ x, y, delay = 0 }: { x: number; y: number; delay?: number }) {
  return (
    <>
      {[0, 1, 2].map(i => (
        <motion.circle
          key={i}
          cx={x + (i - 1) * 6}
          cy={y}
          r={6 + i * 2}
          fill="rgba(200,210,220,0.25)"
          initial={{ cy: y, opacity: 0, r: 4 }}
          animate={{
            cy: [y, y - 20, y - 50],
            opacity: [0, 0.4, 0],
            r: [4, 10, 16],
            cx: [x + (i - 1) * 4, x + (i - 1) * 10, x + (i - 1) * 18],
          }}
          transition={{ duration: 1.8, delay: delay + i * 0.2, ease: 'easeOut', repeat: 2 }}
        />
      ))}
    </>
  );
}

export default function Cake({ onComplete }: CakeProps) {
  const [blownOut, setBlownOut] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleBlowOut = () => {
    if (blownOut) return;
    setBlownOut(true);
    setShowConfetti(true);
    haptic.blow();
    playDing();
    setTimeout(() => onComplete(), 3800);
  };

  const { startListening, isListening } = useMicrophoneBlow(handleBlowOut);

  // Candle x positions in the SVG (viewBox 0 0 200 180)
  const candles = [
    { x: 72, candleY1: 52, candleY2: 82, label: '2', delay: 0 },
    { x: 128, candleY1: 52, candleY2: 82, label: '0', delay: 0.25 },
  ];

  return (
    <div className="relative min-h-dvh flex flex-col items-center justify-center p-6 bg-icy overflow-hidden">
      <FloatingHearts />

      {/* CAKE SVG */}
      <motion.div
        initial={{ scale: 0.75, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 mb-8"
        style={{ width: 220 }}
      >
        <svg viewBox="0 0 200 190" width="100%" overflow="visible">
          <defs>
            {/* Flame gradients */}
            <linearGradient id="flameOuter" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="#dc2626" />
              <stop offset="40%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#fde68a" />
            </linearGradient>
            <linearGradient id="flameInner" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="#fb923c" />
              <stop offset="60%" stopColor="#fef08a" />
              <stop offset="100%" stopColor="white" />
            </linearGradient>
            {/* Tier gradients */}
            <linearGradient id="topTier" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f9a8d4" />
              <stop offset="100%" stopColor="#ec4899" stopOpacity="0.7" />
            </linearGradient>
            <linearGradient id="bottomTier" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fef3c7" />
              <stop offset="100%" stopColor="#fde68a" />
            </linearGradient>
            <filter id="softShadow" x="-20%" y="-20%" width="140%" height="160%">
              <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="rgba(10,17,40,0.18)" />
            </filter>
            <filter id="candleGlow">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          {/* ── BOTTOM TIER ── */}
          {/* Shadow */}
          <ellipse cx="100" cy="174" rx="68" ry="8" fill="rgba(10,17,40,0.1)" />
          {/* Body */}
          <rect x="28" y="120" width="144" height="52" rx="12" fill="url(#bottomTier)" filter="url(#softShadow)" />
          {/* Frosting top */}
          <rect x="28" y="120" width="144" height="14" rx="7" fill="white" />
          {/* Frosting drips */}
          {[40, 60, 80, 100, 120, 140, 158].map((dx, i) => (
            <path
              key={i}
              d={`M${dx - 7},126 Q${dx - 6},${136 + (i % 3) * 6} ${dx},${140 + (i % 3) * 7} Q${dx + 6},${136 + (i % 3) * 6} ${dx + 7},126`}
              fill="white"
            />
          ))}
          {/* Cerulean dots */}
          {[44, 68, 92, 116, 140, 162].map((dx, i) => (
            <circle key={i} cx={dx} cy={148 + (i % 2) * 8} r="3.5" fill="#219EED" opacity="0.7" />
          ))}
          {/* Rose heart sprinkles */}
          {[55, 100, 148].map((dx, i) => (
            <text key={i} x={dx} y={160} fontSize="10" fill="#f472b6" textAnchor="middle">♥</text>
          ))}

          {/* ── TOP TIER ── */}
          {/* Body */}
          <motion.g animate={{ y: [0, -3, 0] }} transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}>
            <rect x="58" y="68" width="84" height="54" rx="10" fill="url(#topTier)" filter="url(#softShadow)" />
            {/* Frosting top */}
            <rect x="58" y="68" width="84" height="12" rx="6" fill="white" />
            {/* Top tier frosting drips */}
            {[68, 82, 96, 110, 122, 134].map((dx, i) => (
              <path
                key={i}
                d={`M${dx - 5},72 Q${dx - 4},${80 + (i % 2) * 5} ${dx},${84 + (i % 2) * 6} Q${dx + 4},${80 + (i % 2) * 5} ${dx + 5},72`}
                fill="white"
              />
            ))}
            {/* Top tier dots */}
            {[70, 90, 110, 130].map((dx, i) => (
              <circle key={i} cx={dx} cy={96 + (i % 2) * 8} r="3" fill="#1338BE" opacity="0.4" />
            ))}

            {/* ── CANDLES ── */}
            {candles.map((c) => (
              <g key={c.label}>
                {/* Wick */}
                <line x1={c.x} y1={c.candleY2 - 2} x2={c.x} y2={c.candleY2 - 6} stroke="#4a3728" strokeWidth="1.5" strokeLinecap="round" />
                {/* Candle body */}
                <rect
                  x={c.x - 5} y={c.candleY1}
                  width="10" height={c.candleY2 - c.candleY1}
                  rx="3"
                  fill="linear-gradient(#dbeafe, #bfdbfe)"
                  style={{ fill: 'url(#candleBody)' }}
                />
                <rect x={c.x - 5} y={c.candleY1} width="10" height={c.candleY2 - c.candleY1} rx="3" fill="#bfdbfe" />
                <rect x={c.x - 5} y={c.candleY1} width="4" height={c.candleY2 - c.candleY1} rx="3" fill="rgba(255,255,255,0.4)" />
                {/* Number label */}
                <text x={c.x} y={c.candleY2 + 14} textAnchor="middle" fontSize="11" fontFamily="Georgia, serif" fontWeight="bold" fill="#1338BE" opacity="0.6">
                  {c.label}
                </text>
                {/* Flame */}
                <g transform={`translate(${c.x}, ${c.candleY1 - 2})`} filter="url(#candleGlow)">
                  <Flame active={!blownOut} delay={c.delay} />
                </g>
              </g>
            ))}
          </motion.g>

          {/* Smoke on blow-out */}
          <AnimatePresence>
            {blownOut && candles.map((c, i) => (
              <SmokePuff key={i} x={c.x} y={c.candleY1 - 22} delay={i * 0.15} />
            ))}
          </AnimatePresence>

          {/* Confetti burst */}
          <AnimatePresence>
            {showConfetti && CONFETTI.map(p => {
              const rad = (p.angle * Math.PI) / 180;
              return (
                <motion.g key={p.id}>
                  {p.isRect ? (
                    <motion.rect
                      x={100} y={100}
                      width={p.size} height={p.size / 2}
                      fill={p.color}
                      rx="1"
                      initial={{ x: 100, y: 100, opacity: 1, rotate: 0 }}
                      animate={{
                        x: 100 + Math.cos(rad) * p.distance,
                        y: 100 + Math.sin(rad) * p.distance + 30,
                        opacity: 0,
                        rotate: p.angle * 3,
                      }}
                      transition={{ duration: 1.2, delay: p.id * 0.02, ease: [0.22, 1, 0.36, 1] }}
                    />
                  ) : (
                    <motion.circle
                      cx={100} cy={100}
                      r={p.size / 2}
                      fill={p.color}
                      initial={{ cx: 100, cy: 100, opacity: 1, scale: 1 }}
                      animate={{
                        cx: 100 + Math.cos(rad) * p.distance,
                        cy: 100 + Math.sin(rad) * p.distance + 20,
                        opacity: 0,
                        scale: 0.3,
                      }}
                      transition={{ duration: 1.1, delay: p.id * 0.02, ease: [0.22, 1, 0.36, 1] }}
                    />
                  )}
                </motion.g>
              );
            })}
          </AnimatePresence>
        </svg>
      </motion.div>

      {/* UI Controls */}
      <div className="text-center max-w-[280px] space-y-6 z-20">
        <AnimatePresence mode="wait">
          {!blownOut ? (
            <motion.div
              key="prompt"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center gap-5"
            >
              <div className="space-y-1">
                <h2 className="text-navy font-serif text-2xl italic">Make a wish, Halimah.</h2>
                <p className="text-navy/40 text-sm">The universe is listening to you.</p>
              </div>

              {!isListening ? (
                <div className="flex flex-col gap-3 w-full">
                  <button
                    id="mic-start"
                    onClick={() => startListening()}
                    className="flex items-center justify-center gap-3 bg-cerulean text-white px-8 py-4 rounded-full shadow-lg hover:bg-cerulean/90 active:scale-95 transition-all font-medium"
                    style={{ boxShadow: '0 8px 24px rgba(33,158,237,0.35)' }}
                  >
                    <Mic size={18} />
                    <span>Start Listening</span>
                  </button>
                  <button
                    id="manual-blow"
                    onClick={handleBlowOut}
                    className="text-cerulean/50 text-[10px] uppercase tracking-widest font-semibold hover:text-cerulean transition-colors flex items-center justify-center gap-2"
                  >
                    <Wind size={11} />
                    <span>Or blow manually</span>
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-5">
                  <motion.div
                    animate={{ scale: [1, 1.18, 1] }}
                    transition={{ repeat: Infinity, duration: 1.2 }}
                    className="w-20 h-20 rounded-full flex items-center justify-center text-cerulean border-2 border-cerulean/30 bg-cerulean/8"
                  >
                    <Wind size={36} strokeWidth={1.5} />
                  </motion.div>
                  <div>
                    <p className="text-navy/60 font-medium animate-pulse">Blow into the mic…</p>
                    <p className="text-[10px] text-navy/30 mt-1">Blow firmly and steadily</p>
                  </div>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="celebration"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 18 }}
              className="space-y-5"
            >
              <div className="flex justify-center gap-2 text-cerulean">
                <Sparkles size={20} /><Sparkles size={24} /><Sparkles size={20} />
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-serif text-navy">Wish accepted.</h2>
                <p className="text-navy/50 italic leading-relaxed text-sm">
                  The silence that follows is where your dreams begin to take shape.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
