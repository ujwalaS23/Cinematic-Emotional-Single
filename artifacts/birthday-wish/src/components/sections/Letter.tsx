import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

export function Letter() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const paragraphs = [
    "My dearest,",
    "Time has a way of rewriting everything — except this.",
    "I never stopped. Not when the calls grew quiet, not when the miles widened, not when silence became the only language left between us. I still carried you — in small, private ways that nobody sees. In the pause before I fall asleep. In the moment a song plays that you would have loved.",
    "Every birthday reminds me that you exist in this world. And somehow, that is enough.",
    "I don't write this to ask for anything. I don't expect you to hold anything I say here. I only write because some feelings deserve to be spoken aloud — at least once — even if nobody hears them.",
    "I still pray for your happiness. Every day, without fail. Not out of hope for something in return, but because caring for someone never needed a reason to stop.",
    "This website is a small, quiet piece of my heart.\nI hope it finds you well.",
    "With all the love I never said enough,\n— Someone who means every word."
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.4
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] } }
  };

  return (
    <section id="letter-section" className="relative min-h-[100dvh] py-32 px-6 flex flex-col items-center justify-center z-10">
      <motion.h2 
        ref={ref}
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="font-serif italic text-gold text-4xl md:text-5xl mb-12 text-center"
      >
        If Love Could Speak...
      </motion.h2>

      <motion.div 
        variants={container}
        initial="hidden"
        animate={isInView ? "show" : "hidden"}
        className="glass-card max-w-[760px] w-full p-8 md:p-14"
      >
        <div className="font-cursive text-foreground/90 text-2xl md:text-3xl leading-[2.2] md:leading-[2.2] space-y-6 whitespace-pre-wrap">
          {paragraphs.map((text, i) => (
            <motion.p key={i} variants={item}>
              {text}
            </motion.p>
          ))}
        </div>
      </motion.div>
    </section>
  );
}