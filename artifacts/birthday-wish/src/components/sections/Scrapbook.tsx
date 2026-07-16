import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const pages = [
  {
    title: "The day I realized how rare you were.",
    caption: "Some people arrive quietly and change everything.",
    date: "A Beginning",
  },
  {
    title: "Every ordinary Tuesday.",
    caption: "The best days never announce themselves.",
    date: "The Middle",
  },
  {
    title: "The ones we didn't photograph.",
    caption: "The memory keeps those safe.",
    date: "The Quiet Moments",
  },
  {
    title: "After the silence.",
    caption: "Some chapters stay open even when the book is closed.",
    date: "Today",
  }
];

// Simple SVG doodles
const HeartDoodle = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="opacity-30">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
  </svg>
);

const StarDoodle = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="opacity-30">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
  </svg>
);

export function Scrapbook() {
  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState(1);

  const paginate = (newDirection: number) => {
    const next = currentPage + newDirection;
    if (next >= 0 && next < pages.length) {
      setDirection(newDirection);
      setCurrentPage(next);
    }
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 0.95
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 0.95
    })
  };

  return (
    <section className="relative min-h-[100dvh] py-32 px-6 flex flex-col items-center justify-center z-10 overflow-hidden">
      <div className="text-center mb-16">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-serif italic text-gold text-[clamp(2rem,5vw,3.5rem)]"
        >
          If Hearts Had Photo Albums
        </motion.h2>
      </div>

      <div className="relative w-full max-w-4xl mx-auto aspect-[4/3] md:aspect-[16/9] mb-12 perspective-1000">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentPage}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.4 }
            }}
            className="absolute inset-0 rounded-xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-gold/10 p-6 md:p-12 flex flex-col items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, rgba(240,237,230,0.06), rgba(240,237,230,0.02))',
            }}
          >
            {/* Paper Texture Overlay */}
            <div 
              className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
                backgroundSize: '4px 4px'
              }}
            />

            <div className="absolute top-8 left-8 text-gold"><HeartDoodle /></div>
            <div className="absolute bottom-8 right-8 text-gold"><StarDoodle /></div>

            <div className="w-full max-w-2xl relative aspect-[16/9] bg-gradient-to-br from-navy to-midnight rounded-lg border border-gold/20 p-2 shadow-inner flex flex-col items-center justify-center mb-8">
               <span className="font-sans text-xs tracking-widest text-gold/30 uppercase absolute">
                  {/* REPLACE: <img src="your-image.jpg" alt="[Photo placeholder]" className="w-full h-full object-cover rounded" /> */}
                  [Photo Placeholder {currentPage + 1}]
               </span>
            </div>

            <div className="text-center space-y-4">
              <h3 className="font-serif italic text-foreground text-2xl md:text-3xl">
                "{pages[currentPage].title}"
              </h3>
              <p className="font-cursive text-gold text-xl md:text-2xl">
                {pages[currentPage].caption}
              </p>
              <p className="font-sans text-foreground/40 text-xs tracking-widest uppercase pt-2">
                — [ {pages[currentPage].date} ] —
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex flex-col items-center gap-6">
        <div className="flex gap-8">
          <button 
            onClick={() => paginate(-1)}
            disabled={currentPage === 0}
            className={`font-sans tracking-widest uppercase text-sm flex items-center gap-2 transition-all ${currentPage === 0 ? 'text-foreground/20 cursor-not-allowed' : 'text-gold hover:text-gold-pale hover:-translate-x-1 cursor-none'}`}
          >
            ← Previous
          </button>
          
          <button 
            onClick={() => paginate(1)}
            disabled={currentPage === pages.length - 1}
            className={`font-sans tracking-widest uppercase text-sm flex items-center gap-2 transition-all ${currentPage === pages.length - 1 ? 'text-foreground/20 cursor-not-allowed' : 'text-gold hover:text-gold-pale hover:translate-x-1 cursor-none'}`}
          >
            Next →
          </button>
        </div>

        <div className="flex gap-2">
          {pages.map((_, i) => (
            <div 
              key={i} 
              className={`w-2 h-2 rounded-full transition-all duration-300 ${i === currentPage ? 'bg-gold w-6' : 'bg-gold/20'}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
