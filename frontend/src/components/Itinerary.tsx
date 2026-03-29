import React, { useRef } from 'react';
import { useApp } from '../AppContext';
import { 
  ArrowLeft, 
  Plus, 
  Search, 
  Filter, 
  Calendar as CalendarIcon, 
  MapPin, 
  Clock, 
  CheckCircle2,
  Circle
} from 'lucide-react';
import { BottomNav } from './Navigation';
import { cn } from '../lib/utils';

export const Itinerary = () => {
  const { activeTrip, setScreen, activities } = useApp();
  const dateRef = useRef<HTMLInputElement>(null);

  if (!activeTrip) return null;

  const tripActivities = activities.filter(a => a.tripId === activeTrip.id);

  return (
    <div className="bg-background min-h-screen pb-32">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl px-6 py-6 border-b border-outline-variant/10">
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={() => setScreen('dashboard')}
            className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center text-primary"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-headline text-xl font-bold text-primary">Itinerary</h1>
          <button 
            onClick={() => setScreen('add-activity')}
            className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white shadow-lg"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
          {['Oct 12', 'Oct 13', 'Oct 14', 'Oct 15', 'Oct 16'].map((date, i) => (
            <button 
              key={date}
              className={cn(
                "flex flex-col items-center min-w-[64px] py-3 rounded-2xl transition-all",
                i === 2 ? "bg-primary text-white shadow-md" : "bg-surface-container-low text-on-surface-variant"
              )}
            >
              <span className="text-[10px] font-bold uppercase tracking-widest mb-1">{date.split(' ')[0]}</span>
              <span className="text-lg font-headline font-bold">{date.split(' ')[1]}</span>
            </button>
          ))}
        </div>
      </header>

      <main className="pt-52 px-6 space-y-8">
        <div className="flex items-center justify-between">
          <div className="relative flex-grow mr-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-outline w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search activities..." 
              className="w-full py-3 pl-10 pr-4 rounded-xl bg-surface-container-low border-none text-sm font-medium focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <button className="w-12 h-12 rounded-xl bg-surface-container-low flex items-center justify-center text-primary">
            <Filter className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          {tripActivities.map((activity, idx) => (
            <div key={activity.id} className="flex gap-6">
              <div className="flex flex-col items-center pt-1">
                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2">{activity.time.split(' ')[0]}</span>
                <span className="text-[8px] font-bold text-outline uppercase tracking-tighter">{activity.time.split(' ')[1]}</span>
                <div className="w-0.5 flex-grow bg-outline-variant/30 my-2" />
              </div>
              
              <div className="flex-grow bg-surface-container-lowest p-6 rounded-[2rem] shadow-sm border border-outline-variant/10 relative overflow-hidden group">
                <div className={cn(
                  "absolute top-0 left-0 w-1.5 h-full",
                  activity.category === 'food' ? "bg-amber-400" : "bg-primary"
                )} />
                
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        dateRef.current?.showPicker?.() || dateRef.current?.click();
                      }}
                      className="w-8 h-8 rounded-full flex items-center justify-center bg-primary-container/10 text-primary hover:bg-primary/20 transition-colors"
                    >
                      <CalendarIcon className="w-4 h-4" />
                      <input ref={dateRef} type="date" className="absolute opacity-0 w-0 h-0" />
                    </button>
                    <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{activity.category}</span>
                  </div>
                  <button className="text-outline hover:text-primary">
                    {activity.status === 'confirmed' ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <Circle className="w-5 h-5" />}
                  </button>
                </div>

                <h3 className="font-headline text-xl font-bold text-primary mb-2">{activity.name}</h3>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-on-surface-variant">
                    <MapPin className="w-3.5 h-3.5" />
                    <span className="text-xs font-medium">{activity.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-on-surface-variant">
                    <Clock className="w-3.5 h-3.5" />
                    <span className="text-xs font-medium">{activity.time}</span>
                  </div>
                </div>

                {activity.notes && (
                  <div className="mt-4 p-3 rounded-xl bg-surface-container-low text-[10px] font-medium text-on-surface-variant italic">
                    "{activity.notes}"
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>

      <BottomNav />
    </div>
  );
};
