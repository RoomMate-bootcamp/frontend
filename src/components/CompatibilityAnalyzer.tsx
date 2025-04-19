import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle, ThumbsUp, ThumbsDown } from "lucide-react";

// Local compatibility calculation algorithm as fallback
const calculateLocalCompatibility = (currentUser, roommate) => {
  try {
    let score = 50; // Start with a neutral score
    let matches = [];
    let conflicts = [];

    // Check location match
    if (currentUser.location && roommate.location) {
      if (currentUser.location === roommate.location) {
        score += 10;
        matches.push(`Оба ищут жилье в районе ${roommate.location}.`);
      } else {
        score -= 5;
        conflicts.push(`Разные предпочтения по району: ${currentUser.location} vs ${roommate.location}.`);
      }
    }

    // Check budget match
    if (currentUser.rent_budget && roommate.rent_budget) {
      const budgetDiff = Math.abs(currentUser.rent_budget - roommate.rent_budget);
      const maxBudget = Math.max(currentUser.rent_budget, roommate.rent_budget);
      const budgetDiffPercent = (budgetDiff / maxBudget) * 100;

      if (budgetDiffPercent <= 10) {
        score += 10;
        matches.push(`Схожий бюджет на аренду: в пределах 10% разницы.`);
      } else if (budgetDiffPercent <= 20) {
        score += 5;
        matches.push(`Близкий бюджет на аренду: разница в пределах 20%.`);
      } else if (budgetDiffPercent >= 50) {
        score -= 10;
        conflicts.push(`Значительная разница в бюджете: ${currentUser.rent_budget}₽ vs ${roommate.rent_budget}₽.`);
      }
    }

    // Check cleanliness compatibility
    if (currentUser.cleanliness_level && roommate.cleanliness_level) {
      const cleanDiff = Math.abs(currentUser.cleanliness_level - roommate.cleanliness_level);

      if (cleanDiff === 0) {
        score += 15;
        matches.push(`Идеальное совпадение по уровню чистоплотности (${roommate.cleanliness_level}/5).`);
      } else if (cleanDiff === 1) {
        score += 5;
        matches.push(`Близкие стандарты чистоты.`);
      } else if (cleanDiff >= 3) {
        score -= 15;
        conflicts.push(`Существенная разница в отношении к чистоте: ${currentUser.cleanliness_level}/5 vs ${roommate.cleanliness_level}/5.`);
      }
    }

    // Check sleep habits
    if (currentUser.sleep_habits && roommate.sleep_habits) {
      const currentSleepType = getSleepType(currentUser.sleep_habits);
      const roommateSleepType = getSleepType(roommate.sleep_habits);

      if (currentSleepType === roommateSleepType) {
        score += 10;
        matches.push(`Схожий режим сна: ${roommate.sleep_habits}.`);
      } else if (
        (currentSleepType === 'morning' && roommateSleepType === 'night') ||
        (currentSleepType === 'night' && roommateSleepType === 'morning')
      ) {
        score -= 10;
        conflicts.push(`Противоположные режимы сна: ${currentUser.sleep_habits} vs ${roommate.sleep_habits}.`);
      }
    }

    // Check smoking preferences
    if (currentUser.smoking_preference && roommate.smoking_preference) {
      if (currentUser.smoking_preference === roommate.smoking_preference) {
        score += 10;
        matches.push(`Одинаковое отношение к курению: ${roommate.smoking_preference}.`);
      } else if (
        (currentUser.smoking_preference.includes('Не курю') && roommate.smoking_preference.includes('Курю дома')) ||
        (currentUser.smoking_preference.includes('Курю дома') && roommate.smoking_preference.includes('Не курю'))
      ) {
        score -= 15;
        conflicts.push(`Противоречие в отношении курения: ${currentUser.smoking_preference} vs ${roommate.smoking_preference}.`);
      }
    }

    // Check pet preferences
    if (currentUser.pet_preference && roommate.pet_preference) {
      if (currentUser.pet_preference === roommate.pet_preference) {
        score += 10;
        matches.push(`Схожее отношение к домашним животным: ${roommate.pet_preference}.`);
      } else if (
        (currentUser.pet_preference.includes('Аллергия') && roommate.pet_preference.includes('питомец')) ||
        (currentUser.pet_preference.includes('питомец') && roommate.pet_preference.includes('Аллергия'))
      ) {
        score -= 20;
        conflicts.push(`Серьезное противоречие: у одного аллергия, у другого есть питомец.`);
      }
    }

    // Check interests
    if (currentUser.interests && roommate.interests &&
        Array.isArray(currentUser.interests) && Array.isArray(roommate.interests)) {

      const commonInterests = currentUser.interests.filter(i =>
        roommate.interests.includes(i)
      );

      if (commonInterests.length >= 3) {
        score += 15;
        matches.push(`Много общих интересов: ${commonInterests.join(', ')}.`);
      } else if (commonInterests.length > 0) {
        score += 5;
        matches.push(`Некоторые общие интересы: ${commonInterests.join(', ')}.`);
      } else if (currentUser.interests.length > 0 && roommate.interests.length > 0) {
        score -= 5;
        conflicts.push(`Не найдено общих интересов.`);
      }
    }

    // Cap score between 0-100
    score = Math.max(0, Math.min(100, score));

    // Generate explanation
    let explanation = `Оценка совместимости: ${score}%\n\n`;

    if (matches.length > 0) {
      explanation += "📋 Потенциальные совпадения:\n";
      matches.forEach(match => {
        explanation += `• ${match}\n`;
      });
      explanation += "\n";
    }

    if (conflicts.length > 0) {
      explanation += "⚠️ Возможные конфликты:\n";
      conflicts.forEach(conflict => {
        explanation += `• ${conflict}\n`;
      });
      explanation += "\n";
    }

    explanation += "Эта оценка основана на совпадении ваших предпочтений по жилью, образу жизни и личных интересов.";

    return {
      score: score,
      explanation: explanation,
      matches: matches,
      conflicts: conflicts
    };
  } catch (error) {
    console.error("Error in local compatibility calculation:", error);
    return {
      score: 50,
      explanation: "Базовый анализ совместимости на основе ваших предпочтений.",
      matches: [],
      conflicts: []
    };
  }
};

