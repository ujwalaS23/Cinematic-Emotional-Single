import React, { useEffect, useState, useRef } from 'react';
import Lenis from 'lenis';
import { AnimatePresence } from 'framer-motion';

import { IntroLoader } from './components/IntroLoader';
import { CursorTrail } from './components/CursorTrail';
import { MouseGlow } from './components/MouseGlow';
import { StarField3D } from './components/StarField3D';
import { MusicPlayer } from './components/MusicPlayer';

import { Hero } from './components/sections/Hero';
import { NeverEnds } from './components/sections/NeverEnds';
import { Gallery } from './components/sections/Gallery';
import { Timeline } from './components/sections/Timeline';
import { ThingsNeverSaid } from './components/sections/ThingsNeverSaid';
import { YourEyes } from './components/sections/YourEyes';
import { Scrapbook } from './components/sections/Scrapbook';
import { Constellation } from './components/sections/Constellation';
import { TheSilence } from './components/sections/TheSilence';
import { BirthdayWish } from './components/sections/BirthdayWish';
import { Surprise } from './components/sections/Surprise';
import { Finale } from './components/sections/Finale';

function App() {
  const [loaded, setLoaded] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Check for reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (!prefersReducedMotion) {
      const lenis = new Lenis({ 
        duration: 1.4, 
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) 
      });
      
      function raf(time: number) { 
        lenis.raf(time); 
        requestAnimationFrame(raf); 
      }
      requestAnimationFrame(raf);
      
      return () => lenis.destroy();
    }
  }, []);

  const handleEnter = () => {
    setLoaded(true);
    if (audioRef.current) {
      audioRef.current.play().catch(e => console.log('Audio autoplay prevented'));
    }
  };

  return (
    <div className="bg-background min-h-[100dvh] text-foreground selection:bg-gold/30 selection:text-white relative font-sans">
      <CursorTrail />
      <MouseGlow />
      <StarField3D />
      <MusicPlayer ref={audioRef} />

      <AnimatePresence mode="wait">
        {!loaded && <IntroLoader onEnter={handleEnter} key="loader" />}
      </AnimatePresence>

      <main 
        className="relative z-10 w-full overflow-hidden transition-opacity duration-1000 ease-out"
        style={{ opacity: loaded ? 1 : 0, pointerEvents: loaded ? 'auto' : 'none' }}
      >
        <Hero />
        <NeverEnds />
        <Gallery />
        <Timeline />
        <ThingsNeverSaid />
        <YourEyes />
        <Scrapbook />
        <Constellation />
        <TheSilence />
        <BirthdayWish />
        <Surprise />
        <Finale />
      </main>
    </div>
  );
}

export default App;
