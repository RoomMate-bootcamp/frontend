import { useState, useEffect, useRef } from "react";
import { Heart, X, Loader2, Bell, Info } from "lucide-react";
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
  getUserProfile,
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead
} from '@/lib/requests';
import { useCookies } from "react-cookie";
import { useSwipeable } from "react-swipeable";
import { motion } from "framer-motion";
import CompatibilityAnalyzer from "@/components/CompatibilityAnalyzer";

export default function Search() {
  const [cookies] = useCookies(["TOKEN"]);
  const [loading, setLoading] = useState(true);
  const [likeInProgress, setLikeInProgress] = useState(false);
  const [potentialRoommates, setPotentialRoommates] = useState([]);
  const [dislikedRoommates, setDislikedRoommates] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState(null);
  const [showCompatibility, setShowCompatibility] = useState(false);
  const [swipeStyle, setSwipeStyle] = useState({ x: 0, rotate: 0 });
  const [isSwiping, setIsSwiping] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const notificationsRef = useRef(null);

  // Close notifications when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [notificationsRef]);

  // Load notifications periodically
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await getNotifications(cookies.TOKEN);
        setNotifications(response.notifications || []);
        setUnreadCount(response.unread_count || 0);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();

    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [cookies.TOKEN]);

  // Initial data loading
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // First fetch current user profile
        const userData = await getUserProfile(cookies.TOKEN);
        setCurrentUser(userData);

        // Then fetch potential roommates
        const data = await getPotentialRoommates(cookies.TOKEN);

        if (data && Array.isArray(data)) {
          setPotentialRoommates(data);
        } else {
          setPotentialRoommates([]);
          setError("Не получены данные о соседях");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Не удалось загрузить данные");
      } finally {
        setLoading(false);
      }
    };

    if (cookies.TOKEN) {
      fetchData();
    }
  }, [cookies.TOKEN]);

  const handleNotificationClick = async (notification) => {
    if (!notification.is_read) {
      try {
        await markNotificationAsRead(cookies.TOKEN, notification.id);
        // Update notification list
        setNotifications(prev =>
          prev.map(n =>
            n.id === notification.id ? {...n, is_read: true} : n
          )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      } catch (error) {
        console.error("Error marking notification as read:", error);
      }
    }

    // Handle notification actions if needed
    // For example, navigate to matches page for match notifications
  };

  const markAllRead = async () => {
    try {
      await markAllNotificationsAsRead(cookies.TOKEN);
      setNotifications(prev =>
        prev.map(n => ({...n, is_read: true}))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

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
    } else if (direction === "left") {
      // Save disliked roommate for later if we run out of new ones
      setDislikedRoommates(prev => [...prev, currentRoommate]);
    }

    // Animation for swiping
    setSwipeStyle({
      x: direction === "right" ? 300 : -300,
      rotate: direction === "right" ? 15 : -15,
    });

    setTimeout(() => {
      setSwipeStyle({ x: 0, rotate: 0 });
      setIsSwiping(false);

      // Remove the current roommate from the list
      const updatedRoommates = [...potentialRoommates];
      updatedRoommates.splice(currentIndex, 1);
      setPotentialRoommates(updatedRoommates);

      // If we run out of new roommates, use the disliked ones
      if (updatedRoommates.length === 0 && dislikedRoommates.length > 0) {
        setPotentialRoommates(dislikedRoommates);
        setDislikedRoommates([]);
        setCurrentIndex(0);
      }
    }, 300);
  };

  const toggleCompatibility = () => {
    setShowCompatibility(!showCompatibility);
  };

  const swipeHandlers = useSwipeable({
    onSwiping: (eventData) => {
      setIsSwiping(true);
      setSwipeStyle({
        x: eventData.deltaX,
        rotate: eventData.deltaX / 10,
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

  if (!potentialRoommates.length) {
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

  const currentRoommate = potentialRoommates[0]; // Always show first roommate in the array

  return (
    <Layout>
      <div className="flex flex-col items-center max-w-md mx-auto">
        <div className="w-full flex justify-between items-center mb-4 md:mb-6">
          <h2 className="text-2xl font-bold">Найди соседа</h2>

          {/* Notifications Bell */}
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 rounded-full text-xs"
                >
                  {unreadCount}
                </Badge>
              )}
            </Button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div
                ref={notificationsRef}
                className="absolute top-full right-0 mt-1 w-80 bg-white rounded-lg shadow-lg z-50 border overflow-hidden"
              >
                <div className="p-3 border-b flex justify-between items-center">
                  <h3 className="font-medium">Уведомления</h3>
                  {unreadCount > 0 && (
                    <Button variant="ghost" size="sm" onClick={markAllRead} className="text-xs">
                      Отметить все прочитанными
                    </Button>
                  )}
                </div>

                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="py-4 px-3 text-center text-gray-500">
                      <Info className="w-5 h-5 mx-auto mb-1" />
                      <p>Нет уведомлений</p>
                    </div>
                  ) : (
                    notifications.map(notification => (
                      <div
                        key={notification.id}
                        className={`p-3 border-b hover:bg-gray-50 cursor-pointer ${!notification.is_read ? 'bg-blue-50' : ''}`}
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <div className="flex gap-3 items-start">
                          {notification.related_user && (
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={notification.related_user.avatar} />
                              <AvatarFallback>{notification.related_user.name?.slice(0, 2) || '?'}</AvatarFallback>
                            </Avatar>
                          )}
                          <div>
                            <p className={`text-sm ${!notification.is_read ? 'font-medium' : ''}`}>
                              {notification.content}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(notification.timestamp).toLocaleString('ru-RU', {
                                day: '2-digit',
                                month: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main content with either profile or compatibility analysis */}
        <motion.div
          className="w-full bg-white"
          {...swipeHandlers}
          style={{
            x: swipeStyle.x,
            rotate: swipeStyle.rotate,
            opacity: 1, // No transparency
          }}
          animate={isSwiping ? {} : { x: 0, rotate: 0, opacity: 1 }}
          exit={{ x: swipeStyle.x, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          {showCompatibility ? (
            <CompatibilityAnalyzer
              roommate={currentRoommate}
              currentUser={currentUser}
              onClose={toggleCompatibility}
            />
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
                    onClick={toggleCompatibility}
                  >
                    🔍 Проверить совместимость
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
      </div>
    </Layout>
  );
}