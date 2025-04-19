import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronLeft, MessageSquare } from "lucide-react";
import { mockUsers, mockMessages } from "@/lib/mocks";
import { formatDate } from "@/lib/utils";
import { Message } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function Chat({
  currentChat,
  setCurrentChat,
}: {
  currentChat: string | null;
  setCurrentChat: Function | undefined;
}) {
  const [loading, setLoading] = useState<boolean>(false);
  const [messages, setMessages] =
    useState<Record<string, Message[]>>(mockMessages);
  const [newMessage, setNewMessage] = useState("");

  // Handle sending a message
  const handleSendMessage = () => {
    if (newMessage.trim() === "" || !currentChat) return;

    const newMsg: Message = {
      id: `msg${Date.now()}`,
      senderId: "current",
      receiverId: currentChat,
      content: newMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => ({
      ...prev,
      [currentChat]: [...(prev[currentChat] || []), newMsg],
    }));

    setNewMessage("");
  };
  return (
    <div
      className={`${!currentChat ? "hidden md:flex" : "flex"} flex-col flex-1`}
    >
      {currentChat && setCurrentChat ? (
        <>
          <div className="flex items-center p-4 border-b mb-2">
            {currentChat !== "ai" ? (
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden mr-2"
                onClick={() => setCurrentChat(null)}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
            ) : (
              ""
            )}

            <Avatar className="h-10 w-10 mr-3">
              <AvatarImage
                src={mockUsers.find((u) => u.id === currentChat)?.avatar}
                alt={mockUsers.find((u) => u.id === currentChat)?.name}
              />
              <AvatarFallback>
                {mockUsers.find((u) => u.id === currentChat)?.name.slice(0, 2)}
              </AvatarFallback>
            </Avatar>

            <div>
              <h3 className="font-medium">
                {mockUsers.find((u) => u.id === currentChat)?.name}
              </h3>
              <p className="text-base text-gray-500">
                {mockUsers.find((u) => u.id === currentChat)?.location}
              </p>
            </div>
          </div>

          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4 flex-col justify-between h-[70vh]">
              {(messages[currentChat] || []).map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.senderId === "current" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs p-3 rounded-lg ${
                      msg.senderId === "current"
                        ? "bg-blue-500 text-white rounded-br-none"
                        : "bg-gray-200 text-gray-800 rounded-bl-none"
                    }`}
                  >
                    <p>{msg.content}</p>
                    <p
                      className={`text-xs mt-1 ${
                        msg.senderId === "current"
                          ? "text-blue-100"
                          : "text-gray-500"
                      }`}
                    >
                      {formatDate(msg.timestamp)}
                    </p>
                  </div>
                </div>
              ))}

              {(messages[currentChat] || []).length === 0 && (
                <div className="text-center p-4 text-gray-500">
                  <p>
                    Начните общение с{" "}
                    {mockUsers.find((u) => u.id === currentChat)?.name ??
                    currentChat === "ai"
                      ? "CrocoAI"
                      : "неизвестным человеком"}{" "}
                    :)
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="p-4 border-t mt-auto">
            <div className="flex space-x-2">
              <Input
                placeholder={loading ? "CrocoAI думает над ответом..." : "Введите сообщение..."}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              />
              <Button onClick={handleSendMessage}>Отправить</Button>
            </div>
          </div>
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center p-8">
            <MessageSquare className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-medium mb-2">Ваши сообщения</h3>
            <p className="text-gray-500">
              Выберите совпадение, чтобы начать общение
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
