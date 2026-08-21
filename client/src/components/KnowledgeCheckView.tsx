import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, HelpCircle, RotateCcw, Award } from "lucide-react";
import data from "@/data/knowledgeCheckData.json";

export default function KnowledgeCheckView() {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState<Record<string, boolean>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const handleSelectOption = (questionId: string, letter: string) => {
    if (quizSubmitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: letter }));
  };

  const handleToggleShowResult = (questionId: string) => {
    setShowResults((prev) => ({ ...prev, [questionId]: !prev[questionId] }));
  };

  const calculateScore = () => {
    let correctCount = 0;
    data.questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctAnswer) {
        correctCount++;
      }
    });
    return correctCount;
  };

  const resetQuiz = () => {
    setSelectedAnswers({});
    setShowResults({});
    setQuizSubmitted(false);
  };

  const score = calculateScore();
  const answeredCount = Object.keys(selectedAnswers).length;
  const isComplete = answeredCount === data.questions.length;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 rounded-2xl p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <Badge className="bg-blue-500/20 text-blue-300 border-blue-400/30 mb-3 px-3 py-1 text-sm font-medium">
            Course Evaluation & Revision
          </Badge>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl mb-2">
            Knowledge Checks
          </h1>
          <p className="text-blue-100 text-sm sm:text-base max-w-xl leading-relaxed">
            Test your understanding with official course review questions. Get instant feedback and detailed explanations for every standard.
          </p>
        </div>

        <div className="bg-white/10 border border-white/15 backdrop-blur-md rounded-2xl p-4 text-center min-w-[160px]">
          <div className="text-xs uppercase tracking-wider text-blue-200 font-semibold mb-1">Your Progress</div>
          <div className="text-3xl font-extrabold text-white">
            {answeredCount} / {data.questions.length}
          </div>
          <div className="text-[11px] text-blue-300 mt-0.5">Questions answered</div>
        </div>
      </div>

      {/* Score Banner when Submitted */}
      {quizSubmitted && (
        <Card className="p-6 bg-emerald-50 border-emerald-200 text-emerald-900 flex items-center justify-between gap-4 animate-in fade-in duration-300">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 font-bold text-lg shadow-md">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Knowledge Check Completed!</h3>
              <p className="text-sm text-emerald-700">
                You scored <strong className="font-bold">{score}</strong> out of <strong className="font-bold">{data.questions.length}</strong> ({Math.round((score / data.questions.length) * 100)}%).
                {score === data.questions.length ? " Excellent work! You have mastered these course questions." : " Review the explanations below to strengthen your understanding."}
              </p>
            </div>
          </div>
          <Button onClick={resetQuiz} variant="outline" className="border-emerald-300 text-emerald-800 hover:bg-emerald-100">
            <RotateCcw className="w-4 h-4 mr-2" /> Try Again
          </Button>
        </Card>
      )}

      {/* Questions List */}
      <div className="space-y-6">
        {data.questions.map((q, index) => {
          const userAnswer = selectedAnswers[q.id];
          const isAnswered = Boolean(userAnswer);
          const isCorrect = userAnswer === q.correctAnswer;
          const displayExplanation = showResults[q.id] || (quizSubmitted && isAnswered);

          return (
            <Card key={q.id} className="p-6 border border-gray-200 shadow-sm bg-white space-y-4">
              <div className="flex items-center justify-between gap-2 border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  <Badge className="bg-blue-600 text-white font-mono text-xs">Question {index + 1}</Badge>
                  <span className="text-xs font-medium text-gray-500">{q.source}</span>
                </div>
                {isAnswered && (
                  <Badge variant="outline" className={userAnswer === q.correctAnswer ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-red-50 text-red-700 border-red-200"}>
                    {userAnswer === q.correctAnswer ? "Correct" : "Incorrect"}
                  </Badge>
                )}
              </div>

              <h3 className="font-bold text-gray-900 text-base sm:text-lg leading-snug">{q.question}</h3>

              <div className="space-y-2.5">
                {q.options.map((opt) => {
                  const isChosen = userAnswer === opt.letter;
                  const isRightOption = opt.letter === q.correctAnswer;

                  let optionStyle = "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50 text-gray-800";
                  if (quizSubmitted || showResults[q.id]) {
                    if (isRightOption) {
                      optionStyle = "border-emerald-500 bg-emerald-50 text-emerald-950 font-semibold ring-1 ring-emerald-500";
                    } else if (isChosen && !isRightOption) {
                      optionStyle = "border-red-400 bg-red-50 text-red-950";
                    }
                  } else if (isChosen) {
                    optionStyle = "border-blue-600 bg-blue-50 text-blue-950 font-medium ring-2 ring-blue-500/20";
                  }

                  return (
                    <button
                      type="button"
                      key={opt.letter}
                      onClick={() => handleSelectOption(q.id, opt.letter)}
                      disabled={quizSubmitted}
                      className={`w-full text-left p-3.5 rounded-xl border-2 transition-all flex items-start gap-3 cursor-pointer ${optionStyle}`}
                    >
                      <span className="w-6 h-6 rounded-lg bg-white border border-gray-300 flex items-center justify-center font-mono font-bold text-xs flex-shrink-0 text-gray-700">
                        {opt.letter}
                      </span>
                      <span className="text-sm leading-relaxed flex-1">{opt.text}</span>
                      {(quizSubmitted || showResults[q.id]) && isRightOption && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                      )}
                      {(quizSubmitted || showResults[q.id]) && isChosen && !isRightOption && (
                        <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation & Toggle Button */}
              <div className="pt-2 flex items-center justify-between border-t border-gray-100">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-blue-600 hover:bg-blue-50 p-0 h-auto font-medium"
                  onClick={() => handleToggleShowResult(q.id)}
                >
                  <HelpCircle className="w-4 h-4 mr-1.5" />
                  {displayExplanation ? "Hide explanation" : "Show explanation & correct answer"}
                </Button>

                {!isAnswered && (
                  <span className="text-[11px] text-gray-400 italic">Select an option above</span>
                )}
              </div>

              {displayExplanation && (
                <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-4 text-xs sm:text-sm text-blue-950 space-y-2 animate-in fade-in duration-200">
                  <div className="font-bold flex items-center gap-1.5 text-blue-900">
                    <CheckCircle2 className="w-4 h-4 text-blue-600" />
                    Correct Answer: Option {q.correctAnswer}
                  </div>
                  <p className="leading-relaxed text-blue-900/90">{q.explanation}</p>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Submit / Finish Button */}
      {!quizSubmitted && (
        <div className="flex justify-end pt-4">
          <Button
            size="lg"
            disabled={!isComplete}
            onClick={() => setQuizSubmitted(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-xl shadow-lg disabled:opacity-50"
          >
            Submit Knowledge Check ({answeredCount}/{data.questions.length})
          </Button>
        </div>
      )}
    </div>
  );
}
