import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import Envelope from './components/Envelope';
import Letter from './components/Letter';
import Cake from './components/Cake';
import PinVault from './components/PinVault';
import FinalMessage from './components/FinalMessage';

type Phase = 'envelope' | 'letter' | 'cake' | 'vault' | 'payload';

// Per-phase exit/enter variants
const transitions: Record<Phase, { exit: object; enter: object }> = {
  envelope: {
    exit:  { opacity: 0, scale: 1.08, y: -40, filter: 'blur(6px)' },
    enter: { opacity: 0, scale: 0.94, y: 20 },
  },
  letter: {
    exit:  { opacity: 0, x: -60, filter: 'blur(4px)' },
    enter: { opacity: 0, y: 80 },
  },
  cake: {
    exit:  { opacity: 0, scale: 0.92, y: 30 },
    enter: { opacity: 0, scale: 1.06 },
  },
  vault: {
    exit:  { opacity: 0, y: -50, filter: 'blur(8px)' },
    enter: { opacity: 0 },
  },
  payload: {
    exit:  { opacity: 0 },
    enter: { opacity: 0, scale: 0.96 },
  },
};

export default function App() {
  const [phase, setPhase] = useState<Phase>('envelope');

  return (
    <div className="min-h-dvh w-full bg-icy overflow-x-hidden">
      <AnimatePresence mode="wait">
        {phase === 'envelope' && (
          <motion.div
            key="envelope"
            initial={transitions.envelope.enter}
            animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
            exit={transitions.envelope.exit}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          >
            <Envelope onOpen={() => setPhase('letter')} />
          </motion.div>
        )}

        {phase === 'letter' && (
          <motion.div
            key="letter"
            initial={transitions.letter.enter}
            animate={{ opacity: 1, y: 0 }}
            exit={transitions.letter.exit}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <Letter onNext={() => setPhase('cake')} />
          </motion.div>
        )}

        {phase === 'cake' && (
          <motion.div
            key="cake"
            initial={transitions.cake.enter}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={transitions.cake.exit}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <Cake onComplete={() => setPhase('vault')} />
          </motion.div>
        )}

        {phase === 'vault' && (
          <motion.div
            key="vault"
            initial={transitions.vault.enter}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={transitions.vault.exit}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-50"
          >
            <PinVault onUnlocked={() => setPhase('payload')} />
          </motion.div>
        )}

        {phase === 'payload' && (
          <motion.div
            key="payload"
            initial={transitions.payload.enter}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <FinalMessage />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
