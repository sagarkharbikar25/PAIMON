import React from 'react';
import { useApp } from '../AppContext';
import { 
  ArrowLeft, 
  TrendingUp, 
  TrendingDown, 
  PieChart, 
  BarChart3, 
  Calendar,
  Download,
  Share2
} from 'lucide-react';
import { cn } from '../lib/utils';
import { BottomNav } from './Navigation';

export const Reports = () => {
  const { setScreen, activeTrip, expenses } = useApp();

  if (!activeTrip) return null;

  const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const budget = activeTrip.budget || 5000;
  const remaining = budget - totalSpent;
  const percentage = Math.min(100, (totalSpent / budget) * 100);

  const categories = [
    { name: 'Food', amount: 1200, color: 'bg-amber-500' },
    { name: 'Transport', amount: 850, color: 'bg-blue-500' },
    { name: 'Stay', amount: 2100, color: 'bg-emerald-500' },
    { name: 'Shopping', amount: 450, color: 'bg-rose-500' }
  ];

  return (
    <div className="bg-background min-h-screen pb-20">
      {/* Header */}
      <header className="px-6 py-6 flex items-center justify-between sticky top-0 bg-white/70 backdrop-blur-xl z-50 border-b border-outline-variant/10">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setScreen('dashboard')}
            className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center text-primary"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-headline text-xl font-bold text-primary">Trip Analytics</h1>
        </div>
        <div className="flex gap-2">
          <button className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center text-primary">
            <Share2 className="w-5 h-5" />
          </button>
          <button className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white">
            <Download className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="p-6 space-y-8">
        {/* Summary Card */}
        <section className="bg-primary rounded-[2.5rem] p-8 text-white shadow-xl shadow-primary/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
          <div className="relative z-10">
            <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-2">Total Budget Spent</p>
            <h2 className="text-4xl font-headline font-black mb-6">${totalSpent.toLocaleString()}</h2>
            
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span>Progress</span>
                <span>{percentage.toFixed(1)}%</span>
              </div>
              <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-white rounded-full" style={{ width: `${percentage}%` }} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-white/10">
              <div>
                <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest mb-1">Remaining</p>
                <p className="text-lg font-headline font-bold">${remaining.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest mb-1">Daily Avg</p>
                <p className="text-lg font-headline font-bold">${(totalSpent / 7).toFixed(0)}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Category Breakdown */}
        <section className="space-y-4">
          <h3 className="font-headline text-xl font-bold text-primary px-2">Spending by Category</h3>
          <div className="bg-surface-container-lowest rounded-[2.5rem] p-6 border border-outline-variant/10 shadow-sm space-y-6">
            {categories.map((cat) => (
              <div key={cat.name} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className={cn("w-3 h-3 rounded-full", cat.color)} />
                    <span className="text-sm font-bold text-primary">{cat.name}</span>
                  </div>
                  <span className="text-sm font-headline font-bold text-primary">${cat.amount}</span>
                </div>
                <div className="w-full h-1.5 bg-surface-container-low rounded-full overflow-hidden">
                  <div className={cn("h-full rounded-full", cat.color)} style={{ width: `${(cat.amount / totalSpent) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Insights */}
        <section className="space-y-4">
          <h3 className="font-headline text-xl font-bold text-primary px-2">Smart Insights</h3>
          <div className="grid grid-cols-1 gap-4">
            <div className="bg-emerald-50 p-6 rounded-[2rem] border border-emerald-100 flex gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center flex-shrink-0">
                <TrendingDown className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-headline font-bold text-emerald-900">Under Budget</h4>
                <p className="text-xs text-emerald-700 mt-1">Your stay expenses are 15% lower than similar trips to this destination. Great job!</p>
              </div>
            </div>
            <div className="bg-rose-50 p-6 rounded-[2rem] border border-rose-100 flex gap-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-500 text-white flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-headline font-bold text-rose-900">Food Alert</h4>
                <p className="text-xs text-rose-700 mt-1">You've spent 80% of your food budget in just 3 days. Consider dining at local markets.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <BottomNav />
    </div>
  );
};
