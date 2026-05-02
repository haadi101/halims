import { motion, AnimatePresence } from 'motion/react';
import { useMicrophoneBlow } from '../hooks/useMicrophoneBlow';
import { Wind, Mic, PartyPopper, Sparkles, Heart } from 'lucide-react';
import { useState, useEffect } from 'react';
import FloatingHearts from './FloatingHearts';

interface CakeProps {
  onComplete: () => void;
}

export default function Cake({ onComplete }: CakeProps) {
  const [blownOut, setBlownOut] = useState(false);
  const [isPromptVisible, setIsPromptVisible] = useState(false);
  const [smokeActive, setSmokeActive] = useState(false);
  
  const handleBlowOut = () => {
    if (blownOut) return;
    setBlownOut(true);
    setSmokeActive(true);
    setTimeout(() => {
      onComplete();
    }, 4000); 
  };

  const { startListening, isListening } = useMicrophoneBlow(handleBlowOut);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-8 bg-icy transition-colors duration-1000 overflow-hidden">
      <FloatingHearts />
      
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative mb-24 z-10"
      >
        {/* Tiered 3D Cake Design */}
        <div className="relative perspective-1000">
          {/* Top Tier */}
          <motion.div 
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="w-32 h-20 bg-white rounded-t-3xl neumorphic relative z-20 mx-auto"
          >
             {/* Candles with realistic flames */}
             <div className="absolute -top-12 inset-x-0 flex justify-around px-8">
               <Candle active={!blownOut} delay={0} label="2" />
               <Candle active={!blownOut} delay={0.2} label="0" />
             </div>
             
             {/* Cream drips */}
             <div className="absolute top-1/2 left-0 w-full flex justify-around">
               {[...Array(4)].map((_, i) => (
                 <div key={i} className="w-8 h-12 bg-white rounded-b-full shadow-inner" />
               ))}
             </div>
          </motion.div>

          {/* Bottom Tier */}
          <div className="w-56 h-24 bg-white rounded-t-[3rem] neumorphic -mt-4 relative z-10 mx-auto">
             <div className="absolute top-1/2 left-0 w-full flex justify-around px-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="w-10 h-16 bg-white/80 rounded-b-full" />
                ))}
             </div>
             {/* Sprinkles/Hearts on cake */}
             <div className="absolute inset-0 p-4">
                <HeartSprinkle top="20%" left="10%" />
                <HeartSprinkle top="40%" left="80%" />
                <HeartSprinkle top="15%" left="50%" />
                <HeartSprinkle top="60%" left="30%" />
             </div>
          </div>

          {/* Plate */}
          <div className="w-72 h-4 bg-navy/5 rounded-full blur-[1px] -mt-1 mx-auto shadow-2xl" />
        </div>

        {/* Smoke Particles */}
        {smokeActive && (
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 pointer-events-none">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 0, x: 0, scale: 0.5 }}
                animate={{ opacity: [0, 0.5, 0], y: -100, x: (i - 4) * 20, scale: 2 }}
                transition={{ duration: 2, delay: i * 0.1 }}
                className="absolute top-0 left-1/2 w-8 h-8 bg-black/5 rounded-full blur-xl"
              />
            ))}
          </div>
        )}
      </motion.div>

      <div className="text-center max-w-xs space-y-8 z-20">
        <AnimatePresence mode="wait">
          {!blownOut ? (
            <motion.div
              key="prompt"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-6"
            >
              <div className="space-y-2">
                <h2 className="text-navy font-serif text-2xl italic">Make a wish, Halimah.</h2>
                <p className="text-navy/40 text-sm">The universe is listening to you.</p>
              </div>

              {!isListening ? (
                <div className="flex flex-col gap-3 w-full">
                  <button
                    id="mic-start"
                    onClick={() => {
                      setIsPromptVisible(true);
                      startListening();
                    }}
                    className="flex items-center justify-center gap-3 bg-cerulean text-white px-8 py-4 rounded-full neumorphic hover:bg-cerulean/90 transition-all font-medium group"
                  >
                    <Mic size={20} className="group-hover:scale-110 transition-transform" />
                    <span>Start Listening</span>
                  </button>
                  
                  <button
                    id="manual-blow"
                    onClick={handleBlowOut}
                    className="text-cerulean/60 text-[10px] uppercase tracking-widest font-semibold hover:text-cerulean transition-colors flex items-center justify-center gap-2"
                  >
                    <Wind size={12} />
                    <span>Or blow manually</span>
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-6">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="w-20 h-20 bg-cerulean/10 border-2 border-cerulean/30 rounded-full flex items-center justify-center text-cerulean"
                  >
                    <Wind size={40} strokeWidth={1.5} />
                  </motion.div>
                  <div className="flex flex-col items-center">
                   <p className="text-navy/60 font-medium animate-pulse">Speak to the wind...</p>
                   <p className="text-[10px] text-navy/30 mt-2">Blow firmly into the microphone</p>
                  </div>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="celebration"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              <div className="flex justify-center gap-2 text-cerulean">
                <Sparkles />
                <Heart size={24} fill="currentColor" />
                <Sparkles />
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-serif text-navy">Wish accepted.</h2>
                <p className="text-navy/50 italic leading-relaxed">
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

function Candle({ active, delay, label }: { active: boolean; delay: number; label: string }) {
  return (
    <div className="relative flex flex-col items-center">
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: [1, 1.1, 0.95, 1],
              opacity: [0.8, 1, 0.8],
            }}
            transition={{ 
              duration: 0.5, 
              repeat: Infinity, 
              delay 
            }}
            className="absolute -top-6 w-5 h-8 bg-gradient-to-t from-orange-500 via-yellow-400 to-white/80 rounded-full blur-[2px] shadow-[0_0_15px_rgba(251,191,36,0.8)]"
          />
        )}
      </AnimatePresence>
      <div className="w-3 h-14 bg-gradient-to-b from-cerulean/30 to-cerulean/10 rounded-full border border-white/20 shadow-inner relative">
         <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-navy/40 font-serif font-black text-lg">{label}</span>
      </div>
    </div>
  );
}

function HeartSprinkle({ top, left }: { top: string; left: string }) {
  return (
    <motion.div
      animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
      transition={{ duration: 4, repeat: Infinity, delay: Math.random() * 2 }}
      className="absolute text-cerulean/40"
      style={{ top, left }}
    >
      <Heart size={12} fill="currentColor" />
    </motion.div>
  );
}
