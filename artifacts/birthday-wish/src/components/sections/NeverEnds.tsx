import React, { useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';

const letterLines = [
  "Time has a strange way of rewriting everything...",
  "except the things that mattered most.",
  "",
  "I remember the warmth of small, ordinary moments.",
  "The kind you don't notice until they're gone.",
  "",
  "Life moved forward. People changed. Days blurred into months.",
  "And yet — on this day, every single year —",
  "my heart remembers.",
  "",
  "Not because I'm holding on.",
  "But because love once made this day feel sacred.",
  "",
  "This message carries no expectations.",
  "Only a quiet, genuine wish for your happiness.",
  "",
  "And gratitude. Always gratitude.",
  "For the season of life we shared."
];

function AnimatedLine({ text, index }: { text: string, index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });

  if (!text) return <div className="h-6" />;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
      transition={{ duration: 1, delay: (index % 5) * 0.15, ease: "easeOut" }}
      className="font-cursive text-foreground text-xl md:text-2xl leading-[2.2] tracking-wide"
    >
      {text}
    </motion.div>
  );
}

export function NeverEnds() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

  return (
    <section id="never-ends-section" ref={sectionRef} className="relative min-h-[100dvh] py-32 px-6 flex flex-col items-center justify-center z-10 overflow-hidden">
      <motion.div style={{ y }} className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-[20%] left-[10%] w-[30vw] h-[30vw] bg-gold/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[20%] right-[10%] w-[40vw] h-[40vw] bg-rose/10 rounded-full blur-[120px]" />
      </motion.div>

      <div className="max-w-3xl w-full mx-auto relative z-10 text-center mb-16">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="font-serif italic text-gold text-[clamp(2rem,5vw,3.5rem)] mb-4"
        >
          Some Stories Never Really End
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 }}
          className="font-cursive text-gold-pale text-2xl md:text-3xl"
        >
          A letter that time couldn't erase
        </motion.p>
      </div>

      <div className="w-full max-w-2xl mx-auto glass-card p-8 md:p-14 relative group">
        {/* Subtle decorative corners */}
        <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-gold/30" />
        <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-gold/30" />
        <div className="absolute bottom-4 left-4 w-4 h-4 border-b border-l border-gold/30" />
        <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-gold/30" />

        <div className="space-y-1">
          {letterLines.map((line, index) => (
            <AnimatedLine key={index} text={line} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
