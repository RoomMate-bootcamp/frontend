import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Button } from "@/components/ui/button";
import { useCookies } from 'react-cookie';
import { BrainCircuit, Crown, Loader2, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { getUserProfile, chatWithAI } from '@/lib/requests';

// Импортируем логотип
import dormBuddyLogo from '../assets/dormbuddy-logo.svg';

export default function Ai() {
  const [cookies] = useCookies(["TOKEN"]);
  const [hasSubscription, setHasSubscription] = useState(true); // Для демо всегда true
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUserSubscription = async () => {
      try {
        setLoading(true);
        const profile = await getUserProfile(cookies.TOKEN);
        setUserProfile(profile);

        // В реальной версии здесь была бы проверка подписки
        // setHasSubscription(profile.user_metadata?.has_subscription === true);

        // Добавляем приветственное сообщение
        setChatHistory([
          {
            id: 'welcome',
            role: 'ai',
            content: 'Привет! Я CrocoAI, твой помощник по вопросам поиска соседей и совместного проживания. Чем могу помочь?',
            timestamp: new Date()
          }
        ]);
      } catch (error) {
        console.error("Error checking user data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (cookies.TOKEN) {
      checkUserSubscription();
    }
  }, [cookies.TOKEN]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: message,
      timestamp: new Date()
    };

    setChatHistory(prev => [...prev, userMessage]);
    setMessage("");
    setSending(true);

    try {
      const response = await chatWithAI(cookies.TOKEN, message);

      const aiResponse = {
        id: `msg-${Date.now() + 1}`,
        role: 'ai',
        content: response.response,
        timestamp: new Date()
      };

      setChatHistory(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error("Error getting AI response:", error);

      const errorMsg = {
        id: `error-${Date.now()}`,
        role: 'ai',
        content: "Извините, произошла ошибка при получении ответа. Пожалуйста, попробуйте еще раз.",
        timestamp: new Date(),
        isError: true
      };

      setChatHistory(prev => [...prev, errorMsg]);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Загрузка...</span>
        </div>
      </Layout>
    );
  }

  if (!hasSubscription) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-md hover-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BrainCircuit className="h-6 w-6 text-primary" />
                Доступ ограничен
              </CardTitle>
              <CardDescription>
                Для использования AI-помощника необходима подписка Premium
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center mb-6">
                <img src={dormBuddyLogo} alt="DormBuddy Logo" className="w-24 h-24 mb-4" />
                <h3 className="text-xl font-semibold text-center">DormBuddy AI</h3>
                <p className="text-center text-gray-500 mt-2">
                  Умный помощник для поиска соседей и решения бытовых вопросов
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 mb-4">
                <h3 className="font-medium mb-2">Возможности CrocoAI:</h3>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                    Персональные советы по жизни с соседями
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                    Помощь в решении конфликтов и бытовых вопросов
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                    Советы по обустройству общего пространства
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                    Рекомендации по эффективному поиску соседей
                  </li>
                </ul>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button
                onClick={() => navigate('/sub')}
                className="flex items-center gap-2 shadow-sm"
              >
                <Crown className="h-5 w-5" />
                Оформить подписку
              </Button>
            </CardFooter>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BrainCircuit className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">CrocoAI - Умный помощник</h2>
          </div>
          <img src={dormBuddyLogo} alt="DormBuddy Logo" className="h-12 w-12" />
        </div>

        <p className="text-muted-foreground mb-6">
          Задайте вопрос о поиске соседей, совместном проживании или решении бытовых проблем
        </p>

        <div className="border rounded-lg bg-white shadow-sm flex flex-col h-[60vh]">
          {/* Чат */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {chatHistory.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6">
                <img src={dormBuddyLogo} alt="DormBuddy Logo" className="w-24 h-24 mb-4 opacity-50" />
                <h3 className="text-xl font-semibold">Добро пожаловать в DormBuddy AI</h3>
                <p className="text-gray-500 mt-2 max-w-md">
                  Задайте вопрос о поиске соседей, совместной аренде, бытовых вопросах или решении конфликтов
                </p>
              </div>
            ) : (
              chatHistory.map(msg => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className="flex gap-2 max-w-[80%]">
                    {msg.role === 'ai' && (
                      <Avatar className="h-8 w-8 mt-1">
                        <AvatarImage src={dormBuddyLogo} alt="AI" />
                        <AvatarFallback>AI</AvatarFallback>
                      </Avatar>
                    )}

                    <div
                      className={`p-3 rounded-lg ${
                        msg.role === 'user' 
                          ? 'bg-primary text-primary-foreground' 
                          : msg.isError 
                            ? 'bg-destructive/10 text-destructive border border-destructive/20' 
                            : 'bg-secondary text-secondary-foreground'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                      <p
                        className={`text-xs mt-1 ${
                          msg.role === 'user' 
                            ? 'text-primary-foreground/70' 
                            : 'text-secondary-foreground/70'
                        }`}
                      >
                        {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </p>
                    </div>

                    {msg.role === 'user' && userProfile && (
                      <Avatar className="h-8 w-8 mt-1">
                        <AvatarImage src={userProfile.avatar} alt={userProfile.name} />
                        <AvatarFallback>{userProfile?.name?.slice(0, 2) || 'U'}</AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                </div>
              ))
            )}
            {sending && (
              <div className="flex justify-start">
                <div className="flex gap-2">
                  <Avatar className="h-8 w-8 mt-1">
                    <AvatarImage src={dormBuddyLogo} alt="AI" />
                    <AvatarFallback>AI</AvatarFallback>
                  </Avatar>
                  <div className="p-3 rounded-lg bg-secondary text-secondary-foreground">
                    <div className="flex space-x-2">
                      <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                      <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Ввод сообщения */}
          <div className="border-t p-4">
            <div className="flex space-x-2">
              <Input
                placeholder="Введите сообщение..."
                value={message}
                onChange={e => setMessage(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                disabled={sending}
                className="bg-gray-50 focus:bg-white"
              />
              <Button onClick={handleSendMessage} disabled={sending} className="px-4">
                {sending ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              DormBuddy AI поможет вам найти идеального соседа и решить бытовые вопросы
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}