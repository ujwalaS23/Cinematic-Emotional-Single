import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

export function ThingsINeverTold() {
  const texts = [
    "I still look for you in crowded rooms.",
    "I still remember the exact way you smiled.",
    "I still miss your voice — the way it softened when you laughed.",
    "I still celebrate your birthday in my heart, every single year.",
    "I still hope you are happy. Deeply, genuinely happy.",
    "I still love your eyes. They always said more than words.",
    "I still think of things I wish I had said.",
    "I still catch myself wondering how you are.",
    "I still believe every moment we shared mattered.",
    "I still carry the memory of you like something precious.",
    "I still think kindness looks like you.",
    "I still hope the world is being gentle with you."
  ];

  return (
    <section className="relative min-h-screen py-32 px-6 z-10">
      <div className="max-w-7xl mx-auto">
        <motion.h2 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="font-serif italic text-gold text-4xl md:text-5xl text-center mb-24"
        >
          The Things I'll Never Tell You
        </motion.h2>

        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {texts.map((text, i) => (
            <Card key={i} text={text} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Card({ text, index }: { text: string, index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.8, delay: (index % 3) * 0.15, ease: [0.22, 1, 0.36, 1] }}
      className="break-inside-avoid"
    >
      <div className="glass-card p-8 group transition-colors duration-300 hover:border-gold/40">
        <div className="w-10 h-[1px] bg-gold/50 mx-auto mb-6 transition-all duration-300 group-hover:w-16 group-hover:bg-gold" />
        <p className="font-serif italic text-gold/90 text-center text-lg md:text-xl leading-relaxed">
          "{text}"
        </p>
      </div>
    </motion.div>
  );
}