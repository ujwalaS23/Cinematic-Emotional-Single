import React from 'react';
import { motion } from 'framer-motion';
import { FloatingParticles } from '../FloatingParticles';

const paragraphs = [
  "There are things the mind catalogues faithfully — dates, words, the shape of rooms.\nAnd then there are things it chooses to preserve differently.\nYour eyes belong to the second category.",
  "Not their color. Not the architecture of them.\nSomething harder to name — a quality of attention,\nas if the world became slightly more honest when you looked at it.",
  "They had a way of holding space for people.\nOf making you feel that what you carried mattered.\nThat you were, in that moment, enough.",
  "I think of them sometimes — not with longing, but with a kind of reverence.\nThe way one remembers a piece of music that once changed something inside them.",
  "They became, for a while, a kind of home.\nAnd home is a complicated thing to stop missing."
];

export function YourEyes() {
  return (
    <section className="relative min-h-[100dvh] py-32 px-6 flex flex-col items-center justify-center z-10 bg-[#030810]">
      <FloatingParticles count={20} opacity={0.2} />
      
      <div className="max-w-4xl w-full mx-auto flex flex-col items-center text-center relative z-10">
        <motion.h2
          initial={{ opacity: 0, filter: 'blur(10px)' }}
          whileInView={{ opacity: 1, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="font-serif italic text-[clamp(2rem,5vw,3.2rem)] text-foreground mb-16 text-center leading-tight drop-shadow-[0_0_15px_rgba(248,244,238,0.3)]"
        >
          "The Place Where I Always Got Lost"
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, delay: 0.5 }}
          className="relative w-full max-w-[500px] aspect-[4/3] rounded-2xl border border-gold/10 overflow-hidden mb-20 group"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-navy to-midnight" />
          
          {/* Subtle eye-like central glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-16 rounded-full bg-gold/10 blur-xl opacity-50 group-hover:opacity-80 transition-opacity duration-1000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-gold/20 blur-md opacity-50 group-hover:scale-110 transition-transform duration-1000" />
          
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-sans text-xs tracking-widest text-gold/30 uppercase">
              {/* REPLACE: <img src="your-image.jpg" alt="[Photo placeholder]" className="w-full h-full object-cover opacity-60 mix-blend-luminosity" /> */}
              [Photo Placeholder — your image here]
            </span>
          </div>
        </motion.div>

        <div className="space-y-12 max-w-[680px]">
          {paragraphs.map((text, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 1.2, delay: i * 0.2 }}
              className="font-sans text-[1.1rem] leading-[2] text-foreground/85 whitespace-pre-line"
            >
              {text}
            </motion.p>
          ))}
        </div>
      </div>
    </section>
  );
}
