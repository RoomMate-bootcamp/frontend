import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User } from "@/lib/types";
import { currentUser } from "@/lib/mocks";
import Layout from "@/components/Layout";

export default function Profile() {
  const [isEditProfile, setIsEditProfile] = useState(false);
  const [profile, setProfile] = useState<User>(currentUser);

  const [formState, setFormState] = useState({ ...currentUser });

  // Handle profile update
  const handleProfileUpdate = () => {
    setProfile(formState);
    setIsEditProfile(false);
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between mb-6">
          <h2 className="text-2xl font-bold">Мой профиль</h2>
          <Button onClick={() => setIsEditProfile(!isEditProfile)}>
            {isEditProfile ? "Отмена" : "Редактировать"}
          </Button>
        </div>

        {isEditProfile ? (
          <Card>
            <CardHeader>
              <CardTitle>Редактирование профиля</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="name">Имя</Label>
                  <Input
                    id="name"
                    value={formState.name}
                    onChange={(e) =>
                      setFormState({ ...formState, name: e.target.value })
                    }
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="age">Возраст</Label>
                    <Input
                      id="age"
                      type="number"
                      value={formState.age}
                      onChange={(e) =>
                        setFormState({
                          ...formState,
                          age: parseInt(e.target.value) || 18,
                        })
                      }
                    />
                  </div>

                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="gender">Пол</Label>
                    <Select
                      value={formState.gender}
                      onValueChange={(value) =>
                        setFormState({ ...formState, gender: value })
                      }
                    >
                      <SelectTrigger id="gender">
                        <SelectValue placeholder="Выберите пол" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="Мужской">Мужской</SelectItem>
                        <SelectItem value="Женский">Женский</SelectItem>
                        <SelectItem value="Другой">Другой</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="occupation">Род занятий</Label>
                    <Input
                      id="occupation"
                      value={formState.occupation}
                      onChange={(e) =>
                        setFormState({
                          ...formState,
                          occupation: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="bio">О себе</Label>
                  <Textarea
                    id="bio"
                    value={formState.bio}
                    onChange={(e) =>
                      setFormState({ ...formState, bio: e.target.value })
                    }
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="rentBudget">Бюджет (₽/мес)</Label>
                    <Input
                      id="rentBudget"
                      type="number"
                      value={formState.rentBudget}
                      onChange={(e) =>
                        setFormState({
                          ...formState,
                          rentBudget: parseInt(e.target.value) || 0,
                        })
                      }
                    />
                  </div>

                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="location">Предпочитаемый район</Label>
                    <Input
                      id="location"
                      value={formState.location}
                      onChange={(e) =>
                        setFormState({ ...formState, location: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="sleepHabits">Режим сна</Label>
                    <Select
                      value={formState.sleepHabits}
                      onValueChange={(value) =>
                        setFormState({ ...formState, sleepHabits: value })
                      }
                    >
                      <SelectTrigger id="sleepHabits">
                        <SelectValue placeholder="Выберите режим" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="Рано ложусь, рано встаю">
                          Рано ложусь, рано встаю
                        </SelectItem>
                        <SelectItem value="Поздно ложусь, поздно встаю">
                          Поздно ложусь, поздно встаю
                        </SelectItem>
                        <SelectItem value="Обычный график">
                          Обычный график
                        </SelectItem>
                        <SelectItem value="Разный график">
                          Разный график
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="cleanlinessLevel">
                      Уровень чистоплотности (1-5)
                    </Label>
                    <Select
                      value={formState.cleanlinessLevel.toString()}
                      onValueChange={(value) =>
                        setFormState({
                          ...formState,
                          cleanlinessLevel: parseInt(value),
                        })
                      }
                    >
                      <SelectTrigger id="cleanlinessLevel">
                        <SelectValue placeholder="Выберите уровень" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="1">1 - Минимальный</SelectItem>
                        <SelectItem value="2">2 - Ниже среднего</SelectItem>
                        <SelectItem value="3">3 - Средний</SelectItem>
                        <SelectItem value="4">4 - Выше среднего</SelectItem>
                        <SelectItem value="5">
                          5 - Очень чистоплотный
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="smokingPreference">
                      Отношение к курению
                    </Label>
                    <Select
                      value={formState.smokingPreference}
                      onValueChange={(value) =>
                        setFormState({ ...formState, smokingPreference: value })
                      }
                    >
                      <SelectTrigger id="smokingPreference">
                        <SelectValue placeholder="Выберите отношение" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="Курю">Курю</SelectItem>
                        <SelectItem value="Не курю">Не курю</SelectItem>
                        <SelectItem value="Не курю, сосед тоже не должен">
                          Не курю, сосед тоже не должен
                        </SelectItem>
                        <SelectItem value="Не курю в помещении">
                          Не курю в помещении
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="petPreference">Отношение к животным</Label>
                    <Select
                      value={formState.petPreference}
                      onValueChange={(value) =>
                        setFormState({ ...formState, petPreference: value })
                      }
                    >
                      <SelectTrigger id="petPreference">
                        <SelectValue placeholder="Выберите отношение" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="У меня есть питомец">
                          У меня есть питомец
                        </SelectItem>
                        <SelectItem value="Люблю животных">
                          Люблю животных
                        </SelectItem>
                        <SelectItem value="Без животных, пожалуйста">
                          Без животных, пожалуйста
                        </SelectItem>
                        <SelectItem value="Аллергия на животных">
                          Аллергия на животных
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleProfileUpdate}>Сохранить изменения</Button>
            </CardFooter>
          </Card>
        ) : (
          <Card>
            <CardHeader className="flex flex-row items-start justify-between">
              <div>
                <CardTitle className="text-2xl">
                  {profile.name}, {profile.age}
                </CardTitle>
                <CardDescription>{profile.occupation}</CardDescription>
              </div>
              <Avatar className="h-16 w-16">
                <AvatarImage src={profile.avatar} alt={profile.name} />
                <AvatarFallback>{profile.name.slice(0, 2)}</AvatarFallback>
              </Avatar>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-medium mb-2">О себе</h3>
                  <p className="text-gray-700">{profile.bio}</p>
                </div>

                <div>
                  <h3 className="text-xl font-medium mb-2">Интересы</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.interests.map((interest, i) => (
                      <Badge key={i} variant="secondary">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-xl font-medium mb-2">
                      Жилищные предпочтения
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Бюджет:</span>
                        <span className="font-medium">
                          {profile.rentBudget} ₽/мес
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Район:</span>
                        <span className="font-medium">{profile.location}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-medium mb-2">
                      Личные привычки
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Режим сна:</span>
                        <span className="font-medium">
                          {profile.sleepHabits}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Чистоплотность:</span>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((level) => (
                            <div
                              key={level}
                              className={`w-4 h-4 rounded-full mx-0.5 ${
                                level <= profile.cleanlinessLevel
                                  ? "bg-green-500"
                                  : "bg-gray-200"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Курение:</span>
                    <span className="font-medium">
                      {profile.smokingPreference}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Животные:</span>
                    <span className="font-medium">{profile.petPreference}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
