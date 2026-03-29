import React from 'react';
import { motion } from 'motion/react';
import { useApp } from '../AppContext';
import { 
  Menu, 
  Bell, 
  MapPin, 
  ArrowRight, 
  Wallet, 
  Lightbulb, 
  CalendarDays, 
  Users, 
  Plus,
  ChevronRight,
  User,
  Bot
} from 'lucide-react';
import { BottomNav } from './Navigation';
import { Notifications } from './Notifications';

export const Dashboard = () => {
  const { trips, expenses, setScreen, setActiveTrip, setSidebarOpen, userProfile, notifications, setShowNotifications, setShowChatbot } = useApp();
  const activeTrip = trips.find(t => t.status === 'active') || trips[0];
  const upcomingTrips = trips.filter(t => t.status === 'upcoming' || t.id === '2');

  const totalSpent = Math.max(activeTrip.spent, expenses.filter(e => e.tripId === activeTrip.id).reduce((acc, curr) => acc + curr.amount, 0));
  const totalBudget = activeTrip.budget;
  const spentPercentage = totalBudget > 0 ? Math.min(Math.round((totalSpent / totalBudget) * 100), 100) : 0;
  const budgetDiff = Math.abs(Math.round(((totalBudget - totalSpent) / totalBudget) * 100));
  const isUnderBudget = totalSpent <= totalBudget;

  const hasUnread = notifications.some(n => !n.isRead);
  const firstName = userProfile?.fullName?.split(' ')[0] || "Arjun";

  return (
    <div className="bg-background min-h-screen">
      <Notifications />
      {/* Top Bar */}
      <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl flex items-center justify-between px-6 h-16">
        <div className="flex items-center gap-3">
          <Menu 
            className="text-primary w-6 h-6 cursor-pointer hover:scale-110 transition-transform" 
            onClick={() => setSidebarOpen(true)}
          />
          <span className="font-headline font-extrabold text-xl text-primary tracking-tighter">प्रvaas</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative cursor-pointer" onClick={() => setShowNotifications(true)}>
            <Bell className="text-primary w-6 h-6" />
            {hasUnread && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 border-2 border-white rounded-full" />
            )}
          </div>
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm cursor-pointer bg-surface-container flex items-center justify-center" onClick={() => setScreen('profile')}>
            {userProfile?.image ? (
              <img 
                src={userProfile.image} 
                alt="Avatar"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <User className="w-6 h-6 text-primary" />
            )}
          </div>
        </div>
      </nav>

      <main className="pt-24 pb-32 px-6 max-w-7xl mx-auto">
        <header className="mb-10">
          <h1 className="font-headline text-4xl font-extrabold text-primary tracking-tight mb-2">Welcome, {firstName}</h1>
          <p className="font-sans text-on-surface-variant flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Current stop: Kyoto, Japan
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Current Journey */}
          <section className="md:col-span-8">
            <motion.div 
              whileHover={{ scale: 1.01 }}
              className="relative overflow-hidden rounded-[2.5rem] h-[500px] shadow-sm cursor-pointer group"
              onClick={() => { setActiveTrip(activeTrip!); setScreen('trip-details'); }}
            >
              <img 
                src={activeTrip?.image} 
                alt={activeTrip?.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent" />
              <div className="absolute bottom-0 left-0 p-8 w-full">
                <span className="inline-block px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-white font-sans text-xs font-bold tracking-widest uppercase mb-4">Current Journey</span>
                <h2 className="font-headline text-3xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">{activeTrip?.name}</h2>
                <div className="flex flex-wrap gap-4">
                  <button className="primary-gradient text-white px-8 py-4 rounded-xl font-headline font-bold text-sm shadow-lg flex items-center gap-2 active:scale-95 transition-transform">
                    View Itinerary
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button className="bg-white/10 backdrop-blur-xl text-white border border-white/20 px-8 py-4 rounded-xl font-headline font-bold text-sm hover:bg-white/20 transition-colors">
                    Manage Bookings
                  </button>
                </div>
              </div>
            </motion.div>
          </section>

          {/* Side Column */}
          <div className="md:col-span-4 flex flex-col gap-6">
            <section className="bg-surface-container-low rounded-[2.5rem] p-8 flex flex-col justify-between h-full">
              <div>
                <div className="flex justify-between items-start mb-6">
                  <span className="font-headline font-bold text-lg text-primary">Trip Budget</span>
                  <Wallet className="text-primary w-6 h-6" />
                </div>
                <div className="mb-4">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-3xl font-headline font-extrabold text-primary">₹{totalSpent.toLocaleString()}</span>
                    <span className="text-on-surface-variant font-sans text-xs font-medium">OF ₹{totalBudget.toLocaleString()}</span>
                  </div>
                  <div className="w-full h-3 bg-surface-container-highest rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full transition-all duration-1000 ease-out" 
                      style={{ width: `${spentPercentage}%` }} 
                    />
                  </div>
                </div>
                <p className="text-on-surface-variant text-sm font-sans mb-6">
                  {isUnderBudget 
                    ? `You are ${budgetDiff}% under budget for this phase. Great job!` 
                    : `You are ${budgetDiff}% over budget. Consider tracking your expenses closely.`}
                </p>
              </div>
              <button 
                onClick={() => setScreen('expenses')}
                className="w-full py-4 rounded-xl border border-outline-variant/30 font-headline font-bold text-sm text-primary hover:bg-surface-container transition-colors flex items-center justify-center gap-2"
              >
                Full Expense Report
                <ChevronRight className="w-4 h-4" />
              </button>
            </section>

            <section className="bg-tertiary-container text-white rounded-[2.5rem] p-10 relative overflow-hidden min-h-[220px] flex flex-col justify-center">
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <Lightbulb className="text-on-tertiary-container w-5 h-5 fill-current" />
                  <span className="font-sans text-xs font-bold tracking-widest uppercase text-on-tertiary-container">Travel Tip</span>
                </div>
                <p className="font-headline font-semibold text-2xl leading-relaxed">The best Gion views are at 6:00 AM before the crowds arrive.</p>
              </div>
              <div className="absolute -right-4 -bottom-4 opacity-10">
                <Lightbulb className="w-40 h-40" />
              </div>
            </section>
          </div>
        </div>

        {/* Upcoming Expeditions */}
        <section className="mt-16">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-headline text-2xl font-bold text-primary">Upcoming Expeditions</h3>
            <button className="text-primary font-headline font-bold text-sm flex items-center gap-1">
              See All
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {upcomingTrips.map((trip) => (
              <motion.div 
                key={trip.id}
                whileHover={{ y: -5 }}
                className="bg-surface-container-lowest rounded-[2rem] p-4 group cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300"
                onClick={() => { setActiveTrip(trip); setScreen('trip-details'); }}
              >
                <div className="relative h-48 rounded-[1.5rem] overflow-hidden mb-5">
                  <img 
                    src={trip.image} 
                    alt={trip.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-[10px] font-bold text-on-surface uppercase tracking-tighter">Tickets Confirmed</span>
                  </div>
                </div>
                <div className="px-2 pb-2">
                  <h4 className="font-headline font-bold text-xl text-primary mb-1">{trip.name}</h4>
                  <div className="flex items-center gap-4 text-on-surface-variant text-xs font-medium">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        const input = document.createElement('input');
                        input.type = 'date';
                        input.showPicker?.();
                      }}
                      className="flex items-center gap-1 hover:text-primary transition-colors"
                    >
                      <CalendarDays className="w-3 h-3" />
                      {trip.startDate} - {trip.endDate}
                    </button>
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      2 People
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
            <div 
              onClick={() => setScreen('create-trip')}
              className="flex flex-col items-center justify-center border-2 border-dashed border-outline-variant/30 rounded-[2rem] h-full min-h-[280px] p-8 text-on-surface-variant hover:border-primary/30 hover:bg-surface-container-low transition-colors group cursor-pointer"
            >
              <Plus className="w-10 h-10 mb-3 group-hover:scale-110 transition-transform" />
              <p className="font-headline font-bold text-sm">Plan New Expedition</p>
            </div>
          </div>
        </section>
      </main>

      <button 
        onClick={() => setShowChatbot(true)}
        className="fixed bottom-28 right-6 md:right-12 primary-gradient text-white w-16 h-16 rounded-2xl shadow-2xl flex items-center justify-center z-50 hover:scale-110 transition-transform active:scale-95 group"
      >
        <Bot className="w-8 h-8" />
      </button>

      <BottomNav />
    </div>
  );
};
