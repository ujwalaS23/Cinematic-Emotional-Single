import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export function Hero() {
  const [typedText, setTypedText] = useState("");
  const fullText1 = "I would have forgotten you long ago.";
  const fullText2 = "But some hearts never learn how to stop caring.";
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    
    if (phase === 0) {
      timeout = setTimeout(() => setPhase(1), 1500);
    } else if (phase === 1) {
      if (typedText.length < fullText1.length) {
        timeout = setTimeout(() => {
          setTypedText(fullText1.substring(0, typedText.length + 1));
        }, 50);
      } else {
        timeout = setTimeout(() => {
          setTypedText("");
          setPhase(2);
        }, 2000);
      }
    } else if (phase === 2) {
      if (typedText.length < fullText2.length) {
        timeout = setTimeout(() => {
          setTypedText(fullText2.substring(0, typedText.length + 1));
        }, 50);
      }
    }
    
    return () => clearTimeout(timeout);
  }, [phase, typedText, fullText1, fullText2]);

  const scrollToNext = () => {
    const nextSection = document.getElementById('never-ends-section');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-[100dvh] flex flex-col items-center justify-center px-6 pt-20 pb-10">
      {/* Lens Flare */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gold/5 rounded-full blur-[100px] mix-blend-screen pointer-events-none opacity-50 translate-x-1/3 -translate-y-1/3" />
      
      <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto space-y-8">
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="font-cursive text-gold text-xl md:text-2xl"
        >
          A love that never stopped, even after silence.
        </motion.p>
        
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
          className="font-serif text-foreground text-[clamp(3.5rem,9vw,8rem)] leading-tight drop-shadow-[0_0_20px_rgba(201,169,110,0.4)]"
        >
          Happy Birthday <span className="text-rose inline-block animate-pulse">❤️</span>
        </motion.h1>
        
        <div className="space-y-4 min-h-[100px] flex flex-col items-center">
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.8 }}
            className="font-sans font-light text-gold text-lg md:text-xl opacity-90"
          >
            If distance could erase love,
          </motion.p>
          
          <div className="font-sans font-light text-foreground/80 text-lg md:text-xl h-8 flex items-center">
            {phase > 0 && (
              <span>
                {typedText}
                <motion.span 
                  animate={{ opacity: [1, 0] }} 
                  transition={{ repeat: Infinity, duration: 0.8 }}
                  className="inline-block w-0.5 h-5 bg-gold ml-1 align-middle"
                />
              </span>
            )}
          </div>
        </div>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 2.5 }}
          onClick={scrollToNext}
          className="mt-8 px-8 py-3 rounded-full border border-gold text-gold font-serif text-lg tracking-wide glass-card hover:bg-gold/10 hover:shadow-[0_0_20px_rgba(201,169,110,0.3)] hover:scale-105 transition-all duration-500 cursor-pointer group"
        >
          Read My Heart
        </motion.button>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 3 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 pointer-events-none"
      >
        <span className="font-sans font-light uppercase text-gold/60 text-[0.7rem] tracking-[0.15em]">Scroll</span>
        <div className="w-[1px] h-16 bg-gradient-to-b from-gold/0 via-gold/50 to-gold/0 relative overflow-hidden">
          <motion.div 
            className="absolute top-0 left-0 w-full h-1/3 bg-gold"
            animate={{ top: ['-30%', '130%'] }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          />
        </div>
      </motion.div>
    </section>
  );
}
