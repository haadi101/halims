import { motion, useInView } from 'motion/react';
import { Heart } from 'lucide-react';
import FloatingHearts from './FloatingHearts';
import { useRef, useEffect, useState, useCallback } from 'react';

interface LetterProps {
  onNext: () => void;
}

type MediaItem =
  | { type: 'image'; src: string; caption: string; sub?: string; aspect: 'video' | 'square' | 'portrait' }
  | { type: 'video'; src: string; caption: string; sub?: string };

const memories: MediaItem[] = [
  { type: 'image', src: '/halims-img/beauty.JPG',    caption: 'happy birthday to the most beautiful girl I know.', sub: 'yes, I said what I said.', aspect: 'portrait' },
  { type: 'image', src: '/halims-img/normal1.jpg',   caption: '💙', aspect: 'portrait' },
  { type: 'video', src: '/halims-img/oluya.MP4',     caption: 'Happy birthday OLUYA!!!', sub: '🖐️🖐️' },
  { type: 'video', src: '/halims-img/fed me.MP4',    caption: 'happy birthday to the woman who fed me when I was hungry.' },
  { type: 'image', src: '/halims-img/fairskin.JPG',  caption: 'hold on.', aspect: 'portrait' },
  { type: 'image', src: '/halims-img/darkskin.jpg',  caption: 'Na only God sabi how many skin tones you get 😭', aspect: 'portrait' },
  { type: 'image', src: '/halims-img/img_6881.jpg',  caption: 'And to the person who tried to strangle me, you won’t escape what’s coming for you 🫵', aspect: 'portrait' },
];

// Deterministic slight rotation per card — feels like scattered prints
const ROTATIONS = [-2.8, 1.5, -1.2, 2.5, -2.1, 1.8, -0.9, 2.2, -1.7, 3.1, -2.3, 1.1];

// ─── Typewriter hook ───────────────────────────────────────────────────
function useTypewriter(lines: string[], charSpeed = 38, pauseBetween = 500) {
  const [phase, setPhase] = useState(0);
  const [displayed, setDisplayed] = useState<string[]>(lines.map(() => ''));

  useEffect(() => {
    if (phase >= lines.length) return;
    const text = lines[phase];
    let i = 0;
    const iv = setInterval(() => {
      i++;
      setDisplayed(prev => {
        const next = [...prev];
        next[phase] = text.slice(0, i);
        return next;
      });
      if (i >= text.length) {
        clearInterval(iv);
        setTimeout(() => setPhase(p => p + 1), pauseBetween);
      }
    }, charSpeed);
    return () => clearInterval(iv);
  }, [phase]);

  const done = phase >= lines.length;
  return { displayed, done };
}

// ─── Autoplay video hook ───────────────────────────────────────────────
function VideoCard({ src, caption, sub }: { src: string; caption: string; sub?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [showUnmute, setShowUnmute] = useState(false);

  const tryPlay = useCallback(async (v: HTMLVideoElement) => {
    try {
      v.muted = false;
      await v.play();
      setPlaying(true); setMuted(false); setShowUnmute(false);
    } catch {
      try {
        v.muted = true;
        await v.play();
        setPlaying(true); setMuted(true); setShowUnmute(true);
      } catch { setPlaying(false); }
    }
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    const c = containerRef.current;
    if (!v || !c) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { tryPlay(v); }
      else { v.pause(); v.currentTime = 0; setPlaying(false); setShowUnmute(false); }
    }, { threshold: 0.55 });
    obs.observe(c);
    return () => obs.disconnect();
  }, [tryPlay]);

  const handleTap = async () => {
    const v = videoRef.current;
    if (!v) return;
    if (muted) { v.muted = false; setMuted(false); setShowUnmute(false); }
    else if (v.paused) { await tryPlay(v); }
    else { v.pause(); setPlaying(false); }
  };

  return (
    <div className="flex flex-col gap-4">
      <div ref={containerRef} className="relative w-full overflow-hidden rounded-2xl cursor-pointer" style={{ background: '#060d1e' }} onClick={handleTap}>
        <video
          ref={videoRef}
          src={src}
          className="w-full block rounded-2xl"
          style={{ maxHeight: '70vw', objectFit: 'cover' }}
          playsInline preload="metadata"
          onEnded={() => setPlaying(false)}
        />
        {showUnmute && (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-white text-[11px] font-medium"
            style={{ background: 'rgba(10,17,40,0.65)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="white"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3z"/></svg>
            Tap to unmute
          </motion.div>
        )}
        {!playing && (
          <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'rgba(6,13,30,0.38)' }}>
            <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7L8 5z" /></svg>
            </div>
          </div>
        )}
      </div>
      <div className="text-center px-1">
        <p className="font-serif text-lg text-navy/80 italic leading-snug">{caption}</p>
        {sub && <p className="text-navy/40 text-base mt-1">{sub}</p>}
      </div>
    </div>
  );
}

