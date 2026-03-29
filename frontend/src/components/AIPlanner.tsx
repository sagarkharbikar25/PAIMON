import React, { useState, useRef } from 'react';
import { useApp } from '../AppContext';
import { 
  ArrowLeft, 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  Calendar as CalendarIcon, 
  MapPin, 
  Plane,
  Loader2,
  Plus
} from 'lucide-react';
import { BottomNav } from './Navigation';
import { cn } from '../lib/utils';
import { generateItinerary } from '../services/geminiService';

export const AIPlanner = () => {
  const { setScreen } = useApp();
  const [destination, setDestination] = useState('');
  const [duration, setDuration] = useState('');
  const [interests, setInterests] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const dateRef = useRef<HTMLInputElement>(null);

  const handleGenerate = async () => {
    if (!destination || !duration) return;
    setIsLoading(true);
    try {
      const data = await generateItinerary(destination, duration, interests);
      setResult(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-background min-h-screen pb-32">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl px-6 py-6 border-b border-outline-variant/10">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => setScreen('trip-details')}
            className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center text-primary"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-tertiary fill-current" />
            <h1 className="font-headline text-xl font-bold text-primary">AI Concierge</h1>
          </div>
          <div className="w-10" />
        </div>
      </header>

      <main className="pt-28 px-6 space-y-8">
        {!result ? (
          <section className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="font-headline text-3xl font-extrabold text-primary tracking-tight">Plan Your Next Escape</h2>
              <p className="text-on-surface-variant font-medium">Tell me where you want to go, and I'll handle the rest.</p>
            </div>

            <div className="space-y-6 bg-surface-container-lowest p-8 rounded-[2.5rem] shadow-sm border border-outline-variant/10">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest px-1">Destination</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-outline w-5 h-5" />
                  <input 
                    type="text" 
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="E.g. Santorini, Greece" 
                    className="w-full py-4 pl-12 pr-5 rounded-xl bg-surface-container-low border-none font-medium focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest px-1">Duration</label>
                <div className="relative">
                  <button 
                    type="button"
                    onClick={() => dateRef.current?.showPicker?.() || dateRef.current?.click()}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-outline w-5 h-5 z-10 hover:text-primary transition-colors"
                  >
                    <CalendarIcon className="w-full h-full" />
                  </button>
                  <input 
                    ref={dateRef}
                    type="date" 
                    className="absolute opacity-0 w-0 h-0"
                    onChange={(e) => setDuration(e.target.value)}
                  />
                  <input 
                    type="text" 
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="E.g. 5 Days" 
                    className="w-full py-4 pl-12 pr-5 rounded-xl bg-surface-container-low border-none font-medium focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest px-1">Interests & Vibe</label>
                <textarea 
                  value={interests}
                  onChange={(e) => setInterests(e.target.value)}
                  placeholder="E.g. Luxury dining, sunset views, historical sites..." 
                  className="w-full py-4 px-5 rounded-xl bg-surface-container-low border-none font-medium focus:ring-2 focus:ring-primary/20 min-h-[120px] resize-none"
                />
              </div>

              <button 
                onClick={handleGenerate}
                disabled={isLoading}
                className="w-full py-5 rounded-2xl primary-gradient text-white font-headline font-bold text-lg shadow-lg flex items-center justify-center gap-3 disabled:opacity-50 transition-all active:scale-95"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span>Curating your journey...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-6 h-6" />
                    <span>Generate Itinerary</span>
                  </>
                )}
              </button>
            </div>
          </section>
        ) : (
          <section className="space-y-8 animate-fade-in">
            <div className="flex justify-between items-center">
              <h2 className="font-headline text-2xl font-bold text-primary">Your Curated Journey</h2>
              <button 
                onClick={() => setResult(null)}
                className="text-primary font-bold text-sm"
              >
                Reset
              </button>
            </div>

            <div className="space-y-8">
              {result.days?.map((day: any, idx: number) => (
                <div key={idx} className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-headline font-bold">
                      {idx + 1}
                    </div>
                    <h3 className="font-headline text-xl font-bold text-primary">Day {idx + 1}</h3>
                  </div>
                  <div className="space-y-4 ml-5 pl-8 border-l-2 border-outline-variant/30">
                    {day.activities?.map((act: any, aIdx: number) => (
                      <div key={aIdx} className="bg-surface-container-lowest p-6 rounded-[1.5rem] shadow-sm border border-outline-variant/10">
                        <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest block mb-1">{act.time}</span>
                        <h4 className="font-headline font-bold text-primary mb-2">{act.name}</h4>
                        <p className="text-xs text-on-surface-variant font-medium leading-relaxed">{act.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full py-5 rounded-2xl bg-tertiary text-white font-headline font-bold text-lg shadow-lg flex items-center justify-center gap-3 active:scale-95 transition-all">
              <Plus className="w-6 h-6" />
              <span>Save to My Trips</span>
            </button>
          </section>
        )}
      </main>

      <BottomNav />
    </div>
  );
};
