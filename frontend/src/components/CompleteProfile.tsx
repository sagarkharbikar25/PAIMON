/* =============================================
   src/components/CompleteProfile.tsx
   Pravas — Complete Profile (connected to backend)
   ============================================= */

import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { useApp } from '../AppContext';
import {
  ArrowLeft,
  Camera,
  Calendar as CalendarIcon,
  ChevronDown,
  ShieldCheck,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';
import { cn } from '../lib/utils';
import { updateProfile } from '../services/authService';

const countryCodes: Record<string, string> = {
  'United States': '+1',
  'India':         '+91',
  'United Kingdom':'+44',
  'Canada':        '+1',
  'Australia':     '+61',
};

export const CompleteProfile = () => {
  const { setScreen, setUserProfile } = useApp();
  const dateInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    fullName: '',
    age:      '',
    dob:      '',
    mobile:   '',
    country:  'India',
    state:    '',
    image:    '',
  });

  const [errors,    setErrors]    = useState<Record<string, boolean>>({});
  const [apiError,  setApiError]  = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    const newErrors: Record<string, boolean> = {};
    let hasError = false;

    const requiredFields = ['fullName', 'age', 'dob', 'mobile', 'country', 'state'];
    requiredFields.forEach(key => {
      if (!(formData[key as keyof typeof formData] as string).trim()) {
        newErrors[key] = true;
        hasError = true;
      }
    });

    if (hasError) { setErrors(newErrors); return; }

    setIsLoading(true);
    setApiError('');

    try {
      await updateProfile({
        name:        formData.fullName,
        mobile:      formData.mobile,
        dateOfBirth: formData.dob,
        age:         parseInt(formData.age),
        country:     formData.country,
        state:       formData.state,
      });

      setUserProfile(formData);
      setScreen('dashboard');
    } catch (err) {
      setApiError((err as Error).message || 'Failed to save profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => { const e = { ...prev }; delete e[field]; return e; });
    }
  };

  return (
    <main className="min-h-screen bg-white flex flex-col">
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleImageChange}
      />

      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between sticky top-0 bg-white z-10 border-b border-gray-50">
        <button onClick={() => setScreen('auth')} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6 text-primary" />
        </button>
        <h1 className="font-headline font-bold text-primary text-lg">Complete Profile</h1>
        <div className="w-10" />
      </header>

      <div className="flex-1 overflow-y-auto px-6 py-8 pb-32 max-w-xl mx-auto w-full">
        <div className="text-center mb-10">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-headline text-3xl font-extrabold text-primary mb-3"
          >
            Build Your Identity
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-on-surface-variant font-medium leading-relaxed"
          >
            Share your details to unlock a personalized concierge experience.
          </motion.p>
        </div>

        {/* Profile Image */}
        <div className="flex justify-center mb-12">
          <div className="relative">
            <div
              className="w-32 h-32 rounded-full bg-surface-container-low flex items-center justify-center border-4 border-white shadow-sm overflow-hidden cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              {formData.image ? (
                <img src={formData.image} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-16 h-16 text-gray-300">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </div>
              )}
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-1 right-1 w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white shadow-lg border-2 border-white active:scale-90 transition-transform"
            >
              <Camera className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* API Error */}
        {apiError && (
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-error-container text-on-error-container text-sm font-medium mb-6">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{apiError}</span>
          </div>
        )}

        {/* Form */}
        <div className="space-y-6 bg-surface-container-lowest/30 p-8 rounded-[2.5rem] border border-gray-50">

          {/* Full Name */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-primary px-1">Full Name</label>
            <input
              type="text"
              value={formData.fullName}
              onChange={e => handleChange('fullName', e.target.value)}
              placeholder="Johnathan Doe"
              className={cn(
                'w-full py-4 px-5 rounded-2xl bg-surface-container-low border-none focus:ring-2 focus:ring-primary/20 transition-all font-medium placeholder:text-gray-300',
                errors.fullName && 'ring-2 ring-red-500/20 bg-red-50/30'
              )}
            />
          </div>

          {/* Age */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-primary px-1">Age</label>
            <input
              type="number"
              value={formData.age}
              onChange={e => handleChange('age', e.target.value)}
              placeholder="28"
              className={cn(
                'w-full py-4 px-5 rounded-2xl bg-surface-container-low border-none focus:ring-2 focus:ring-primary/20 transition-all font-medium placeholder:text-gray-300',
                errors.age && 'ring-2 ring-red-500/20 bg-red-50/30'
              )}
            />
          </div>

          {/* Date of Birth */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-primary px-1">Date of Birth</label>
            <div className="relative">
              <input
                ref={dateInputRef}
                type="date"
                value={formData.dob}
                onChange={e => handleChange('dob', e.target.value)}
                className={cn(
                  'w-full py-4 px-5 rounded-2xl bg-surface-container-low border-none focus:ring-2 focus:ring-primary/20 transition-all font-medium',
                  errors.dob && 'ring-2 ring-red-500/20 bg-red-50/30'
                )}
              />
              <CalendarIcon
                className="absolute right-5 top-1/2 -translate-y-1/2 text-on-surface-variant w-5 h-5 cursor-pointer"
                onClick={() => {
                  if (dateInputRef.current && 'showPicker' in dateInputRef.current) {
                    try { (dateInputRef.current as HTMLInputElement & { showPicker: () => void }).showPicker(); }
                    catch { dateInputRef.current.focus(); }
                  } else { dateInputRef.current?.focus(); }
                }}
              />
            </div>
          </div>

          {/* Mobile */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-primary px-1">Mobile Number</label>
            <div className="flex gap-3">
              <div className="w-16 py-4 px-3 rounded-2xl bg-surface-container-low flex items-center justify-center font-bold text-primary">
                {countryCodes[formData.country] || '+91'}
              </div>
              <input
                type="tel"
                value={formData.mobile}
                onChange={e => handleChange('mobile', e.target.value)}
                placeholder="9876543210"
                className={cn(
                  'flex-1 py-4 px-5 rounded-2xl bg-surface-container-low border-none focus:ring-2 focus:ring-primary/20 transition-all font-medium placeholder:text-gray-300',
                  errors.mobile && 'ring-2 ring-red-500/20 bg-red-50/30'
                )}
              />
            </div>
          </div>

          {/* Country */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-primary px-1">Country</label>
            <div className="relative">
              <select
                value={formData.country}
                onChange={e => handleChange('country', e.target.value)}
                className="w-full py-4 px-5 rounded-2xl bg-surface-container-low border-none focus:ring-2 focus:ring-primary/20 transition-all font-medium appearance-none"
              >
                <option>India</option>
                <option>United States</option>
                <option>United Kingdom</option>
                <option>Canada</option>
                <option>Australia</option>
              </select>
              <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-on-surface-variant w-5 h-5 pointer-events-none" />
            </div>
          </div>

          {/* State */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-primary px-1">State / Region</label>
            <input
              type="text"
              value={formData.state}
              onChange={e => handleChange('state', e.target.value)}
              placeholder="Haryana"
              className={cn(
                'w-full py-4 px-5 rounded-2xl bg-surface-container-low border-none focus:ring-2 focus:ring-primary/20 transition-all font-medium placeholder:text-gray-300',
                errors.state && 'ring-2 ring-red-500/20 bg-red-50/30'
              )}
            />
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-12 flex gap-4 items-start bg-blue-50/50 p-5 rounded-3xl">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-xs text-blue-800/70 font-medium leading-relaxed">
            Your data is encrypted and used only to enhance your booking experience. We never share your details without consent.
          </p>
        </div>
      </div>

      {/* Footer Button */}
      <div className="fixed bottom-0 left-0 w-full p-6 bg-white/80 backdrop-blur-xl border-t border-gray-50 flex justify-center">
        <button
          onClick={handleSave}
          disabled={isLoading}
          className="w-full max-w-xl py-4 rounded-2xl primary-gradient text-white font-bold text-lg shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-3 group disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
          ) : (
            <>
              <span>Save Profile</span>
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </>
          )}
        </button>
      </div>
    </main>
  );
};