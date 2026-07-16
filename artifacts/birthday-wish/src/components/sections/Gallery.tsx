import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, X } from 'lucide-react';

const photos = [
  { id: 1, caption: "The day everything felt easy", date: "2021" },
  { id: 2, caption: "A moment I return to", date: "Summer" },
  { id: 3, caption: "Something about this day", date: "Autumn" },
  { id: 4, caption: "Where time stood still", date: "2022" },
  { id: 5, caption: "The best kind of nothing", date: "Winter" },
  { id: 6, caption: "When we didn't know", date: "Spring" },
  { id: 7, caption: "Just us, just then", date: "2023" },
  { id: 8, caption: "A moment saved in amber", date: "Forever" },
];

function PolaroidCard({ photo, onClick }: { photo: typeof photos[0], onClick: () => void }) {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const baseRotation = (photo.id % 2 === 0 ? 1 : -1) * (Math.random() * 3 + 1);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;
    setRotate({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
    setIsHovered(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, delay: (photo.id % 4) * 0.1 }}
      className="relative cursor-pointer z-10"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        perspective: "1000px"
      }}
      whileHover={{ zIndex: 30 }}
    >
      <motion.div
        animate={{
          rotateX: rotate.x,
          rotateY: rotate.y,
          rotateZ: isHovered ? 0 : baseRotation,
          scale: isHovered ? 1.05 : 1
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="bg-[#F0EDE8] p-3 pb-8 rounded shadow-[0_10px_30px_rgba(0,0,0,0.3)] hover:shadow-[0_0_25px_rgba(201,169,110,0.4)] transition-shadow duration-300"
      >
        <div className="aspect-[4/5] bg-gradient-to-b from-[#0A1628] to-[#0D1F3C] w-full relative flex items-center justify-center overflow-hidden">
          {/* REPLACE: <img src="your-photo.jpg" alt="[Photo placeholder]" className="w-full h-full object-cover" /> */}
          <Camera className="text-gold/30" size={32} />
          <span className="absolute bottom-4 font-sans text-xs text-gold/30 tracking-widest uppercase">[Placeholder]</span>
        </div>
        <div className="pt-4 flex flex-col items-center justify-center space-y-1">
          <p className="font-cursive text-[#0A1628] text-xl font-semibold text-center leading-tight">
            {photo.caption}
          </p>
          <p className="font-sans text-[#0A1628]/50 text-xs tracking-widest uppercase">
            — {photo.date} —
          </p>
        </div>

        {/* Sparkles on hover */}
        <AnimatePresence>
          {isHovered && (
            <>
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  className="absolute text-gold"
                  style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                  }}
                >
                  ✦
                </motion.div>
              ))}
            </>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

export function Gallery() {
  const [selectedPhoto, setSelectedPhoto] = useState<typeof photos[0] | null>(null);

  return (
    <section className="relative min-h-[100dvh] py-32 px-6 z-10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-serif italic text-gold text-[clamp(2rem,5vw,3.5rem)] mb-4"
          >
            Our Little Universe
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="font-cursive text-gold-pale text-2xl md:text-3xl"
          >
            Moments I'll carry forever.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 px-4 md:px-12">
          {photos.map((photo) => (
            <PolaroidCard key={photo.id} photo={photo} onClick={() => setSelectedPhoto(photo)} />
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
            onClick={() => setSelectedPhoto(null)}
          >
            <motion.button 
              className="absolute top-8 right-8 text-white/50 hover:text-white"
              whileHover={{ scale: 1.1, rotate: 90 }}
              onClick={() => setSelectedPhoto(null)}
            >
              <X size={32} />
            </motion.button>
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-[#F0EDE8] p-4 pb-12 rounded max-w-2xl w-full cursor-default"
              onClick={(e) => e.stopPropagation()}
            >
               <div className="aspect-[4/3] bg-gradient-to-b from-[#0A1628] to-[#0D1F3C] w-full relative flex items-center justify-center">
                  <Camera className="text-gold/20" size={64} />
               </div>
               <div className="pt-8 flex flex-col items-center justify-center space-y-2">
                  <p className="font-cursive text-[#0A1628] text-3xl md:text-4xl font-semibold text-center">
                    {selectedPhoto.caption}
                  </p>
                  <p className="font-sans text-[#0A1628]/50 text-sm tracking-widest uppercase">
                    — {selectedPhoto.date} —
                  </p>
               </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
