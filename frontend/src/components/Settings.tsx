import React from 'react';
import { useApp } from '../AppContext';
import { 
  ArrowLeft, 
  User, 
  Bell, 
  Lock, 
  Globe, 
  Moon, 
  HelpCircle, 
  LogOut, 
  ChevronRight,
  Shield,
  CreditCard,
  Smartphone
} from 'lucide-react';
import { cn } from '../lib/utils';
import { BottomNav } from './Navigation';

export const Settings = () => {
  const { setScreen, logout } = useApp();

  const sections = [
    {
      title: 'Account',
      items: [
        { name: 'Profile Information', icon: <User className="w-5 h-5" />, color: 'text-blue-500', onClick: () => setScreen('profile') },
        { name: 'Security & Password', icon: <Lock className="w-5 h-5" />, color: 'text-emerald-500' },
        { name: 'Payment Methods', icon: <CreditCard className="w-5 h-5" />, color: 'text-amber-500' }
      ]
    },
    {
      title: 'Preferences',
      items: [
        { name: 'Notifications', icon: <Bell className="w-5 h-5" />, color: 'text-rose-500', onClick: () => setScreen('notifications') },
        { name: 'Language', icon: <Globe className="w-5 h-5" />, color: 'text-indigo-500', value: 'English (US)' },
        { name: 'Dark Mode', icon: <Moon className="w-5 h-5" />, color: 'text-slate-500', toggle: true },
        { name: 'Units', icon: <Smartphone className="w-5 h-5" />, color: 'text-cyan-500', value: 'Metric' }
      ]
    },
    {
      title: 'Support & Legal',
      items: [
        { name: 'Help Center', icon: <HelpCircle className="w-5 h-5" />, color: 'text-orange-500' },
        { name: 'Privacy Policy', icon: <Shield className="w-5 h-5" />, color: 'text-teal-500' }
      ]
    }
  ];

  return (
    <div className="bg-background min-h-screen pb-20">
      {/* Header */}
      <header className="px-6 py-6 flex items-center gap-4 sticky top-0 bg-white/70 backdrop-blur-xl z-50 border-b border-outline-variant/10">
        <button 
          onClick={() => setScreen('dashboard')}
          className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center text-primary"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="font-headline text-xl font-bold text-primary">Settings</h1>
      </header>

      <main className="p-6 space-y-8">
        {sections.map((section) => (
          <div key={section.title} className="space-y-4">
            <h3 className="px-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{section.title}</h3>
            <div className="bg-surface-container-lowest rounded-[2rem] border border-outline-variant/10 overflow-hidden shadow-sm">
              {section.items.map((item, idx) => (
                <button 
                  key={item.name}
                  onClick={item.onClick}
                  className={cn(
                    "w-full flex items-center justify-between p-5 hover:bg-surface-container-low transition-colors",
                    idx !== section.items.length - 1 && "border-b border-outline-variant/5"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div className={cn("w-10 h-10 rounded-xl bg-surface-container-low flex items-center justify-center", item.color)}>
                      {item.icon}
                    </div>
                    <span className="font-headline font-bold text-primary">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {item.value && <span className="text-xs font-bold text-on-surface-variant">{item.value}</span>}
                    {item.toggle && (
                      <div className="w-10 h-6 rounded-full bg-surface-container-high relative">
                        <div className="absolute left-1 top-1 w-4 h-4 rounded-full bg-white shadow-sm" />
                      </div>
                    )}
                    {!item.toggle && <ChevronRight className="w-4 h-4 text-outline" />}
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}

        <button 
          onClick={logout}
          className="w-full flex items-center justify-center gap-3 p-5 rounded-[2rem] bg-rose-50 text-rose-600 font-headline font-bold hover:bg-rose-100 transition-colors mt-8"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>

        <div className="text-center space-y-1 pt-4">
          <p className="text-[10px] font-bold text-outline uppercase tracking-widest">Voyage AI v2.4.0</p>
          <p className="text-[10px] text-on-surface-variant">Made with ❤️ for world travelers</p>
        </div>
      </main>
      <BottomNav />
    </div>
  );
};
