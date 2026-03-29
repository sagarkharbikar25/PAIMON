import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../AppContext';
import { 
  Calendar, 
  Wallet, 
  Ticket, 
  Compass, 
  Sparkles, 
  Settings, 
  X,
  ChevronRight,
  User,
  BarChart2
} from 'lucide-react';
import { cn } from '../lib/utils';

export const Sidebar = () => {
  const { isSidebarOpen, setSidebarOpen, setScreen, userProfile, setShowChatbot } = useApp();

  const menuItems = [
    { id: 'itinerary', label: 'Itinerary', icon: Calendar, screen: 'itinerary' },
    { id: 'expenses', label: 'Expenses', icon: Wallet, screen: 'expenses' },
    { id: 'tickets', label: 'Tickets', icon: Ticket, screen: 'vault' },
    { id: 'explore', label: 'Explore', icon: Compass, screen: 'explore' },
    { id: 'reports', label: 'Analytics', icon: BarChart2, screen: 'reports' },
    { id: 'settings', label: 'Settings', icon: Settings, screen: 'settings' },
  ];

  const displayName = userProfile?.fullName || "Alex Horizon";

  return (
    <AnimatePresence>
      {isSidebarOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
          />

          {/* Sidebar Content */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 bottom-0 w-[320px] bg-white z-[70] shadow-2xl flex flex-col overflow-hidden rounded-r-[3rem]"
          >
            {/* Header / Profile */}
            <div className="p-8 pt-12">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-primary/10 shadow-lg bg-surface-container flex items-center justify-center">
                  {userProfile?.image ? (
                    <img 
                      src={userProfile.image} 
                      alt={displayName}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <User className="w-8 h-8 text-primary" />
                  )}
                </div>
                <div>
                  <h3 className="font-headline text-xl font-extrabold text-primary tracking-tight">{displayName}</h3>
                  <span className="inline-block px-3 py-1 bg-orange-100 text-orange-600 text-[10px] font-bold uppercase tracking-widest rounded-full">Gold Member</span>
                </div>
              </div>

              {/* Status Card */}
              <div className="bg-surface-container-low rounded-3xl p-5 mb-8 border border-primary/5">
                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest block mb-1">Current Status</span>
                <p className="font-headline font-bold text-primary">Premium Explorer</p>
              </div>

              {/* Navigation List */}
              <nav className="space-y-2">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setScreen(item.screen as any);
                      setSidebarOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-200 group",
                      item.id === 'itinerary' ? "bg-primary/10 text-primary" : "hover:bg-primary/5 text-on-surface-variant hover:text-primary"
                    )}
                  >
                    <item.icon className={cn("w-5 h-5", item.id === 'itinerary' ? "text-primary" : "text-on-surface-variant group-hover:text-primary")} />
                    <span className="font-headline font-bold text-sm flex-1 text-left">{item.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Bottom Card */}
            <div className="p-8">
              <div className="bg-primary rounded-[2rem] p-6 text-white shadow-xl shadow-primary/20 relative overflow-hidden">
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
                <h4 className="font-headline font-bold text-lg mb-2 relative z-10">Need Help?</h4>
                <p className="text-white/70 text-xs mb-6 relative z-10 leading-relaxed">Our 24/7 concierge is ready for you.</p>
                <button 
                  onClick={() => {
                    setShowChatbot(true);
                    setSidebarOpen(false);
                  }}
                  className="w-full bg-white text-primary font-headline font-bold text-xs py-4 rounded-xl shadow-lg active:scale-95 transition-transform"
                >
                  Contact Support
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
