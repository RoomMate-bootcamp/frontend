import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
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
import { ProfileUpdate, User } from "@/lib/types";
import { getUserProfile, updateUserProfile } from "@/lib/requests";
import Layout from "@/components/Layout";
import { Loader2, Pencil } from "lucide-react";

export default function Profile() {
  const [cookies] = useCookies(["TOKEN"]);
  const navigate = useNavigate();
  const [isEditProfile, setIsEditProfile] = useState(false);
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  const [formState, setFormState] = useState<ProfileUpdate>({});

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const userData = await getUserProfile(cookies.TOKEN);
        setProfile(userData);
        // Initialize form state with profile data
        setFormState({
          name: userData.name,
          age: userData.age,
          gender: userData.gender,
          occupation: userData.occupation,
          bio: userData.bio,
          interests: userData.interests || [],
          cleanliness_level: userData.cleanliness_level,
          sleep_habits: userData.sleep_habits,
          rent_budget: userData.rent_budget,
          location: userData.location,
          smoking_preference: userData.smoking_preference,
          pet_preference: userData.pet_preference,
          study_location: userData.study_location,
          study_program: userData.study_program,
          accommodation_preference: userData.accommodation_preference,
          telegram_username: userData.telegram_username,
        });
      } catch (error) {
        console.error("Failed to load profile:", error);
        setError("Не удалось загрузить профиль");
      } finally {
        setLoading(false);
      }
    };

    if (cookies.TOKEN) {
      loadProfile();
    } else {
      navigate("/login");
    }
  }, [cookies.TOKEN, navigate]);

  // Handle profile update
  const handleProfileUpdate = async () => {
    try {
      setUpdating(true);
      setError("");

      // Process numeric fields
      const processedUpdate = {
        ...formState,
        age: formState.age ? Number(formState.age) : undefined,
        cleanliness_level: formState.cleanliness_level ? Number(formState.cleanliness_level) : undefined,
        rent_budget: formState.rent_budget ? Number(formState.rent_budget) : undefined,
      };

      const updatedProfile = await updateUserProfile(cookies.TOKEN, processedUpdate);
      setProfile(updatedProfile);
      setIsEditProfile(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
      setError("Не удалось обновить профиль");
    } finally {
      setUpdating(false);
    }
  };

  // Handle adding a new interest
  const handleAddInterest = (interest: string) => {
    if (!formState.interests) {
      setFormState({...formState, interests: [interest]});
      return;
    }

    if (!formState.interests.includes(interest)) {
      setFormState({
        ...formState,
        interests: [...formState.interests, interest]
      });
    }
  };

  // Handle removing an interest
  const handleRemoveInterest = (interest: string) => {
    if (!formState.interests) return;

    setFormState({
      ...formState,
      interests: formState.interests.filter(i => i !== interest)
    });
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Загрузка профиля...</span>
        </div>
      </Layout>
    );
  }

  if (!profile) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <p className="text-destructive mb-4">{error || "Не удалось загрузить профиль"}</p>
            <Button onClick={() => navigate("/")}>Вернуться на главную</Button>
          </div>
        </div>
      </Layout>
    );
  }

  // Map accommodation value to display text
  const getAccommodationText = (value?: string) => {
    const map: Record<string, string> = {
      "apartment": "Квартира",
      "dormitory": "Общежитие",
      "no_preference": "Не имеет значения"
    };
    return value ? map[value] || value : "Не указано";
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Мой профиль</h2>
          <Button
            onClick={() => setIsEditProfile(!isEditProfile)}
            variant={isEditProfile ? "outline" : "default"}
          >
            {isEditProfile ? "Отмена" : (
              <>
                <Pencil className="h-4 w-4 mr-2" />
                Редактировать
              </>
            )}
          </Button>
        </div>

        {isEditProfile ? (
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Редактирование профиля</CardTitle>
              <CardDescription>Внесите изменения в свой профиль</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="name">Имя</Label>
                  <Input
                    id="name"
                    value={formState.name || ""}
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
                      value={formState.age || ""}
                      onChange={(e) =>
                        setFormState({
                          ...formState,
                          age: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="gender">Пол</Label>
                    <Select
                      value={formState.gender || ""}
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
                      value={formState.occupation || ""}
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
                    value={formState.bio || ""}
                    onChange={(e) =>
                      setFormState({ ...formState, bio: e.target.value })
                    }
                    rows={4}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label>Интересы</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formState.interests?.map((interest) => (
                      <Badge key={interest} variant="outline" className="py-1 px-2">
                        {interest}
                        <button
                          type="button"
                          className="ml-2 text-gray-500 hover:text-destructive"
                          onClick={() => handleRemoveInterest(interest)}
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      id="interest"
                      placeholder="Добавить интерес"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                          e.preventDefault();
                          handleAddInterest(e.currentTarget.value.trim());
                          e.currentTarget.value = '';
                        }
                      }}
                    />
                    <Button
                      variant="outline"
                      onClick={() => {
                        const input = document.getElementById('interest') as HTMLInputElement;
                        if (input && input.value.trim()) {
                          handleAddInterest(input.value.trim());
                          input.value = '';
                        }
                      }}
                    >
                      Добавить
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="rentBudget">Бюджет (₽/мес)</Label>
                    <Input
                      id="rentBudget"
                      type="number"
                      value={formState.rent_budget || ""}
                      onChange={(e) =>
                        setFormState({
                          ...formState,
                          rent_budget: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="location">Предпочитаемый район</Label>
                    <Input
                      id="location"
                      value={formState.location || ""}
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
                      value={formState.sleep_habits || ""}
                      onValueChange={(value) =>
                        setFormState({ ...formState, sleep_habits: value })
                      }
                    >
                      <SelectTrigger id="sleepHabits">
                        <SelectValue placeholder="Выберите режим" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="Жаворонок">
                          Жаворонок (рано встаю)
                        </SelectItem>
                        <SelectItem value="Сова">
                          Сова (поздно ложусь)
                        </SelectItem>
                        <SelectItem value="Смешанный">
                          Смешанный график
                        </SelectItem>
                        <SelectItem value="Нерегулярный">
                          Нерегулярный график
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="cleanlinessLevel">
                      Уровень чистоплотности (1-5)
                    </Label>
                    <Select
                      value={formState.cleanliness_level?.toString() || ""}
                      onValueChange={(value) =>
                        setFormState({
                          ...formState,
                          cleanliness_level: value,
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
                      value={formState.smoking_preference || ""}
                      onValueChange={(value) =>
                        setFormState({ ...formState, smoking_preference: value })
                      }
                    >
                      <SelectTrigger id="smokingPreference">
                        <SelectValue placeholder="Выберите отношение" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="Не курю">Не курю</SelectItem>
                        <SelectItem value="Курю, но не дома">Курю, но не дома</SelectItem>
                        <SelectItem value="Курю дома">Курю дома</SelectItem>
                        <SelectItem value="Не курю, соседу тоже нельзя">
                          Не курю, соседу тоже нельзя
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="petPreference">Отношение к животным</Label>
                    <Select
                      value={formState.pet_preference || ""}
                      onValueChange={(value) =>
                        setFormState({ ...formState, pet_preference: value })
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="study_location">ВУЗ/Город учебы</Label>
                    <Input
                      id="study_location"
                      value={formState.study_location || ""}
                      onChange={(e) =>
                        setFormState({ ...formState, study_location: e.target.value })
                      }
                    />
                  </div>

                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="study_program">Специальность</Label>
                    <Input
                      id="study_program"
                      value={formState.study_program || ""}
                      onChange={(e) =>
                        setFormState({ ...formState, study_program: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="accommodation_preference">Тип жилья</Label>
                    <Select
                      value={formState.accommodation_preference || ""}
                      onValueChange={(value) =>
                        setFormState({ ...formState, accommodation_preference: value })
                      }
                    >
                      <SelectTrigger id="accommodation_preference">
                        <SelectValue placeholder="Выберите тип жилья" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="apartment">Квартира</SelectItem>
                        <SelectItem value="dormitory">Общежитие</SelectItem>
                        <SelectItem value="no_preference">Не имеет значения</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="telegram_username">Telegram Username</Label>
                    <Input
                      id="telegram_username"
                      value={formState.telegram_username || ""}
                      onChange={(e) =>
                        setFormState({ ...formState, telegram_username: e.target.value })
                      }
                      placeholder="Без @"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              {error && <p className="text-destructive text-sm mr-auto">{error}</p>}
              <Button onClick={handleProfileUpdate} disabled={updating}>
                {updating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Сохранение...
                  </>
                ) : "Сохранить изменения"}
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <Card className="shadow-md">
            <CardHeader className="flex flex-row items-start justify-between">
              <div>
                <CardTitle className="text-2xl">
                  {profile.name || "Не указано"}{profile.age ? `, ${profile.age}` : ""}
                </CardTitle>
                <CardDescription>{profile.occupation || "Не указана профессия"}</CardDescription>
              </div>
              <Avatar className="h-16 w-16 avatar-ring">
                <AvatarImage src={profile.avatar || "/api/placeholder/100/100"} alt={profile.name || "Профиль"} />
                <AvatarFallback>{profile.name?.slice(0, 2) || "?"}</AvatarFallback>
              </Avatar>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">О себе</h3>
                  <p className="text-gray-700">{profile.bio || "Информация о себе не указана"}</p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Интересы</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.interests && profile.interests.length > 0 ?
                      profile.interests.map((interest, i) => (
                        <Badge key={i} variant="secondary">
                          {interest}
                        </Badge>
                      )) :
                      <p className="text-gray-500">Интересы не указаны</p>
                    }
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">
                      Жилищные предпочтения
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Бюджет:</span>
                        <span className="font-medium">
                          {profile.rent_budget ? `${profile.rent_budget} ₽/мес` : "Не указан"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Район:</span>
                        <span className="font-medium">{profile.location || "Не указан"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Тип жилья:</span>
                        <span className="font-medium">
                          {getAccommodationText(profile.accommodation_preference)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">
                      Личные привычки
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Режим сна:</span>
                        <span className="font-medium">
                          {profile.sleep_habits || "Не указан"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Чистоплотность:</span>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((level) => (
                            <div
                              key={level}
                              className={`w-4 h-4 rounded-full mx-0.5 ${
                                profile.cleanliness_level && level <= profile.cleanliness_level
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
                      {profile.smoking_preference || "Не указано"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Животные:</span>
                    <span className="font-medium">{profile.pet_preference || "Не указано"}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">ВУЗ/Город учебы:</span>
                    <span className="font-medium">
                      {profile.study_location || "Не указано"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Специальность:</span>
                    <span className="font-medium">{profile.study_program || "Не указано"}</span>
                  </div>
                </div>

                {profile.telegram_username && (
                  <div className="border-t pt-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Telegram:</span>
                      <span className="font-medium text-blue-500">
                        @{profile.telegram_username}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}