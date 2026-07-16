import React from 'react';
import { motion } from 'framer-motion';

const letterParas = [
  "On this day, I want you to know something simple:",
  "I genuinely wish you happiness.\nNot the surface kind that passes with the weather.\nBut the deep, settled kind — the kind that knows itself.",
  "May life protect you.\nMay your dreams take the shape they deserve.\nMay your family stay healthy, close, and warm.\nMay your smile remain easy to find.\nMay your heart always find its way back to peace.\nMay every year that follows be kinder than the last.",
  "Whether our paths meet again or not —\nI will always carry gratitude for the season we shared.\nYou changed something in me that stayed changed.",
  "And that is more than enough."
];

export function BirthdayWish() {
  return (
    <section className="relative min-h-[120dvh] py-40 px-6 flex flex-col items-center z-10 overflow-hidden">
      
      {/* Moon Element */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="relative mb-16 mt-10"
      >
        <motion.div 
          animate={{ scale: [1, 1.04, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="w-[120px] h-[120px] md:w-[200px] md:h-[200px] rounded-full bg-[#E8E0D4] mx-auto shadow-[0_0_40px_rgba(201,169,110,0.2),_0_0_100px_rgba(201,169,110,0.06),_0_0_200px_rgba(201,169,110,0.03)] relative"
        >
          {/* Craters/Texture via subtle inset shadow and gradient */}
          <div className="absolute inset-0 rounded-full mix-blend-multiply opacity-30 shadow-[inset_-20px_-20px_40px_rgba(0,0,0,0.1)]" />
        </motion.div>
      </motion.div>

      <motion.h2 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, delay: 0.5 }}
        className="font-serif italic text-gold text-[clamp(3rem,7vw,6rem)] text-center mb-16 drop-shadow-[0_0_20px_rgba(201,169,110,0.2)]"
      >
        Happy Birthday
      </motion.h2>

      <div className="max-w-[700px] w-full mx-auto space-y-8 text-center relative z-10">
        {letterParas.map((para, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 1.2, delay: i * 0.3 }}
            className="font-sans text-[1.1rem] leading-[2] text-foreground/90 whitespace-pre-line"
          >
            {para}
          </motion.p>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 2, delay: 2.5 }}
        className="mt-32 pt-16 px-4"
      >
        <p className="font-cursive text-gold text-[clamp(1.5rem,4vw,2.5rem)] text-center">
          "I will always be thankful our paths crossed once."
        </p>
      </motion.div>
      
    </section>
  );
}
