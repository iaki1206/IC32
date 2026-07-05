import { useState, useEffect } from "react";

interface QuizScore {
  quizId: string;
  score: number;
  total: number;
  percentage: number;
  completedAt: number;
  attempts: number;
}

const QUIZ_PROGRESS_KEY = "ic32-quiz-progress";

export function useQuizProgress() {
  const [quizScores, setQuizScores] = useState<Record<string, QuizScore>>({});
  const [isLoaded, setIsLoaded] = useState(false);

  // Load quiz progress from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(QUIZ_PROGRESS_KEY);
      if (stored) {
        setQuizScores(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Failed to load quiz progress:", error);
    }
    setIsLoaded(true);
  }, []);

  // Save quiz progress to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(QUIZ_PROGRESS_KEY, JSON.stringify(quizScores));
      } catch (error) {
        console.error("Failed to save quiz progress:", error);
      }
    }
  }, [quizScores, isLoaded]);

  const recordQuizScore = (quizId: string, score: number, total: number) => {
    setQuizScores((prev) => {
      const existing = prev[quizId];
      const percentage = Math.round((score / total) * 100);

      return {
        ...prev,
        [quizId]: {
          quizId,
          score,
          total,
          percentage,
          completedAt: Date.now(),
          attempts: (existing?.attempts || 0) + 1,
        },
      };
    });
  };

  const getQuizScore = (quizId: string) => {
    return quizScores[quizId];
  };

  const getAverageScore = () => {
    const scores = Object.values(quizScores);
    if (scores.length === 0) return 0;
    const sum = scores.reduce((acc, q) => acc + q.percentage, 0);
    return Math.round(sum / scores.length);
  };

  const getCompletedQuizzes = () => {
    return Object.keys(quizScores).length;
  };

  const getTotalAttempts = () => {
    return Object.values(quizScores).reduce((sum, q) => sum + q.attempts, 0);
  };

  const clearAllProgress = () => {
    setQuizScores({});
  };

  return {
    quizScores,
    recordQuizScore,
    getQuizScore,
    getAverageScore,
    getCompletedQuizzes,
    getTotalAttempts,
    clearAllProgress,
  };
}
