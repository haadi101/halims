import { motion, AnimatePresence } from 'motion/react';
import { Mail, Heart } from 'lucide-react';
import FloatingHearts from './FloatingHearts';
import { useState } from 'react';

interface EnvelopeProps {
  onOpen: () => void;
}

export default function Envelope({ onOpen }: EnvelopeProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
    setTimeout(onOpen, 1500);
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-icy p-6 overflow-hidden">
      <FloatingHearts />
      
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-sm perspective-1000"
      >
        <div className="relative group cursor-pointer" onClick={!isOpen ? handleOpen : undefined}>
          {/* Envelope Back & Sides */}
          <div className="relative bg-cobalt aspect-[4/3] rounded-xl shadow-[0_20px_50px_rgba(10,17,40,0.3)] overflow-hidden">
            {/* The Letter inside (poking out) */}
            <motion.div 
              animate={isOpen ? { y: -100, opacity: 1 } : { y: 0, opacity: 0 }}
              transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
              className="absolute inset-x-4 top-4 h-full bg-white rounded-lg shadow-sm paper-texture p-6 z-0"
            >
              <div className="w-1/2 h-2 bg-navy/5 mb-2" />
              <div className="w-3/4 h-2 bg-navy/5" />
            </motion.div>

            {/* Front Diagonal Folds */}
            <div 
              className="absolute inset-0 bg-cobalt/95 z-10"
              style={{ clipPath: 'polygon(0 0, 0 100%, 50% 50%, 100% 100%, 100% 0)' }}
            />
            
            {/* Bottom Flap */}
            <div 
              className="absolute bottom-0 left-0 w-full h-1/2 bg-cobalt/90 z-10"
              style={{ clipPath: 'polygon(0 100%, 50% 0, 100% 100%)' }}
            />

            {/* Top Flap (Animated) */}
            <motion.div 
              initial={false}
              animate={isOpen ? { rotateX: 180, zIndex: 0 } : { rotateX: 0, zIndex: 20 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="absolute top-0 left-0 w-full h-1/2 bg-cobalt origin-top"
              style={{ 
                clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                backfaceVisibility: 'hidden'
              }}
            />
            
            {/* Wax Seal */}
            <AnimatePresence>
              {!isOpen && (
                <motion.div
                  exit={{ scale: 1.5, opacity: 0 }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none"
                >
                  <motion.div
                    animate={{ scale: [1, 1.05, 1], boxShadow: ['0 0 20px rgba(33,158,237,0.4)', '0 0 40px rgba(33,158,237,0.7)', '0 0 20px rgba(33,158,237,0.4)'] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-16 h-16 bg-cerulean rounded-full flex items-center justify-center border-4 border-cerulean/30 shadow-lg"
                  >
                    <Heart className="text-white fill-white" size={24} />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <motion.div
          animate={isOpen ? { opacity: 0 } : { opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-center mt-12 space-y-4"
        >
          <p className="text-cerulean font-medium tracking-[0.2em] uppercase text-[10px]">
            A private delivery for Halimah
          </p>
          <p className="text-navy/30 text-xs italic">
            Tap the seal to begin
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
