import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../AppContext';
import { ArrowRight, Compass, Utensils, Car, ShieldCheck, Ticket } from 'lucide-react';
import { cn } from '../lib/utils';

const steps = [
  {
    title: "Track Expenses Effortlessly",
    description: "Stay within budget while you focus on the journey. Real-time insights at your fingertips.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDWais9E6SbFsT4fMLU-TIxC69fbao1w4U-qAwh7ODqmDYaqFTTFlS9wSSOZ3wxfuleCp5hzkuMJzQZ4qbNa6uYXeeHUld66aihpvKO5BJzBS1hKV0btlRtHm8fG4EukGnnWkoCVXRW4CawSRAFFPOlMukZeD0iQJWXfQC-ALbfBURn-lf_LSpCD-vcu8pT837vZ2gB25fn6b42BjGx537JN263Zyr5OmDn3VF6nyG_EeROvjtRambIhGOhWorNXfjlmjXgGAHB2mV6",
    badge: "Safe to Spend",
    overlay: (
      <div className="absolute -bottom-4 -left-6 w-64 glass-card p-6 rounded-[1.5rem] shadow-xl -rotate-3 border border-white/20">
        <div className="flex justify-between items-center mb-4">
          <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Daily Budget</span>
          <span className="text-primary font-bold">$450.00</span>
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center">
              <Utensils className="w-4 h-4 text-on-secondary-container" />
            </div>
            <div className="flex-1 h-1.5 bg-surface-container rounded-full overflow-hidden">
              <div className="h-full bg-primary w-3/4" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-tertiary-fixed flex items-center justify-center">
              <Car className="w-4 h-4 text-on-tertiary-fixed-variant" />
            </div>
            <div className="flex-1 h-1.5 bg-surface-container rounded-full overflow-hidden">
              <div className="h-full bg-tertiary w-1/4" />
            </div>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-outline-variant/15 flex justify-between">
          <span className="text-[10px] text-on-surface-variant">Remaining</span>
          <span className="text-xs font-bold text-on-surface">$124.50</span>
        </div>
      </div>
    )
  },
  {
    title: "All Tickets in One Place",
    description: "Your Travel Hub - All your bookings in one sleek digital wallet. Say goodbye to searching through endless emails.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCcaHtN8WS4hvX6weywEuCa3aSfIme3hdaucVP_pWnNS-Rr_6c-ja3Xpj3oHEd_EGLtwI9IpFEtvDqaFnWIBIfjRysW8xBrjxxdqmr2_ytXnN1R9Yv6IaDv9AOG44ZLY139nDtzwPpo1bXCKRWoB20TT2aTqa91r3HKKPAsfdHXG4vQA5zEOnhOUwW2M1-EIuiIeJFDE9AhcGe85lfGSMs_mUOs_xKzCJsSWF7RNTwIHnu2uMm60wMRDIoCYo29EnWmaJhnJt17D7pF",
    badge: "All-in-One",
    overlay: (
      <div className="absolute -bottom-4 right-0 w-64 bg-surface-container-lowest rounded-xl shadow-xl p-5 rotate-3 border border-outline-variant/15">
        <div className="flex justify-between items-center mb-4">
          <div className="p-2 bg-primary-container rounded-lg">
            <Ticket className="w-4 h-4 text-on-primary" />
          </div>
          <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Confirmed</span>
        </div>
        <h4 className="font-headline font-bold text-primary">Boarding Pass</h4>
        <div className="flex justify-between items-center mt-2">
          <span className="text-2xl font-bold">LHR</span>
          <div className="flex-1 border-t border-dashed border-slate-300 mx-2" />
          <span className="text-2xl font-bold">HND</span>
        </div>
      </div>
    )
  },
  {
    title: "AI-Powered Itineraries",
    description: "Personalized journeys crafted by advanced AI. Experience the world like a local, with every detail handled.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDf4wjoVR1uT6cESO_wtHubfB9OITUzhJBAZ0CCyAphh-dCcvD6faQJQLS7Et72ZBhvGp3LGEXv4ZyChBK5Ln-AxRPzKy0888L4lve6cOLUHLi_-vH5gc_QtT0hTjCF75idU7vbaF8cttMcxuqp03wzU2FZ7bDsYTUfHKZmOt783lMJNdFMWZBkNtTomm0aBCUxIDXWVzWuUIMWHsFkHT-HJ9_Y2nF-5uC9w2rOATTrLdaxJKPf5-IB6gyETDhO2cM75humNishdvp6",
    badge: "Smart Travel",
    overlay: (
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 glass-card p-6 rounded-3xl shadow-2xl border border-white/40 flex flex-col items-center gap-4">
        <div className="w-12 h-12 bg-tertiary-container rounded-full flex items-center justify-center text-white">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <p className="text-center font-headline font-bold text-primary">AI Concierge Active</p>
      </div>
    )
  }
];

