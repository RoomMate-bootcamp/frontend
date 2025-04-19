import { User, Message, Match } from './types';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Анна',
    age: 22,
    gender: 'Женский',
    occupation: 'Студент',
    avatar: '/api/placeholder/100/100',
    bio: 'Учусь на 3 курсе, ищу спокойного соседа для совместной аренды квартиры рядом с университетом.',
    interests: ['Чтение', 'Йога', 'Кулинария'],
    cleanlinessLevel: 4,
    sleepHabits: 'Рано ложусь, рано встаю',
    rentBudget: 15000,
    location: 'Рядом с МГТУ',
    smokingPreference: 'Не курю, сосед тоже не должен',
    petPreference: 'Люблю животных'
  },
  {
    id: '2',
    name: 'Максим',
    age: 24,
    gender: 'Мужской',
    occupation: 'Программист',
    avatar: '/api/placeholder/100/100',
    bio: 'Работаю из дома, ищу тихого соседа для съема 2-комнатной квартиры.',
    interests: ['Программирование', 'Видеоигры', 'Настольные игры'],
    cleanlinessLevel: 3,
    sleepHabits: 'Поздно ложусь, поздно встаю',
    rentBudget: 20000,
    location: 'Центр города',
    smokingPreference: 'Не курю в помещении',
    petPreference: 'Без животных, пожалуйста'
  },
  {
    id: '3',
    name: 'Елена',
    age: 23,
    gender: 'Женский',
    occupation: 'Дизайнер',
    avatar: '/api/placeholder/100/100',
    bio: 'Творческий человек, ищу соседа для совместной аренды креативной квартиры.',
    interests: ['Рисование', 'Фотография', 'Музыка'],
    cleanlinessLevel: 3,
    sleepHabits: 'Разный график',
    rentBudget: 18000,
    location: 'Арбат',
    smokingPreference: 'Не курю',
    petPreference: 'У меня есть кошка'
  },
  {
    id: '4',
    name: 'Дмитрий',
    age: 25,
    gender: 'Мужской',
    occupation: 'Инженер',
    avatar: '/api/placeholder/100/100',
    bio: 'Спокойный, аккуратный, ищу такого же соседа для совместной аренды.',
    interests: ['Спорт', 'Технологии', 'Путешествия'],
    cleanlinessLevel: 5,
    sleepHabits: 'Стабильный график',
    rentBudget: 22000,
    location: 'Технопарк',
    smokingPreference: 'Не курю',
    petPreference: 'Без животных'
  },
  {
    id: 'ai',
    name: 'CrocoAI',
    age: 0,
    gender: 'Не указано',
    occupation: 'ИИ-ассистент',
    avatar: '/api/placeholder/100/100',
    bio: 'Я ваш персональный AI-помощник для вопросов о совместном проживании и поиске соседей.',
    interests: ['Ответы на вопросы', 'Советы по совместному проживанию', 'Рекомендации'],
    cleanlinessLevel: 5,
    sleepHabits: 'Всегда доступен',
    rentBudget: 0,
    location: 'Везде',
    smokingPreference: 'Не курит',
    petPreference: 'Нейтрально'
  }
];

export const mockMatches: Match[] = [
  {
    id: 'm1',
    userId1: 'current',
    userId2: '1',
    timestamp: new Date(2025, 3, 15)
  },
  {
    id: 'm2',
    userId1: 'current',
    userId2: '3',
    timestamp: new Date(2025, 3, 10)
  }
];

export const mockMessages: Record<string, Message[]> = {
  '1': [
    {
      id: 'msg1',
      senderId: 'current',
      receiverId: '1',
      content: 'Привет! Мне понравилась твоя анкета. Давай обсудим возможность совместной аренды?',
      timestamp: new Date(2025, 3, 15, 14, 30)
    },
    {
      id: 'msg2',
      senderId: '1',
      receiverId: 'current',
      content: 'Привет! Конечно, я тоже заинтересована. Какой район тебе подходит?',
      timestamp: new Date(2025, 3, 15, 15, 45)
    }
  ],
  '3': [
    {
      id: 'msg3',
      senderId: 'current',
      receiverId: '3',
      content: 'Привет! Я тоже люблю искусство. Может быть, мы могли бы найти квартиру вместе?',
      timestamp: new Date(2025, 3, 10, 18, 20)
    }
  ],
  'ai': [
    {
      id: 'msg4',
      senderId: 'ai',
      receiverId: 'current',
      content: 'Привет! Я CrocoAI, ваш персональный помощник по вопросам совместного проживания. Чем я могу вам помочь сегодня?',
      timestamp: new Date(2025, 3, 18, 12, 0)
    }
  ]
};

// Current user (for demo)
export const currentUser: User = {
  id: 'current',
  name: 'Вы',
  age: 23,
  gender: 'Женский',
  occupation: 'Студент',
  avatar: '/api/placeholder/100/100',
  bio: 'Ищу соседа для совместной аренды недалеко от университета',
  interests: ['Музыка', 'Спорт', 'Кино'],
  cleanlinessLevel: 4,
  sleepHabits: 'Обычный график',
  rentBudget: 17000,
  location: 'МГТУ',
  smokingPreference: 'Не курю',
  petPreference: 'Люблю животных'
};