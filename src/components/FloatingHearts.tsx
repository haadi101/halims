import { useEffect, useState } from 'react';

const SHAPES = ['heart', 'heart', 'heart', 'star', 'heart', 'heart', 'sparkle'];

export default function FloatingHearts() {
  const [particles, setParticles] = useState<
    { id: number; left: string; size: number; duration: number; delay: number; shape: string; rotation: number }[]
  >([]);

  useEffect(() => {
    setParticles(
      Array.from({ length: 18 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 96 + 2}%`,
        size: Math.random() * 14 + 8,
        duration: Math.random() * 10 + 11,
        delay: Math.random() * 6,
        shape: SHAPES[i % SHAPES.length],
        rotation: Math.random() * 720 - 360,
      }))
    );
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="floating-particle absolute bottom-[-5%]"
          style={{
            left: p.left,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            animationName: 'floatUp',
            animationTimingFunction: 'linear',
            animationIterationCount: 'infinite',
          }}
        >
          {p.shape === 'heart' && (
            <svg
              width={p.size}
              height={p.size}
              viewBox="0 0 24 24"
              fill="rgba(33,158,237,0.18)"
              style={{
                animation: `tumble ${p.duration * 0.6}s linear ${p.delay}s infinite`,
              }}
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          )}
          {p.shape === 'star' && (
            <svg
              width={p.size}
              height={p.size}
              viewBox="0 0 24 24"
              fill="rgba(33,158,237,0.12)"
              style={{
                animation: `tumble ${p.duration * 0.5}s linear ${p.delay}s infinite`,
              }}
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          )}
          {p.shape === 'sparkle' && (
            <svg
              width={p.size * 1.2}
              height={p.size * 1.2}
              viewBox="0 0 24 24"
              stroke="rgba(33,158,237,0.15)"
              fill="none"
              strokeWidth="1.5"
              style={{
                animation: `tumble ${p.duration * 0.7}s linear ${p.delay}s infinite`,
              }}
            >
              <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.64 5.64l2.12 2.12M16.24 16.24l2.12 2.12M5.64 18.36l2.12-2.12M16.24 7.76l2.12-2.12" strokeLinecap="round" />
            </svg>
          )}
        </div>
      ))}
    </div>
  );
}
