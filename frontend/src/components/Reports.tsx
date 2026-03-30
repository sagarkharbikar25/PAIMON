import React, { useState, useEffect } from 'react';
import { useApp } from '../AppContext';
import { ArrowLeft, TrendingUp, TrendingDown, Download, Share2, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { BottomNav } from './Navigation';
import { apiFetch } from '../services/api';

// ✅ Add interface for expense type
interface Expense {
  _id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
}

export const Reports = () => {
  const { setScreen, activeTrip } = useApp();
  
  // ✅ FIXED: Add local state
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (!activeTrip) return;

      try {
        setLoading(true);
        const tripId = activeTrip._id || activeTrip.id;
        
        const [expensesData, summaryData] = await Promise.all([
          apiFetch(`/expenses/${tripId}`),
          apiFetch(`/expenses/${tripId}/summary`)
        ]);

        // ✅ FIXED: Now setExpenses exists
        setExpenses(expensesData.expenses || []);
        setSummary(summaryData);
      } catch (err) {
        console.error('Failed to fetch reports data');
        setError('Failed to load reports');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTrip]);

  if (!activeTrip) return null;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const budget = activeTrip.budget || 5000;
  const remaining = budget - totalSpent;
  const percentage = Math.min(100, (totalSpent / budget) * 100);

  // Calculate categories from expenses
  const categories = expenses.reduce((acc: any[], exp) => {
    const existing = acc.find(c => c.name === exp.category);
    if (existing) {
      existing.amount += exp.amount;
    } else {
      acc.push({
        name: exp.category,
        amount: exp.amount,
        color: getCategoryColor(exp.category)
      });
    }
    return acc;
  }, []);

  return (
    <div className="bg-background min-h-screen pb-20">
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
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl text-sm">
            {error}
          </div>
        )}

        {/* Summary Card */}
        <section className="bg-primary rounded-[2.5rem] p-8 text-white shadow-xl shadow-primary/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
          <div className="relative z-10">
            <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-2">Total Budget Spent</p>
            <h2 className="text-4xl font-headline font-black mb-6">₹{totalSpent.toLocaleString()}</h2>
            
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
                <p className="text-lg font-headline font-bold">₹{remaining.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest mb-1">Daily Avg</p>
                <p className="text-lg font-headline font-bold">₹{(totalSpent / 7).toFixed(0)}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Category Breakdown */}
        <section className="space-y-4">
          <h3 className="font-headline text-xl font-bold text-primary px-2">Spending by Category</h3>
          <div className="bg-surface-container-lowest rounded-[2.5rem] p-6 border border-outline-variant/10 shadow-sm space-y-6">
            {categories.length > 0 ? (
              categories.map((cat: any) => (
                <div key={cat.name} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className={cn("w-3 h-3 rounded-full", cat.color)} />
                      <span className="text-sm font-bold text-primary">{cat.name}</span>
                    </div>
                    <span className="text-sm font-headline font-bold text-primary">₹{cat.amount}</span>
                  </div>
                  <div className="w-full h-1.5 bg-surface-container-low rounded-full overflow-hidden">
                    <div className={cn("h-full rounded-full", cat.color)} style={{ width: `${(cat.amount / totalSpent) * 100}%` }} />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-8">No expenses recorded yet</p>
            )}
          </div>
        </section>

        {/* Settlement Summary */}
        {summary && summary.settlements && summary.settlements.length > 0 && (
          <section className="space-y-4">
            <h3 className="font-headline text-xl font-bold text-primary px-2">Who Owes Whom</h3>
            <div className="space-y-3">
              {summary.settlements.map((settlement: any, idx: number) => (
                <div key={idx} className="bg-white p-5 rounded-2xl border border-outline-variant/10 shadow-sm">
                  <p className="text-sm font-medium text-gray-700">
                    <span className="font-bold text-primary">{settlement.from}</span> owes{' '}
                    <span className="font-bold text-primary">{settlement.to}</span>
                  </p>
                  <p className="text-2xl font-headline font-bold text-primary mt-2">
                    ₹{settlement.amount.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
      <BottomNav />
    </div>
  );
};

// Helper function
function getCategoryColor(category: string) {
  const colors: Record<string, string> = {
    'Food': 'bg-amber-500',
    'Transport': 'bg-blue-500',
    'Stay': 'bg-emerald-500',
    'Shopping': 'bg-rose-500',
    'Activities': 'bg-purple-500',
    'Other': 'bg-gray-500'
  };
  return colors[category] || 'bg-gray-500';
}