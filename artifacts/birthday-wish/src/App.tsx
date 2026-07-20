import React, { useEffect, useState } from 'react';
import Lenis from 'lenis';
import { AnimatePresence, motion } from 'framer-motion';

import { WaxSealScreen } from './components/WaxSealScreen';
import { IntroLetter } from './components/IntroLetter';
import { Gallery } from './components/Gallery';
import { ProudOf } from './components/ProudOf';
import { MainLetter } from './components/MainLetter';
import { Ending } from './components/Ending';

function App() {
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const lenis = new Lenis({ duration: 1.2, easing: (t) => 1 - Math.pow(1 - t, 4) });
    function raf(time: number) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  return (
    /* Page background — warm cream with soft peach/rose blushes */
    <div
      className="min-h-[100dvh] relative overflow-x-hidden"
      style={{
        backgroundColor: '#FFF9F3',
        backgroundImage: `
          radial-gradient(ellipse 60% 40% at 10% 15%, rgba(248,220,200,0.45) 0%, transparent 60%),
          radial-gradient(ellipse 50% 35% at 90% 75%, rgba(217,165,165,0.25) 0%, transparent 55%),
          radial-gradient(ellipse 70% 60% at 50% 50%, rgba(244,233,221,0.3) 0%, transparent 70%)
        `,
      }}
    >
      {/* Wax seal opening screen — sits on top until opened */}
      <AnimatePresence>
        {!opened && (
          <WaxSealScreen key="seal" onOpen={() => setOpened(true)} />
        )}
      </AnimatePresence>

      {/* Main content — fades in after opening */}
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: opened ? 1 : 0 }}
        transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
        style={{ pointerEvents: opened ? 'auto' : 'none' }}
        className="relative z-10 w-full"
      >
        <IntroLetter />
        <Gallery />
        <ProudOf />
        <MainLetter />
        <Ending />
      </motion.main>
    </div>
  );
}

export default App;
