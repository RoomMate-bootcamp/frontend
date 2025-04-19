import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, MessageSquare, Trash2, ExternalLink } from "lucide-react";
import Layout from "@/components/Layout";
import { useCookies } from 'react-cookie';
import { getMatches, deleteMatch } from "@/lib/requests";
import { Match } from "@/lib/types";

export default function Matches() {
  const [cookies] = useCookies(["TOKEN"]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentMatch, setCurrentMatch] = useState<Match | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setLoading(true);
        const data = await getMatches(cookies.TOKEN);
        setMatches(data || []);
      } catch (error) {
        console.error("Error fetching matches:", error);
        setError("Не удалось загрузить совпадения");
      } finally {
        setLoading(false);
      }
    };

    if (cookies.TOKEN) {
      fetchMatches();
    }
  }, [cookies.TOKEN]);

  const handleDeleteMatch = async (matchId: string | number) => {
    try {
      setDeleteLoading(true);
      await deleteMatch(cookies.TOKEN, matchId);
      // Remove from local state
      setMatches(matches.filter(match => match.id !== matchId));
      // Reset current match if it was deleted
      if (currentMatch && currentMatch.id === matchId) {
        setCurrentMatch(null);
      }
    } catch (error) {
      console.error("Error deleting match:", error);
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
          <p>Загрузка совпадений...</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-64">
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Попробовать снова</Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="md:grid md:grid-cols-3 gap-6">
        {/* Matches List (visible on all screens, but only 1/3 on desktop) */}
        <div className={`${currentMatch ? "hidden md:block" : ""} md:col-span-1`}>
          <h2 className="text-2xl font-bold mb-4">Совпадения</h2>

          {matches.length === 0 ? (
            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <p className="mb-2 font-medium">У вас пока нет совпадений</p>
                <p className="text-muted-foreground text-sm mb-4">
                  Продолжайте искать, чтобы найти идеального соседа
                </p>
                <Button variant="outline" onClick={() => window.location.href = "/"}>
                  Искать соседей
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {matches.map((match) => (
                <Card
                  key={match.id}
                  className={`cursor-pointer hover:bg-gray-50 transition-colors ${
                    currentMatch && currentMatch.id === match.id ? "border-2 border-primary" : ""
                  }`}
                  onClick={() => setCurrentMatch(match)}
                >
                  <CardHeader className="p-3">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10 avatar-ring">
                        <AvatarImage
                          src={match.roommate?.avatar || "/api/placeholder/100/100"}
                          alt={match.roommate?.name || "Пользователь"}
                        />
                        <AvatarFallback>
                          {match.roommate?.name?.slice(0, 2) || "?"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-base">
                          {match.roommate?.name || "Пользователь"}
                        </CardTitle>
                        <CardDescription className="text-xs">
                          {match.roommate?.location || "Не указано"}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Match Details */}
        <div className={`${!currentMatch ? "hidden md:flex" : ""} md:col-span-2`}>
          {currentMatch ? (
            <Card className="h-full">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16 avatar-ring">
                      <AvatarImage
                        src={currentMatch.roommate?.avatar || "/api/placeholder/100/100"}
                        alt={currentMatch.roommate?.name || "Пользователь"}
                      />
                      <AvatarFallback>
                        {currentMatch.roommate?.name?.slice(0, 2) || "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-xl">
                        {currentMatch.roommate?.name || "Пользователь"}
                        {currentMatch.roommate?.age ? `, ${currentMatch.roommate.age}` : ""}
                      </CardTitle>
                      <CardDescription>
                        {currentMatch.roommate?.occupation || "Не указана профессия"}
                      </CardDescription>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden"
                    onClick={() => setCurrentMatch(null)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                  </Button>
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-1">О себе:</h3>
                    <p className="text-gray-600">{currentMatch.roommate?.bio || "Информация о себе не указана"}</p>
                  </div>

                  <div>
                    <h3 className="font-medium mb-1">Интересы:</h3>
                    <div className="flex flex-wrap gap-2">
                      {currentMatch.roommate?.interests && currentMatch.roommate.interests.length > 0 ? (
                        currentMatch.roommate.interests.map((interest, idx) => (
                          <Badge key={idx} variant="secondary">{interest}</Badge>
                        ))
                      ) : (
                        <span className="text-gray-500">Интересы не указаны</span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div className="space-y-2">
                      <h3 className="font-medium">Жилищные предпочтения</h3>
                      <div className="grid grid-cols-2 gap-1">
                        <span className="text-gray-500">Бюджет:</span>
                        <span>{currentMatch.roommate?.rent_budget ? `${currentMatch.roommate.rent_budget} ₽` : "Не указан"}</span>

                        <span className="text-gray-500">Район:</span>
                        <span>{currentMatch.roommate?.location || "Не указан"}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="font-medium">Личные привычки</h3>
                      <div className="grid grid-cols-2 gap-1">
                        <span className="text-gray-500">Чистоплотность:</span>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((level) => (
                            <div
                              key={level}
                              className={`w-4 h-4 rounded-full mr-0.5 ${
                                currentMatch.roommate?.cleanliness_level && level <= currentMatch.roommate.cleanliness_level
                                  ? "bg-green-500"
                                  : "bg-gray-200"
                              }`}
                            />
                          ))}
                        </div>

                        <span className="text-gray-500">Режим сна:</span>
                        <span>{currentMatch.roommate?.sleep_habits || "Не указан"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <h3 className="font-medium mb-2">Контактная информация:</h3>
                    {currentMatch.roommate?.telegram_username ? (
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => window.open(`https://t.me/${currentMatch.roommate?.telegram_username}`, '_blank')}
                      >
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Написать в Telegram: @{currentMatch.roommate.telegram_username}
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </Button>
                    ) : (
                      <p className="text-gray-500">Пользователь не указал свой Telegram</p>
                    )}
                  </div>
                </div>
              </CardContent>

              <CardFooter className="border-t pt-4 mt-2">
                <Button
                  variant="destructive"
                  className="ml-auto"
                  onClick={() => handleDeleteMatch(currentMatch.id)}
                  disabled={deleteLoading}
                >
                  {deleteLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="mr-2 h-4 w-4" />
                  )}
                  Удалить совпадение
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <div className="flex-1 flex items-center justify-center h-full">
              <div className="text-center p-8">
                <MessageSquare className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-medium mb-2">Информация о совпадении</h3>
                <p className="text-gray-500">
                  Выберите совпадение из списка слева, чтобы увидеть подробную информацию
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}