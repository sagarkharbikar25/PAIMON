import React, { useState, useRef } from 'react';
import { useApp } from '../AppContext';
import { 
  ArrowLeft, 
  Tag, 
  Calendar as CalendarIcon, 
  Users, 
  Plus,
  IndianRupee,
  Check
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

export const AddExpense = () => {
  const { setScreen, addExpense, activeTrip } = useApp();
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Dining');
  const [paidBy, setPaidBy] = useState('You');
  const [splitMethod, setSplitMethod] = useState('Equally');

  const friends = ['You', 'Aarav', 'Ishaan', 'Saanvi'];
  const splitMethods = ['Equally', 'Specific'];
  const [selectedFriends, setSelectedFriends] = useState<string[]>(['You', 'Aarav', 'Ishaan', 'Saanvi']);
  const [specificAmounts, setSpecificAmounts] = useState<Record<string, string>>({});
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const dateInputRef = useRef<HTMLInputElement>(null);

  const handleAdd = () => {
    if (!amount || !activeTrip) return;
    
    let splitWith: string[] = [];
    if (splitMethod === 'Equally') {
      splitWith = selectedFriends.filter(f => f !== paidBy);
    } else if (splitMethod === 'Specific') {
      splitWith = Object.entries(specificAmounts)
        .filter(([name, amt]: [string, string]) => name !== paidBy && parseFloat(amt) > 0)
        .map(([name]) => name);
    }

    addExpense({
      id: Date.now().toString(), // Better ID for sorting
      tripId: activeTrip.id,
      amount: parseFloat(amount),
      description: description || 'Untitled Expense',
      category,
      date: date === new Date().toISOString().split('T')[0] ? 'Today' : date,
      paidBy,
      splitWith
    });
    setScreen('expenses');
  };

  const categories = [
    { name: 'Dining', icon: '🍽️' },
    { name: 'Transport', icon: '🚗' },
    { name: 'Shopping', icon: '🛍️' },
    { name: 'Sights', icon: '🏛️' },
    { name: 'Hotel', icon: '🏨' }
  ];

  const toggleFriend = (friend: string) => {
    if (selectedFriends.includes(friend)) {
      if (selectedFriends.length > 1) {
        setSelectedFriends(selectedFriends.filter(f => f !== friend));
      }
    } else {
      setSelectedFriends([...selectedFriends, friend]);
    }
  };

  return (
    <div className="bg-background min-h-screen pb-12">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl px-6 py-6 flex items-center justify-between border-b border-outline-variant/5">
        <button 
          onClick={() => setScreen('expenses')}
          className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center text-primary active:scale-90 transition-transform"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="font-headline text-xl font-extrabold text-primary tracking-tight">Add Expense</h1>
        <div className="w-10" />
      </header>

      <main className="pt-28 px-6 space-y-8">
        {/* Amount Input Section */}
        <div className="flex flex-col items-center py-6">
          <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-4">AMOUNT SPENT</span>
          <div className="flex items-center gap-2">
            <IndianRupee className="w-8 h-8 text-primary/40" />
            <input 
              type="number" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00" 
              className="bg-transparent border-none font-headline font-extrabold text-6xl text-primary placeholder:text-outline/20 w-full max-w-[280px] text-center focus:ring-0"
              autoFocus
            />
          </div>
        </div>

        {/* Details Form */}
        <div className="space-y-6">
          {/* Description */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest px-1">DESCRIPTION</label>
            <div className="relative group">
              <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-outline w-5 h-5 group-focus-within:text-primary transition-colors" />
              <input 
                type="text" 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="E.g. Dinner at Gion" 
                className="w-full py-4 pl-12 pr-5 rounded-2xl bg-white border border-outline-variant/10 shadow-sm font-medium focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
          </div>

          {/* Category Chips */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest px-1">CATEGORY</label>
            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 px-1">
              {categories.map(cat => (
                <button 
                  key={cat.name}
                  onClick={() => setCategory(cat.name)}
                  className={cn(
                    "px-5 py-3 rounded-xl font-headline font-bold text-xs whitespace-nowrap transition-all flex items-center gap-2",
                    category === cat.name 
                      ? "bg-primary text-white shadow-lg scale-105" 
                      : "bg-white text-on-surface-variant border border-outline-variant/10"
                  )}
                >
                  <span>{cat.icon}</span>
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Date and Paid By */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest px-1">DATE</label>
              <div className="relative">
                <button 
                  type="button"
                  onClick={() => dateInputRef.current?.showPicker?.() || dateInputRef.current?.click()}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-outline w-4 h-4 z-10 hover:text-primary transition-colors"
                >
                  <CalendarIcon className="w-full h-full" />
                </button>
                <input 
                  ref={dateInputRef}
                  type="date" 
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full py-4 pl-10 pr-4 rounded-2xl bg-white border border-outline-variant/10 shadow-sm font-bold text-sm focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest px-1">PAID BY</label>
              <div className="relative">
                <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-outline w-4 h-4" />
                <select 
                  value={paidBy}
                  onChange={(e) => setPaidBy(e.target.value)}
                  className="w-full py-4 pl-10 pr-4 rounded-2xl bg-white border border-outline-variant/10 shadow-sm font-bold text-sm appearance-none focus:ring-2 focus:ring-primary/20"
                >
                  {friends.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Split Method */}
          <div className="space-y-3">
            <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest px-1">SPLIT METHOD</label>
            <div className="bg-white p-2 rounded-2xl border border-outline-variant/10 shadow-sm flex gap-1">
              {splitMethods.map(method => (
                <button
                  key={method}
                  onClick={() => setSplitMethod(method)}
                  className={cn(
                    "flex-1 py-3 rounded-xl text-xs font-bold transition-all",
                    splitMethod === method 
                      ? "bg-primary text-white shadow-md" 
                      : "text-on-surface-variant hover:bg-surface-container-low"
                  )}
                >
                  {method}
                </button>
              ))}
            </div>
            
            {splitMethod === 'Equally' && (
              <div className="space-y-2 mt-4 px-1">
                {friends.map(friend => (
                  <button
                    key={friend}
                    onClick={() => toggleFriend(friend)}
                    className={cn(
                      "w-full px-5 py-4 rounded-2xl text-sm font-bold transition-all border flex items-center justify-between",
                      selectedFriends.includes(friend)
                        ? "bg-primary/5 border-primary text-primary shadow-sm"
                        : "bg-white border-outline-variant/10 text-on-surface-variant"
                    )}
                  >
                    <span>{friend}</span>
                    {selectedFriends.includes(friend) && <Check className="w-4 h-4" />}
                  </button>
                ))}
              </div>
            )}

            {splitMethod === 'Specific' && (
              <div className="space-y-3 mt-4 px-1">
                {friends.map(friend => (
                  <div key={friend} className="flex items-center gap-3 bg-white p-4 rounded-2xl border border-outline-variant/10 shadow-sm">
                    <span className="flex-1 font-bold text-sm text-primary">{friend}</span>
                    <div className="flex items-center gap-2 bg-surface-container-low px-3 py-2 rounded-xl border border-outline-variant/5">
                      <span className="text-xs font-bold text-on-surface-variant">₹</span>
                      <input 
                        type="number"
                        value={specificAmounts[friend] || ''}
                        onChange={(e) => setSpecificAmounts({...specificAmounts, [friend]: e.target.value})}
                        placeholder="0"
                        className="bg-transparent border-none w-20 text-right font-bold text-sm focus:ring-0 p-0"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Save Button */}
        <motion.button 
          whileTap={{ scale: 0.98 }}
          onClick={handleAdd}
          className="w-full py-5 rounded-[2rem] bg-primary text-white font-headline font-extrabold text-lg shadow-[0_20px_40px_rgba(0,50,125,0.2)] flex items-center justify-center gap-3 mt-4"
        >
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <Check className="w-5 h-5" />
          </div>
          <span>Save Expense</span>
        </motion.button>
      </main>
    </div>
  );
};
