/**
 * Types for the application
 */

export interface User {
  id: string | number;
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
  username?: string;
  email?: string;
  isActive?: boolean;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
}

export interface Match {
  id: string | number;
  userId1?: string | number;
  userId2?: string | number;
  user1_id?: number;
  user2_id?: number;
  timestamp: Date | string;
  roommate?: User;
}

export interface Like {
  id: number;
  liker_id: number;
  liked_id: number;
  status: LikeStatus;
  timestamp: string;
  liker?: User;
  liked?: User;
}

export type LikeStatus = 'pending' | 'accepted' | 'declined';

export interface LikeAction {
  action: 'accept' | 'decline';
}

export interface Notification {
  id: number;
  type: NotificationType;
  content: string;
  related_user_id?: number;
  related_entity_id?: number;
  is_read: boolean;
  timestamp: string;
  related_user?: User;
}

export type NotificationType = 'new_like' | 'match_created' | 'new_message';

export interface NotificationsResponse {
  notifications: Notification[];
  unread_count: number;
}

export interface AIChatRequest {
  message: string;
}

export interface AIChatResponse {
  response: string;
  conversation_id?: string;
}

export interface AIMatchingScore {
  score: number;
  explanation: string;
}

export interface AIMatch {
  user: User;
  compatibility_score: number;
  compatibility_explanation: string;
}

export interface AIMatchesResponse {
  matches: AIMatch[];
}

export interface ProfileUpdate {
  name?: string;
  age?: number;
  gender?: string;
  occupation?: string;
  avatar?: string;
  bio?: string;
  interests?: string[];
  cleanliness_level?: number;
  sleep_habits?: string;
  rent_budget?: number;
  location?: string;
  smoking_preference?: string;
  pet_preference?: string;
  study_location?: string;
  study_program?: string;
  accommodation_preference?: string;
  telegram_username?: string;
}