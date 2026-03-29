import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useApp } from '../AppContext';
import { 
  ArrowLeft, 
  Search, 
  MapPin, 
  Navigation, 
  Star, 
  Clock, 
  Phone, 
  Globe,
  Plus
} from 'lucide-react';
import { BottomNav } from './Navigation';
import { cn } from '../lib/utils';

export const Explore = () => {
  const { setScreen } = useApp();
  const [activeTab, setActiveTab] = useState('All');

  const categories = ['All', 'Sights', 'Food', 'Shopping', 'Outdoors'];
  const places = [
    {
      name: 'Fushimi Inari-taisha',
      category: 'Sights',
      rating: 4.9,
      reviews: 12400,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDdRfsjEbCeSDZqmUp3FFf8DmfCp1sM7ZuMrXq71esSfYa0Gf9UH_NKWvm4ar2cwCfEQs8agBZUma3bNAbRH0pPxK-tb39HUPZYDgOqEIjuZmrEZQCYaBRuL6UzJxY0s-oxIfk8yEjlwItK5kJ1T61BeBcjlv0v3cKsLYOXh_0waJTzWJu9BnaYlqQb72LnxcQx9UKySwlDwjr1_wSZdkLDw-yZ5fRn_MGYrvsppYfFpAm919ygetwq8-TNlH3VAOo3SrQZ1Jloo-dI',
      distance: '2.4 km'
    },
    {
      name: 'Kichi Kichi Omurice',
      category: 'Food',
      rating: 4.8,
      reviews: 850,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDWais9E6SbFsT4fMLU-TIxC69fbao1w4U-qAwh7ODqmDYaqFTTFlS9wSSOZ3wxfuleCp5hzkuMJzQZ4qbNa6uYXeeHUld66aihpvKO5BJzBS1hKV0btlRtHm8fG4EukGnnWkoCVXRW4CawSRAFFPOlMukZeD0iQJWXfQC-ALbfBURn-lf_LSpCD-vcu8pT837vZ2gB25fn6b42BjGx537JN263Zyr5OmDn3VF6nyG_EeROvjtRambIhGOhWorNXfjlmjXgGAHB2mV6',
      distance: '0.8 km'
    }
  ];

  return (
    <div className="bg-background min-h-screen pb-32">
      {/* Map Background (Simulated) */}
      <div className="fixed top-0 w-full h-[45vh] bg-slate-200 overflow-hidden">
        <img 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDwd0LpKo3FVX0fn9WMIUybWQiDTz-oBInU0SnOvnCdK9QUZJ_Cn8uscMHfLmf_5vbeDjqREjCxrFbQHEIKDZEDLC3NK_98T4BpW5cI1rz0eVJSud72Ja5SU_tPuLEf7b3Ke3g5BppWnwTeIQrejRs5JmhZVxO3W4uhfDtDF2huHyf7X_kMnXit6HFtpW8GI31e0rdtbbWC_Q1VLkDyY59j8PowA5fR3EWHn1zno36hjQaJAdVjJDnUATdTYvg8Gn0JnRaZ0CIubgnb" 
          alt="Map"
          className="w-full h-full object-cover opacity-50 grayscale"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        
        {/* Map Markers */}
        <div className="absolute top-1/2 left-1/3 w-10 h-10 bg-primary rounded-full border-4 border-white shadow-xl flex items-center justify-center text-white animate-bounce">
          <MapPin className="w-5 h-5" />
        </div>
        <div className="absolute top-1/4 right-1/4 w-8 h-8 bg-tertiary rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white">
          <Utensils className="w-4 h-4" />
        </div>
      </div>

      {/* Header Overlay */}
      <header className="fixed top-0 w-full z-50 px-6 py-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setScreen('dashboard')}
            className="w-12 h-12 rounded-2xl bg-white/80 backdrop-blur-xl flex items-center justify-center text-primary shadow-lg"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex-grow relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-outline w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search Kyoto..." 
              className="w-full py-4 pl-12 pr-4 rounded-2xl bg-white/80 backdrop-blur-xl border-none font-medium shadow-lg focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>
      </header>

      <main className="relative z-10 pt-[38vh] px-6 space-y-8">
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
          {categories.map((cat) => (
            <button 
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={cn(
                "px-6 py-3 rounded-2xl font-headline font-bold text-sm whitespace-nowrap transition-all",
                activeTab === cat ? "bg-primary text-white shadow-lg" : "bg-white/80 backdrop-blur-md text-on-surface-variant"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-headline text-2xl font-bold text-primary">Nearby Places</h2>
            <span className="text-xs font-bold text-outline uppercase tracking-widest">124 Results</span>
          </div>

          <div className="space-y-6">
            {places.map((place) => (
              <motion.div 
                key={place.name}
                whileHover={{ y: -5 }}
                className="bg-surface-container-lowest rounded-[2.5rem] p-4 shadow-sm border border-outline-variant/10 group cursor-pointer"
              >
                <div className="flex gap-5">
                  <div className="w-32 h-32 rounded-[1.5rem] overflow-hidden flex-shrink-0">
                    <img 
                      src={place.image} 
                      alt={place.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex-grow py-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{place.category}</span>
                        <span className="text-[10px] font-bold text-primary">{place.distance}</span>
                      </div>
                      <h3 className="font-headline font-bold text-primary mb-2 leading-tight">{place.name}</h3>
                      <div className="flex items-center gap-1 text-amber-500">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span className="text-xs font-bold">{place.rating}</span>
                        <span className="text-[10px] text-outline font-medium">({place.reviews})</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="flex-grow py-2 rounded-xl bg-primary/5 text-primary font-headline font-bold text-[10px] uppercase tracking-widest hover:bg-primary hover:text-white transition-all">
                        Details
                      </button>
                      <button className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center">
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      <BottomNav />
    </div>
  );
};

const Utensils = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
    <path d="M7 2v20" />
    <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
  </svg>
);
