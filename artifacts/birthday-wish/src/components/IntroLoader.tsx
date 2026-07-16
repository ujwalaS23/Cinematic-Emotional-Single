import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function IntroLoader({ onEnter }: { onEnter: () => void }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    // Step 0 -> 1: initial stars
    const t1 = setTimeout(() => setStep(1), 1500);
    // Step 1 -> 2: First text hides
    const t2 = setTimeout(() => setStep(2), 3500);
    // Step 2 -> 3: Moon appears
    const t3 = setTimeout(() => setStep(3), 6000);
    // Step 3 -> 4: Button appears
    const t4 = setTimeout(() => setStep(4), 7500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, []);

  return (
    <motion.div 
      className="fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center pointer-events-auto"
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {/* Tiny stars background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 50 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: Math.random() * 0.5 + 0.2 }}
            transition={{ delay: Math.random() * 2, duration: 2 }}
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() * 2 + 'px',
              height: Math.random() * 2 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-[300px] text-center px-4">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.p
              key="text1"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 1.2 }}
              className="font-cursive text-gold text-2xl md:text-3xl"
            >
              Every love story leaves behind a little light.
            </motion.p>
          )}

          {step >= 2 && (
            <motion.div
              key="text2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2 }}
              className="flex flex-col items-center gap-2"
            >
              <p className="font-cursive text-gold text-2xl md:text-3xl">Tonight...</p>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 1.2 }}
                className="font-cursive text-gold text-2xl md:text-3xl"
              >
                ...this light is for you.
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>

        {step >= 3 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="mt-12 mb-8 relative flex items-center justify-center"
          >
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-[#E8E0D4] shadow-[0_0_40px_rgba(201,169,110,0.3),_inset_-10px_-10px_20px_rgba(0,0,0,0.1)] animate-pulse" style={{ animationDuration: '4s' }} />
          </motion.div>
        )}

        {step >= 4 && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            onClick={onEnter}
            className="mt-6 px-8 py-3 rounded-full border border-gold text-gold font-serif text-lg tracking-wide glass-card hover:bg-gold/10 hover:shadow-[0_0_20px_rgba(201,169,110,0.3)] hover:scale-105 transition-all duration-500 cursor-pointer"
          >
            Enter
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
