export interface User {
  id: string;
  name: string;
  age: number;
  gender: string;
  occupation: string;
  avatar: string;
  bio: string;
  interests: string[];
  cleanlinessLevel: number;
  sleepHabits: string;
  rentBudget: number;
  location: string;
  smokingPreference: string;
  petPreference: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
}

export interface Match {
  id: string;
  userId1: string;
  userId2: string;
  timestamp: Date;
}