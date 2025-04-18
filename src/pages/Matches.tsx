import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronLeft, MessageSquare } from "lucide-react";
import { Message, User } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { mockMessages, mockUsers, mockMatches } from "@/lib/mocks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Layout from "@/components/Layout";

const matchedUsers = mockMatches.map(match => {
  const userId = match.userId1 === 'current' ? match.userId2 : match.userId1;
  return mockUsers.find(user => user.id === userId);
}).filter(Boolean) as User[];

export default function Matches() {
  const [messages, setMessages] =
    useState<Record<string, Message[]>>(mockMessages);
  const [currentChat, setCurrentChat] = useState<string | null>(null);
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
    <Layout>
      <div className="flex flex-col md:flex-row h-full">
        {/* Matches List */}
        <div
          className={`${
            currentChat ? "hidden md:block" : ""
          } md:w-1/3 border-r`}
        >
          <h2 className="text-2xl font-bold mb-4">Совпадения</h2>

          {matchedUsers.length === 0 ? (
            <div className="text-center p-4 bg-gray-100 rounded-md">
              <p>У вас пока нет совпадений</p>
              <p className="text-sm text-gray-500 mt-2">
                Продолжайте искать, чтобы найти идеального соседа
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {matchedUsers.map((user) => (
                <Card
                  key={user.id}
                  className={`cursor-pointer hover:bg-gray-50 ${
                    currentChat === user.id ? "border-2 border-blue-500" : ""
                  }`}
                  onClick={() => setCurrentChat(user.id)}
                >
                  <CardHeader className="p-3">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>{user.name.slice(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-base">{user.name}</CardTitle>
                        <CardDescription className="text-xs">
                          {user.location}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Chat Area */}
        <div
          className={`${
            !currentChat ? "hidden md:flex" : "flex"
          } flex-col flex-1`}
        >
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
                    src={mockUsers.find((u) => u.id === currentChat)?.avatar}
                    alt={mockUsers.find((u) => u.id === currentChat)?.name}
                  />
                  <AvatarFallback>
                    {mockUsers
                      .find((u) => u.id === currentChat)
                      ?.name.slice(0, 2)}
                  </AvatarFallback>
                </Avatar>

                <div>
                  <h3 className="font-medium">
                    {mockUsers.find((u) => u.id === currentChat)?.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {mockUsers.find((u) => u.id === currentChat)?.location}
                  </p>
                </div>
              </div>

              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {(messages[currentChat] || []).map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${
                        msg.senderId === "current"
                          ? "justify-end"
                          : "justify-start"
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
                        {mockUsers.find((u) => u.id === currentChat)?.name}
                      </p>
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
      </div>
    </Layout>
  );
}