export const Onboarding = () => {
  const { onboardingStep, setOnboardingStep, setScreen } = useApp();
  const step = steps[onboardingStep - 1];

  const handleNext = () => {
    if (onboardingStep < 3) {
      setOnboardingStep(onboardingStep + 1);
    } else {
      setScreen('auth');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl">
        <div className="flex justify-between items-center px-6 py-6 w-full max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <Compass className="text-primary w-6 h-6" />
            <h1 className="text-xl font-extrabold text-primary tracking-tighter font-headline">The Explorer</h1>
          </div>
          <button 
            onClick={() => setScreen('auth')}
            className="text-on-surface-variant font-medium text-sm hover:text-primary transition-colors"
          >
            Skip
          </button>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center px-6 pt-24 pb-12 overflow-hidden">
        <div className="w-full max-w-lg mx-auto flex flex-col gap-12">
          <AnimatePresence mode="wait">
            <motion.div 
              key={onboardingStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="relative w-full aspect-[4/5] flex items-center justify-center"
            >
              <div className="absolute -top-12 -right-12 w-64 h-64 bg-secondary-container/30 rounded-full blur-3xl -z-10" />
              
              <div className="relative w-full h-full rounded-[2rem] overflow-hidden shadow-2xl rotate-2">
                <img 
                  src={step.image} 
                  alt={step.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              </div>

              {step.overlay}

              <div className="absolute top-10 -right-4 w-24 h-24 bg-tertiary-container flex flex-col items-center justify-center rounded-full text-on-tertiary shadow-xl rotate-12">
                <span className="text-[10px] font-headline font-bold text-center leading-tight">{step.badge}</span>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="text-center space-y-6">
            <AnimatePresence mode="wait">
              <motion.div 
                key={onboardingStep}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-3"
              >
                <h2 className="text-4xl font-headline font-bold tracking-tight text-primary leading-tight">
                  {step.title}
                </h2>
                <p className="text-on-surface-variant font-sans leading-relaxed text-lg max-w-sm mx-auto">
                  {step.description}
                </p>
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-center items-center gap-2 py-4">
              {[1, 2, 3].map(i => (
                <div 
                  key={i}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-300",
                    onboardingStep === i ? "w-8 bg-primary" : "w-1.5 bg-surface-container-highest"
                  )}
                />
              ))}
            </div>
          </div>
        </div>
      </main>

      <footer className="w-full max-w-lg mx-auto px-6 pb-12 flex items-center justify-between mt-auto">
        <div className="text-on-surface-variant font-medium text-sm">
          Step {onboardingStep} of 3
        </div>
        <button 
          onClick={handleNext}
          className="primary-gradient text-on-primary px-8 py-4 rounded-xl font-bold flex items-center gap-3 shadow-lg active:scale-95 transition-all duration-200 group"
        >
          <span>{onboardingStep === 3 ? 'Get Started' : 'Next'}</span>
          <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
        </button>
      </footer>
    </div>
  );
};
