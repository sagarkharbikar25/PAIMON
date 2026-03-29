import React, { useState, useRef } from 'react';
import { useApp } from '../AppContext';
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  Calendar as CalendarIcon, 
  Utensils, 
  Camera, 
  ShoppingBag, 
  Mountain,
  Plus
} from 'lucide-react';
import { cn } from '../lib/utils';

export const AddActivity = () => {
  const { setScreen, addActivity, activeTrip } = useApp();
  const [name, setName] = useState('');
  const [category, setCategory] = useState<'food' | 'sightseeing' | 'outdoors' | 'shopping'>('sightseeing');
  const [time, setTime] = useState('10:00 AM');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('2026-10-14');
  const [image, setImage] = useState<string | null>(null);
  const dateRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAdd = () => {
    if (!name || !activeTrip) return;
    addActivity({
      id: Math.random().toString(36).substr(2, 9),
      tripId: activeTrip.id,
      name,
      category,
      time,
      date: 'Oct 14',
      location,
      image: image || undefined,
      status: 'pending'
    });
    setScreen('trip-details');
  };

  const categories = [
    { id: 'sightseeing', label: 'Sights', icon: Camera, color: 'text-blue-500', bg: 'bg-blue-50' },
    { id: 'food', label: 'Food', icon: Utensils, color: 'text-amber-500', bg: 'bg-amber-50' },
    { id: 'shopping', label: 'Shopping', icon: ShoppingBag, color: 'text-purple-500', bg: 'bg-purple-50' },
    { id: 'outdoors', label: 'Outdoors', icon: Mountain, color: 'text-emerald-500', bg: 'bg-emerald-50' }
  ];

  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl px-6 py-6 border-b border-outline-variant/10">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => setScreen('itinerary')}
            className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center text-primary"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-headline text-xl font-bold text-primary">New Activity</h1>
          <div className="w-10" />
        </div>
      </header>

      <main className="pt-28 px-6 space-y-10 pb-12">
        <div className="space-y-4">
          <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest px-1">Activity Image</label>
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="w-full h-48 rounded-[2.5rem] bg-surface-container-low border-2 border-dashed border-outline-variant/20 flex flex-col items-center justify-center cursor-pointer overflow-hidden group hover:border-primary/30 hover:bg-surface-container transition-all"
          >
            {image ? (
              <img src={image} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <>
                <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary mb-3 group-hover:scale-110 transition-transform">
                  <Camera className="w-6 h-6" />
                </div>
                <p className="text-xs font-bold text-on-surface-variant">Tap to upload image</p>
                <p className="text-[10px] text-outline mt-1">Optional</p>
              </>
            )}
            <input 
              ref={fileInputRef}
              type="file" 
              accept="image/*" 
              onChange={handleImageUpload} 
              className="hidden" 
            />
          </div>
        </div>

        <div className="space-y-4">
          <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest px-1">Activity Name</label>
          <input 
            type="text" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="E.g. Visit Kinkaku-ji Temple" 
            className="w-full py-5 px-6 rounded-2xl bg-surface-container-low border-none font-headline font-bold text-xl focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="space-y-4">
          <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest px-1">Category</label>
          <div className="grid grid-cols-2 gap-3">
            {categories.map((cat) => (
              <button 
                key={cat.id}
                onClick={() => setCategory(cat.id as any)}
                className={cn(
                  "p-5 rounded-2xl border-2 transition-all flex flex-col items-center gap-2",
                  category === cat.id 
                    ? "border-primary bg-primary/5 shadow-sm" 
                    : "border-transparent bg-surface-container-low hover:bg-surface-container"
                )}
              >
                <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", cat.bg, cat.color)}>
                  <cat.icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-primary">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-4">
            <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest px-1">Time</label>
            <div className="relative">
              <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-outline w-4 h-4" />
              <input 
                type="text" 
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full py-4 pl-10 pr-4 rounded-xl bg-surface-container-low border-none font-bold text-sm focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
          <div className="space-y-4">
            <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest px-1">Date</label>
            <div className="relative">
              <button 
                type="button"
                onClick={() => dateRef.current?.showPicker?.() || dateRef.current?.click()}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-outline w-4 h-4 z-10 hover:text-primary transition-colors"
              >
                <CalendarIcon className="w-full h-full" />
              </button>
              <input 
                ref={dateRef}
                type="date" 
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full py-4 pl-10 pr-4 rounded-xl bg-surface-container-low border-none font-bold text-sm focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest px-1">Location</label>
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-outline w-5 h-5" />
            <input 
              type="text" 
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Search location..." 
              className="w-full py-5 pl-12 pr-5 rounded-2xl bg-surface-container-low border-none font-bold text-sm focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        <button 
          onClick={handleAdd}
          className="w-full py-5 rounded-2xl primary-gradient text-white font-headline font-bold text-lg shadow-lg flex items-center justify-center gap-3 active:scale-95 transition-all"
        >
          <Plus className="w-6 h-6" />
          <span>Add to Itinerary</span>
        </button>
      </main>
    </div>
  );
};
