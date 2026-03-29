export type Screen = 
  | 'splash' 
  | 'onboarding' 
  | 'auth' 
  | 'dashboard' 
  | 'create-trip' 
  | 'trip-details' 
  | 'itinerary' 
  | 'add-activity' 
  | 'expenses' 
  | 'add-expense' 
  | 'vault' 
  | 'explore' 
  | 'translator' 
  | 'ai-planner' 
  | 'profile' 
  | 'notifications'
  | 'chatbot'
  | 'weather'
  | 'reports'
  | 'settings'
  | 'complete-profile';

export interface UserProfile {
  fullName: string;
  age: string;
  dob: string;
  mobile: string;
  country: string;
  state: string;
  image?: string;
}

export interface Trip {
  id: string;
  name: string;
  location: string;
  hotelName?: string;
  startDate: string;
  endDate: string;
  budget: number;
  spent: number;
  image: string;
  status: 'active' | 'upcoming' | 'completed';
}

export interface Activity {
  id: string;
  tripId: string;
  name: string;
  category: 'food' | 'sightseeing' | 'outdoors' | 'shopping';
  time: string;
  date: string;
  location: string;
  notes?: string;
  image?: string;
  status: 'confirmed' | 'reserved' | 'pending';
}

export interface Expense {
  id: string;
  tripId: string;
  amount: number;
  description: string;
  category: string;
  date: string;
  paidBy: string;
  splitWith: string[];
}

export interface Document {
  id: string;
  tripId: string;
  name: string;
  type: 'flight' | 'hotel' | 'id' | 'other';
  size: string;
  updatedAt: string;
  image?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'flight' | 'budget' | 'weather' | 'general';
  isRead: boolean;
}
