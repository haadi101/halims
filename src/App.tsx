import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import Envelope from './components/Envelope';
import Letter from './components/Letter';
import Cake from './components/Cake';
import PinVault from './components/PinVault';
import FinalMessage from './components/FinalMessage';

type Phase = 'envelope' | 'letter' | 'cake' | 'vault' | 'payload';

export default function App() {
  const [phase, setPhase] = useState<Phase>('envelope');

  return (
    <div className="min-h-screen w-full bg-icy overflow-x-hidden">
      <AnimatePresence mode="wait">
        {phase === 'envelope' && (
          <motion.div
            key="envelope"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.8 }}
          >
            <Envelope onOpen={() => setPhase('letter')} />
          </motion.div>
        )}

        {phase === 'letter' && (
          <motion.div
            key="letter"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "circOut" }}
          >
            <Letter onNext={() => setPhase('cake')} />
          </motion.div>
        )}

        {phase === 'cake' && (
          <motion.div
            key="cake"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            <Cake onComplete={() => setPhase('vault')} />
          </motion.div>
        )}

        {phase === 'vault' && (
          <motion.div
            key="vault"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="fixed inset-0 z-50"
          >
            <PinVault onUnlocked={() => setPhase('payload')} />
          </motion.div>
        )}

        {phase === 'payload' && (
          <motion.div
            key="payload"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2 }}
          >
            <FinalMessage />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
