import React from 'react';
import { motion } from 'framer-motion';

const thoughts = [
  "I still smile when I remember us.",
  "Some memories still feel like yesterday.",
  "I still hope life is kind to you.",
  "I wonder if you remember the little things too.",
  "Some people become home.",
  "You became mine.",
  "Even silence couldn't teach my heart to forget you.",
  "The prayers never stopped.",
  "I don't need anything back.",
  "Knowing you existed already changed my life.",
  "Some birthdays are impossible to forget.",
  "I still look for you in songs.",
  "You made ordinary moments feel like gifts.",
  "I hope your dreams are finally finding you.",
  "I think of you when the light is beautiful.",
  "Some goodbyes were never really said.",
  "I carry you in quiet moments.",
  "You taught me that love doesn't need a reason to stay.",
  "I am grateful for every chapter we shared.",
  "I still celebrate this day. Every year. Just differently."
];

function Card({ text, index }: { text: string, index: number }) {
  // Generate random varying heights and margins for a masonry feel
  const minHeight = 120 + (index % 3) * 40;
  const marginTop = (index % 4) * 20;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, delay: (index % 5) * 0.1 }}
      className="glass-card p-6 flex flex-col items-center justify-center text-center relative group hover:shadow-[0_0_20px_rgba(201,169,110,0.15)] transition-shadow duration-500"
      style={{ minHeight, marginTop }}
    >
      <div className="w-10 h-[1px] bg-gold/50 mb-4 group-hover:w-16 transition-all duration-500" />
      <p className="font-serif italic text-foreground/90 text-lg leading-relaxed">
        "{text}"
      </p>
    </motion.div>
  );
}

export function ThingsNeverSaid() {
  return (
    <section className="relative min-h-[100dvh] py-32 px-6 z-10 flex flex-col items-center">
      <div className="text-center mb-24">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-serif italic text-gold text-[clamp(2rem,5vw,3.5rem)] mb-4"
        >
          Things I Never Said
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="font-cursive text-gold-pale text-2xl md:text-3xl"
        >
          Thoughts that lived quietly.
        </motion.p>
      </div>

      <div className="max-w-6xl w-full mx-auto columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
        {thoughts.map((thought, index) => (
          <div key={index} className="break-inside-avoid">
            <Card text={thought} index={index} />
          </div>
        ))}
      </div>
    </section>
  );
}
