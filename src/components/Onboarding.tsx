import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { updateUserProfile } from "@/lib/requests";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Home,
  Loader2,
  User,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ProfileUpdate } from "@/lib/types";

const steps = [
  {
    id: "personal",
    name: "Личная информация",
    fields: ["name", "age", "gender", "occupation", "bio"],
    icon: User,
  },
  {
    id: "living",
    name: "Стиль жизни",
    fields: [
      "cleanliness_level",
      "sleep_habits",
      "smoking_preference",
      "pet_preference",
    ],
    icon: Home,
  },
  {
    id: "housing",
    name: "Жилищные предпочтения",
    fields: [
      "rent_budget",
      "location",
      "accommodation_preference",
      "telegram_username",
    ],
    icon: Users,
  },
  {
    id: "interests",
    name: "Интересы",
    fields: ["interests"],
    icon: Users,
  },
];

export default function Onboarding() {
  const [cookies] = useCookies(["TOKEN"]);
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Form data
  const [profile, setProfile] = useState<ProfileUpdate>({
    name: "",
    age: undefined,
    gender: "",
    occupation: "",
    bio: "",
    interests: [],
    cleanliness_level: undefined,
    sleep_habits: "",
    rent_budget: undefined,
    location: "",
    smoking_preference: "",
    pet_preference: "",
    study_location: "",
    study_program: "",
    accommodation_preference: "",
    telegram_username: "",
  });

  // For interests selection
  const [interestInput, setInterestInput] = useState("");
  const availableInterests = [
    "Спорт", "Музыка", "Кино", "Литература", "Технологии",
    "Путешествия", "Кулинария", "Игры", "Искусство", "Фотография",
    "Танцы", "Психология", "Наука", "История", "Языки"
  ];

  // Handle form field changes
  const handleChange = (field: string, value: any) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Add interest to the list
  const addInterest = (interest: string) => {
    if (!profile.interests) {
      setProfile(prev => ({...prev, interests: [interest]}));
      return;
    }

    if (!profile.interests.includes(interest)) {
      setProfile(prev => ({
        ...prev,
        interests: [...prev.interests!, interest]
      }));
    }
  };

  // Remove interest from the list
  const removeInterest = (interest: string) => {
    setProfile(prev => ({
      ...prev,
      interests: prev.interests?.filter(i => i !== interest)
    }));
  };

  // Check if the current step is valid
  const isCurrentStepValid = () => {
    const currentStepObj = steps[currentStep];

    if (currentStepObj.id === "personal") {
      return Boolean(
        profile.name &&
        profile.age &&
        profile.gender &&
        profile.occupation
      );
    }

    if (currentStepObj.id === "living") {
      return Boolean(
        profile.cleanliness_level &&
        profile.sleep_habits &&
        profile.smoking_preference &&
        profile.pet_preference
      );
    }

    if (currentStepObj.id === "housing") {
      return Boolean(
        profile.rent_budget &&
        profile.location
      );
    }

    if (currentStepObj.id === "interests") {
      return profile.interests && profile.interests.length > 0;
    }

    return true;
  };

  // Go to the next step
  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  // Go to the previous step
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  // Submit the form data
  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError("");

    try {
      // Convert age and cleanliness_level to numbers
      const processedProfile: ProfileUpdate = {
        ...profile,
        age: profile.age ? Number(profile.age) : undefined,
        cleanliness_level: profile.cleanliness_level ? Number(profile.cleanliness_level) : undefined,
        rent_budget: profile.rent_budget ? Number(profile.rent_budget) : undefined
      };

      await updateUserProfile(cookies.TOKEN, processedProfile);
      navigate("/");
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Произошла ошибка при сохранении профиля. Пожалуйста, попробуйте еще раз.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render step dots
  const renderStepIndicator = () => {
    return (
      <div className="flex justify-center space-x-2 mb-6">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={`w-2.5 h-2.5 rounded-full transition-colors ${
              index === currentStep
                ? "bg-primary"
                : index < currentStep
                ? "bg-primary/50"
                : "bg-gray-200"
            }`}
          />
        ))}
      </div>
    );
  };

  // Render the appropriate form fields based on the current step
  const renderStepContent = () => {
    const currentStepObj = steps[currentStep];

    switch (currentStepObj.id) {
      case "personal":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Имя <span className="text-destructive">*</span></Label>
              <Input
                id="name"
                value={profile.name || ""}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Ваше имя"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="age">Возраст <span className="text-destructive">*</span></Label>
              <Input
                id="age"
                type="number"
                value={profile.age || ""}
                onChange={(e) => handleChange("age", e.target.value)}
                placeholder="Ваш возраст"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Пол <span className="text-destructive">*</span></Label>
              <Select
                value={profile.gender || ""}
                onValueChange={(value) => handleChange("gender", value)}
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

            <div className="space-y-2">
              <Label htmlFor="occupation">Профессия <span className="text-destructive">*</span></Label>
              <Input
                id="occupation"
                value={profile.occupation || ""}
                onChange={(e) => handleChange("occupation", e.target.value)}
                placeholder="Ваша профессия или род занятий"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">О себе</Label>
              <Textarea
                id="bio"
                value={profile.bio || ""}
                onChange={(e) => handleChange("bio", e.target.value)}
                placeholder="Расскажите немного о себе"
                rows={4}
              />
            </div>
          </div>
        );

      case "living":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cleanliness_level">Уровень чистоплотности <span className="text-destructive">*</span></Label>
              <Select
                value={profile.cleanliness_level?.toString() || ""}
                onValueChange={(value) => handleChange("cleanliness_level", value)}
              >
                <SelectTrigger id="cleanliness_level">
                  <SelectValue placeholder="Оцените вашу чистоплотность" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="1">1 - Минимальная</SelectItem>
                  <SelectItem value="2">2 - Ниже среднего</SelectItem>
                  <SelectItem value="3">3 - Средняя</SelectItem>
                  <SelectItem value="4">4 - Выше среднего</SelectItem>
                  <SelectItem value="5">5 - Максимальная</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sleep_habits">Режим сна <span className="text-destructive">*</span></Label>
              <Select
                value={profile.sleep_habits || ""}
                onValueChange={(value) => handleChange("sleep_habits", value)}
              >
                <SelectTrigger id="sleep_habits">
                  <SelectValue placeholder="Ваш режим сна" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="Жаворонок">Жаворонок (рано встаю, рано ложусь)</SelectItem>
                  <SelectItem value="Сова">Сова (поздно встаю, поздно ложусь)</SelectItem>
                  <SelectItem value="Смешанный">Смешанный график</SelectItem>
                  <SelectItem value="Нерегулярный">Нерегулярный график</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="smoking_preference">Отношение к курению <span className="text-destructive">*</span></Label>
              <Select
                value={profile.smoking_preference || ""}
                onValueChange={(value) => handleChange("smoking_preference", value)}
              >
                <SelectTrigger id="smoking_preference">
                  <SelectValue placeholder="Ваше отношение к курению" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="Не курю">Не курю</SelectItem>
                  <SelectItem value="Курю, но не дома">Курю, но не дома</SelectItem>
                  <SelectItem value="Курю дома">Курю дома</SelectItem>
                  <SelectItem value="Не курю, соседу тоже нельзя">Не курю, соседу тоже нельзя</SelectItem>
                  <SelectItem value="Не имеет значения">Не имеет значения</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pet_preference">Отношение к животным <span className="text-destructive">*</span></Label>
              <Select
                value={profile.pet_preference || ""}
                onValueChange={(value) => handleChange("pet_preference", value)}
              >
                <SelectTrigger id="pet_preference">
                  <SelectValue placeholder="Ваше отношение к животным" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="У меня есть питомец">У меня есть питомец</SelectItem>
                  <SelectItem value="Люблю животных">Люблю животных</SelectItem>
                  <SelectItem value="Без животных, пожалуйста">Без животных, пожалуйста</SelectItem>
                  <SelectItem value="Аллергия на животных">Аллергия на животных</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case "housing":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="rent_budget">Бюджет на аренду (₽/мес) <span className="text-destructive">*</span></Label>
              <Input
                id="rent_budget"
                type="number"
                value={profile.rent_budget || ""}
                onChange={(e) => handleChange("rent_budget", e.target.value)}
                placeholder="Ваш бюджет на аренду"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Предпочтительный район <span className="text-destructive">*</span></Label>
              <Input
                id="location"
                value={profile.location || ""}
                onChange={(e) => handleChange("location", e.target.value)}
                placeholder="Район для поиска жилья"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="study_location">ВУЗ/Город учебы</Label>
              <Input
                id="study_location"
                value={profile.study_location || ""}
                onChange={(e) => handleChange("study_location", e.target.value)}
                placeholder="Название ВУЗа или города"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="study_program">Специальность/Направление</Label>
              <Input
                id="study_program"
                value={profile.study_program || ""}
                onChange={(e) => handleChange("study_program", e.target.value)}
                placeholder="Ваша специальность"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="accommodation_preference">Предпочтительное жилье</Label>
              <Select
                value={profile.accommodation_preference || ""}
                onValueChange={(value) => handleChange("accommodation_preference", value)}
              >
                <SelectTrigger id="accommodation_preference">
                  <SelectValue placeholder="Тип жилья" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="apartment">Квартира</SelectItem>
                  <SelectItem value="dormitory">Общежитие</SelectItem>
                  <SelectItem value="no_preference">Не имеет значения</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="telegram_username">Username в Telegram</Label>
              <Input
                id="telegram_username"
                value={profile.telegram_username || ""}
                onChange={(e) => handleChange("telegram_username", e.target.value)}
                placeholder="Ваш username без @"
              />
            </div>
          </div>
        );

      case "interests":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="interests">Интересы <span className="text-destructive">*</span></Label>
              <p className="text-sm text-gray-500">Выберите свои интересы из списка или добавьте свои</p>

              <div className="flex flex-wrap gap-2 mb-4">
                {profile.interests?.map((interest) => (
                  <Badge key={interest} variant="outline" className="badge-outline p-2 text-sm">
                    {interest}
                    <button
                      type="button"
                      className="ml-2 text-gray-500 hover:text-destructive"
                      onClick={() => removeInterest(interest)}
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>

              <div className="flex gap-2">
                <Input
                  id="custom-interest"
                  value={interestInput}
                  onChange={(e) => setInterestInput(e.target.value)}
                  placeholder="Добавить свой интерес"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    if (interestInput.trim()) {
                      addInterest(interestInput.trim());
                      setInterestInput("");
                    }
                  }}
                >
                  Добавить
                </Button>
              </div>

              <div className="mt-4 pt-4 border-t">
                <p className="text-sm font-medium mb-2">Популярные интересы:</p>
                <div className="flex flex-wrap gap-2">
                  {availableInterests.map((interest) => (
                    <Badge
                      key={interest}
                      variant="secondary"
                      className="cursor-pointer hover:bg-primary/10"
                      onClick={() => addInterest(interest)}
                    >
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              {(() => {
                const IconComponent = steps[currentStep].icon;
                return <IconComponent className="h-5 w-5 text-primary" />;
              })()}
            </div>
            <div>
              <CardTitle className="text-xl">
                {steps[currentStep].name}
              </CardTitle>
              <CardDescription>
                Шаг {currentStep + 1} из {steps.length}
              </CardDescription>
            </div>
          </div>
          {renderStepIndicator()}
        </CardHeader>
        <CardContent>{renderStepContent()}</CardContent>
        <CardFooter className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 0}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Назад
          </Button>

          {currentStep < steps.length - 1 ? (
            <Button
              type="button"
              onClick={nextStep}
              disabled={!isCurrentStepValid()}
            >
              Далее
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting || !isCurrentStepValid()}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Сохранение...
                </>
              ) : (
                <>
                  Завершить
                  <Check className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          )}
        </CardFooter>

        {error && (
          <div className="p-4 text-destructive text-center text-sm">{error}</div>
        )}
      </Card>
    </div>
  );
}