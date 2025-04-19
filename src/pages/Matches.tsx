import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { User } from "@/lib/types";
import { mockUsers, mockMatches } from "@/lib/mocks";
import Layout from "@/components/Layout";
import Chat from '@/components/Chat';

const matchedUsers = mockMatches.map(match => {
  const userId = match.userId1 === 'current' ? match.userId2 : match.userId1;
  return mockUsers.find(user => user.id === userId);
}).filter(Boolean) as User[];

export default function Matches() {
  const [currentChat, setCurrentChat] = useState<string | null>(null);

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
              <p className="text-base text-gray-500 mt-2">
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
                        <CardTitle className="text-lg">{user.name}</CardTitle>
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
        <Chat currentChat={currentChat} setCurrentChat={setCurrentChat} />
      </div>
    </Layout>
  );
}
