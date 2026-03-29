import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useApp } from '../AppContext';
import { 
  User, 
  Wallet, 
  Plus, 
  Utensils, 
  Car, 
  Landmark,
  ChevronRight,
  ArrowLeft
} from 'lucide-react';
import { BottomNav } from './Navigation';
import { cn } from '../lib/utils';

export const Expenses = () => {
  const { setScreen, userProfile, expenses, activeTrip } = useApp();
  const [filter, setFilter] = useState<'all' | 'me' | 'shared'>('all');

  // Calculate dynamic budget stats
  const totalBudget = activeTrip?.budget || 60000;
  const totalSpent = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const remaining = totalBudget - totalSpent;
  const spentPercentage = totalBudget > 0 ? Math.min(Math.round((totalSpent / totalBudget) * 100), 100) : 0;
  
  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'dining':
      case 'food & drinks':
        return Utensils;
      case 'transport':
        return Car;
      case 'sightseeing':
        return Landmark;
      default:
        return Wallet;
    }
  };

  const filteredExpenses = expenses
    .filter(e => {
      if (filter === 'all') return true;
      const type = e.paidBy === 'You' ? 'me' : 'shared';
      return type === filter;
    })
    .sort((a, b) => b.id.localeCompare(a.id)); // Sort by "newest" (mocked by ID)

  const recentExpenses = filteredExpenses.slice(0, 3);

  return (
    <div className="bg-background min-h-screen pb-32">
      {/* Header */}
      <header className="px-6 pt-12 pb-6 flex items-center justify-between bg-white/50 backdrop-blur-md sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setScreen('dashboard')}
            className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center text-primary active:scale-90 transition-transform"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="w-10 h-10 rounded-full overflow-hidden bg-surface-container flex items-center justify-center border border-outline-variant/20">
            {userProfile?.image ? (
              <img src={userProfile.image} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            ) : (
              <User className="w-5 h-5 text-primary" />
            )}
          </div>
          <h1 className="font-headline text-xl font-extrabold text-primary tracking-tight">Expenses</h1>
        </div>
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg">
          <Wallet className="w-5 h-5" />
        </div>
      </header>

      <main className="px-6 space-y-8 mt-6">
        {/* Budget Status Card */}
        <section className="bg-white rounded-[2.5rem] p-8 shadow-[0_20px_60px_rgba(0,50,125,0.1)] border border-blue-50/50">
          <div className="flex justify-between items-start mb-6">
            <div>
              <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2 block">TRIP BUDGET STATUS</span>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-headline font-extrabold text-primary tracking-tight">₹{totalSpent.toLocaleString()}</span>
                <span className="text-on-surface-variant font-sans text-sm font-medium">/ ₹{totalBudget.toLocaleString()}</span>
              </div>
            </div>
            <div className="bg-blue-100/60 text-primary px-4 py-2 rounded-full text-[10px] font-extrabold tracking-wider">
              {spentPercentage}% SPENT
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-3 bg-surface-container rounded-full overflow-hidden mb-8">
            <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${spentPercentage}%` }} />
          </div>

          {/* Stats Grid */}
          <div className="w-full">
            <div className="bg-surface-container-low p-6 rounded-[2rem] flex flex-col items-center justify-center text-center w-full">
              <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">REMAINING BUDGET</span>
              <p className="text-3xl font-headline font-extrabold text-primary">₹{remaining.toLocaleString()}</p>
            </div>
          </div>
        </section>

        {/* Filters */}
        <div className="flex gap-3">
          <button 
            onClick={() => setFilter('all')}
            className={cn(
              "flex-1 py-3 rounded-full font-headline font-bold text-sm transition-all",
              filter === 'all' ? "bg-primary text-white shadow-lg" : "bg-surface-container-low text-on-surface-variant"
            )}
          >
            All Expenses
          </button>
          <button 
            onClick={() => setFilter('me')}
            className={cn(
              "flex-1 py-3 rounded-full font-headline font-bold text-sm transition-all",
              filter === 'me' ? "bg-primary text-white shadow-lg" : "bg-surface-container-low text-on-surface-variant"
            )}
          >
            Me Only
          </button>
          <button 
            onClick={() => setFilter('shared')}
            className={cn(
              "flex-1 py-3 rounded-full font-headline font-bold text-sm transition-all",
              filter === 'shared' ? "bg-primary text-white shadow-lg" : "bg-surface-container-low text-on-surface-variant"
            )}
          >
            Shared
          </button>
        </div>

        {/* Recent Activity */}
        <section>
          <h2 className="font-headline text-2xl font-bold text-primary mb-6">Recent Activity</h2>
          <div className="space-y-4">
            {recentExpenses.length > 0 ? recentExpenses.map((expense) => {
              const Icon = getCategoryIcon(expense.category);
              return (
                <motion.div 
                  key={expense.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white p-5 rounded-[2rem] flex items-center justify-between shadow-sm border border-outline-variant/5"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-50/80 flex items-center justify-center text-primary">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-headline font-bold text-primary text-sm">{expense.description}</h3>
                      <p className="text-[10px] text-on-surface-variant font-medium">
                        {expense.date} • {expense.category}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="font-headline font-extrabold text-primary">₹{expense.amount.toLocaleString()}</span>
                    {expense.paidBy === 'You' ? (
                      <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-[8px] font-bold text-white">
                        ME
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-[8px] font-bold text-white">
                        {expense.paidBy.substring(0, 2).toUpperCase()}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            }) : (
              <div className="text-center py-10 text-on-surface-variant font-medium">
                No expenses found.
              </div>
            )}
          </div>
        </section>
      </main>

      {/* FAB */}
      <button 
        onClick={() => setScreen('add-expense')}
        className="fixed bottom-28 right-6 w-16 h-16 rounded-2xl bg-primary text-white shadow-2xl flex items-center justify-center z-50 active:scale-95 transition-transform"
      >
        <Plus className="w-8 h-8" />
      </button>

      <BottomNav />
    </div>
  );
};
