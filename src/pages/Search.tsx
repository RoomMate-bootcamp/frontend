import { useState, useEffect } from "react";
import { Heart, X, Loader2 } from "lucide-react";
import {
  Card,
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Layout from "@/components/Layout";
import {
  getPotentialRoommates,
  likeUser,
  getCompatibilityScore,
} from "@/lib/requests";
import { useCookies } from "react-cookie";
import { User, AIMatchingScore } from "@/lib/types";
import { useSwipeable } from "react-swipeable"; // Импортируем библиотеку для свайпов
import { motion } from "framer-motion";

export default function Search() {
  const [cookies] = useCookies(["TOKEN"]);
  const [loading, setLoading] = useState(true);
  const [likeInProgress, setLikeInProgress] = useState(false);
  const [potentialRoommates, setPotentialRoommates] = useState<User[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [compatibilityData, setCompatibilityData] =
    useState<AIMatchingScore | null>(null);
  const [showCompatibility, setShowCompatibility] = useState(false);
  const [loadingCompatibility, setLoadingCompatibility] = useState(false);
  const [swipeStyle, setSwipeStyle] = useState({ x: 0, rotate: 0 }); // Состояние для анимации свайпа
  const [isSwiping, setIsSwiping] = useState(false); // Флаг для отслеживания свайпа

  useEffect(() => {
    const fetchRoommates = async () => {
      try {
        setLoading(true);
        const data = await getPotentialRoommates(cookies.TOKEN);
        setPotentialRoommates(data || []);
      } catch (error) {
        console.error("Error fetching potential roommates:", error);
        setError("Не удалось загрузить потенциальных соседей");
      } finally {
        setLoading(false);
      }
    };

    if (cookies.TOKEN) {
      fetchRoommates();
    }
  }, [cookies.TOKEN]);

  const handleSwipe = async (direction: "left" | "right") => {
    if (!potentialRoommates.length || currentIndex >= potentialRoommates.length)
      return;

    const currentRoommate = potentialRoommates[currentIndex];
    

    if (direction === "right") {
      try {
        setLikeInProgress(true);
        await likeUser(cookies.TOKEN, currentRoommate.id);
      } catch (error) {
        console.error("Error liking user:", error);
      } finally {
        setLikeInProgress(false);
      }
    }

    // Анимация исчезновения карточки
    setSwipeStyle({
      x: direction === "right" ? 300 : -300, // Сдвиг в сторону свайпа
      rotate: direction === "right" ? 15 : -15, // Наклон в сторону свайпа
    });

    setTimeout(() => {
      setSwipeStyle({ x: 0, rotate: 0 }); // Сброс стилей после анимации
      setIsSwiping(false);

      if (currentIndex < potentialRoommates.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setPotentialRoommates([]);
      }
    }, 300); // Задержка для завершения анимации
  };

  const checkCompatibility = async () => {
    if (!potentialRoommates.length || currentIndex >= potentialRoommates.length)
      return;

    const currentRoommate = potentialRoommates[currentIndex];

    try {
      setLoadingCompatibility(true);
      const data = await getCompatibilityScore(
        cookies.TOKEN,
        currentRoommate.id
      );
      setCompatibilityData(data);
      setShowCompatibility(true);
    } catch (error) {
      console.error("Error getting compatibility score:", error);
    } finally {
      setLoadingCompatibility(false);
    }
  };

  const swipeHandlers = useSwipeable({
    onSwiping: (eventData) => {
      setIsSwiping(true);
      setSwipeStyle({
        x: eventData.deltaX,
        rotate: eventData.deltaX / 10, // Наклон пропорционален движению
      });
    },
    onSwipedLeft: () => handleSwipe("left"),
    onSwipedRight: () => handleSwipe("right"),
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  if (loading) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
          <p>Ищем подходящих соседей...</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-64">
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Попробовать снова
          </Button>
        </div>
      </Layout>
    );
  }

  if (!potentialRoommates.length || currentIndex >= potentialRoommates.length) {
    return (
      <Layout>
        <div className="flex flex-col items-center max-w-md mx-auto">
          <h2 className="text-2xl font-bold mb-6">Найди соседа</h2>
          <Card className="w-full text-center p-8">
            <div className="py-10">
              <p className="text-xl font-medium mb-2">
                На данный момент нет подходящих соседей
              </p>
              <p className="text-muted-foreground mb-6">
                Загляните позже или поменяйте критерии поиска в профиле
              </p>
              <Button onClick={() => window.location.reload()}>Обновить</Button>
            </div>
          </Card>
        </div>
      </Layout>
    );
  }

  const currentRoommate = potentialRoommates[currentIndex];

  return (
    <Layout>
      <div className="flex flex-col items-center max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-4 md:mb-6">Найди соседа</h2>

        <div className="relative w-full h-full">
          {potentialRoommates
            .slice(currentIndex + 1, currentIndex + 6) // Показываем 5-8 карточек под текущей
            .reverse() // Обратный порядок, чтобы верхняя карта была ближе
            .map((roommate, index) => (
              <Card
                className="w-full h-[75vh] opacity-50 absolute w-full bg-white"
                key={roommate.id}
                style={{
                  transform: `rotate(${(index - 2) * 3}deg)`, // Угол наклона для каждой карты
                  zIndex: -index, // Карты под текущей
                }}
              >
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>
                      {roommate.name || "Без имени"}
                      {roommate.age ? `, ${roommate.age}` : ""}
                    </CardTitle>
                    <CardDescription>
                      {roommate.occupation || "Не указано"}
                    </CardDescription>
                  </div>
                  <Avatar className="h-12 w-12 avatar-ring">
                    <AvatarImage
                      src={roommate.avatar || "/api/placeholder/100/100"}
                      alt={roommate.name || "Пользователь"}
                    />
                    <AvatarFallback>
                      {roommate.name?.slice(0, 2) || "?"}
                    </AvatarFallback>
                  </Avatar>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium">О себе:</h3>
                      <p className="text-gray-600">
                        {roommate.bio || "Информация о себе не указана"}
                      </p>
                    </div>

                    <div>
                      <h3 className="font-medium">Интересы:</h3>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {roommate.interests &&
                        roommate.interests.length > 0 ? (
                          roommate.interests.map((interest, i) => (
                            <Badge key={i} variant="secondary">
                              {interest}
                            </Badge>
                          ))
                        ) : (
                          <p className="text-gray-500">Интересы не указаны</p>
                        )}
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
                                roommate.cleanliness_level &&
                                level <= roommate.cleanliness_level
                                  ? "bg-green-500"
                                  : "bg-gray-200"
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="font-medium">Бюджет:</h3>
                        <p className="text-gray-600">
                          {roommate.rent_budget
                            ? `${roommate.rent_budget} ₽/мес`
                            : "Не указан"}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h3 className="font-medium">Сон:</h3>
                        <p className="text-gray-600">
                          {roommate.sleep_habits || "Не указано"}
                        </p>
                      </div>

                      <div>
                        <h3 className="font-medium">Район:</h3>
                        <p className="text-gray-600">
                          {roommate.location || "Не указан"}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h3 className="font-medium">Курение:</h3>
                        <p className="text-gray-600">
                          {roommate.smoking_preference || "Не указано"}
                        </p>
                      </div>

                      <div>
                        <h3 className="font-medium">Животные:</h3>
                        <p className="text-gray-600">
                          {roommate.pet_preference || "Не указано"}
                        </p>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={checkCompatibility}
                      disabled={loadingCompatibility}
                    >
                      {loadingCompatibility ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Анализируем совместимость...
                        </>
                      ) : (
                        "Проверить совместимость"
                      )}
                    </Button>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full h-12 w-12 cursor-pointer"
                    onClick={() => handleSwipe("left")}
                    disabled={likeInProgress}
                  >
                    <X className="h-6 w-6 text-destructive text-red-500" />
                  </Button>

                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full h-12 w-12 cursor-pointer"
                    onClick={() => handleSwipe("right")}
                    disabled={likeInProgress}
                  >
                    {likeInProgress ? (
                      <Loader2 className="h-6 w-6 animate-spin" />
                    ) : (
                      <Heart className="h-6 w-6 text-green-500" />
                    )}
                  </Button>
                </CardFooter>
              </Card>
            ))}
        </div>

        {/* Оборачиваем карточку в обработчик свайпов */}
        <motion.div
          className="w-full bg-white"
          {...swipeHandlers}
          style={{
            x: swipeStyle.x,
            rotate: swipeStyle.rotate,
            opacity: 1 - Math.min(Math.abs(swipeStyle.x) / 300, 1),
          }}
          animate={isSwiping ? {} : { x: 0, rotate: 0, opacity: 1 }}
          exit={{ x: swipeStyle.x, opacity: 0 }} // Анимация исчезновения
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          {showCompatibility && compatibilityData ? (
            <Card className="w-full animate-in bg-white">
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  Совместимость
                  <Badge variant="outline" className="text-lg font-bold">
                    {Math.round(compatibilityData.score)}%
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Анализ совместимости с {currentRoommate.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-indigo-600 h-4 rounded-full"
                      style={{ width: `${compatibilityData.score}%` }}
                    ></div>
                  </div>

                  <div className="bg-secondary p-4 rounded-lg">
                    <p className="whitespace-pre-wrap">
                      {compatibilityData.explanation}
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full h-12 w-12 cursor-pointer"
                  onClick={() => handleSwipe("left")}
                  disabled={likeInProgress}
                >
                  <X className="h-6 w-6 text-destructive text-red-500" />
                </Button>

                <Button
                  variant="default"
                  onClick={() => setShowCompatibility(false)}
                >
                  Вернуться к профилю
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full h-12 w-12 cursor-pointer"
                  onClick={() => handleSwipe("right")}
                  disabled={likeInProgress}
                >
                  {likeInProgress ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    <Heart className="h-6 w-6 text-green-500" />
                  )}
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <Card className="w-full animate-in bg-white">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>
                    {currentRoommate.name || "Без имени"}
                    {currentRoommate.age ? `, ${currentRoommate.age}` : ""}
                  </CardTitle>
                  <CardDescription>
                    {currentRoommate.occupation || "Не указано"}
                  </CardDescription>
                </div>
                <Avatar className="h-12 w-12 avatar-ring">
                  <AvatarImage
                    src={currentRoommate.avatar || "/api/placeholder/100/100"}
                    alt={currentRoommate.name || "Пользователь"}
                  />
                  <AvatarFallback>
                    {currentRoommate.name?.slice(0, 2) || "?"}
                  </AvatarFallback>
                </Avatar>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium">О себе:</h3>
                    <p className="text-gray-600">
                      {currentRoommate.bio || "Информация о себе не указана"}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-medium">Интересы:</h3>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {currentRoommate.interests &&
                      currentRoommate.interests.length > 0 ? (
                        currentRoommate.interests.map((interest, i) => (
                          <Badge key={i} variant="secondary">
                            {interest}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-gray-500">Интересы не указаны</p>
                      )}
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
                              currentRoommate.cleanliness_level &&
                              level <= currentRoommate.cleanliness_level
                                ? "bg-green-500"
                                : "bg-gray-200"
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium">Бюджет:</h3>
                      <p className="text-gray-600">
                        {currentRoommate.rent_budget
                          ? `${currentRoommate.rent_budget} ₽/мес`
                          : "Не указан"}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-medium">Сон:</h3>
                      <p className="text-gray-600">
                        {currentRoommate.sleep_habits || "Не указано"}
                      </p>
                    </div>

                    <div>
                      <h3 className="font-medium">Район:</h3>
                      <p className="text-gray-600">
                        {currentRoommate.location || "Не указан"}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-medium">Курение:</h3>
                      <p className="text-gray-600">
                        {currentRoommate.smoking_preference || "Не указано"}
                      </p>
                    </div>

                    <div>
                      <h3 className="font-medium">Животные:</h3>
                      <p className="text-gray-600">
                        {currentRoommate.pet_preference || "Не указано"}
                      </p>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={checkCompatibility}
                    disabled={loadingCompatibility}
                  >
                    {loadingCompatibility ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Анализируем совместимость...
                      </>
                    ) : (
                      "Проверить совместимость"
                    )}
                  </Button>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full h-12 w-12 cursor-pointer"
                  onClick={() => handleSwipe("left")}
                  disabled={likeInProgress}
                >
                  <X className="h-6 w-6 text-destructive text-red-500" />
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full h-12 w-12 cursor-pointer"
                  onClick={() => handleSwipe("right")}
                  disabled={likeInProgress}
                >
                  {likeInProgress ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    <Heart className="h-6 w-6 text-green-500" />
                  )}
                </Button>
              </CardFooter>
            </Card>
          )}
        </motion.div>

        <div className="mt-4 text-center text-gray-500">
          <p>Нажмите на правую кнопку, если хотите жить вместе</p>
        </div>
      </div>
    </Layout>
  );
}
