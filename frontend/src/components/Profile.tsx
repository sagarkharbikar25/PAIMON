import React, { useRef } from 'react';
import { useApp } from '../AppContext';
import { 
  ArrowLeft, 
  Settings, 
  ChevronRight, 
  CreditCard, 
  Bell, 
  Shield, 
  HelpCircle, 
  LogOut,
  Camera,
  MapPin,
  User
} from 'lucide-react';
import { BottomNav } from './Navigation';

export const Profile = () => {
  const { setScreen, userProfile, setUserProfile } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const menuItems = [
    { label: 'Payment Methods', icon: CreditCard, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Notifications', icon: Bell, color: 'text-amber-500', bg: 'bg-amber-50' },
    { label: 'Security & Privacy', icon: Shield, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: 'Help & Support', icon: HelpCircle, color: 'text-purple-500', bg: 'bg-purple-50' },
  ];

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (userProfile) {
          setUserProfile({ ...userProfile, image: reader.result as string });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const displayName = userProfile?.fullName || "Arjun Malhotra";
  const displayLocation = userProfile ? `${userProfile.state}, ${userProfile.country}` : "New Delhi, India";

  return (
    <div className="bg-background min-h-screen pb-32">
      {/* Hidden File Input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*"
        onChange={handleImageChange}
      />
      {/* Header */}
      <header className="px-6 pt-12 pb-8 bg-surface-container-low rounded-b-[3rem] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10" />
        
        <div className="flex justify-between items-center mb-10">
          <button 
            onClick={() => setScreen('dashboard')}
            className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary shadow-sm"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-headline text-xl font-bold text-primary">Profile</h1>
          <button 
            onClick={() => setScreen('settings')}
            className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary shadow-sm"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-col items-center">
          <div className="relative mb-6">
            <div 
              className="w-32 h-32 rounded-[2.5rem] overflow-hidden border-4 border-white shadow-xl bg-surface-container flex items-center justify-center cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              {userProfile?.image ? (
                <img 
                  src={userProfile.image} 
                  alt="Profile"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <User className="w-16 h-16 text-primary" />
              )}
            </div>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg border-2 border-white"
            >
              <Camera className="w-5 h-5" />
            </button>
          </div>
          
          <h2 className="font-headline text-3xl font-extrabold text-primary mb-1">{displayName}</h2>
          <p className="text-on-surface-variant font-medium flex items-center gap-1 mb-6">
            <MapPin className="w-4 h-4" />
            {displayLocation}
          </p>

          <div className="flex gap-4 w-full max-w-sm">
            <div className="flex-1 bg-white/50 backdrop-blur-md p-4 rounded-2xl text-center border border-white/40">
              <p className="text-2xl font-headline font-extrabold text-primary">12</p>
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Trips</p>
            </div>
            <div className="flex-1 bg-white/50 backdrop-blur-md p-4 rounded-2xl text-center border border-white/40">
              <p className="text-2xl font-headline font-extrabold text-primary">24</p>
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Countries</p>
            </div>
            <div className="flex-1 bg-white/50 backdrop-blur-md p-4 rounded-2xl text-center border border-white/40">
              <p className="text-2xl font-headline font-extrabold text-primary">4.9</p>
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Rating</p>
            </div>
          </div>
        </div>
      </header>

      <main className="px-6 py-10 space-y-8">
        <section className="space-y-4">
          <h3 className="font-headline text-lg font-bold text-primary px-2">Account Settings</h3>
          <div className="bg-surface-container-lowest rounded-[2.5rem] overflow-hidden shadow-sm border border-outline-variant/10">
            {menuItems.map((item, idx) => (
              <button 
                key={item.label}
                className={`w-full flex items-center justify-between p-6 hover:bg-surface-container-low transition-colors ${idx !== menuItems.length - 1 ? 'border-b border-outline-variant/10' : ''}`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl ${item.bg} ${item.color} flex items-center justify-center`}>
                    <item.icon className="w-6 h-6" />
                  </div>
                  <span className="font-headline font-bold text-primary">{item.label}</span>
                </div>
                <ChevronRight className="w-5 h-5 text-outline" />
              </button>
            ))}
          </div>
        </section>

        <button 
          onClick={() => setScreen('auth')}
          className="w-full p-6 rounded-[2rem] bg-red-50 text-red-600 font-headline font-bold flex items-center justify-center gap-3 active:scale-95 transition-all"
        >
          <LogOut className="w-6 h-6" />
          Logout
        </button>

        <div className="text-center">
          <p className="text-[10px] font-bold text-outline uppercase tracking-[0.3em]">प्रvaas v2.4.0</p>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};
