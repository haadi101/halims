import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck } from 'lucide-react';
import { haptic } from '../utils/haptic';

interface PinVaultProps {
  onUnlocked: () => void;
}

export default function PinVault({ onUnlocked }: PinVaultProps) {
  const [step, setStep] = useState<'message' | 'vault'>('message');
  const [pin, setPin] = useState<string>('');
  const [showDot, setShowDot] = useState(false);

  useEffect(() => {
    // Initial sequence: Fade in message, then 3s delay for dot
    const timer = setTimeout(() => setShowDot(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleKeyPress = (num: string) => {
    if (pin.length < 4) {
      haptic.tap();
      const newPin = pin + num;
      setPin(newPin);
      if (newPin.length === 4) {
        haptic.success();
        setTimeout(() => { onUnlocked(); }, 500);
      }
    }
  };

  const clearPin = () => setPin('');

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center p-8 overflow-hidden relative">
      <AnimatePresence mode="wait">
        {step === 'message' && (
          <motion.div
            key="birthday-message"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center space-y-8 z-10"
          >
            <motion.h1 
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              className="font-serif text-3xl text-cerulean leading-tight"
            >
              Happy Birthday, Halimah.
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ delay: 1 }}
              className="text-white font-sans font-light tracking-wide"
            >
              I am always in your corner.
            </motion.p>
            
            <AnimatePresence>
              {showDot && (
                <motion.button
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  whileHover={{ scale: 1.2, boxShadow: '0 0 30px rgba(33,158,237,0.4)' }}
                  onClick={() => setStep('vault')}
                  className="mt-12 w-3 h-3 bg-cerulean rounded-full shadow-[0_0_15px_rgba(33,158,237,0.8)] cursor-pointer"
                />
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {step === 'vault' && (
          <motion.div
            key="vault-entry"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-xs flex flex-col items-center gap-12"
          >
            <div className="text-center space-y-2">
              <ShieldCheck className="mx-auto text-cerulean mb-4" size={32} />
              <h2 className="text-white/40 text-xs uppercase tracking-[0.2em]">Private Vault</h2>
              <p className="text-white/20 text-[10px] lowercase italic">The four numbers you use to unlock your screen</p>
            </div>

            {/* PIN Dots */}
            <div className="flex gap-4">
              {[0, 1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  animate={{ 
                    scale: pin.length > i ? 1.2 : 1,
                    backgroundColor: pin.length > i ? '#219EED' : 'rgba(255,255,255,0.05)'
                  }}
                  className="w-4 h-4 rounded-full border border-white/10"
                />
              ))}
            </div>

            {/* PIN Pad */}
            <div className="grid grid-cols-3 gap-6 w-full px-4">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'X'].map((key, i) => (
                <button
                  key={i}
                  disabled={!key}
                  onClick={() => {
                    if (key === 'X') clearPin();
                    else if (key) handleKeyPress(key);
                  }}
                  className={`flex items-center justify-center font-sans text-xl text-white/80 h-16 rounded-2xl transition-all
                    ${key ? 'active:bg-white/5 active:scale-95' : 'invisible'}
                    ${key === 'X' ? 'text-white/20 text-sm' : ''}
                  `}
                >
                  {key}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
