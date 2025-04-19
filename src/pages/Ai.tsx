import Layout from '@/components/Layout';
import Chat from '@/components/Chat';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { getUserProfile } from '@/lib/requests';
import { Button } from '@/components/ui/button';
import { BrainCircuit, Crown, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function Ai() {
  const [cookies] = useCookies(["TOKEN"]);
  const [hasSubscription, setHasSubscription] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUserSubscription = async () => {
      try {
        setLoading(true);
        const profile = await getUserProfile(cookies.TOKEN);
        // Check if user has subscription in profile data
        // This is a placeholder - backend should provide subscription info
        setHasSubscription(profile.user_metadata?.has_subscription === true);
      } catch (error) {
        console.error("Error checking subscription:", error);
      } finally {
        setLoading(false);
      }
    };

    if (cookies.TOKEN) {
      checkUserSubscription();
    }
  }, [cookies.TOKEN]);

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

  // For demo purposes, always allow access to AI
  // In production, uncomment the below code to restrict based on subscription
  /*
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
  */

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <BrainCircuit className="h-6 w-6 text-primary" />
            <span>CrocoAI - Ваш умный помощник</span>
          </h2>
          <p className="text-muted-foreground mt-1">
            Задайте вопрос о поиске соседей, совместном проживании или решении бытовых проблем
          </p>
        </div>
        <Chat currentChat="ai" setCurrentChat={() => {}} />
      </div>
    </Layout>
  );
}