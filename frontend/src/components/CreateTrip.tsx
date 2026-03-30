import React, { useState, useRef } from 'react';
import { useApp } from '../AppContext';
import { ArrowLeft, MapPin, Calendar as CalendarIcon, Users, Wallet, Camera, Plus, ArrowRight, UserPlus, X, Share2, Mail, MessageCircle, Loader2 } from 'lucide-react';
import { BottomNav } from './Navigation';
import { cn } from '../lib/utils';
import apiFetch from '../services/api';

export const CreateTrip = () => {
  const { setScreen, addTrip } = useApp();
  const [step, setStep] = useState(1);
  const [tripName, setTripName] = useState('');
  const [destination, setDestination] = useState('');
  const [budget, setBudget] = useState('');
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [travelerType, setTravelerType] = useState<'solo' | 'group'>('solo');
  const [groupMembers, setGroupMembers] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const startDateRef = useRef<HTMLInputElement>(null);
  const endDateRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setCoverImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const addMember = () => { if (groupMembers.length < 10) setGroupMembers([...groupMembers, '']); };
  const updateMember = (i: number, v: string) => { const m = [...groupMembers]; m[i] = v; setGroupMembers(m); };
  const removeMember = (i: number) => setGroupMembers(groupMembers.filter((_, idx) => idx !== i));

  const handleShare = async (platform?: 'whatsapp' | 'email') => {
    const text = `Join my trip: ${tripName || 'New Adventure'} to ${destination}!`;
    if (platform === 'whatsapp') window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    else if (platform === 'email') window.open(`mailto:?subject=${encodeURIComponent(tripName)}&body=${encodeURIComponent(text)}`, '_blank');
    else { navigator.clipboard.writeText(text); alert('Copied!'); }
  };

  const handleCreate = async () => {
    setLoading(true);
    setError('');
    try {
      const data: any = await apiFetch('/trips', {
        method: 'POST',
        body: JSON.stringify({
          title: tripName || 'New Adventure',
          destination: destination || 'Unknown',
          startDate: startDateRef.current?.value || new Date().toISOString(),
          endDate: endDateRef.current?.value || new Date().toISOString(),
          budget: parseFloat(budget) || 0,
          currency: 'INR',
          image: coverImage || 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=1000',
        }),
      });
      // Also update local context so dashboard refreshes
      addTrip({
        id: data.trip?._id || Math.random().toString(36).substr(2, 9),
        name: tripName || 'New Adventure',
        location: destination,
        startDate: startDateRef.current?.value || '',
        endDate: endDateRef.current?.value || '',
        budget: parseFloat(budget) || 0,
        spent: 0,
        image: coverImage || 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=1000',
        status: 'upcoming',
      });
      setScreen('dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to create trip');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background min-h-screen pb-32">
      <header className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl px-6 py-6 border-b border-outline-variant/10">
        <div className="flex items-center justify-between">
          <button onClick={() => step > 1 ? setStep(step - 1) : setScreen('dashboard')} className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center text-primary">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-headline text-xl font-bold text-primary">Plan Expedition</h1>
          <div className="w-10" />
        </div>
      </header>

      <main className="pt-28 px-6 space-y-10">
        <div className="space-y-2">
          <div className="flex justify-between items-end">
            <h2 className="font-headline text-3xl font-extrabold text-primary">Where to?</h2>
            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Step {step} of 3</span>
          </div>
          <div className="w-full h-1.5 bg-surface-container rounded-full overflow-hidden">
            <div className="h-full bg-primary transition-all duration-500" style={{ width: `${(step / 3) * 100}%` }} />
          </div>
        </div>

        {error && <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-red-700 text-sm font-medium">{error}</div>}

        {step === 1 && (
          <div className="space-y-8">
            <div className="space-y-4">
              <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest px-1">Destination</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-outline w-5 h-5" />
                <input type="text" value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="Enter city or country" className="w-full py-5 pl-12 pr-5 rounded-2xl bg-surface-container-low border-none font-headline font-bold text-lg focus:ring-2 focus:ring-primary/20" />
              </div>
            </div>
            <div className="space-y-4">
              <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest px-1">Trip Name</label>
              <input type="text" value={tripName} onChange={(e) => setTripName(e.target.value)} placeholder="E.g. Summer in Paris" className="w-full py-5 px-6 rounded-2xl bg-surface-container-low border-none font-headline font-bold text-lg focus:ring-2 focus:ring-primary/20" />
            </div>
            <div className="space-y-4">
              <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest px-1">Cover Image</label>
              <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
              <div onClick={() => fileInputRef.current?.click()} className="aspect-video rounded-[2.5rem] bg-surface-container-low border-2 border-dashed border-outline-variant/30 flex flex-col items-center justify-center gap-3 text-on-surface-variant group hover:bg-surface-container transition-colors cursor-pointer overflow-hidden relative">
                {coverImage ? (
                  <><img src={coverImage} alt="Cover" className="w-full h-full object-cover" /><div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><Camera className="w-10 h-10 text-white" /></div></>
                ) : (
                  <><Camera className="w-10 h-10 group-hover:scale-110 transition-transform" /><p className="font-headline font-bold text-sm">Browse Trip Image</p></>
                )}
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8">
            <div className="space-y-4">
              <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest px-1">Dates</label>
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-outline w-4 h-4 z-10" />
                  <input ref={startDateRef} type="date" className="w-full py-4 pl-10 pr-4 rounded-xl bg-surface-container-low border-none font-bold text-sm focus:ring-2 focus:ring-primary/20" />
                </div>
                <div className="relative">
                  <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-outline w-4 h-4 z-10" />
                  <input ref={endDateRef} type="date" className="w-full py-4 pl-10 pr-4 rounded-xl bg-surface-container-low border-none font-bold text-sm focus:ring-2 focus:ring-primary/20" />
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest px-1">Travelers</label>
              <div className="flex p-1 bg-surface-container-low rounded-2xl">
                <button onClick={() => setTravelerType('solo')} className={cn("flex-1 py-4 rounded-xl font-headline font-bold text-sm transition-all", travelerType === 'solo' ? "bg-primary text-white shadow-md" : "text-on-surface-variant")}>Solo</button>
                <button onClick={() => setTravelerType('group')} className={cn("flex-1 py-4 rounded-xl font-headline font-bold text-sm transition-all", travelerType === 'group' ? "bg-primary text-white shadow-md" : "text-on-surface-variant")}>Group</button>
              </div>
              {travelerType === 'group' && (
                <div className="space-y-4 mt-6">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-xs font-bold text-primary">Group Members ({groupMembers.length}/10)</span>
                    {groupMembers.length < 10 && <button onClick={addMember} className="text-primary flex items-center gap-1 text-xs font-bold"><Plus className="w-4 h-4" /> Add Member</button>}
                  </div>
                  <div className="space-y-3">
                    {groupMembers.map((member, idx) => (
                      <div key={idx} className="flex gap-2">
                        <div className="relative flex-grow">
                          <UserPlus className="absolute left-4 top-1/2 -translate-y-1/2 text-outline w-4 h-4" />
                          <input type="text" value={member} onChange={(e) => updateMember(idx, e.target.value)} placeholder={`Member ${idx + 1} Name`} className="w-full py-3 pl-10 pr-4 rounded-xl bg-surface-container-low border-none font-bold text-sm focus:ring-2 focus:ring-primary/20" />
                        </div>
                        <button onClick={() => removeMember(idx)} className="w-11 h-11 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center flex-shrink-0"><X className="w-4 h-4" /></button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-8">
            <div className="space-y-4">
              <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest px-1">Budget (Estimated)</label>
              <div className="relative">
                <Wallet className="absolute left-4 top-1/2 -translate-y-1/2 text-outline w-5 h-5" />
                <input type="number" value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="₹ 0.00" className="w-full py-5 pl-12 pr-5 rounded-2xl bg-surface-container-low border-none font-headline font-bold text-2xl focus:ring-2 focus:ring-primary/20" />
              </div>
            </div>
            <div className="bg-primary/5 p-8 rounded-[2.5rem] border border-primary/10 space-y-6">
              <div className="space-y-2">
                <h4 className="font-headline font-bold text-primary flex items-center gap-2"><Users className="w-5 h-5" />Collaborators</h4>
                <p className="text-xs text-on-surface-variant font-medium leading-relaxed">Invite friends to plan this trip together.</p>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <button onClick={() => handleShare('whatsapp')} className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white border border-outline-variant/10 hover:bg-emerald-50 transition-all group">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center"><MessageCircle className="w-5 h-5" /></div>
                  <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest">WhatsApp</span>
                </button>
                <button onClick={() => handleShare('email')} className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white border border-outline-variant/10 hover:bg-blue-50 transition-all group">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center"><Mail className="w-5 h-5" /></div>
                  <span className="text-[10px] font-bold text-blue-700 uppercase tracking-widest">Email</span>
                </button>
                <button onClick={() => handleShare()} className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white border border-outline-variant/10 hover:bg-primary/5 transition-all group">
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center"><Share2 className="w-5 h-5" /></div>
                  <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Social</span>
                </button>
              </div>
            </div>
          </div>
        )}

        <button onClick={() => step < 3 ? setStep(step + 1) : handleCreate()} disabled={loading} className="w-full py-5 rounded-2xl primary-gradient text-white font-headline font-bold text-lg shadow-lg flex items-center justify-center gap-3 active:scale-95 transition-all group disabled:opacity-70">
          {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <><span>{step === 3 ? 'Create Expedition' : 'Continue'}</span><ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-1" /></>}
        </button>
      </main>
      <BottomNav />
    </div>
  );
};