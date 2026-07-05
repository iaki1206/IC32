import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, RotateCcw, AlertCircle } from "lucide-react";

interface QuizQuestion {
  id: string;
  question: string;
  type: "multiple-choice" | "true-false";
  options?: Array<{ id: string; text: string }>;
  correctAnswer: string;
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
}

interface Quiz {
  id: string;
  sectionId: number;
  title: string;
  description: string;
  questions: QuizQuestion[];
}

interface QuizComponentProps {
  quiz: Quiz;
  onComplete?: (score: number, total: number) => void;
}

export default function QuizComponent({ quiz, onComplete }: QuizComponentProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const selectedAnswer = selectedAnswers[currentQuestion.id];
  const isAnswerCorrect = selectedAnswer === currentQuestion.correctAnswer;

  const handleSelectAnswer = (answerId: string) => {
    if (!showFeedback) {
      setSelectedAnswers((prev) => ({
        ...prev,
        [currentQuestion.id]: answerId,
      }));
    }
  };

  const handleSubmitAnswer = () => {
    setShowFeedback(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setShowFeedback(false);
    } else {
      setQuizComplete(true);
      const score = quiz.questions.filter(
        (q) => selectedAnswers[q.id] === q.correctAnswer
      ).length;
      onComplete?.(score, quiz.questions.length);
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setShowFeedback(false);
    setQuizComplete(false);
  };

  if (quizComplete) {
    const score = quiz.questions.filter(
      (q) => selectedAnswers[q.id] === q.correctAnswer
    ).length;
    const percentage = Math.round((score / quiz.questions.length) * 100);

    return (
      <Card className="w-full">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
          <CardTitle>Quiz Complete!</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="text-center mb-6">
            <div className="text-5xl font-bold text-blue-600 mb-2">
              {score}/{quiz.questions.length}
            </div>
            <div className="text-2xl font-semibold text-gray-900 mb-2">
              {percentage}%
            </div>
            <p className="text-gray-600">
              {percentage >= 80
                ? "Excellent! You have a strong understanding of this material."
                : percentage >= 60
                ? "Good job! Review the topics you struggled with for better understanding."
                : "Keep studying! Review the explanations and try again."}
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-blue-900 mb-3">Your Performance:</h4>
            <div className="space-y-2">
              {quiz.questions.map((q) => {
                const isCorrect = selectedAnswers[q.id] === q.correctAnswer;
                return (
                  <div key={q.id} className="flex items-center gap-2">
                    {isCorrect ? (
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                    )}
                    <span className="text-sm text-gray-700 flex-1">{q.question}</span>
                    <Badge
                      variant={isCorrect ? "default" : "destructive"}
                      className="text-xs"
                    >
                      {q.difficulty}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </div>

          <Button onClick={handleRestart} className="w-full gap-2">
            <RotateCcw className="w-4 h-4" />
            Retake Quiz
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-center justify-between mb-2">
          <CardTitle>{quiz.title}</CardTitle>
          <Badge variant="outline">
            Question {currentQuestionIndex + 1} of {quiz.questions.length}
          </Badge>
        </div>
        <CardDescription>{quiz.description}</CardDescription>
        <div className="mt-4 bg-white rounded-full h-2 overflow-hidden">
          <div
            className="bg-blue-600 h-full transition-all"
            style={{
              width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%`,
            }}
          />
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        {/* Question */}
        <div className="mb-6">
          <div className="flex items-start gap-3 mb-4">
            <Badge
              variant={
                currentQuestion.difficulty === "easy"
                  ? "secondary"
                  : currentQuestion.difficulty === "medium"
                  ? "outline"
                  : "destructive"
              }
            >
              {currentQuestion.difficulty.charAt(0).toUpperCase() +
                currentQuestion.difficulty.slice(1)}
            </Badge>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {currentQuestion.question}
          </h3>

          {/* Options */}
          <div className="space-y-3">
            {currentQuestion.type === "multiple-choice" ? (
              currentQuestion.options?.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleSelectAnswer(option.id)}
                  disabled={showFeedback}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    selectedAnswer === option.id
                      ? showFeedback
                        ? isAnswerCorrect
                          ? "border-green-500 bg-green-50"
                          : "border-red-500 bg-red-50"
                        : "border-blue-500 bg-blue-50"
                      : showFeedback && option.id === currentQuestion.correctAnswer
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        selectedAnswer === option.id
                          ? showFeedback
                            ? isAnswerCorrect
                              ? "border-green-500 bg-green-500"
                              : "border-red-500 bg-red-500"
                            : "border-blue-500 bg-blue-500"
                          : "border-gray-300"
                      }`}
                    >
                      {selectedAnswer === option.id && (
                        <span className="text-white font-bold text-sm">
                          {showFeedback && isAnswerCorrect ? "✓" : ""}
                          {showFeedback && !isAnswerCorrect ? "✗" : ""}
                          {!showFeedback ? "•" : ""}
                        </span>
                      )}
                    </div>
                    <span className="font-medium text-gray-900">{option.text}</span>
                  </div>
                </button>
              ))
            ) : (
              <div className="space-y-3">
                {["true", "false"].map((value) => (
                  <button
                    key={value}
                    onClick={() => handleSelectAnswer(value)}
                    disabled={showFeedback}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      selectedAnswer === value
                        ? showFeedback
                          ? value === currentQuestion.correctAnswer
                            ? "border-green-500 bg-green-50"
                            : "border-red-500 bg-red-50"
                          : "border-blue-500 bg-blue-50"
                        : showFeedback && value === currentQuestion.correctAnswer
                        ? "border-green-500 bg-green-50"
                        : "border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          selectedAnswer === value
                            ? showFeedback
                              ? value === currentQuestion.correctAnswer
                                ? "border-green-500 bg-green-500"
                                : "border-red-500 bg-red-500"
                              : "border-blue-500 bg-blue-500"
                            : "border-gray-300"
                        }`}
                      >
                        {selectedAnswer === value && (
                          <span className="text-white font-bold text-sm">
                            {showFeedback && value === currentQuestion.correctAnswer
                              ? "✓"
                              : ""}
                            {showFeedback &&
                            value !== currentQuestion.correctAnswer
                              ? "✗"
                              : ""}
                            {!showFeedback ? "•" : ""}
                          </span>
                        )}
                      </div>
                      <span className="font-medium text-gray-900 capitalize">
                        {value}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Feedback */}
        {showFeedback && (
          <div
            className={`mb-6 p-4 rounded-lg border-l-4 ${
              isAnswerCorrect
                ? "bg-green-50 border-green-500"
                : "bg-red-50 border-red-500"
            }`}
          >
            <div className="flex gap-3">
              {isAnswerCorrect ? (
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              )}
              <div>
                <h4
                  className={`font-semibold mb-2 ${
                    isAnswerCorrect ? "text-green-900" : "text-red-900"
                  }`}
                >
                  {isAnswerCorrect ? "Correct!" : "Incorrect"}
                </h4>
                <p
                  className={`text-sm ${
                    isAnswerCorrect ? "text-green-800" : "text-red-800"
                  }`}
                >
                  {currentQuestion.explanation}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3">
          {!showFeedback ? (
            <Button
              onClick={handleSubmitAnswer}
              disabled={!selectedAnswer}
              className="flex-1"
            >
              Submit Answer
            </Button>
          ) : (
            <Button onClick={handleNextQuestion} className="flex-1">
              {currentQuestionIndex < quiz.questions.length - 1
                ? "Next Question"
                : "View Results"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
