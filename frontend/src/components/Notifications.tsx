import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../AppContext';
import { Plane, Wallet, CloudRain, ArrowRight, Bell, ArrowLeft } from 'lucide-react';
import { cn } from '../lib/utils';
import { apiFetch } from '../services/api';

// ✅ Add interface for notification type
interface Notification {
  id: string;
  _id?: string;
  type: 'flight' | 'budget' | 'weather' | 'general';
  title: string;
  message: string;
  time: string;
  isRead: boolean;
}

export const Notifications = ({ isFullScreen = false }: { isFullScreen?: boolean }) => {
  const { showNotifications, setShowNotifications, setScreen } = useApp();
  
  // ✅ FIXED: Add local state
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch notifications from backend
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const data = await apiFetch('/notifications');
        
        // ✅ FIXED: Now setNotifications exists
        const notifs = (data.notifications || []).map((n: any) => ({
          id: n._id || n.id,
          _id: n._id,
          type: n.type,
          title: n.title,
          message: n.message,
          time: formatTime(n.createdAt || n.time),
          isRead: n.isRead || false
        }));
        
        setNotifications(notifs);
      } catch (err) {
        console.error('Failed to fetch notifications');
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  const markAllAsRead = async () => {
    try {
      await apiFetch('/notifications/mark-read', { method: 'PUT' });
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    } catch (err) {
      console.error('Failed to mark notifications as read');
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await apiFetch(`/notifications/${id}/read`, { method: 'PUT' });
      setNotifications(notifications.map(n =>
        n.id === id ? { ...n, isRead: true } : n
      ));
    } catch (err) {
      console.error('Failed to mark notification as read');
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'flight': return <Plane className="w-5 h-5" />;
      case 'budget': return <Wallet className="w-5 h-5" />;
      case 'weather': return <CloudRain className="w-5 h-5" />;
      default: return <Bell className="w-5 h-5" />;
    }
  };

  const getIconBg = (type: string) => {
    switch (type) {
      case 'flight': return 'bg-blue-600';
      case 'budget': return 'bg-orange-900';
      case 'weather': return 'bg-blue-100 text-blue-900';
      default: return 'bg-primary';
    }
  };

  // Helper function to format time
  function formatTime(dateString: string) {
    if (!dateString) return 'Just now';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  }

  if (isFullScreen) {
    return (
      <div className="bg-background min-h-screen pb-20">
        <header className="px-6 py-6 flex items-center gap-4 sticky top-0 bg-white/70 backdrop-blur-xl z-50 border-b border-outline-variant/10">
          <button 
            onClick={() => setScreen('dashboard')}
            className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center text-primary"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-headline text-xl font-bold text-primary">Notifications</h1>
        </header>

        <main className="p-6 space-y-6">
          <div className="flex items-center justify-between px-4">
            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
              {notifications.length} Total
            </span>
            <button 
              onClick={markAllAsRead}
              className="text-xs font-bold text-primary hover:underline"
            >
              Mark all as read
            </button>
          </div>

          <div className="space-y-4">
            {loading ? (
              <p className="text-center text-gray-500 py-8">Loading...</p>
            ) : notifications.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No notifications</p>
            ) : (
              notifications.map((notification) => (
                <div 
                  key={notification.id}
                  onClick={() => markAsRead(notification.id)}
                  className={cn(
                    "flex gap-4 p-6 rounded-[2.5rem] transition-all border border-outline-variant/5 shadow-sm cursor-pointer",
                    notification.isRead ? "bg-surface-container-lowest" : "bg-primary/5 border-primary/10"
                  )}
                >
                  <div className={cn(
                    "w-14 h-14 rounded-[1.5rem] flex items-center justify-center flex-shrink-0 text-white shadow-lg",
                    getIconBg(notification.type)
                  )}>
                    {getIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-headline font-bold text-primary truncate">{notification.title}</h3>
                      <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest whitespace-nowrap ml-2">
                        {notification.time}
                      </span>
                    </div>
                    <p className="text-sm text-on-surface-variant font-medium leading-relaxed">
                      {notification.message}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </main>
      </div>
    );
  }

  return (
    <AnimatePresence>
      {showNotifications && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowNotifications(false)}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[100]"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="fixed top-20 right-6 w-[calc(100%-3rem)] max-w-[400px] max-h-[50vh] bg-white rounded-[2.5rem] shadow-2xl z-[110] overflow-hidden border border-gray-100 flex flex-col"
          >
            <div className="p-8 pb-6 flex items-center justify-between flex-shrink-0">
              <h2 className="font-headline text-2xl font-extrabold text-primary">Notifications</h2>
              <button 
                onClick={markAllAsRead}
                className="text-on-surface-variant font-sans text-sm font-medium hover:text-primary transition-colors"
              >
                Mark all as read
              </button>
            </div>

            <div className="px-2 pb-4 overflow-y-auto flex-1 custom-scrollbar">
              {loading ? (
                <p className="text-center text-gray-500 py-8">Loading...</p>
              ) : notifications.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No notifications</p>
              ) : (
                notifications.map((notification) => (
                  <div 
                    key={notification.id}
                    onClick={() => markAsRead(notification.id)}
                    className={cn(
                      "flex gap-4 p-6 rounded-[2rem] transition-colors hover:bg-surface-container-low cursor-pointer",
                      !notification.isRead && "bg-surface-container-lowest/50"
                    )}
                  >
                    <div className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 text-white",
                      getIconBg(notification.type)
                    )}>
                      {getIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-headline font-bold text-primary truncate">{notification.title}</h3>
                        <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest whitespace-nowrap ml-2">
                          {notification.time}
                        </span>
                      </div>
                      <p className="text-sm text-on-surface-variant font-medium leading-relaxed">
                        {notification.message}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-8 pt-4 border-t border-gray-50 flex-shrink-0">
              <button 
                onClick={() => {
                  setShowNotifications(false);
                  setScreen('notifications');
                }}
                className="w-full flex items-center justify-center gap-2 font-headline font-bold text-primary hover:gap-3 transition-all"
              >
                View all activity
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};