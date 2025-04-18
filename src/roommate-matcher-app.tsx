import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ChevronLeft, Heart, X, MessageSquare, Menu, Settings, Home, Users, Search, LogOut } from 'lucide-react';

// Types
interface User {
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

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
}

interface Match {
  id: string;
  userId1: string;
  userId2: string;
  timestamp: Date;
}

// Mock data
const mockUsers: User[] = [
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
  }
];

const mockMatches: Match[] = [
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

const mockMessages: Record<string, Message[]> = {
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
  ]
};

// Utility functions
const formatDate = (date: Date) => {
  return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()} ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
};

// Current user (for demo)
const currentUser: User = {
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

// Main App Component
const RoommateMatcherApp = () => {
  const [activeTab, setActiveTab] = useState('browse');
  const [userIndex, setUserIndex] = useState(0);
  const [matches, setMatches] = useState<Match[]>(mockMatches);
  const [messages, setMessages] = useState<Record<string, Message[]>>(mockMessages);
  const [currentChat, setCurrentChat] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [isEditProfile, setIsEditProfile] = useState(false);
  const [profile, setProfile] = useState<User>(currentUser);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Form state for edit profile
  const [formState, setFormState] = useState({ ...currentUser });

  // Handle profile update
  const handleProfileUpdate = () => {
    setProfile(formState);
    setIsEditProfile(false);
  };

  // Handle swipe action
  const handleSwipe = (direction: 'left' | 'right') => {
    if (direction === 'right') {
      // Simulate a match with 30% probability
      if (Math.random() > 0.7) {
        const newMatch: Match = {
          id: `m${matches.length + 1}`,
          userId1: 'current',
          userId2: mockUsers[userIndex].id,
          timestamp: new Date()
        };
        setMatches([...matches, newMatch]);
      }
    }
    
    // Move to next user
    if (userIndex < mockUsers.length - 1) {
      setUserIndex(userIndex + 1);
    } else {
      // Loop back to first user when reached the end
      setUserIndex(0);
    }
  };

  // Handle sending a message
  const handleSendMessage = () => {
    if (newMessage.trim() === '' || !currentChat) return;
    
    const newMsg: Message = {
      id: `msg${Date.now()}`,
      senderId: 'current',
      receiverId: currentChat,
      content: newMessage,
      timestamp: new Date()
    };
    
    setMessages(prev => ({
      ...prev,
      [currentChat]: [...(prev[currentChat] || []), newMsg]
    }));
    
    setNewMessage('');
  };

  // Get current user being viewed
  const currentViewUser = mockUsers[userIndex];

  // Get matched users
  const matchedUsers = matches.map(match => {
    const userId = match.userId1 === 'current' ? match.userId2 : match.userId1;
    return mockUsers.find(user => user.id === userId);
  }).filter(Boolean) as User[];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between p-4 bg-white border-b">
        <div className="flex items-center">
          <h1 className="text-xl font-bold">RoomMate</h1>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          <Menu className="h-6 w-6" />
        </Button>
      </header>

      {/* Mobile Menu Sheet */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side="left" className="w-64">
          <SheetHeader>
            <SheetTitle>Меню</SheetTitle>
          </SheetHeader>
          <div className="mt-8 flex flex-col gap-4">
            <Button 
              variant={activeTab === 'browse' ? 'default' : 'ghost'} 
              className="justify-start" 
              onClick={() => {
                setActiveTab('browse');
                setIsMobileMenuOpen(false);
              }}
            >
              <Search className="mr-2 h-5 w-5" />
              Поиск
            </Button>
            <Button 
              variant={activeTab === 'matches' ? 'default' : 'ghost'} 
              className="justify-start" 
              onClick={() => {
                setActiveTab('matches');
                setIsMobileMenuOpen(false);
              }}
            >
              <Users className="mr-2 h-5 w-5" />
              Совпадения
            </Button>
            <Button 
              variant={activeTab === 'profile' ? 'default' : 'ghost'} 
              className="justify-start" 
              onClick={() => {
                setActiveTab('profile');
                setIsMobileMenuOpen(false);
              }}
            >
              <Settings className="mr-2 h-5 w-5" />
              Профиль
            </Button>
            <Button variant="ghost" className="justify-start mt-auto">
              <LogOut className="mr-2 h-5 w-5" />
              Выйти
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      <div className="flex flex-1">
        {/* Desktop Sidebar */}
        <div className="hidden md:flex flex-col w-64 border-r bg-white p-4">
          <div className="mb-8">
            <h1 className="text-2xl font-bold">RoomMate</h1>
            <p className="text-gray-500 text-sm">Найди идеального соседа</p>
          </div>
          <div className="flex flex-col gap-2">
            <Button 
              variant={activeTab === 'browse' ? 'default' : 'ghost'} 
              className="justify-start" 
              onClick={() => setActiveTab('browse')}
            >
              <Search className="mr-2 h-5 w-5" />
              Поиск
            </Button>
            <Button 
              variant={activeTab === 'matches' ? 'default' : 'ghost'} 
              className="justify-start" 
              onClick={() => setActiveTab('matches')}
            >
              <Users className="mr-2 h-5 w-5" />
              Совпадения
            </Button>
            <Button 
              variant={activeTab === 'profile' ? 'default' : 'ghost'} 
              className="justify-start" 
              onClick={() => setActiveTab('profile')}
            >
              <Settings className="mr-2 h-5 w-5" />
              Профиль
            </Button>
          </div>
          <Button variant="ghost" className="justify-start mt-auto">
            <LogOut className="mr-2 h-5 w-5" />
            Выйти
          </Button>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4">
          {/* Browse Tab */}
          {activeTab === 'browse' && (
            <div className="flex flex-col items-center max-w-md mx-auto">
              <h2 className="text-2xl font-bold mb-4 md:mb-6">Найди соседа</h2>
              
              <Card className="w-full">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>{currentViewUser.name}, {currentViewUser.age}</CardTitle>
                    <CardDescription>{currentViewUser.occupation}</CardDescription>
                  </div>
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={currentViewUser.avatar} alt={currentViewUser.name} />
                    <AvatarFallback>{currentViewUser.name.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium">О себе:</h3>
                      <p className="text-gray-600">{currentViewUser.bio}</p>
                    </div>
                    
                    <div>
                      <h3 className="font-medium">Интересы:</h3>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {currentViewUser.interests.map((interest, i) => (
                          <Badge key={i} variant="secondary">{interest}</Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h3 className="font-medium">Чистоплотность:</h3>
                        <div className="flex mt-1">
                          {[1, 2, 3, 4, 5].map((level) => (
                            <div 
                              key={level} 
                              className={`w-5 h-5 rounded-full mr-1 ${
                                level <= currentViewUser.cleanlinessLevel ? 'bg-green-500' : 'bg-gray-200'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-medium">Бюджет:</h3>
                        <p className="text-gray-600">{currentViewUser.rentBudget} ₽/мес</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h3 className="font-medium">Сон:</h3>
                        <p className="text-gray-600">{currentViewUser.sleepHabits}</p>
                      </div>
                      
                      <div>
                        <h3 className="font-medium">Район:</h3>
                        <p className="text-gray-600">{currentViewUser.location}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h3 className="font-medium">Курение:</h3>
                        <p className="text-gray-600">{currentViewUser.smokingPreference}</p>
                      </div>
                      
                      <div>
                        <h3 className="font-medium">Животные:</h3>
                        <p className="text-gray-600">{currentViewUser.petPreference}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="rounded-full h-12 w-12"
                    onClick={() => handleSwipe('left')}
                  >
                    <X className="h-6 w-6 text-red-500" />
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="rounded-full h-12 w-12"
                    onClick={() => handleSwipe('right')}
                  >
                    <Heart className="h-6 w-6 text-green-500" />
                  </Button>
                </CardFooter>
              </Card>
              
              <div className="mt-4 text-center text-gray-500">
                <p>Свайпните вправо, если хотите жить вместе</p>
              </div>
            </div>
          )}

          {/* Matches Tab */}
          {activeTab === 'matches' && (
            <div className="flex flex-col md:flex-row h-full">
              {/* Matches List */}
              <div className={`${currentChat ? 'hidden md:block' : ''} md:w-1/3 border-r`}>
                <h2 className="text-2xl font-bold mb-4">Совпадения</h2>
                
                {matchedUsers.length === 0 ? (
                  <div className="text-center p-4 bg-gray-100 rounded-md">
                    <p>У вас пока нет совпадений</p>
                    <p className="text-sm text-gray-500 mt-2">Продолжайте искать, чтобы найти идеального соседа</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {matchedUsers.map(user => (
                      <Card key={user.id} className={`cursor-pointer hover:bg-gray-50 ${currentChat === user.id ? 'border-2 border-blue-500' : ''}`} onClick={() => setCurrentChat(user.id)}>
                        <CardHeader className="p-3">
                          <div className="flex items-center space-x-3">
                            <Avatar>
                              <AvatarImage src={user.avatar} alt={user.name} />
                              <AvatarFallback>{user.name.slice(0, 2)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <CardTitle className="text-base">{user.name}</CardTitle>
                              <CardDescription className="text-xs">{user.location}</CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Chat Area */}
              <div className={`${!currentChat ? 'hidden md:flex' : 'flex'} flex-col flex-1`}>
                {currentChat ? (
                  <>
                    <div className="flex items-center p-4 border-b mb-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="md:hidden mr-2"
                        onClick={() => setCurrentChat(null)}
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </Button>
                      
                      <Avatar className="h-10 w-10 mr-3">
                        <AvatarImage 
                          src={mockUsers.find(u => u.id === currentChat)?.avatar} 
                          alt={mockUsers.find(u => u.id === currentChat)?.name} 
                        />
                        <AvatarFallback>
                          {mockUsers.find(u => u.id === currentChat)?.name.slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div>
                        <h3 className="font-medium">
                          {mockUsers.find(u => u.id === currentChat)?.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {mockUsers.find(u => u.id === currentChat)?.location}
                        </p>
                      </div>
                    </div>
                    
                    <ScrollArea className="flex-1 p-4">
                      <div className="space-y-4">
                        {(messages[currentChat] || []).map(msg => (
                          <div 
                            key={msg.id} 
                            className={`flex ${msg.senderId === 'current' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div 
                              className={`max-w-xs p-3 rounded-lg ${
                                msg.senderId === 'current' 
                                  ? 'bg-blue-500 text-white rounded-br-none' 
                                  : 'bg-gray-200 text-gray-800 rounded-bl-none'
                              }`}
                            >
                              <p>{msg.content}</p>
                              <p className={`text-xs mt-1 ${msg.senderId === 'current' ? 'text-blue-100' : 'text-gray-500'}`}>
                                {formatDate(msg.timestamp)}
                              </p>
                            </div>
                          </div>
                        ))}
                        
                        {(messages[currentChat] || []).length === 0 && (
                          <div className="text-center p-4 text-gray-500">
                            <p>Начните общение с {mockUsers.find(u => u.id === currentChat)?.name}</p>
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                    
                    <div className="p-4 border-t mt-auto">
                      <div className="flex space-x-2">
                        <Input 
                          placeholder="Введите сообщение..."
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        />
                        <Button onClick={handleSendMessage}>
                          Отправить
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center p-8">
                      <MessageSquare className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                      <h3 className="text-xl font-medium mb-2">Ваши сообщения</h3>
                      <p className="text-gray-500">Выберите совпадение, чтобы начать общение</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="max-w-2xl mx-auto">
              <div className="flex justify-between mb-6">
                <h2 className="text-2xl font-bold">Мой профиль</h2>
                <Button onClick={() => setIsEditProfile(!isEditProfile)}>
                  {isEditProfile ? 'Отмена' : 'Редактировать'}
                </Button>
              </div>
              
              {isEditProfile ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Редактирование профиля</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="name">Имя</Label>
                        <Input 
                          id="name" 
                          value={formState.name} 
                          onChange={(e) => setFormState({...formState, name: e.target.value})}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex flex-col space-y-1.5">
                          <Label htmlFor="age">Возраст</Label>
                          <Input 
                            id="age" 
                            type="number" 
                            value={formState.age} 
                            onChange={(e) => setFormState({...formState, age: parseInt(e.target.value) || 18})}
                          />
                        </div>
                        
                        <div className="flex flex-col space-y-1.5">
                          <Label htmlFor="gender">Пол</Label>
                          <Select 
                            value={formState.gender} 
                            onValueChange={(value) => setFormState({...formState, gender: value})}
                          >
                            <SelectTrigger id="gender">
                              <SelectValue placeholder="Выберите пол" />
                            </SelectTrigger>
                            <SelectContent className='bg-white'>
                              <SelectItem value="Мужской">Мужской</SelectItem>
                              <SelectItem value="Женский">Женский</SelectItem>
                              <SelectItem value="Другой">Другой</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="flex flex-col space-y-1.5">
                          <Label htmlFor="occupation">Род занятий</Label>
                          <Input 
                            id="occupation" 
                            value={formState.occupation} 
                            onChange={(e) => setFormState({...formState, occupation: e.target.value})}
                          />
                        </div>
                      </div>
                      
                      <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="bio">О себе</Label>
                        <Textarea 
                          id="bio" 
                          value={formState.bio} 
                          onChange={(e) => setFormState({...formState, bio: e.target.value})}
                          rows={4}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col space-y-1.5">
                          <Label htmlFor="rentBudget">Бюджет (₽/мес)</Label>
                          <Input 
                            id="rentBudget" 
                            type="number" 
                            value={formState.rentBudget} 
                            onChange={(e) => setFormState({...formState, rentBudget: parseInt(e.target.value) || 0})}
                          />
                        </div>
                        
                        <div className="flex flex-col space-y-1.5">
                          <Label htmlFor="location">Предпочитаемый район</Label>
                          <Input 
                            id="location" 
                            value={formState.location} 
                            onChange={(e) => setFormState({...formState, location: e.target.value})}
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col space-y-1.5">
                          <Label htmlFor="sleepHabits">Режим сна</Label>
                          <Select 
                            value={formState.sleepHabits} 
                            onValueChange={(value) => setFormState({...formState, sleepHabits: value})}
                          >
                            <SelectTrigger id="sleepHabits">
                              <SelectValue placeholder="Выберите режим" />
                            </SelectTrigger>
                            <SelectContent className='bg-white'>
                              <SelectItem value="Рано ложусь, рано встаю">Рано ложусь, рано встаю</SelectItem>
                              <SelectItem value="Поздно ложусь, поздно встаю">Поздно ложусь, поздно встаю</SelectItem>
                              <SelectItem value="Обычный график">Обычный график</SelectItem>
                              <SelectItem value="Разный график">Разный график</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="flex flex-col space-y-1.5">
                          <Label htmlFor="cleanlinessLevel">Уровень чистоплотности (1-5)</Label>
                          <Select 
                            value={formState.cleanlinessLevel.toString()} 
                            onValueChange={(value) => setFormState({...formState, cleanlinessLevel: parseInt(value)})}
                          >
                            <SelectTrigger id="cleanlinessLevel">
                              <SelectValue placeholder="Выберите уровень" />
                            </SelectTrigger>
                            <SelectContent className='bg-white'>
                              <SelectItem value="1">1 - Минимальный</SelectItem>
                              <SelectItem value="2">2 - Ниже среднего</SelectItem>
                              <SelectItem value="3">3 - Средний</SelectItem>
                              <SelectItem value="4">4 - Выше среднего</SelectItem>
                              <SelectItem value="5">5 - Очень чистоплотный</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col space-y-1.5">
                          <Label htmlFor="smokingPreference">Отношение к курению</Label>
                          <Select 
                            value={formState.smokingPreference} 
                            onValueChange={(value) => setFormState({...formState, smokingPreference: value})}
                          >
                            <SelectTrigger id="smokingPreference">
                              <SelectValue placeholder="Выберите отношение" />
                            </SelectTrigger>
                            <SelectContent className='bg-white'>
                              <SelectItem value="Курю">Курю</SelectItem>
                              <SelectItem value="Не курю">Не курю</SelectItem>
                              <SelectItem value="Не курю, сосед тоже не должен">Не курю, сосед тоже не должен</SelectItem>
                              <SelectItem value="Не курю в помещении">Не курю в помещении</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="flex flex-col space-y-1.5">
                          <Label htmlFor="petPreference">Отношение к животным</Label>
                          <Select 
                            value={formState.petPreference} 
                            onValueChange={(value) => setFormState({...formState, petPreference: value})}
                          >
                            <SelectTrigger id="petPreference">
                              <SelectValue placeholder="Выберите отношение" />
                            </SelectTrigger>
                            <SelectContent className='bg-white'>
                              <SelectItem value="У меня есть питомец">У меня есть питомец</SelectItem>
                              <SelectItem value="Люблю животных">Люблю животных</SelectItem>
                              <SelectItem value="Без животных, пожалуйста">Без животных, пожалуйста</SelectItem>
                              <SelectItem value="Аллергия на животных">Аллергия на животных</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button onClick={handleProfileUpdate}>Сохранить изменения</Button>
                  </CardFooter>
                </Card>
              ) : (
                <Card>
                  <CardHeader className="flex flex-row items-start justify-between">
                    <div>
                      <CardTitle className="text-2xl">{profile.name}, {profile.age}</CardTitle>
                      <CardDescription>{profile.occupation}</CardDescription>
                    </div>
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={profile.avatar} alt={profile.name} />
                      <AvatarFallback>{profile.name.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium mb-2">О себе</h3>
                        <p className="text-gray-700">{profile.bio}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium mb-2">Интересы</h3>
                        <div className="flex flex-wrap gap-2">
                          {profile.interests.map((interest, i) => (
                            <Badge key={i} variant="secondary">{interest}</Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="text-lg font-medium mb-2">Жилищные предпочтения</h3>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Бюджет:</span>
                              <span className="font-medium">{profile.rentBudget} ₽/мес</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Район:</span>
                              <span className="font-medium">{profile.location}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-medium mb-2">Личные привычки</h3>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Режим сна:</span>
                              <span className="font-medium">{profile.sleepHabits}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-gray-600">Чистоплотность:</span>
                              <div className="flex">
                                {[1, 2, 3, 4, 5].map((level) => (
                                  <div 
                                    key={level} 
                                    className={`w-4 h-4 rounded-full mx-0.5 ${
                                      level <= profile.cleanlinessLevel ? 'bg-green-500' : 'bg-gray-200'
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Курение:</span>
                          <span className="font-medium">{profile.smokingPreference}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Животные:</span>
                          <span className="font-medium">{profile.petPreference}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoommateMatcherApp;