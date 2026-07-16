import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const lines = [
  "There is a particular kind of peace that comes after.",
  "Not the peace of having answers.\nBut the peace of releasing the need for them.",
  "I learned to live with unanswered questions.\nTo accept that some things end without explanation.\nAnd that this does not diminish what they were.",
  "I still wish you happiness.\nNot because I expect anything.\nNot out of guilt or obligation.\nSimply because — love that was real doesn't disappear.\nIt transforms.",
  "It becomes a quiet wish.\nA small, faithful prayer sent into the world,\nasking only that life is kind to you.",
  "No guilt. No blame. No distance between us in this.\nJust honesty.\nJust love in the only form it can now take."
];

export function TheSilence() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-20% 0px" });

  return (
    <section className="relative min-h-[120dvh] flex flex-col items-center justify-center py-40 px-6 z-10 bg-[#030810]">
      {/* Intentionally dark, no particles here */}
      
      <div ref={ref} className="max-w-[620px] w-full mx-auto space-y-16 text-center">
        {lines.map((text, index) => {
          const isFirstOrLast = index === 0 || index === lines.length - 1;
          return (
            <motion.p
              key={index}
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 2.5, delay: index * 0.8 + 0.5, ease: "easeInOut" }}
              className={`whitespace-pre-line leading-relaxed ${
                isFirstOrLast 
                  ? "font-serif italic text-gold text-2xl md:text-3xl" 
                  : "font-sans text-foreground/80 text-lg md:text-xl font-light"
              }`}
            >
              {text}
            </motion.p>
          );
        })}
      </div>

      {/* Subtle section transition line */}
      <motion.div 
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 1.5, delay: 1 }}
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/3 h-[1px] bg-gradient-to-r from-gold/0 via-gold/30 to-gold/0"
      >
        <motion.div
          animate={{ left: ['0%', '100%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 -translate-y-1/2 w-1 h-1 bg-gold rounded-full shadow-[0_0_10px_rgba(201,169,110,1)]"
          style={{ transform: 'translate(-50%, -50%)' }}
        />
      </motion.div>
    </section>
  );
}
