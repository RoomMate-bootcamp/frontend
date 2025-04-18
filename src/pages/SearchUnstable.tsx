import { useState } from "react";
import { Heart, X } from "lucide-react";
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
import { mockUsers, mockMatches } from "@/lib/mocks";
import { Match } from "@/lib/types";
import Layout from "@/components/Layout";

export default function Search() {
  const [userIndex, setUserIndex] = useState(0);

  const currentViewUser = mockUsers[userIndex];

  const [matches, setMatches] = useState<Match[]>(mockMatches);

  const handleSwipe = (direction: "left" | "right") => {
    if (direction === "right") {
      // Simulate a match with 30% probability
      const newMatch: Match = {
        id: `m${matches.length + 1}`,
        userId1: "current",
        userId2: mockUsers[userIndex].id,
        timestamp: new Date(),
      };
      setMatches([...matches, newMatch]);
    }

    // Move to next user
    if (userIndex < mockUsers.length - 1) {
      setUserIndex(userIndex + 1);
    } else {
      // Loop back to first user when reached the end
      setUserIndex(0);
    }
  };

  return (
    <Layout>
      <div className="flex flex-col items-center max-w-md mx-auto">
      {/* <div className="flex flex-col items-center max-w-md mx-auto relative w-full"> */}
        {/* <div className="w-full h-full hover:bg-red-300 absolute -left-1/2 top-0 z-10 opacity-15 cursor-pointer blur-xl transition" onClick={() => handleSwipe("left")}></div>
        <div className="w-full h-full hover:bg-green-300 absolute left-1/2 top-0 z-10 opacity-15 cursor-pointer blur-xl transition" onClick={() => handleSwipe("right")}></div> */}
        <h2 className="text-2xl font-bold mb-4 md:mb-6">Найди соседа</h2>

        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>
                {currentViewUser.name}, {currentViewUser.age}
              </CardTitle>
              <CardDescription>{currentViewUser.occupation}</CardDescription>
            </div>
            <Avatar className="h-12 w-12">
              <AvatarImage
                src={currentViewUser.avatar}
                alt={currentViewUser.name}
              />
              <AvatarFallback>
                {currentViewUser.name.slice(0, 2)}
              </AvatarFallback>
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
                    <Badge key={i} variant="secondary">
                      {interest}
                    </Badge>
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
                          level <= currentViewUser.cleanlinessLevel
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
                    {currentViewUser.rentBudget} ₽/мес
                  </p>
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
                  <p className="text-gray-600">
                    {currentViewUser.smokingPreference}
                  </p>
                </div>

                <div>
                  <h3 className="font-medium">Животные:</h3>
                  <p className="text-gray-600">
                    {currentViewUser.petPreference}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full h-12 w-12 cursor-pointer"
              onClick={() => handleSwipe("left")}
            >
              <X className="h-6 w-6 text-red-500" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              className="rounded-full h-12 w-12 cursor-pointer"
              onClick={() => handleSwipe("right")}
            >
              <Heart className="h-6 w-6 text-green-500" />
            </Button>
          </CardFooter>
        </Card>

        <div className="mt-4 text-center text-gray-500">
          <p>Нажмите вправо, если хотите жить вместе</p>
        </div>
      </div>
    </Layout>
  );
}
