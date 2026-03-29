/* =============================================
   src/components/Auth.tsx
   Pravas — Auth Screen (connected to backend)
   ============================================= */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useApp } from '../AppContext';
import { Compass, Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react';
import { login, register } from '../services/authService';

/* ── Firebase error code → friendly message ─ */
function friendlyError(message: string): string {
  if (message.includes('already exists'))      return 'An account with this email already exists.';
  if (message.includes('Incorrect email'))      return 'Incorrect email or password.';
  if (message.includes('required'))            return 'Please fill in all fields.';
  if (message.includes('8 characters'))        return 'Password must be at least 8 characters.';
  if (message.includes('Network'))             return 'Network error. Is the backend running?';
  return message || 'Something went wrong. Please try again.';
}

export const Auth = () => {
  const { setScreen, setUserProfile } = useApp();
  const [isLogin, setIsLogin]           = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading]       = useState(false);
  const [error, setError]               = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    /* Basic client-side validation */
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields.');
      return;
    }
    if (!isLogin && !formData.name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!isLogin && formData.password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setIsLoading(true);
    try {
      if (isLogin) {
        const user = await login(formData.email, formData.password);
        /* Populate app context with backend user */
        setUserProfile({
          fullName: user.name,
          age: '',
          dob: '',
          mobile: '',
          country: '',
          state: '',
          image: user.photoUrl || '',
        });
        setScreen('dashboard');
      } else {
        const user = await register(formData.name, formData.email, formData.password);
        setUserProfile({
          fullName: user.name,
          age: '',
          dob: '',
          mobile: '',
          country: '',
          state: '',
          image: user.photoUrl || '',
        });
        /* Go to complete profile after registration */
        setScreen('complete-profile');
      }
    } catch (err) {
      setError(friendlyError((err as Error).message));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4 md:p-8 lg:p-12 overflow-hidden relative bg-background">
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute -bottom-32 -right-32 w-[32rem] h-[32rem] bg-secondary-container/30 rounded-full blur-3xl" />

      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center relative z-10">

        {/* Left Side: Editorial */}
        <div className="hidden lg:flex flex-col justify-center space-y-8 pr-12">
          <div className="space-y-4">
            <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-secondary-container text-on-secondary-container text-xs font-semibold tracking-wider uppercase">
              Premium Travel Experience
            </span>
            <h1 className="font-headline text-5xl xl:text-6xl font-extrabold text-primary tracking-tighter leading-[1.1]">
              Explore the <br />
              <span className="text-tertiary">Extraordinary.</span>
            </h1>
            <p className="text-on-surface-variant text-lg max-w-md font-medium leading-relaxed">
              Join प्रvaas and unlock a world of curated journeys, seamless planning, and elite concierge services.
            </p>
          </div>
          <div className="relative group overflow-hidden rounded-[2rem] shadow-2xl aspect-[4/3]">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDf4wjoVR1uT6cESO_wtHubfB9OITUzhJBAZ0CCyAphh-dCcvD6faQJQLS7Et72ZBhvGp3LGEXv4ZyChBK5Ln-AxRPzKy0888L4lve6cOLUHLi_-vH5gc_QtT0hTjCF75idU7vbaF8cttMcxuqp03wzU2FZ7bDsYTUfHKZmOt783lMJNdFMWZBkNtTomm0aBCUxIDXWVzWuUIMWHsFkHT-HJ9_Y2nF-5uC9w2rOATTrLdaxJKPf5-IB6gyETDhO2cM75humNishdvp6"
              alt="Luxury Travel"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent" />
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="flex justify-center lg:justify-end">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-[480px] glass-card p-8 md:p-12 rounded-[2.5rem] shadow-xl"
          >
            <div className="text-center lg:text-left mb-10">
              <div className="flex items-center justify-center lg:justify-start gap-2 mb-6">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                  <Compass className="text-white w-6 h-6" />
                </div>
                <span className="font-headline text-2xl font-extrabold text-primary tracking-tighter">प्रvaas</span>
              </div>
              <h2 className="font-headline text-3xl font-bold text-on-surface tracking-tight mb-2">
                {isLogin ? 'Welcome Back' : 'Create an account'}
              </h2>
              <p className="text-on-surface-variant font-medium">
                {isLogin ? 'Continue your journey with us.' : 'Join our community of world explorers.'}
              </p>
            </div>

            {/* Google button (placeholder) */}
            <button
              type="button"
              className="w-full flex items-center justify-center gap-3 py-4 px-6 rounded-xl bg-surface-container-low hover:bg-surface-container transition-all duration-300 opacity-60 cursor-not-allowed"
              disabled
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z" fill="#EA4335" />
              </svg>
              <span className="text-on-surface font-semibold">Continue with Google</span>
            </button>

            <div className="relative my-10">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-outline-variant opacity-30" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-bold">
                <span className="bg-white px-4 text-outline">Or via Email</span>
              </div>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-error-container text-on-error-container text-sm font-medium mb-6">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Full Name (register only) */}
              {!isLogin && (
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-on-surface-variant px-1 uppercase tracking-wider">Full Name</label>
                  <input
                    className="w-full py-4 px-5 rounded-xl bg-surface-container-high border-none focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all font-medium"
                    placeholder="E.g. Julianne Moore"
                    type="text"
                    value={formData.name}
                    onChange={e => handleChange('name', e.target.value)}
                    autoComplete="name"
                  />
                </div>
              )}

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-on-surface-variant px-1 uppercase tracking-wider">Email Address</label>
                <div className="relative">
                  <input
                    className="w-full py-4 pl-12 pr-5 rounded-xl bg-surface-container-high border-none focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all font-medium"
                    placeholder="name@example.com"
                    type="email"
                    value={formData.email}
                    onChange={e => handleChange('email', e.target.value)}
                    autoComplete="email"
                  />
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-outline w-5 h-5" />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Password</label>
                  {isLogin && <a href="#" className="text-[10px] font-bold text-primary hover:underline">Forgot?</a>}
                </div>
                <div className="relative">
                  <input
                    className="w-full py-4 pl-12 pr-12 rounded-xl bg-surface-container-high border-none focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all font-medium"
                    placeholder="••••••••"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={e => handleChange('password', e.target.value)}
                    autoComplete={isLogin ? 'current-password' : 'new-password'}
                  />
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-outline w-5 h-5" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 rounded-xl primary-gradient text-white font-bold text-lg shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                ) : (
                  <>
                    <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-10 text-center">
              <p className="text-on-surface-variant font-medium">
                {isLogin ? 'New to our journey?' : 'Already have an account?'}
                <button
                  onClick={() => { setIsLogin(!isLogin); setError(''); }}
                  className="text-primary font-bold hover:underline ml-1"
                >
                  {isLogin ? 'Join the journey' : 'Log in'}
                </button>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
};