// Helper function to categorize sleep habits
const getSleepType = (sleepHabit) => {
  const lowerHabit = sleepHabit.toLowerCase();
  if (lowerHabit.includes('рано') || lowerHabit.includes('жаворонок')) {
    return 'morning';
  } else if (lowerHabit.includes('поздно') || lowerHabit.includes('сова')) {
    return 'night';
  } else {
    return 'mixed';
  }
};

// Main component
export default function CompatibilityAnalyzer({ roommate, currentUser, onClose }) {
  const [compatibilityData, setCompatibilityData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    if (!roommate || !roommate.id) {
      setError("Недостаточно данных для анализа");
      setLoading(false);
      return;
    }

    const analyzeCompatibility = async () => {
      try {
        setLoading(true);
        setError(null);
        setUsingFallback(false);

        // Try the API-based compatibility first
        try {
          const response = await fetch(`${import.meta.env.VITE_PUBLIC_BACKEND_URL}/api/v1/ai-matching/${roommate.id}/compatibility`, {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${localStorage.getItem('TOKEN')}`,
              "Cache-Control": "no-cache, no-store, must-revalidate",
              "Pragma": "no-cache"
            },
          });

          // Check if response is OK
          if (response.ok) {
            const data = await response.json();
            setCompatibilityData(data);
            setLoading(false);
            return;
          }

          // If we get here, there was a problem with the API response
          throw new Error("API response issue");
        } catch (apiError) {
          console.warn("API compatibility analysis failed, using fallback algorithm", apiError);
          // Use fallback if API fails
          setUsingFallback(true);
          const localAnalysis = calculateLocalCompatibility(currentUser, roommate);
          setCompatibilityData(localAnalysis);
        }
      } catch (err) {
        console.error("Compatibility analysis error:", err);
        setError("Ошибка при анализе совместимости");
      } finally {
        setLoading(false);
      }
    };

    analyzeCompatibility();
  }, [roommate, currentUser]);

  // Extract insights from explanation
  const extractInsights = (explanation) => {
    if (!explanation) return { matches: [], conflicts: [] };

    // If we're using the fallback, it already provides structured data
    if (usingFallback && compatibilityData) {
      return {
        matches: compatibilityData.matches || [],
        conflicts: compatibilityData.conflicts || []
      };
    }

    // Otherwise try to parse from text
    const matches = [];
    const conflicts = [];

    const paragraphs = explanation.split('\n').filter(p => p.trim().length > 0);

    paragraphs.forEach(paragraph => {
      const lowerPara = paragraph.toLowerCase();

      // Positive indicators
      if (
        lowerPara.includes('совпад') ||
        lowerPara.includes('подход') ||
        lowerPara.includes('оба') ||
        lowerPara.includes('схожие') ||
        lowerPara.includes('общие') ||
        lowerPara.includes('плюс') ||
        lowerPara.includes('преимущ')
      ) {
        matches.push(paragraph);
      }

      // Negative indicators
      else if (
        lowerPara.includes('разн') ||
        lowerPara.includes('конфликт') ||
        lowerPara.includes('проблем') ||
        lowerPara.includes('вызов') ||
        lowerPara.includes('несовмест') ||
        lowerPara.includes('против') ||
        lowerPara.includes('минус')
      ) {
        conflicts.push(paragraph);
      }
    });

    return { matches, conflicts };
  };

  if (loading) {
    return (
      <Card className="w-full shadow-md">
        <CardContent className="pt-6 flex flex-col items-center justify-center min-h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
          <p className="text-gray-500">Анализируем совместимость...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full shadow-md">
        <CardContent className="pt-6 flex flex-col items-center justify-center min-h-64">
          <AlertCircle className="h-8 w-8 text-destructive mb-4" />
          <p className="text-destructive">{error}</p>
          <Button onClick={onClose} className="mt-4">
            Вернуться
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!compatibilityData) {
    // Fallback with minimal data
    const basicAnalysis = {
      score: 50,
      explanation: "Базовый анализ показывает среднюю совместимость. Обратите внимание на детали профиля для полной оценки.",
    };
    setCompatibilityData(basicAnalysis);
    return null; // Will re-render with the data
  }

  const { matches, conflicts } = extractInsights(compatibilityData.explanation);
  const score = compatibilityData.score;

  return (
    <Card className="w-full shadow-md animate-in">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          Анализ совместимости
          <Badge
            variant={score >= 70 ? "default" : score >= 50 ? "secondary" : "outline"}
            className="text-lg font-bold">
            {Math.round(score)}%
          </Badge>
        </CardTitle>
        <CardDescription>
          {usingFallback && (
            <span className="text-muted-foreground">
              Анализ на основе ваших предпочтений
            </span>
          )}
          {!usingFallback && (
            <span>
              Анализ совместимости с {roommate.name}
            </span>
          )}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Compatibility score visualization */}
        <div className="space-y-2">
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className={`${score >= 70 ? 'bg-green-500' : score >= 50 ? 'bg-blue-500' : 'bg-amber-500'} h-4 rounded-full transition-all duration-500 ease-in-out`}
              style={{ width: `${score}%` }}
            ></div>
          </div>

          <div className="flex justify-between text-xs text-gray-500">
            <span>Низкая совместимость</span>
            <span>Высокая совместимость</span>
          </div>
        </div>

        {/* Potential matches section */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium flex items-center gap-2">
            <ThumbsUp className="h-5 w-5 text-green-500" />
            Потенциальные совпадения
          </h3>

          {matches.length > 0 ? (
            <div className="space-y-2">
              {matches.map((match, idx) => (
                <div key={idx} className="bg-green-50 p-3 rounded-md border border-green-100">
                  <p className="text-gray-800">{match}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">Не найдено значимых совпадений</p>
          )}
        </div>

        {/* Potential conflicts section */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium flex items-center gap-2">
            <ThumbsDown className="h-5 w-5 text-amber-500" />
            Потенциальные конфликты
          </h3>

          {conflicts.length > 0 ? (
            <div className="space-y-2">
              {conflicts.map((conflict, idx) => (
                <div key={idx} className="bg-amber-50 p-3 rounded-md border border-amber-100">
                  <p className="text-gray-800">{conflict}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">Значимых конфликтов не выявлено</p>
          )}
        </div>

        {/* Full explanation */}
        <div className="pt-4 border-t border-gray-100">
          <h3 className="text-lg font-medium mb-2">Полный анализ</h3>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
            <p className="whitespace-pre-wrap">{compatibilityData.explanation}</p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-end">
        <Button onClick={onClose}>
          Вернуться к профилю
        </Button>
      </CardFooter>
    </Card>
  );
}