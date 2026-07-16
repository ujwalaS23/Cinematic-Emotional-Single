import React, { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const timelineNodes = [
  { title: "The Beginning", desc: "Everything felt possible. The world was smaller, and that smallness felt like safety." },
  { title: "Our Laughter", desc: "There was a particular kind of laughter — unguarded, easy, the kind that forgets itself." },
  { title: "Long Conversations", desc: "Hours that felt like minutes. Words that felt like breathing." },
  { title: "Inside Jokes", desc: "The private language only two people can speak. I still remember every word." },
  { title: "Comfort", desc: "You became the place I didn't have to perform. Just exist." },
  { title: "Distance", desc: "Life pulled quietly at first. Then with more intention." },
  { title: "Silence", desc: "The hardest part wasn't the distance. It was learning to carry the quiet." },
  { title: "Acceptance", desc: "Letting go doesn't mean forgetting. It means making peace with what was." },
  { title: "Hope", desc: "Love that transforms into a quiet prayer. Wanting good things for someone, no matter what." },
  { title: "Birthday", desc: "And every year, on this day — I still think of you. With warmth, with gratitude, with love." }
];

export function Timeline() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  return (
    <section className="relative min-h-screen py-32 z-10 flex flex-col items-center">
      <div className="text-center mb-24 px-6">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-serif italic text-gold text-[clamp(2rem,5vw,3.5rem)]"
        >
          The Road We Walked
        </motion.h2>
      </div>

      <div 
        ref={containerRef}
        className="w-full flex-1 relative flex flex-col md:flex-row items-center md:items-stretch overflow-x-hidden md:overflow-x-auto snap-x snap-mandatory hide-scrollbar"
        style={{ scrollbarWidth: 'none' }}
      >
        {/* Horizontal Line for Desktop, Vertical for Mobile */}
        <div className="absolute left-8 md:left-0 top-0 md:top-1/2 bottom-0 md:bottom-auto w-[2px] md:w-full h-full md:h-[2px] bg-gradient-to-b md:bg-gradient-to-r from-gold/0 via-gold/30 to-gold/0 md:-translate-y-1/2" />

        <div className="flex flex-col md:flex-row gap-12 md:gap-0 px-12 md:px-24 py-12 md:py-32 relative">
          {timelineNodes.map((node, i) => {
            const isActive = activeIndex === i;
            const isTop = i % 2 === 0;

            return (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative snap-center shrink-0 flex md:block items-center md:w-[260px] cursor-pointer group"
                onClick={() => setActiveIndex(isActive ? null : i)}
              >
                {/* Node Circle */}
                <div className="absolute left-0 md:left-1/2 top-0 md:top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                  <motion.div 
                    className={`w-4 h-4 rounded-full border-2 border-gold transition-colors duration-500 flex items-center justify-center ${isActive ? 'bg-gold shadow-[0_0_15px_rgba(201,169,110,0.8)]' : 'bg-background group-hover:bg-gold/50'}`}
                  >
                    {isActive && <div className="w-1.5 h-1.5 bg-background rounded-full" />}
                  </motion.div>
                </div>

                {/* Connector Line */}
                <div className={`absolute left-0 md:left-1/2 w-[30px] md:w-[2px] h-[2px] md:h-[60px] bg-gold/30 -translate-y-1/2 md:-translate-x-1/2 transition-colors duration-300 ${isActive ? 'bg-gold/80' : ''} ${isTop ? 'md:bottom-1/2 md:translate-y-0' : 'md:top-1/2 md:translate-y-0'}`} />

                {/* Content Card */}
                <div className={`ml-8 md:ml-0 md:absolute md:w-[220px] left-1/2 md:-translate-x-1/2 transition-all duration-500 ${isTop ? 'md:bottom-[calc(50%+60px)]' : 'md:top-[calc(50%+60px)]'} ${isActive ? 'z-30' : 'z-10'}`}>
                  <div className={`glass-card p-5 transition-all duration-500 ${isActive ? 'scale-110 shadow-[0_0_30px_rgba(201,169,110,0.2)]' : 'hover:bg-white/5 opacity-80 hover:opacity-100'}`}>
                    <h3 className="font-serif italic text-gold text-lg mb-2 text-center md:text-left">{node.title}</h3>
                    <motion.div 
                      initial={false}
                      animate={{ height: isActive || window.innerWidth < 768 ? 'auto' : 0, opacity: isActive || window.innerWidth < 768 ? 1 : 0 }}
                      className="overflow-hidden"
                    >
                      <p className="font-sans text-sm text-foreground/80 leading-relaxed mt-2 text-center md:text-left">
                        {node.desc}
                      </p>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
