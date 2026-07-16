import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const memories = [
  "I still remember this day.", "You smiled here.", "I laughed the hardest here.", 
  "I didn't know those moments would become memories.", "This one stays with me.", 
  "The world felt kind here.", "I was happiest in moments like this.", 
  "I wish I could return to this.", "You were radiant here.", "Time felt generous here.", 
  "I never wanted this one to end.", "We didn't know it then, but this was golden.", 
  "This is the one I revisit most.", "Something shifted inside me here.", "The air felt different this day."
];

// Generate stable random positions
const stars = Array.from({ length: 30 }).map((_, i) => ({
  id: i,
  x: Math.random() * 80 + 10, // 10% to 90%
  y: Math.random() * 80 + 10,
  memory: memories[i % memories.length],
  delay: Math.random() * 2
}));

export function InteractiveStars() {
  const [activeStar, setActiveStar] = useState<number | null>(null);

  return (
    <section className="relative min-h-[80vh] py-24 px-6 z-10 flex flex-col items-center">
      <motion.h2 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="font-serif italic text-gold text-4xl text-center mb-4 z-20"
      >
        Written in Stars
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.5 }}
        className="font-sans italic text-gold/60 text-sm text-center mb-12 z-20"
      >
        ✦ Click the stars to reveal memories
      </motion.p>

      <div className="relative w-full max-w-5xl h-[60vh] mx-auto bg-navy/20 rounded-3xl border border-gold/10 overflow-hidden glass-card">
        {stars.map((star) => (
          <div 
            key={star.id}
            className="absolute"
            style={{ left: `${star.x}%`, top: `${star.y}%` }}
          >
            <motion.button
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ repeat: Infinity, duration: 2 + star.delay, delay: star.delay }}
              className="relative group p-4 -m-4 outline-none cursor-pointer"
              onClick={() => setActiveStar(activeStar === star.id ? null : star.id)}
              onMouseEnter={() => setActiveStar(star.id)}
              onMouseLeave={() => setActiveStar(null)}
            >
              <svg width="8" height="8" viewBox="0 0 24 24" fill="#E8D5A3" className="transition-transform group-hover:scale-150">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </motion.button>

            <AnimatePresence>
              {activeStar === star.id && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: 10, x: '-50%' }}
                  animate={{ opacity: 1, scale: 1, y: -40, x: '-50%' }}
                  exit={{ opacity: 0, scale: 0.8, y: 10, x: '-50%' }}
                  className="absolute left-1/2 bottom-full mb-2 w-[200px] pointer-events-none z-50"
                >
                  <div className="glass-card px-4 py-3 text-center">
                    <p className="font-cursive text-gold text-lg leading-tight">{star.memory}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  );
}