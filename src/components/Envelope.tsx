import { motion, AnimatePresence } from 'motion/react';
import FloatingHearts from './FloatingHearts';
import { useState } from 'react';
import { playCrack, playWhoosh } from '../hooks/useSound';
import { haptic } from '../utils/haptic';

interface EnvelopeProps {
  onOpen: () => void;
}

const FRAGMENTS = Array.from({ length: 8 }, (_, i) => ({
  id: i,
  angle: (i * 360) / 8,
  distance: 48 + (i % 3) * 12,
  size: 6 + (i % 3) * 4,
}));

const RIPPLES = [0, 1, 2];

export default function Envelope({ onOpen }: EnvelopeProps) {
  const [sealState, setSealState] = useState<'idle' | 'cracking' | 'cracked'>('idle');
  const [isOpen, setIsOpen] = useState(false);

  const handleTap = () => {
    if (sealState !== 'idle') return;
    haptic.crack();
    playCrack();
    setSealState('cracking');
    setTimeout(() => {
      setSealState('cracked');
      setIsOpen(true);
      playWhoosh();
      setTimeout(onOpen, 1400);
    }, 650);
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-dvh bg-icy px-5 overflow-hidden">
      <FloatingHearts />

      <motion.div
        initial={{ scale: 0.85, opacity: 0, y: 40 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-[320px] z-10"
      >
        <div style={{ perspective: '700px', perspectiveOrigin: 'center 40%' }}>

          {/* Envelope shell */}
          <div
            className="relative z-10 rounded-2xl overflow-visible"
            style={{ 
              aspectRatio: '4/3',
              boxShadow: '0 28px 56px rgba(10,17,40,0.5)',
            }}
            onClick={sealState === 'idle' ? handleTap : undefined}
          >
            {/* Back face (Inside of the envelope) */}
            <div
              className="absolute inset-0 rounded-2xl"
              style={{
                background: '#081024',
                boxShadow: 'inset 0 4px 20px rgba(0,0,0,0.4)',
              }}
            />

            {/* Letter peeking out */}
            <motion.div
              initial={false}
              animate={isOpen ? { y: -75, opacity: 1 } : { y: 6, opacity: 0 }}
              transition={{ delay: 0.3, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-x-7 top-0 h-24 z-0 rounded-lg overflow-hidden"
              style={{
                background: '#faf5ee',
                backgroundImage: 'repeating-linear-gradient(transparent, transparent 17px, #e2d8c8 18px)',
                backgroundSize: '100% 18px',
                boxShadow: '0 6px 24px rgba(10,17,40,0.18)',
              }}
            >
              <div className="p-3 space-y-2 pt-4">
                <div className="h-1.5 rounded-full bg-navy/10 w-3/4" />
                <div className="h-1.5 rounded-full bg-navy/10 w-1/2" />
                <div className="h-1.5 rounded-full bg-navy/10 w-2/3" />
              </div>
            </motion.div>

            {/* Front face wrapper (Pocket) */}
            <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none z-10">
              <div 
                className="absolute inset-0"
                style={{ clipPath: 'polygon(0 0, 50% 50%, 100% 0, 100% 100%, 0 100%)' }}
              >
                {/* Body Gradient */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: 'linear-gradient(145deg, #1845d4 0%, #0A1128 100%)',
                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08)',
                  }}
                />

                {/* Linen texture */}
                <div
                  className="absolute inset-0 opacity-[0.04]"
                  style={{
                    backgroundImage: 'repeating-linear-gradient(45deg, white 0px, white 1px, transparent 1px, transparent 7px)',
                  }}
                />

                {/* Left fold */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none"
                  style={{ clipPath: 'polygon(0 0, 0 100%, 50% 50%)' }}>
                  <div className="absolute inset-0"
                    style={{ background: 'linear-gradient(to right, rgba(255,255,255,0.11), rgba(255,255,255,0.02))' }} />
                </div>

                {/* Right fold */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none"
                  style={{ clipPath: 'polygon(100% 0, 100% 100%, 50% 50%)' }}>
                  <div className="absolute inset-0"
                    style={{ background: 'linear-gradient(to left, rgba(0,0,0,0.14), rgba(0,0,0,0.02))' }} />
                </div>

                {/* Bottom fold */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none"
                  style={{ clipPath: 'polygon(0 100%, 100% 100%, 50% 50%)' }}>
                  <div className="absolute inset-0"
                    style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.22), rgba(0,0,0,0.04))' }} />
                </div>

                {/* Crease lines */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 320 240" preserveAspectRatio="none">
                  <line x1="0" y1="0" x2="160" y2="120" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
                  <line x1="320" y1="0" x2="160" y2="120" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
                  <line x1="0" y1="240" x2="160" y2="120" stroke="rgba(0,0,0,0.12)" strokeWidth="1" />
                  <line x1="320" y1="240" x2="160" y2="120" stroke="rgba(0,0,0,0.12)" strokeWidth="1" />
                </svg>
              </div>
            </div>

            {/* Top flap */}
            <motion.div
              initial={false}
              animate={isOpen ? { rotateX: -175 } : { rotateX: 0 }}
              transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1], delay: isOpen ? 0.15 : 0 }}
              className="absolute inset-0 rounded-t-2xl z-20 pointer-events-none"
              style={{
                transformOrigin: 'center top',
                clipPath: 'polygon(0 0, 100% 0, 50% 50%)',
                backfaceVisibility: 'hidden',
                background: 'linear-gradient(175deg, #1e50e8 0%, #0c2bbf 70%, #091f9a 100%)',
              }}
            >
              <div className="absolute inset-0 opacity-20"
                style={{ background: 'linear-gradient(200deg, rgba(255,255,255,0.5) 0%, transparent 60%)', clipPath: 'polygon(0 0, 100% 0, 50% 50%)' }} />
            </motion.div>

            {/* WAX SEAL */}
            <div className="absolute inset-0 flex items-center justify-center z-30">
              <AnimatePresence>
                {sealState === 'idle' && (
                  <motion.div
                    key="seal"
                    exit={{ scale: 0.4, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="relative flex items-center justify-center cursor-pointer"
                    style={{ width: 60, height: 60 }}
                  >
                    <motion.div
                      animate={{ scale: [1, 1.35, 1], opacity: [0.4, 0, 0.4] }}
                      transition={{ duration: 2.2, repeat: Infinity }}
                      className="absolute inset-0 rounded-full bg-cerulean"
                    />
                    <motion.div
                      animate={{ scale: [1, 1.03, 1] }}
                      transition={{ duration: 2.2, repeat: Infinity }}
                      className="w-14 h-14 rounded-full bg-cerulean flex items-center justify-center relative"
                      style={{ boxShadow: '0 0 24px rgba(33,158,237,0.7), 0 4px 12px rgba(10,17,40,0.3)' }}
                    >
                      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 56 56">
                        <circle cx="28" cy="28" r="22" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" strokeDasharray="4 3" />
                        {Array.from({ length: 12 }, (_, i) => {
                          const a = (i * 30 * Math.PI) / 180;
                          return <line key={i} x1={28 + Math.cos(a) * 20} y1={28 + Math.sin(a) * 20} x2={28 + Math.cos(a) * 24} y2={28 + Math.sin(a) * 24} stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />;
                        })}
                      </svg>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                      </svg>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Crack burst */}
              <AnimatePresence>
                {sealState === 'cracking' && (
                  <div key="crack" className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    {RIPPLES.map(i => (
                      <motion.div
                        key={`ripple-${i}`}
                        className="absolute rounded-full border-2 border-cerulean"
                        initial={{ width: 56, height: 56, opacity: 0.9 }}
                        animate={{ width: 120 + i * 30, height: 120 + i * 30, opacity: 0 }}
                        transition={{ duration: 0.55, delay: i * 0.1, ease: 'easeOut' }}
                      />
                    ))}
                    {FRAGMENTS.map(f => {
                      const rad = (f.angle * Math.PI) / 180;
                      return (
                        <motion.div
                          key={`frag-${f.id}`}
                          className="absolute rounded-full bg-cerulean"
                          style={{ width: f.size, height: f.size }}
                          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                          animate={{ x: Math.cos(rad) * f.distance, y: Math.sin(rad) * f.distance, opacity: 0, scale: 0.2, rotate: f.angle }}
                          transition={{ duration: 0.55, delay: f.id * 0.02, ease: [0.22, 1, 0.36, 1] }}
                        />
                      );
                    })}
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Hint text */}
        <motion.div
          animate={sealState !== 'idle' ? { opacity: 0, y: -10 } : { opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2.5, repeat: sealState === 'idle' ? Infinity : 0 }}
          className="text-center mt-10 space-y-2"
        >
          <p className="text-cerulean font-medium tracking-[0.22em] uppercase text-[10px]">A private delivery for Halimah</p>
          <p className="text-navy/30 text-xs italic">Tap the seal to begin</p>
        </motion.div>
      </motion.div>
    </div>
  );
}
