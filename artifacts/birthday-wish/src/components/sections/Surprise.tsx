import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const text1 = "If I could ask the universe for one gift today...";
const text2 = "...it wouldn't be for you to come back.";
const text3 = "It would simply be... for life to always be gentle with you.";

export function Surprise() {
  const [revealed, setRevealed] = useState(false);
  const [phase, setPhase] = useState(0);
  const [typed1, setTyped1] = useState("");
  const [typed2, setTyped2] = useState("");
  const [typed3, setTyped3] = useState("");

  const typeText = async (text: string, setter: React.Dispatch<React.SetStateAction<string>>, delay = 40) => {
    setter("");
    for (let i = 0; i <= text.length; i++) {
      setter(text.substring(0, i));
      await new Promise(r => setTimeout(r, delay));
    }
  };

  useEffect(() => {
    if (!revealed) return;
    
    let active = true;
    const runSequence = async () => {
      // 1. Wait for background to darken and candle to appear
      await new Promise(r => setTimeout(r, 1500));
      if (!active) return;
      
      // 2. Type first line
      await typeText(text1, setTyped1);
      
      // 3. Pause 2s, type second line
      await new Promise(r => setTimeout(r, 2000));
      if (!active) return;
      await typeText(text2, setTyped2);

      // 4. Pause 1s, type third line
      await new Promise(r => setTimeout(r, 1000));
      if (!active) return;
      await typeText(text3, setTyped3);

      // 5. Pause 2s, reveal finale text
      await new Promise(r => setTimeout(r, 2000));
      if (!active) return;
      setPhase(4);
    };

    runSequence();
    
    return () => { active = false; };
  }, [revealed]);

  const handleContinue = () => {
    setRevealed(false);
    setTimeout(() => {
      const finale = document.getElementById('finale-section');
      if (finale) {
        finale.scrollIntoView({ behavior: 'smooth' });
      }
    }, 500); // Wait a bit for the overlay to fade out
  };

  return (
    <section className="relative min-h-[60dvh] flex flex-col items-center justify-center py-20 px-6 z-10">
      {!revealed && (
        <motion.button
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          onClick={() => setRevealed(true)}
          className="font-serif italic text-gold text-2xl md:text-3xl hover:text-gold-pale hover:drop-shadow-[0_0_15px_rgba(201,169,110,0.5)] transition-all duration-300 group cursor-pointer relative"
        >
          One Last Thing...
          {/* Subtle star particle burst on hover */}
          <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
             <span className="absolute -top-4 -right-4 text-gold/60 text-sm animate-ping" style={{ animationDuration: '1s' }}>✦</span>
             <span className="absolute -bottom-2 -left-4 text-gold/60 text-xs animate-ping" style={{ animationDuration: '1.5s' }}>✦</span>
          </div>
        </motion.button>
      )}

      <AnimatePresence>
        {revealed && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center px-6 pointer-events-auto"
          >
            {/* Candle Glow Background */}
            <motion.div 
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full blur-[80px] pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(245,166,35,0.15) 0%, transparent 70%)' }}
              animate={{ opacity: [0.8, 1, 0.7, 0.9, 0.8] }}
              transition={{ duration: 0.4, repeat: Infinity, repeatType: "mirror" }}
            />

            {/* Candle SVG */}
            <div className="relative mb-12 flex justify-center z-10">
              <svg width="60" height="140" viewBox="0 0 60 140" className="drop-shadow-[0_0_15px_rgba(245,166,35,0.6)]">
                {/* Candle body */}
                <rect x="22" y="60" width="16" height="70" rx="2" fill="#E8D5A3" opacity="0.95" />
                <path d="M22 62 Q30 58 38 62 L38 130 L22 130 Z" fill="#D4C190" />
                {/* Wick */}
                <line x1="30" y1="52" x2="30" y2="60" stroke="#222" strokeWidth="1.5" />
                {/* Flame */}
                <motion.path 
                  d="M30,15 Q38,35 30,52 Q22,35 30,15 Z" 
                  fill="url(#flameGrad)"
                  animate={{ 
                    scale: [1, 1.05, 0.95, 1.02, 1],
                    rotate: [0, -1, 2, -1, 0]
                  }}
                  transition={{ repeat: Infinity, duration: 0.3 }}
                  style={{ transformOrigin: "30px 52px" }}
                />
                <defs>
                  <radialGradient id="flameGrad" cx="50%" cy="70%" r="50%">
                    <stop offset="0%" stopColor="#FFFFFF" />
                    <stop offset="20%" stopColor="#F5A623" />
                    <stop offset="60%" stopColor="#D9381E" />
                    <stop offset="100%" stopColor="rgba(217,56,30,0)" />
                  </radialGradient>
                </defs>
              </svg>
            </div>

            {/* Typing Text */}
            <div className="min-h-[120px] max-w-[600px] text-center flex flex-col items-center gap-3 z-10">
              <p className="font-sans text-foreground/90 text-[1.1rem] md:text-xl tracking-wide min-h-[30px]">
                {typed1}
              </p>
              <p className="font-sans text-foreground/90 text-[1.1rem] md:text-xl tracking-wide min-h-[30px]">
                {typed2}
              </p>
              <p className="font-sans text-foreground/90 text-[1.1rem] md:text-xl tracking-wide min-h-[30px]">
                {typed3}
              </p>
            </div>

            {/* Final Reveal */}
            <AnimatePresence>
              {phase === 4 && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.5 }}
                  className="mt-12 flex flex-col items-center gap-12 z-10"
                >
                  <h2 className="font-serif italic text-gold text-3xl md:text-5xl drop-shadow-[0_0_15px_rgba(201,169,110,0.4)]">
                    Happy Birthday.
                  </h2>
                  
                  <button 
                    onClick={handleContinue}
                    className="font-sans text-xs tracking-[0.2em] uppercase text-white/40 hover:text-white transition-colors flex flex-col items-center gap-2 cursor-pointer"
                  >
                    <span>Continue</span>
                    <span className="animate-bounce">↓</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
            
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
