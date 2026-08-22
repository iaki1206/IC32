import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  Award,
  Search,
  Filter,
  BookOpenCheck,
  AlertCircle,
  BookOpen,
  AlertTriangle,
} from "lucide-react";
import data from "@/data/knowledgeCheckData.json";

type Option = {
  letter: string;
  text: string;
};

type KnowledgeQuestion = {
  id: string;
  number: number;
  source?: string;
  sourceType?: string;
  chapter?: string | number | null;
  question: string;
  options: Option[];
  correctAnswer?: string | null;
  explanation?: string;
  answerStatus?: string;
};

const questions = data.questions as KnowledgeQuestion[];

// Normalise chapter values because imported question banks may contain strings or numbers.
const normaliseChapter = (chapter: string | number | null | undefined): string =>
  chapter === null || chapter === undefined ? "" : String(chapter).trim();

// Extract unique chapters safely from all imported question banks.
const availableChapters = Array.from(
  new Set(
    questions
      .map((q) => normaliseChapter(q.chapter))
      .filter((chapter) => chapter !== "" && chapter !== "15")
  )
).sort((a, b) => {
  const numA = parseInt(a.match(/Section\s+(\d+)/)?.[1] || "99", 10);
  const numB = parseInt(b.match(/Section\s+(\d+)/)?.[1] || "99", 10);
  return numA - numB;
});

