import React, { useRef } from 'react';
import { motion } from 'motion/react';
import { useApp } from '../AppContext';
import { 
  ArrowLeft, 
  MoreVertical, 
  Calendar as CalendarIcon, 
  Wallet, 
  Ticket, 
  Compass, 
  MapPin, 
  Clock, 
  ChevronRight,
  Plus,
  CloudRain,
  Sparkles,
  Hotel,
  Map,
  FileText,
  Bell
} from 'lucide-react';
import { BottomNav } from './Navigation';
import { cn } from '../lib/utils';

export const TripDetails = () => {
  const { activeTrip, setScreen, activities, updateTrip } = useApp();
  const dateRef = useRef<HTMLInputElement>(null);

  if (!activeTrip) return null;

  const tripActivities = activities.filter(a => a.tripId === activeTrip.id);

  return (
    <div className="bg-background min-h-screen pb-32">
      {/* Hero Header */}
      <header className="relative h-[45vh] w-full overflow-hidden">
        <img 
          src={activeTrip.image} 
          alt={activeTrip.name}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-black/30" />
        
        <div className="absolute top-0 w-full p-6 flex justify-between items-center z-10">
          <button 
            onClick={() => setScreen('dashboard')}
            className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/20"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/20">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>

        <div className="absolute bottom-0 left-0 w-full p-6">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="text-white w-4 h-4" />
            <span className="text-white/90 font-sans text-sm font-medium">{activeTrip.location}</span>
          </div>
          <h1 className="font-headline text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-4">{activeTrip.name}</h1>
          <div className="flex gap-3">
            <button 
              onClick={() => dateRef.current?.showPicker?.() || dateRef.current?.click()}
              className="px-4 py-2 rounded-xl bg-white/20 backdrop-blur-md border border-white/20 text-white text-xs font-bold flex items-center gap-2 hover:bg-white/30 transition-colors"
            >
              <CalendarIcon className="w-3 h-3" />
              {activeTrip.startDate} - {activeTrip.endDate}
              <input ref={dateRef} type="date" className="absolute opacity-0 w-0 h-0" />
            </button>
            <div className="px-4 py-2 rounded-xl bg-white/20 backdrop-blur-md border border-white/20 text-white text-xs font-bold flex items-center gap-2">
              <CloudRain className="w-3 h-3" />
              22°C • Rain
            </div>
          </div>
        </div>
      </header>

      <main className="px-6 -mt-6 relative z-10 space-y-8">
        {/* Trip Details Card */}
        <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-primary/5 border border-outline-variant/10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-2xl bg-primary/5 flex items-center justify-center text-primary">
              <FileText className="w-5 h-5" />
            </div>
            <h2 className="font-headline text-2xl font-bold text-primary">Trip Details</h2>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest px-1">Venue / Hotel Name</label>
              <div className="relative">
                <div className="w-full py-4 px-6 rounded-2xl bg-surface-container-low flex items-center justify-between">
                  <input 
                    type="text"
                    placeholder="Enter venue name"
                    value={activeTrip.hotelName || ''}
                    onChange={(e) => updateTrip({ ...activeTrip, hotelName: e.target.value })}
                    className="font-headline font-bold text-primary bg-transparent border-none focus:ring-0 p-0 w-full placeholder:text-outline/50"
                  />
                  <Hotel className="w-5 h-5 text-outline" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest px-1">Destination</label>
              <div className="relative">
                <div className="w-full py-4 px-6 rounded-2xl bg-surface-container-low flex items-center justify-between">
                  <input 
                    type="text"
                    placeholder="Enter destination"
                    value={activeTrip.location || ''}
                    onChange={(e) => updateTrip({ ...activeTrip, location: e.target.value })}
                    className="font-headline font-bold text-primary bg-transparent border-none focus:ring-0 p-0 w-full placeholder:text-outline/50"
                  />
                  <MapPin className="w-5 h-5 text-outline" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest px-1">Dates</label>
              <div className="grid grid-cols-2 gap-3">
                <div className="relative py-4 px-4 rounded-2xl bg-surface-container-low flex items-center justify-between group">
                  <input 
                    type="date"
                    value={activeTrip.startDate || ''}
                    onChange={(e) => updateTrip({ ...activeTrip, startDate: e.target.value })}
                    className="font-headline font-bold text-primary bg-transparent border-none focus:ring-0 p-0 w-full text-xs cursor-pointer"
                  />
                  <CalendarIcon className="w-4 h-4 text-outline group-hover:text-primary transition-colors" />
                </div>
                <div className="relative py-4 px-4 rounded-2xl bg-surface-container-low flex items-center justify-between group">
                  <input 
                    type="date"
                    value={activeTrip.endDate || ''}
                    onChange={(e) => updateTrip({ ...activeTrip, endDate: e.target.value })}
                    className="font-headline font-bold text-primary bg-transparent border-none focus:ring-0 p-0 w-full text-xs cursor-pointer"
                  />
                  <CalendarIcon className="w-4 h-4 text-outline group-hover:text-primary transition-colors" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Smart Tools */}
        <section className="bg-[#0047AB] text-white rounded-[2.5rem] p-10 overflow-hidden relative shadow-2xl shadow-blue-900/20">
          <div className="relative z-10">
            <h3 className="font-headline text-3xl font-bold mb-3">Smart Concierge</h3>
            <p className="text-white/70 text-sm font-medium mb-8 max-w-[240px]">AI-powered tools to enhance your travel experience.</p>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setScreen('explore')}
                className="bg-white/10 hover:bg-white/20 backdrop-blur-md p-6 rounded-[2rem] flex flex-col items-center gap-3 transition-all active:scale-95 border border-white/10"
              >
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                  <Compass className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest">Explore</span>
              </button>
              <button 
                onClick={() => setScreen('ai-planner')}
                className="bg-white/10 hover:bg-white/20 backdrop-blur-md p-6 rounded-[2rem] flex flex-col items-center gap-3 transition-all active:scale-95 border border-white/10"
              >
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                  <Sparkles className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest">AI Planner</span>
              </button>
            </div>
          </div>
          <div className="absolute -right-10 -bottom-10 opacity-10">
            <Compass className="w-64 h-64 rotate-12" />
          </div>
          <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
        </section>

        {/* Your Activities */}
        <section>
          <div className="mb-6">
            <h2 className="font-headline text-3xl font-bold text-primary mb-2">Your Activities</h2>
            <p className="text-on-surface-variant text-sm font-medium">Curated experiences for Day 1 in {activeTrip.location.split(',')[0]}</p>
          </div>

          <button 
            onClick={() => setScreen('add-activity')}
            className="w-full py-5 rounded-2xl bg-[#0047AB] text-white font-headline font-bold text-lg shadow-lg flex items-center justify-center gap-3 mb-10 active:scale-95 transition-transform"
          >
            <Plus className="w-6 h-6" />
            <span>Add Activity</span>
          </button>
          
          <div className="space-y-10">
            {tripActivities.map((activity) => (
              <div key={activity.id} className="bg-surface-container-lowest rounded-[2.5rem] overflow-hidden shadow-sm border border-outline-variant/10">
                {activity.image && (
                  <div className="h-48 w-full relative">
                    <img 
                      src={activity.image} 
                      alt={activity.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}
                <div className="p-8">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-widest">
                      {activity.time}
                    </span>
                    <span className="text-outline-variant">•</span>
                    <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                      {activity.category === 'sightseeing' ? 'Culture & Nature' : 'Authentic Experience'}
                    </span>
                  </div>
                  <h3 className="font-headline text-2xl font-bold text-primary mb-3">{activity.name}</h3>
                  <p className="text-on-surface-variant text-sm font-medium leading-relaxed mb-8">
                    {activity.name.includes('Bamboo') 
                      ? "Begin your morning with a tranquil walk through the soaring bamboo stalks before the crowds arrive."
                      : "Participate in a private tea ritual at a historic wooden townhouse in the Gion district."}
                  </p>
                  <div className="flex items-center gap-4 pt-6 border-t border-outline-variant/10">
                    <button className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-primary">
                      <Map className="w-5 h-5" />
                    </button>
                    <button className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-primary">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <BottomNav />
    </div>
  );
};
