import { motion } from 'motion/react';
import { Heart } from 'lucide-react';
import FloatingHearts from './FloatingHearts';

interface LetterProps {
  onNext: () => void;
}

const memories = [
  { id: 1, title: "Where it began", desc: "A simple moment that changed everything.", aspect: "aspect-video" },
  { id: 2, title: "Perfect Days", desc: "The quiet ones are always my favorite.", aspect: "aspect-square" },
  { id: 3, title: "Laughter", desc: "The best sound in the world.", aspect: "aspect-video" },
  { id: 4, title: "Together", desc: "Every step feels lighter with you.", aspect: "aspect-square" },
];

export default function Letter({ onNext }: LetterProps) {
  return (
    <div className="relative min-h-screen bg-icy overflow-x-hidden">
      <FloatingHearts />
      
      <div className="relative max-w-xl mx-auto px-8 py-24 z-10">
        {/* Prologue Block */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="paper-texture bg-white p-12 rounded-[2rem] shadow-xl mb-32 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-24 h-24 bg-cerulean/5 rounded-br-full -translate-x-6 -translate-y-6" />
          <Heart className="absolute top-8 right-8 text-cerulean/20" size={32} />
          
          <h1 className="font-serif text-5xl leading-tight mb-10 text-navy">
            Twenty.
          </h1>
          <div className="space-y-6">
            <p className="font-serif text-2xl leading-relaxed text-navy/90 italic">
              "Before the day gets loud, before the calls and the messages flood in, I wanted to build a quiet space just for you."
            </p>
            <p className="font-sans text-navy/60 leading-relaxed font-light">
              No rushing, no replies needed. Just breathe, take your time, and scroll whenever you're ready.
            </p>
          </div>
          
          <div className="mt-12 flex items-center gap-4 text-cerulean">
            <div className="h-[1px] flex-1 bg-cerulean/20" />
            <Heart size={16} fill="currentColor" />
            <div className="h-[1px] flex-1 bg-cerulean/20" />
          </div>
        </motion.div>

        {/* Memory Scroll Area */}
        <div className="space-y-48">
          {memories.map((memo, index) => (
            <motion.div
              key={memo.id}
              initial={{ opacity: 0, y: 80 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col gap-10"
            >
              <div className={`w-full ${memo.aspect} bg-white rounded-[2.5rem] neumorphic overflow-hidden relative group`}>
                <div className="absolute inset-0 bg-gradient-to-tr from-cerulean/20 via-transparent to-white/5 opacity-50 transition-opacity group-hover:opacity-100" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex flex-col items-center gap-4">
                    <Heart className="text-cerulean/10" size={64} strokeWidth={1} />
                    <span className="text-navy/20 font-serif text-sm tracking-widest uppercase italic">Chapter {memo.id}</span>
                  </div>
                </div>
              </div>
              <div className="px-4 text-center">
                <h3 className="font-serif text-2xl text-navy italic">{memo.title}</h3>
                <div className="w-8 h-[1px] bg-cerulean/30 mx-auto my-4" />
                <p className="font-sans text-navy/50 text-sm leading-relaxed max-w-xs mx-auto">{memo.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Transition Anchor */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-64 mb-32 flex flex-col items-center gap-12"
        >
          <div className="flex flex-col items-center gap-4 text-navy/30">
            <p className="text-[10px] uppercase tracking-[0.4em] font-medium">The end of the scroll</p>
            <div className="w-[1px] h-24 bg-gradient-to-b from-navy/30 to-transparent" />
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onNext}
            className="group relative px-10 py-5 overflow-hidden rounded-full font-medium"
          >
            <div className="absolute inset-0 bg-navy transition-transform duration-300 group-hover:scale-110" />
            <span className="relative text-white tracking-widest uppercase text-xs">Continue the journey</span>
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
