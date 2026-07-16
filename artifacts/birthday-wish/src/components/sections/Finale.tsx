import React from 'react';
import { motion, useInView } from 'framer-motion';

function Bird({ delay, duration, top }: { delay: number, duration: number, top: string }) {
  return (
    <motion.svg 
      width="40" height="20" viewBox="0 0 40 20" 
      className="absolute opacity-30 pointer-events-none z-0"
      style={{ top }}
      initial={{ x: '-100px', y: 0 }}
      animate={{ 
        x: '120vw', 
        y: [0, -20, 10, -10, 0] 
      }}
      transition={{ 
        x: { duration, ease: "linear", repeat: Infinity, delay },
        y: { duration: duration / 2, ease: "easeInOut", repeat: Infinity, repeatType: "mirror" }
      }}
    >
      <path d="M5,15 Q10,5 20,10 Q30,5 35,15" fill="none" stroke="#C9A96E" strokeWidth="1.5" strokeLinecap="round" />
    </motion.svg>
  );
}

export function Finale() {
  return (
    <section 
      id="finale-section" 
      className="relative min-h-[100dvh] flex flex-col justify-end pt-40 z-10 overflow-hidden"
      style={{
        background: 'linear-gradient(to bottom, transparent 0%, #0D1F3C 30%, #1A0A05 70%, #3D1C0A 100%)'
      }}
    >
      {/* Horizon Glow */}
      <motion.div 
        animate={{ opacity: [0.1, 0.25, 0.1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] rounded-full blur-[100px] pointer-events-none"
        style={{ 
          background: 'radial-gradient(circle, #C9A96E 0%, transparent 70%)', 
          transform: 'translate(-50%, 50%)' 
        }}
      />

      {/* Birds */}
      <Bird delay={0} duration={25} top="40%" />
      <Bird delay={5} duration={28} top="45%" />
      <Bird delay={12} duration={22} top="35%" />
      <Bird delay={18} duration={30} top="50%" />

      <div className="flex flex-col items-center text-center max-w-4xl mx-auto px-6 z-10 mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 1.5 }}
          className="mb-16 space-y-4"
        >
          <p className="font-serif italic text-[clamp(1.8rem,4vw,3rem)] text-foreground/90">
            Some people leave.
          </p>
          <div className="w-12 h-[1px] bg-gold/50 mx-auto" />
          <p className="font-serif italic text-[clamp(1.8rem,4vw,3rem)] text-foreground/90">
            Some memories stay.
          </p>
          <div className="w-12 h-[1px] bg-gold/50 mx-auto" />
          <p className="font-serif italic text-[clamp(1.8rem,4vw,3rem)] text-foreground/90">
            Some love simply becomes a quiet prayer.
          </p>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, delay: 0.8 }}
          className="font-cursive text-gold-pale text-2xl md:text-4xl mb-12"
        >
          Thank you for existing.
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 2, delay: 1.5 }}
          className="font-serif italic text-gold text-[clamp(2.5rem,6vw,4.5rem)] drop-shadow-[0_0_25px_rgba(201,169,110,0.5)]"
        >
          Happy Birthday ❤️
        </motion.h2>
      </div>

      <footer className="w-full mt-auto py-8 border-t border-gold/15 flex flex-col items-center gap-4 relative z-10 bg-black/20 backdrop-blur-sm">
        <motion.div 
          animate={{ scale: [1, 1.15, 1] }} 
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="#C9A96E" className="drop-shadow-[0_0_8px_rgba(201,169,110,0.5)]">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        </motion.div>
        <p className="font-cursive text-gold text-[1.2rem] opacity-80">
          Made with endless love.
        </p>
      </footer>
    </section>
  );
}
