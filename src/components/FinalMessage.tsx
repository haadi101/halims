import { motion } from 'motion/react';
import { Anchor, Sparkles } from 'lucide-react';
import FloatingHearts from './FloatingHearts';

export default function FinalMessage() {
  return (
    <div className="min-h-screen bg-icy flex items-center justify-center p-10 overflow-hidden relative">
      <FloatingHearts />
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.05 }}
        className="absolute top-10 right-10 z-0"
      >
        <Sparkles size={120} />
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="max-w-md text-center flex flex-col items-center gap-12 z-10"
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="text-cerulean/30"
        >
          <Anchor size={48} strokeWidth={1} />
        </motion.div>

        <p className="font-serif text-2xl leading-relaxed text-navy italic">
          "I built this space because I wanted you to have a place that demands absolutely nothing from you. The world asks for a lot of your energy, but here, you only have to exist." 
        </p>

        <div className="w-12 h-[1px] bg-cerulean/20" />

        <p className="font-sans text-navy/60 leading-relaxed text-sm tracking-wide px-4">
          I am your rock, your quiet supporter, and your anchor whenever you need one. There is no rush, no pressure, and no timeline. I am standing right here, patient and unwavering, cheering for every step you take.
        </p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="mt-12 text-[10px] uppercase tracking-[0.4em] text-navy/20 font-medium"
        >
          Your Sanctuary • 2026
        </motion.div>
      </motion.div>
    </div>
  );
}