// ─── Polaroid image card ───────────────────────────────────────────────
function PolaroidCard({ src, caption, rotation, aspect }: {
  src: string; caption: string; rotation: number; aspect: string;
}) {
  return (
    <div
      className="relative bg-white mx-auto"
      style={{
        rotate: `${rotation}deg`,
        padding: '10px 10px 44px 10px',
        boxShadow: '0 6px 28px rgba(10,17,40,0.18), 0 1px 4px rgba(10,17,40,0.1)',
        maxWidth: '88%',
      }}
    >
      <div className={`w-full overflow-hidden bg-navy/5 ${
        aspect === 'portrait' ? 'aspect-[3/4]' : aspect === 'square' ? 'aspect-square' : 'aspect-video'
      }`}>
        <img src={src} alt={caption} className="w-full h-full object-cover" loading="lazy" decoding="async" />
      </div>
      {/* Caption in the white polaroid strip */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center" style={{ height: 44 }}>
        <p className="font-hand text-navy/60 text-lg text-center px-2 leading-tight">{caption}</p>
      </div>
    </div>
  );
}

// ─── Envelope-pull wrapper ─────────────────────────────────────────────
function EnvelopePull({ children, index }: { children: React.ReactNode; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-70px' });
  const rotation = ROTATIONS[index % ROTATIONS.length];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 70, scale: 0.9, rotate: rotation - 6 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1, rotate: rotation } : {}}
      transition={{ type: 'spring', stiffness: 55, damping: 13, mass: 0.85 }}
    >
      {children}
    </motion.div>
  );
}

// ─── Main Letter component ─────────────────────────────────────────────
export default function Letter({ onNext }: LetterProps) {
  const prologue = [
    'Twenty.',
    '"Before the day gets loud, before the calls and the messages flood in, I wanted to build a quiet space just for you."',
    'No rushing, no replies needed. Just breathe, take your time, and scroll whenever you\'re ready.',
  ];
  const { displayed, done } = useTypewriter(prologue);

  return (
    <div className="relative min-h-dvh bg-icy overflow-x-hidden">
      <FloatingHearts />

      <div className="relative w-full max-w-sm mx-auto px-4 pt-16 pb-14 z-10">

        {/* ── Prologue typewriter card ── */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: 'easeOut' }}
          className="paper-texture bg-white p-7 rounded-[1.75rem] shadow-xl mb-20 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-20 h-20 bg-cerulean/5 rounded-br-full -translate-x-4 -translate-y-4" />
          <Heart className="absolute top-6 right-6 text-cerulean/20" size={26} />

          {/* Title */}
          <h1 className="font-serif text-5xl leading-tight mb-7 text-navy min-h-[3.5rem]">
            {displayed[0]}
            {prologue[0].length > displayed[0].length && <span className="animate-pulse opacity-60">|</span>}
          </h1>

          {/* Quote */}
          {displayed[0] === prologue[0] && (
            <div className="space-y-4">
              <p className="font-serif text-lg leading-relaxed text-navy/85 italic min-h-[5rem]">
                {displayed[1]}
                {displayed[1].length > 0 && displayed[1].length < prologue[1].length && (
                  <span className="animate-pulse opacity-60">|</span>
                )}
              </p>

              {/* Body */}
              {displayed[1] === prologue[1] && (
                <p className="font-sans text-navy/50 leading-relaxed text-sm font-light min-h-[3rem]">
                  {displayed[2]}
                  {displayed[2].length > 0 && displayed[2].length < prologue[2].length && (
                    <span className="animate-pulse opacity-60">|</span>
                  )}
                </p>
              )}
            </div>
          )}

          {done && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-8 flex items-center gap-3 text-cerulean"
            >
              <div className="h-px flex-1 bg-cerulean/20" />
              <Heart size={13} fill="currentColor" />
              <div className="h-px flex-1 bg-cerulean/20" />
            </motion.div>
          )}
        </motion.div>

        {/* ── Media scroll with polaroid + envelope reveal ── */}
        <div className="space-y-20">
          {memories.map((item, index) => (
            <EnvelopePull key={index} index={index}>
              {item.type === 'video' ? (
                <VideoCard src={item.src} caption={item.caption} sub={item.sub} />
              ) : (
                <PolaroidCard
                  src={item.src}
                  caption={item.caption}
                  rotation={ROTATIONS[index % ROTATIONS.length]}
                  aspect={item.aspect}
                />
              )}
            </EnvelopePull>
          ))}
        </div>

        {/* ── End + Continue ── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="mt-28 mb-4 flex flex-col items-center gap-9"
        >
          <div className="flex flex-col items-center gap-3 text-navy/25">
            <p className="text-[9px] uppercase tracking-[0.45em] font-medium">The end of the scroll</p>
            <div className="w-px h-16 bg-gradient-to-b from-navy/25 to-transparent" />
          </div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onNext}
            className="relative px-10 py-4 overflow-hidden rounded-full font-medium"
            style={{
              boxShadow: '0 8px 28px rgba(10,17,40,0.2)',
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            <div className="absolute inset-0 bg-navy rounded-full" />
            <span className="relative text-white tracking-widest uppercase text-[11px]">Continue the journey</span>
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
