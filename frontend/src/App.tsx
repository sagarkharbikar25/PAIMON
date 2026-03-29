import React from 'react';
import { useApp } from './AppContext';
import { SplashScreen } from './components/SplashScreen';
import { Onboarding } from './components/Onboarding';
import { Auth } from './components/Auth';
import { Dashboard } from './components/Dashboard';
import { TripDetails } from './components/TripDetails';
import { Itinerary } from './components/Itinerary';
import { Expenses } from './components/Expenses';
import { Vault } from './components/Vault';
import { AIPlanner } from './components/AIPlanner';
import { Profile } from './components/Profile';
import { CreateTrip } from './components/CreateTrip';
import { Explore } from './components/Explore';
import { Chatbot } from './components/Chatbot';
import { Weather } from './components/Weather';
import { AddActivity } from './components/AddActivity';
import { AddExpense } from './components/AddExpense';
import { CompleteProfile } from './components/CompleteProfile';
import { UploadTicket } from './components/UploadTicket';
import { Settings } from './components/Settings';
import { Notifications } from './components/Notifications';
import { Reports } from './components/Reports';
import { Sidebar } from './components/Sidebar';
import { AnimatePresence, motion } from 'motion/react';

const App = () => {
  const { currentScreen, showChatbot } = useApp();

  const renderScreen = () => {
    switch (currentScreen) {
      case 'splash': return <SplashScreen />;
      case 'onboarding': return <Onboarding />;
      case 'auth': return <Auth />;
      case 'dashboard': return <Dashboard />;
      case 'trip-details': return <TripDetails />;
      case 'itinerary': return <Itinerary />;
      case 'expenses': return <Expenses />;
      case 'vault': return <Vault />;
      case 'upload-ticket': return <UploadTicket />;
      case 'ai-planner': return <AIPlanner />;
      case 'profile': return <Profile />;
      case 'create-trip': return <CreateTrip />;
      case 'explore': return <Explore />;
      case 'weather': return <Weather />;
      case 'add-activity': return <AddActivity />;
      case 'add-expense': return <AddExpense />;
      case 'complete-profile': return <CompleteProfile />;
      case 'reports': return <Reports />;
      case 'settings': return <Settings />;
      case 'notifications': return <Notifications isFullScreen />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-background selection:bg-primary/10 selection:text-primary">
      <Sidebar />
      <AnimatePresence>
        {showChatbot && <Chatbot />}
      </AnimatePresence>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentScreen}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          {renderScreen()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default App;
