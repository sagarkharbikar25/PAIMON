import React from 'react';
import { useApp } from '../AppContext';
import { 
  Compass, 
  Luggage, 
  PlusCircle, 
  User, 
  Home
} from 'lucide-react';
import { cn } from '../lib/utils';

export const BottomNav = () => {
  const { currentScreen, setScreen } = useApp();

  const navItems = [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'create-trip', label: 'Plan', icon: PlusCircle },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full h-20 bg-white/80 backdrop-blur-2xl flex justify-around items-center px-4 pb-safe z-50 rounded-t-[2rem] shadow-[0_-12px_40px_rgba(23,28,31,0.06)]">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentScreen === item.id;
        
        return (
          <button
            key={item.id}
            onClick={() => setScreen(item.id as any)}
            className={cn(
              "flex flex-col items-center justify-center px-5 py-2 transition-all duration-300 active:scale-90",
              isActive ? "text-primary bg-secondary-container/30 rounded-2xl" : "text-slate-400"
            )}
          >
            <Icon className={cn("w-6 h-6 mb-1", isActive && "fill-current")} />
            <span className="text-[10px] font-medium uppercase tracking-widest">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
