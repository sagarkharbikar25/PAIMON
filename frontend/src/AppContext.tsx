/* =============================================
   src/AppContext.tsx
   Pravas — App Context (with auth persistence)
   ============================================= */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Screen, Trip, Activity, Expense, Document, UserProfile } from './types';
import { isLoggedIn, getStoredUser, logout as authLogout } from './services/authService';

interface AppContextType {
  currentScreen: Screen;
  setScreen: (screen: Screen) => void;
  onboardingStep: number;
  setOnboardingStep: (step: number) => void;
  trips: Trip[];
  activeTrip: Trip | null;
  setActiveTrip: (trip: Trip | null) => void;
  activities: Activity[];
  expenses: Expense[];
  documents: Document[];
  userProfile: UserProfile | null;
  setUserProfile: (profile: UserProfile) => void;
  addTrip: (trip: Trip) => void;
  addActivity: (activity: Activity) => void;
  addExpense: (expense: Expense) => void;
  addDocument: (doc: Document) => void;
  updateTrip: (trip: Trip) => void;
  isSidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  showChatbot: boolean;
  setShowChatbot: (show: boolean) => void;
  notifications: Notification[];
  setNotifications: (notifications: Notification[]) => void;
  showNotifications: boolean;
  setShowNotifications: (show: boolean) => void;
  /* Auth helpers */
  handleLogout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  /* ── Auth-aware initial screen ─────────────
     If user already has a token → skip splash/onboarding → go dashboard
     If not → start from splash as usual
  ───────────────────────────────────────────── */
  const getInitialScreen = (): Screen => {
    if (isLoggedIn()) return 'dashboard';
    return 'splash';
  };

  const [currentScreen, setScreen] = useState<Screen>(getInitialScreen);
  const [onboardingStep, setOnboardingStep] = useState(1);

  /* ── User Profile: hydrate from localStorage ─ */
  const getInitialProfile = (): UserProfile | null => {
    const stored = getStoredUser();
    if (!stored) return null;
    return {
      fullName: stored.name || '',
      age:      stored.age?.toString() || '',
      dob:      stored.dateOfBirth || '',
      mobile:   stored.mobile || '',
      country:  stored.country || '',
      state:    stored.state || '',
      image:    stored.photoUrl || '',
    };
  };

  const [userProfile, setUserProfile] = useState<UserProfile | null>(getInitialProfile);

  /* ── Sample data (kept for UI demo, replace with API calls later) ─ */
  const [trips, setTrips] = useState<Trip[]>([
    {
      id: '1',
      name: 'Amalfi Dreamscape',
      location: 'Positano, Italy',
      startDate: 'Oct 12',
      endDate: 'Oct 18',
      budget: 500000,
      spent: 124000,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBgVjY9Fwe_XY4UymT-XfVQQBqKdjKRha0x375NutwCzTA6oW0yUMnYdU04sZK4IQKHU_eudc-MS_ySEZQGFn1CGIT6uuR9W9MP-pXupT2xGW00KhhysZj4hxowQpnRQVvlyJGDOVMSEOK_7O5Deji-tPPpado3IbXwlXaFzkiuhtHzwtUouVg_Ckcpo_RpKOupoMLRvhZK7Df5IPuT4yWgwFS4F7Z3RXa-aNtKid7DQjyO67hLbXDAJvZaJz67n4m2OAlz1DsWcb13',
      status: 'active'
    },
    {
      id: '2',
      name: 'Spring in Kyoto',
      location: 'Kyoto, Japan',
      startDate: 'Mar 20',
      endDate: 'Mar 28',
      budget: 220000,
      spent: 142000,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDdRfsjEbCeSDZqmUp3FFf8DmfCp1sM7ZuMrXq71esSfYa0Gf9UH_NKWvm4ar2cwCfEQs8agBZUma3bNAbRH0pPxK-tb39HUPZYDgOqEIjuZmrEZQCYaBRuL6UzJxY0s-oxIfk8yEjlwItK5kJ1T61BeBcjlv0v3cKsLYOXh_0waJTzWJu9BnaYlqQb72LnxcQx9UKySwlDwjr1_wSZdkLDw-yZ5fRn_MGYrvsppYfFpAm919ygetwq8-TNlH3VAOo3SrQZ1Jloo-dI',
      status: 'active'
    }
  ]);
  const [activeTrip, setActiveTrip]     = useState<Trip | null>(trips[0]);
  const [activities, setActivities]     = useState<Activity[]>([
    { id: 'a1', tripId: '1', name: 'Private Boat Tour to Capri', category: 'sightseeing', time: '09:30 AM', date: 'Oct 14', location: 'Marina Grande Pier, Positano', status: 'confirmed' },
    { id: 'a2', tripId: '1', name: 'Lunch at La Sponda',          category: 'food',        time: '01:30 PM', date: 'Oct 14', location: 'Via San Sebastiano, 2, Positano', status: 'reserved' },
  ]);
  const [expenses, setExpenses]         = useState<Expense[]>([
    { id: 'e1', tripId: '1', amount: 84.20, description: 'Le Petit Bistro', category: 'Dining', date: 'Today', paidBy: 'You', splitWith: ['Marco', 'Sarah'] }
  ]);
  const [documents, setDocuments]       = useState<Document[]>([
    { id: 'd1', tripId: '1', name: 'Air India AI-802.pdf', type: 'flight', size: '1.2 MB', updatedAt: '2 mins ago' }
  ]);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [showChatbot, setShowChatbot]   = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: 'n1', title: 'Tokyo Calling',  message: 'Your flight to Tokyo leaves in 5 hours. Check-in is now open.',          time: 'JUST NOW', type: 'flight',  isRead: false },
    { id: 'n2', title: 'Budget Alert',   message: "You've spent 80% of your Tokyo budget.",                                  time: '2H AGO',   type: 'budget',  isRead: false },
    { id: 'n3', title: 'Weather Update', message: "Rain expected in Goa today. Don't forget to pack an umbrella.",           time: '5H AGO',   type: 'weather', isRead: true  },
  ]);

  /* ── Helpers ───────────────────────────────── */
  const addTrip      = (trip: Trip)          => setTrips(prev => [...prev, trip]);
  const addActivity  = (a: Activity)         => setActivities(prev => [...prev, a]);
  const addExpense   = (e: Expense)          => setExpenses(prev => [...prev, e]);
  const addDocument  = (d: Document)         => setDocuments(prev => [...prev, d]);
  const updateTrip   = (updated: Trip)       => {
    setTrips(prev => prev.map(t => t.id === updated.id ? updated : t));
    if (activeTrip?.id === updated.id) setActiveTrip(updated);
  };

  /* ── Logout ─────────────────────────────────── */
  const handleLogout = () => {
    authLogout();
    setUserProfile(null);
    setScreen('auth');
  };

  return (
    <AppContext.Provider value={{
      currentScreen, setScreen,
      onboardingStep, setOnboardingStep,
      trips, activeTrip, setActiveTrip,
      activities, expenses, documents,
      addTrip, addActivity, addExpense, addDocument, updateTrip,
      isSidebarOpen, setSidebarOpen,
      showChatbot, setShowChatbot,
      userProfile, setUserProfile,
      notifications, setNotifications,
      showNotifications, setShowNotifications,
      handleLogout,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};