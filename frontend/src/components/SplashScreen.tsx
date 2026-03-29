import React from 'react';
import { motion } from 'motion/react';
import { useApp } from '../AppContext';
import { ArrowRight, Compass } from 'lucide-react';

export const SplashScreen = () => {
  const { setScreen } = useApp();

  return (
    <main className="relative h-screen w-full flex flex-col items-center justify-between px-8 py-16 overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBO4ceTowasppywz_qcM5prGvwBuzMGd1uQUlwopb3mcWoMcdwNa4lXhNb0qrREJkVpFiSa4KWlWYG8BJ408wSpScMsgBUU2M-MFmtbfRYayxjY_zMabcjnzPjyuAlrVWxFDeo0iLiYeT79pmzl9ExBll5oj3IwIGjxztyvNZIN9nDk_VsOI5phUdeD2O4wJzESB7aEy0kafSFsWvDo4zHjV06_I9-s3gQzLPTdPopAVzIQhyC663qibs-QYfnWA9LlZrLhmHowh_SZ" 
          alt="Landscape"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/70" />
      </div>

      {/* Top Branding */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="z-10 px-4 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full"
      >
        <span className="text-white text-[10px] uppercase tracking-[0.2em] font-semibold">Expenses Companion</span>
      </motion.div>

      {/* Center Content */}
      <div className="z-10 flex flex-col items-center text-center space-y-8 mb-12">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="w-28 h-28 bg-white/10 backdrop-blur-xl border border-white/30 rounded-[2.5rem] flex items-center justify-center shadow-2xl mb-8"
        >
          <Compass className="text-white w-16 h-16" />
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="font-headline text-6xl font-extrabold tracking-tight text-white drop-shadow-lg"
        >
          प्रvaas
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="font-sans text-xl text-white/90 font-light tracking-wide italic max-w-xs"
        >
          Your journey, curated to perfection.
        </motion.p>
      </div>

      {/* Bottom Action */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="z-10 w-full max-w-sm flex flex-col items-center space-y-12"
      >
        <button 
          onClick={() => setScreen('onboarding')}
          className="group w-full py-5 px-10 bg-white text-primary hover:bg-primary-container hover:text-white rounded-2xl font-headline font-bold text-xl flex items-center justify-center space-x-4 transition-all duration-300 active:scale-95 shadow-[0_20px_50px_rgba(0,0,0,0.3)]"
        >
          <span>Start Your Journey</span>
          <ArrowRight className="transition-transform duration-300 group-hover:translate-x-2" />
        </button>

        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-0.5 bg-white/30 rounded-full" />
          <span className="text-white/50 font-sans text-[10px] uppercase tracking-[0.3em]">Explorer Edition 2.0</span>
        </div>
      </motion.div>
    </main>
  );
};
