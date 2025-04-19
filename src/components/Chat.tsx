import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronLeft, MessageSquare, SendIcon } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Message, User } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { useCookies } from "react-cookie";
import { chatWithAI, getUserProfile } from "@/lib/requests";
import { Card, CardContent } from "@/components/ui/card";

export default function Chat({
  currentChat,
  setCurrentChat,
  chatPartner,
}: {
  currentChat: string | null;
  setCurrentChat: Function | undefined;
  chatPartner?: User | null;
}) {
  const [loading, setLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [cookies] = useCookies(["TOKEN"]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    // Get current user info
    if (cookies.TOKEN) {
      getUserProfile(cookies.TOKEN)
        .then(data => {
          setCurrentUser(data);
        })
        .catch(err => {
          console.error("Failed to load current user:", err);
        });
    }

    // Initialize AI chat with welcome message if this is AI chat
    if (currentChat === "ai" && messages.length === 0) {
      setMessages([
        {
          id: `welcome-${Date.now()}`,
          senderId: "ai",
          receiverId: "current",
          content: "Привет! Я CrocoAI, ваш персональный помощник по вопросам совместного проживания. Чем я могу вам помочь сегодня?",
          timestamp: new Date(),
        }
      ]);
    }

    // Focus input when chat changes
    inputRef.current?.focus();
  }, [cookies.TOKEN, currentChat]);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle sending a message
  const handleSendMessage = async () => {
    if (newMessage.trim() === "" || !currentChat) return;

    const newMsg: Message = {
      id: `msg${Date.now()}`,
      senderId: "current",
      receiverId: currentChat,
      content: newMessage,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newMsg]);
    setNewMessage("");

    // If chatting with AI, get response from the backend AI assistant
    if (currentChat === "ai") {
      setLoading(true);
      try {
        const response = await chatWithAI(cookies.TOKEN, newMessage);

        const aiResponse: Message = {
          id: `msg${Date.now() + 1}`,
          senderId: "ai",
          receiverId: "current",
          content: response.response,
          timestamp: new Date(),
        };

        setMessages(prev => [...prev, aiResponse]);
      } catch (error) {
        console.error("Error getting AI response:", error);

        // Add error message
        const errorMsg: Message = {
          id: `msg${Date.now() + 1}`,
          senderId: "ai",
          receiverId: "current",
          content: "Извините, произошла ошибка при получении ответа от ИИ. Пожалуйста, попробуйте позже.",
          timestamp: new Date(),
        };

        setMessages(prev => [...prev, errorMsg]);
      } finally {
        setLoading(false);
      }
    }
  };

  // For AI chat, create a default AI user
  const aiUser: User = {
    id: "ai",
    name: "CrocoAI",
    age: 0,
    gender: "Не указано",
    occupation: "ИИ-ассистент",
    avatar: "/api/placeholder/100/100",
    bio: "Я ваш персональный AI-помощник для вопросов о совместном проживании и поиске соседей.",
    interests: [],
    cleanlinessLevel: 5,
    sleepHabits: "Всегда доступен",
    rentBudget: 0,
    location: "Везде",
    smokingPreference: "Не курит",
    petPreference: "Нейтрально"
  };

  // Determine the chat partner
  const partner = currentChat === "ai" ? aiUser : chatPartner;

  return (
    <div className={`${!currentChat ? "hidden md:flex" : "flex"} flex-col flex-1 bg-white rounded-lg shadow-sm`}>
      {currentChat && setCurrentChat && partner ? (
        <>
          <div className="flex items-center p-4 border-b mb-2 sticky top-0 bg-white z-10">
            {currentChat !== "ai" ? (
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden mr-2"
                onClick={() => setCurrentChat(null)}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
            ) : null}

            <Avatar className="h-10 w-10 mr-3 avatar-ring">
              <AvatarImage
                src={partner.avatar}
                alt={partner.name}
              />
              <AvatarFallback>
                {partner.name.slice(0, 2)}
              </AvatarFallback>
            </Avatar>

            <div>
              <h3 className="font-medium text-gray-900">{partner.name}</h3>
              <p className="text-xs text-gray-500">
                {currentChat === "ai" ? "ИИ-ассистент" : partner.location}
              </p>
            </div>
          </div>

          <ScrollArea className="flex-1 px-2 py-4 md:px-4">
            <div className="space-y-4 mx-2">
              {messages.map((msg, index) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.senderId === "current" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs md:max-w-md p-3 rounded-lg ${
                      msg.senderId === "current"
                        ? "bg-primary text-primary-foreground rounded-br-none"
                        : "bg-secondary text-secondary-foreground rounded-bl-none"
                    }`}
                  >
                    <p className="whitespace-pre-wrap break-words text-sm md:text-base">{msg.content}</p>
                    <p
                      className={`text-xs mt-1 ${
                        msg.senderId === "current"
                          ? "text-primary-foreground/70"
                          : "text-secondary-foreground/70"
                      }`}
                    >
                      {formatDate(msg.timestamp)}
                    </p>
                  </div>
                </div>
              ))}

              {messages.length === 0 && (
                <div className="text-center py-10">
                  <MessageSquare className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500 font-medium">
                    Начните общение с {partner.name}
                  </p>
                  <p className="text-gray-400 text-sm mt-1">
                    {currentChat === "ai"
                      ? "Задайте вопрос об аренде, соседях или бытовых вопросах"
                      : "Обсудите детали совместного проживания"}
                  </p>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          <div className="p-4 border-t mt-auto">
            <div className="flex space-x-2">
              <Input
                ref={inputRef}
                placeholder={loading ? "CrocoAI думает над ответом..." : "Введите сообщение..."}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                disabled={loading}
                className="bg-gray-50 focus:bg-white"
              />
              <Button
                onClick={handleSendMessage}
                disabled={loading}
                className="px-4"
              >
                {loading ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent"></div>
                ) : (
                  <SendIcon className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <Card className="max-w-md mx-auto p-6 text-center">
            <CardContent className="pt-6">
              <MessageSquare className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-medium mb-2">Ваши сообщения</h3>
              <p className="text-gray-500">
                Выберите совпадение, чтобы начать общение
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}