export default function KnowledgeCheckView() {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState<Record<string, boolean>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [sourceGroupFilter, setSourceGroupFilter] = useState("all");
  const [chapterFilter, setChapterFilter] = useState("all");
  const [answerFilter, setAnswerFilter] = useState("all");
  const [incorrectOnly, setIncorrectOnly] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const incorrectQuestionIds = useMemo(() => {
    const ids = new Set<string>();
    for (const q of questions) {
      const userSel = selectedAnswers[q.id];
      if (userSel && q.correctAnswer && userSel !== q.correctAnswer) {
        ids.add(q.id);
      }
    }
    return ids;
  }, [selectedAnswers]);

  const filteredQuestions = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return questions.filter((question) => {
      if (incorrectOnly && !incorrectQuestionIds.has(question.id)) {
        return false;
      }

      const src = question.source || "";
      let sourceMatches = true;
      if (sourceGroupFilter === "pdf") {
        sourceMatches = src.startsWith("IC32 PDF noteset");
      } else if (sourceGroupFilter === "excel") {
        sourceMatches = src === "ITExam Excel Bank";
      } else if (sourceGroupFilter === "real_exam") {
        sourceMatches = src.startsWith("Real Exam Bank");
      } else if (sourceGroupFilter === "test_bank_127") {
        sourceMatches = src.startsWith("IC32 Test Bank 127");
      } else if (sourceGroupFilter === "quiz") {
        sourceMatches = src.startsWith("Existing Quiz");
      } else if (sourceGroupFilter === "kc") {
        sourceMatches = src.startsWith("Knowledge Check |");
      }

      const chapterMatches = chapterFilter === "all" || normaliseChapter(question.chapter) === chapterFilter;

      const answerMatches =
        answerFilter === "all" ||
        (answerFilter === "answerable" && Boolean(question.correctAnswer)) ||
        (answerFilter === "self-check" && !question.correctAnswer);

      const searchMatches =
        !query ||
        [question.question, question.chapter, question.source, ...question.options.map((option) => option.text)]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(query);

      return sourceMatches && chapterMatches && answerMatches && searchMatches;
    });
  }, [answerFilter, chapterFilter, incorrectOnly, incorrectQuestionIds, searchTerm, sourceGroupFilter]);

  const answerableQuestions = questions.filter((question) => Boolean(question.correctAnswer));
  const answeredAnswerableCount = answerableQuestions.filter((question) => Boolean(selectedAnswers[question.id])).length;
  const score = answerableQuestions.filter(
    (question) => selectedAnswers[question.id] === question.correctAnswer,
  ).length;
  const scorePercentage = answeredAnswerableCount
    ? Math.round((score / answeredAnswerableCount) * 100)
    : 0;
  const isComplete = answeredAnswerableCount === answerableQuestions.length;

  const handleSelectOption = (questionId: string, letter: string) => {
    if (quizSubmitted) return;
    setSelectedAnswers((previous) => ({ ...previous, [questionId]: letter }));
  };

  const handleToggleShowResult = (questionId: string) => {
    setShowResults((previous) => ({ ...previous, [questionId]: !previous[questionId] }));
  };

  const resetQuiz = () => {
    setSelectedAnswers({});
    setShowResults({});
    setIncorrectOnly(false);
    setQuizSubmitted(false);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-blue-950 rounded-2xl p-6 sm:p-8 text-white shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <Badge className="bg-blue-500/20 text-blue-200 border-blue-400/30 mb-3 px-3 py-1 text-sm font-medium">
            Consolidated Question Bank (224 Unique Questions)
          </Badge>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl mb-2">Knowledge Checks & Exam Practice</h1>
          <p className="text-blue-100 text-sm sm:text-base max-w-3xl leading-relaxed">
            Unifying the IC32 PDF noteset, ITExam bank, real exam questions, and course quizzes. Use the source and chapter filters or review incorrect answers to target your exam revision precisely.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 min-w-[260px]">
          <div className="bg-white/10 border border-white/15 backdrop-blur-md rounded-xl p-3 text-center">
            <div className="text-2xl font-extrabold">{questions.length}</div>
            <div className="text-[11px] uppercase tracking-wide text-blue-200">Total Unique</div>
          </div>
          <div className="bg-white/10 border border-white/15 backdrop-blur-md rounded-xl p-3 text-center">
            <div className="text-2xl font-extrabold">{answerableQuestions.length}</div>
            <div className="text-[11px] uppercase tracking-wide text-blue-200">With Answer Key</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4 bg-white border-gray-200 shadow-sm space-y-3">
        <div className="flex flex-col lg:flex-row gap-3 lg:items-center">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search questions, chapters, sources or answer choices..."
              className="w-full h-10 pl-9 pr-3 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-600">
              <Filter className="w-4 h-4 text-blue-600" />
              <span>Source:</span>
            </div>
            <select
              value={sourceGroupFilter}
              onChange={(event) => setSourceGroupFilter(event.target.value)}
              className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-blue-500/30"
            >
              <option value="all">All sources ({questions.length})</option>
              <option value="excel">ITExam Excel Bank (111)</option>
              <option value="pdf">IC32 PDF noteset (71)</option>
              <option value="test_bank_127">Test Bank 127 (14)</option>
              <option value="real_exam">Real Exam Bank (12)</option>
              <option value="quiz">Existing Quiz (11)</option>
              <option value="kc">Course KC (5)</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-600">
              <BookOpen className="w-4 h-4 text-indigo-600" />
              <span>Chapter:</span>
            </div>
            <select
              value={chapterFilter}
              onChange={(event) => setChapterFilter(event.target.value)}
              className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-blue-500/30 max-w-md truncate"
            >
              <option value="all">All chapters ({availableChapters.length} sections)</option>
              {availableChapters.map((ch) => (
                <option key={ch} value={ch}>
                  {ch}
                </option>
              ))}
            </select>

            <select
              value={answerFilter}
              onChange={(event) => setAnswerFilter(event.target.value)}
              className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-blue-500/30"
            >
              <option value="all">All answer status</option>
              <option value="answerable">Answer key available</option>
              <option value="self-check">PDF self-check (no key)</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500 font-medium">
              Showing <strong className="text-gray-900">{filteredQuestions.length}</strong> of {questions.length} questions
            </span>
            {(sourceGroupFilter !== "all" || chapterFilter !== "all" || answerFilter !== "all" || searchTerm !== "" || incorrectOnly) && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchTerm("");
                  setSourceGroupFilter("all");
                  setChapterFilter("all");
                  setAnswerFilter("all");
                  setIncorrectOnly(false);
                }}
                className="text-xs h-9"
              >
                Clear Filters
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Score Tracker Bar & Incorrect Review Mode Button */}
      <Card className="p-4 sm:p-5 bg-blue-50/70 border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-sm">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-bold text-gray-900">
              Score: <span className="text-blue-600">{score}</span> / {answerableQuestions.length} ({scorePercentage}%)
            </div>
            <div className="text-xs text-gray-600">
              Answered {answeredAnswerableCount} of {answerableQuestions.length} answerable questions ({incorrectQuestionIds.size} incorrect)
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant={incorrectOnly ? "default" : "outline"}
            size="sm"
            onClick={() => setIncorrectOnly(!incorrectOnly)}
            className={incorrectOnly ? "bg-rose-600 hover:bg-rose-700 text-white" : "border-rose-200 text-rose-700 bg-rose-50/50 hover:bg-rose-100"}
          >
            <AlertTriangle className="w-4 h-4 mr-1.5" />
            {incorrectOnly ? "Showing Incorrect Answers Only" : `Review Incorrect (${incorrectQuestionIds.size})`}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={resetQuiz}
            className="bg-white hover:bg-gray-50 text-gray-700 border-gray-300"
          >
            <RotateCcw className="w-4 h-4 mr-1.5" />
            Reset Answers
          </Button>
        </div>
      </Card>

      {/* Questions List */}
      <div className="space-y-6">
        {filteredQuestions.length === 0 ? (
          <Card className="p-12 text-center bg-white border-gray-200 space-y-3">
            <AlertCircle className="w-10 h-10 text-gray-400 mx-auto" />
            <h3 className="text-lg font-bold text-gray-900">No questions match your filter criteria</h3>
            <p className="text-sm text-gray-600 max-w-md mx-auto">
              {incorrectOnly
                ? "You have no incorrect answers recorded yet, or none matching your current source and chapter filters."
                : "Try adjusting your search terms, source category, chapter selection, or answer status filter."}
            </p>
            <Button
              variant="default"
              size="sm"
              onClick={() => {
                setSearchTerm("");
                setSourceGroupFilter("all");
                setChapterFilter("all");
                setAnswerFilter("all");
                setIncorrectOnly(false);
              }}
              className="mt-2"
            >
              Clear All Filters & Review Mode
            </Button>
          </Card>
        ) : (
          filteredQuestions.map((q, index) => {
            const userSelection = selectedAnswers[q.id];
            const hasAnswerKey = Boolean(q.correctAnswer);
            const isCorrect = userSelection === q.correctAnswer;
            const showResult = showResults[q.id] || quizSubmitted;

            return (
              <Card key={q.id} className="p-6 bg-white border-gray-200 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className="font-mono text-xs text-blue-700 bg-blue-50 border-blue-200">
                      Q#{index + 1}
                    </Badge>
                    {q.chapter && (
                      <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                        {q.chapter}
                      </Badge>
                    )}
                    <Badge variant="outline" className="text-[10px] text-gray-500">
                      {q.source}
                    </Badge>
                  </div>

                  {!hasAnswerKey && (
                    <Badge className="bg-amber-100 text-amber-800 border-amber-300 text-[11px] self-start sm:self-auto">
                      Self-check item (no official key supplied)
                    </Badge>
                  )}
                </div>

                <div className="text-base font-bold text-gray-900 leading-snug">
                  {q.question}
                </div>

                <div className="space-y-2 pt-1">
                  {q.options.map((opt) => {
                    const isSelected = userSelection === opt.letter;
                    const isTheCorrectAnswer = hasAnswerKey && q.correctAnswer === opt.letter;

                    let optionStyle = "border-gray-200 bg-white hover:bg-gray-50 text-gray-800";
                    if (isSelected) {
                      optionStyle = "border-blue-500 bg-blue-50/70 text-blue-900 font-semibold shadow-sm";
                    }
                    if (showResult && hasAnswerKey) {
                      if (isTheCorrectAnswer) {
                        optionStyle = "border-emerald-500 bg-emerald-50 text-emerald-900 font-bold shadow-sm";
                      } else if (isSelected && !isCorrect) {
                        optionStyle = "border-rose-400 bg-rose-50 text-rose-900 font-medium";
                      }
                    }

                    return (
                      <button
                        type="button"
                        key={opt.letter}
                        onClick={() => handleSelectOption(q.id, opt.letter)}
                        disabled={quizSubmitted}
                        className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start gap-3 cursor-pointer ${optionStyle}`}
                      >
                        <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-mono font-bold flex-shrink-0 ${
                          isSelected ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"
                        }`}>
                          {opt.letter}
                        </span>
                        <span className="text-sm leading-relaxed flex-1">{opt.text}</span>
                        {showResult && hasAnswerKey && isTheCorrectAnswer && (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                        )}
                        {showResult && hasAnswerKey && isSelected && !isCorrect && (
                          <XCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation & Answer Key toggle */}
                {hasAnswerKey && (
                  <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-gray-100">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleShowResult(q.id)}
                      className="text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 self-start"
                    >
                      <HelpCircle className="w-3.5 h-3.5 mr-1.5" />
                      {showResult ? "Hide Explanation & Answer" : "Check Answer & Explanation"}
                    </Button>

                    {userSelection && (
                      <div className="text-xs font-medium">
                        {isCorrect ? (
                          <span className="text-emerald-600 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Correct! Answer is {q.correctAnswer}
                          </span>
                        ) : (
                          <span className="text-rose-600 flex items-center gap-1">
                            <XCircle className="w-3.5 h-3.5" /> Incorrect. Correct answer is {q.correctAnswer}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {showResult && q.explanation && (
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs sm:text-sm text-slate-800 space-y-1">
                    <div className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                      Explanation & Reference
                    </div>
                    <p className="leading-relaxed">{q.explanation}</p>
                  </div>
                )}
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
