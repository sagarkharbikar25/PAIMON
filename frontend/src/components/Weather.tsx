import React from 'react';
import { useApp } from '../AppContext';
import { 
  ArrowLeft, 
  CloudSun, 
  Wind, 
  Droplets, 
  Sun, 
  CloudRain, 
  CloudLightning,
  Thermometer,
  ChevronRight
} from 'lucide-react';
import { BottomNav } from './Navigation';
import { cn } from '../lib/utils';

export const Weather = () => {
  const { setScreen } = useApp();

  const forecast = [
    { day: 'Mon', temp: 22, icon: Sun, status: 'Sunny' },
    { day: 'Tue', temp: 20, icon: CloudSun, status: 'Partly Cloudy' },
    { day: 'Wed', temp: 18, icon: CloudRain, status: 'Showers' },
    { day: 'Thu', temp: 19, icon: CloudRain, status: 'Rain' },
    { day: 'Fri', temp: 21, icon: Sun, status: 'Sunny' },
  ];

  return (
    <div className="bg-background min-h-screen pb-32">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl px-6 py-6 border-b border-outline-variant/10">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => setScreen('dashboard')}
            className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center text-primary"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <CloudSun className="w-5 h-5 text-primary" />
            <h1 className="font-headline text-xl font-bold text-primary">Weather</h1>
          </div>
          <div className="w-10" />
        </div>
      </header>

      <main className="pt-28 px-6 space-y-8">
        {/* Current Weather */}
        <section className="primary-gradient text-white rounded-[3rem] p-10 shadow-2xl relative overflow-hidden">
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/60">Kyoto, Japan</span>
            </div>
            <h2 className="text-8xl font-headline font-extrabold mb-4 tracking-tighter">22°</h2>
            <div className="flex items-center gap-3 mb-8">
              <CloudSun className="w-8 h-8" />
              <span className="text-2xl font-headline font-bold">Partly Cloudy</span>
            </div>
            
            <div className="grid grid-cols-3 w-full gap-4 pt-8 border-t border-white/10">
              <div className="flex flex-col items-center gap-1">
                <Wind className="w-5 h-5 text-white/60" />
                <span className="text-sm font-bold">12 km/h</span>
                <span className="text-[8px] uppercase font-bold text-white/40">Wind</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Droplets className="w-5 h-5 text-white/60" />
                <span className="text-sm font-bold">64%</span>
                <span className="text-[8px] uppercase font-bold text-white/40">Humidity</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Thermometer className="w-5 h-5 text-white/60" />
                <span className="text-sm font-bold">24° / 16°</span>
                <span className="text-[8px] uppercase font-bold text-white/40">High/Low</span>
              </div>
            </div>
          </div>
          <div className="absolute -right-20 -top-20 opacity-10">
            <Sun className="w-64 h-64" />
          </div>
        </section>

        {/* 5-Day Forecast */}
        <section>
          <div className="flex items-center justify-between mb-6 px-2">
            <h3 className="font-headline text-2xl font-bold text-primary">5-Day Forecast</h3>
            <button className="text-primary font-bold text-sm flex items-center gap-1">
              Details
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="space-y-4">
            {forecast.map((day, i) => (
              <div key={day.day} className="bg-surface-container-lowest p-6 rounded-[2rem] shadow-sm border border-outline-variant/10 flex items-center justify-between group hover:shadow-md transition-all">
                <div className="flex items-center gap-6">
                  <span className="w-12 font-headline font-bold text-primary">{day.day}</span>
                  <div className="flex items-center gap-3">
                    <day.icon className={cn(
                      "w-6 h-6",
                      day.status === 'Sunny' ? "text-amber-500" : "text-primary"
                    )} />
                    <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">{day.status}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-lg font-headline font-extrabold text-primary">{day.temp}°</span>
                  <div className="w-24 h-1.5 bg-surface-container rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${(day.temp / 30) * 100}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Travel Advisory */}
        <section className="bg-amber-50 border border-amber-200 rounded-[2rem] p-8 flex gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600 flex-shrink-0">
            <CloudRain className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-headline font-bold text-amber-900 mb-1">Rain Expected Tomorrow</h4>
            <p className="text-xs text-amber-800 font-medium leading-relaxed">Light showers are expected starting at 2 PM. We recommend visiting the Kyoto National Museum during this time.</p>
          </div>
        </section>
      </main>

      <BottomNav />
    </div>
  );
};
