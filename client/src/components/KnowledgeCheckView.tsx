import { useState, useMemo, useEffect } from "react";
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
  AlertCircle,
  BookOpen,
  AlertTriangle,
  Bookmark,
  ExternalLink,
  CheckSquare,
  Square,
  Link2,
} from "lucide-react";
import data from "@/data/knowledgeCheckData.json";

const STORAGE_KEY_ANSWERS = "ic32_knowledge_check_selected_answers";
const STORAGE_KEY_RESULTS = "ic32_knowledge_check_show_results";

type Option = {
  letter: string;
  text: string;
};

type RawOption = Option | string | { letter?: string; text?: string };

type QuestionAnchor = {
  standard?: string;
  clause?: string;
  chapterId?: number;
  chapterNumber?: string;
  chapterTitle?: string;
  topicId?: string;
  topicTitle?: string;
  excerpt?: string;
};

type ExplanationAnchor = {
  anchor: string;
  label: string;
  reason?: string;
  href: string;
};

type KnowledgeQuestion = {
  id: string;
  number: number;
  source?: string;
  sourceType?: string;
  vendor?: string;
  chapter?: string | number | null;
  topic?: string | null;
  question: string;
  options: RawOption[];
  correctAnswer?: string | null;
  correctAnswers?: string[];
  explanation?: string;
  answerStatus?: string;
  anchor?: QuestionAnchor;
  explanationAnchor?: ExplanationAnchor;
};

const questions = data.questions as KnowledgeQuestion[];

const normaliseOptions = (options: RawOption[] | undefined): Option[] =>
  (options ?? []).map((option, index) => {
    const fallbackLetter = String.fromCharCode(65 + index);
    if (typeof option === "string") {
      return { letter: fallbackLetter, text: option };
    }
    return {
      letter: option.letter?.trim() || fallbackLetter,
      text: option.text?.trim() || "",
    };
  });

const normaliseQuestionChapter = (q: KnowledgeQuestion): string => {
  if (q.chapter) {
    const s = String(q.chapter).trim();
    if (s === "15") return "Section 15 — IACS Security Profile Scheme";
    return s;
  }
  if (q.anchor?.chapterTitle) return String(q.anchor.chapterTitle).trim();
  if (q.anchor?.chapterNumber) return String(q.anchor.chapterNumber).trim();
  return "General & Multi-standard";
};

const isMultiSelect = (correctAnswer?: string | null, questionText?: string): boolean => {
  if (questionText && /select all that apply/i.test(questionText)) return true;
  if (!correctAnswer) return false;
  const trimmed = correctAnswer.trim().toUpperCase();
  if (trimmed === "TRUE" || trimmed === "FALSE") return false;
  return trimmed.includes(",") || (trimmed.length > 1 && !["TRUE", "FALSE"].includes(trimmed));
};

const isAnswerCorrect = (userSelection?: string, correctAnswer?: string | null): boolean => {
  if (!userSelection || !correctAnswer) return false;
  const userParts = userSelection
    .split(",")
    .map((s) => s.trim().toUpperCase())
    .filter(Boolean)
    .sort()
    .join(",");
  const correctParts = correctAnswer
    .split(",")
    .map((s) => s.trim().toUpperCase())
    .filter(Boolean)
    .sort()
    .join(",");
  return userParts === correctParts;
};

const isLetterSelected = (userSelection: string | undefined, letter: string, multi: boolean): boolean => {
  if (!userSelection) return false;
  if (!multi) return userSelection.toUpperCase() === letter.toUpperCase();
  return userSelection
    .split(",")
    .map((s) => s.trim().toUpperCase())
    .includes(letter.toUpperCase());
};

const isLetterInCorrectAnswer = (letter: string, correctAnswer?: string | null): boolean => {
  if (!correctAnswer) return false;
  return correctAnswer
    .split(",")
    .map((s) => s.trim().toUpperCase())
    .includes(letter.toUpperCase());
};

// Available chapters sorted numerically, including Section 15 and General
const availableChapters = Array.from(
  new Set(questions.map((q) => normaliseQuestionChapter(q)).filter(Boolean))
).sort((a, b) => {
  const numA = parseInt(a.match(/Section\s+(\d+)/)?.[1] || "999", 10);
  const numB = parseInt(b.match(/Section\s+(\d+)/)?.[1] || "999", 10);
  if (numA !== numB) return numA - numB;
  return a.localeCompare(b);
});

export default function KnowledgeCheckView({
  onNavigateToTopic,
}: {
  onNavigateToTopic?: (chapterId: number, topicId?: string) => void;
}) {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>(() => {
    if (typeof window === "undefined") return {};
    try {
      const stored = localStorage.getItem(STORAGE_KEY_ANSWERS);
      return stored ? JSON.parse(stored) : {};
    } catch (e) {
      console.error("Failed to load selected answers from localStorage:", e);
      return {};
    }
  });

  const [showResults, setShowResults] = useState<Record<string, boolean>>(() => {
    if (typeof window === "undefined") return {};
    try {
      const stored = localStorage.getItem(STORAGE_KEY_RESULTS);
      return stored ? JSON.parse(stored) : {};
    } catch (e) {
      console.error("Failed to load showResults from localStorage:", e);
      return {};
    }
  });

  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [sourceGroupFilter, setSourceGroupFilter] = useState("all");
  const [chapterFilter, setChapterFilter] = useState("all");
  const [answerFilter, setAnswerFilter] = useState("all");
  const [incorrectOnly, setIncorrectOnly] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Persist selected answers to localStorage so they remain checked across visits
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY_ANSWERS, JSON.stringify(selectedAnswers));
    } catch (e) {
      console.error("Failed to persist selected answers to localStorage:", e);
    }
  }, [selectedAnswers]);

  // Persist show results to localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY_RESULTS, JSON.stringify(showResults));
    } catch (e) {
      console.error("Failed to persist showResults to localStorage:", e);
    }
  }, [showResults]);

  const sourceCounts = useMemo(() => {
    const counts = {
      all: questions.length,
      pdf: 0,
      excel: 0,
      external: 0,
      test_bank_127: 0,
      real_exam: 0,
      quiz: 0,
      kc: 0,
    };
    for (const q of questions) {
      const src = q.source || "";
      if (src.startsWith("IC32 PDF noteset") || src.startsWith("ISA/IEC 62443 PDF")) counts.pdf++;
      else if (src === "ITExam Excel Bank") counts.excel++;
      else if (src.startsWith("External question bank")) counts.external++;
      else if (src.startsWith("IC32 Test Bank 127") || src.startsWith("Test Bank 127")) counts.test_bank_127++;
      else if (src.startsWith("Real Exam Bank")) counts.real_exam++;
      else if (src.startsWith("Existing Quiz")) counts.quiz++;
      else if (src.startsWith("Knowledge Check")) counts.kc++;
    }
    return counts;
  }, []);

  const incorrectQuestionIds = useMemo(() => {
    const ids = new Set<string>();
    for (const q of questions) {
      const userSel = selectedAnswers[q.id];
      if (userSel && q.correctAnswer && !isAnswerCorrect(userSel, q.correctAnswer)) {
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
        sourceMatches = src.startsWith("IC32 PDF noteset") || src.startsWith("ISA/IEC 62443 PDF");
      } else if (sourceGroupFilter === "excel") {
        sourceMatches = src === "ITExam Excel Bank";
      } else if (sourceGroupFilter === "external") {
        sourceMatches = src.startsWith("External question bank");
      } else if (sourceGroupFilter === "test_bank_127") {
        sourceMatches = src.startsWith("IC32 Test Bank 127") || src.startsWith("Test Bank 127");
      } else if (sourceGroupFilter === "real_exam") {
        sourceMatches = src.startsWith("Real Exam Bank");
      } else if (sourceGroupFilter === "quiz") {
        sourceMatches = src.startsWith("Existing Quiz");
      } else if (sourceGroupFilter === "kc") {
        sourceMatches = src.startsWith("Knowledge Check");
      }

      const chapterMatches = chapterFilter === "all" || normaliseQuestionChapter(question) === chapterFilter;

      const answerMatches =
        answerFilter === "all" ||
        (answerFilter === "answerable" && Boolean(question.correctAnswer)) ||
        (answerFilter === "self-check" && !question.correctAnswer);

      const searchMatches =
        !query ||
        [
          question.question,
          question.chapter,
          question.source,
          question.anchor?.standard,
          question.anchor?.clause,
          question.anchor?.excerpt,
          question.explanation,
          question.explanationAnchor?.anchor,
          question.explanationAnchor?.label,
          question.explanationAnchor?.reason,
          ...normaliseOptions(question.options).map((option) => option.text),
        ]
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
    (question) => isAnswerCorrect(selectedAnswers[question.id], question.correctAnswer)
  ).length;
  const scorePercentage = answeredAnswerableCount
    ? Math.round((score / answeredAnswerableCount) * 100)
    : 0;

  const handleSelectOption = (questionId: string, letter: string, multi: boolean) => {
    if (quizSubmitted) return;
    setSelectedAnswers((prev) => {
      const current = prev[questionId] || "";
      if (!multi) {
        return { ...prev, [questionId]: letter };
      }
      const set = new Set(
        current
          ? current.split(",").map((s) => s.trim().toUpperCase()).filter(Boolean)
          : []
      );
      if (set.has(letter.toUpperCase())) {
        set.delete(letter.toUpperCase());
      } else {
        set.add(letter.toUpperCase());
      }
      const sorted = Array.from(set).sort().join(", ");
      return { ...prev, [questionId]: sorted };
    });
  };

  const handleToggleShowResult = (questionId: string) => {
    setShowResults((previous) => ({ ...previous, [questionId]: !previous[questionId] }));
  };

  const resetQuiz = () => {
    setSelectedAnswers({});
    setShowResults({});
    setIncorrectOnly(false);
    setQuizSubmitted(false);
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem(STORAGE_KEY_ANSWERS);
        localStorage.removeItem(STORAGE_KEY_RESULTS);
      } catch (e) {
        console.error("Failed to clear answers from localStorage:", e);
      }
    }
  };

  const isFiltersActive =
    sourceGroupFilter !== "all" ||
    chapterFilter !== "all" ||
    answerFilter !== "all" ||
    searchTerm !== "" ||
    incorrectOnly;

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-blue-950 rounded-2xl p-6 sm:p-8 text-white shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <Badge className="bg-blue-500/20 text-blue-200 border-blue-400/30 px-3 py-1 text-sm font-medium">
              Consolidated Question Bank ({questions.length} Unique Questions)
            </Badge>
            <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-400/30 text-xs px-2.5 py-0.5 font-medium">
              100% Anchored to Standards & Course
            </Badge>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl mb-2">
            Knowledge Checks, Exam Practice & Anchors
          </h1>
          <p className="text-blue-100 text-sm sm:text-base max-w-3xl leading-relaxed">
            Consolidating the ISA/IEC 62443 PDF noteset, ITExam bank, real exam items, and course quizzes. Every question includes a <strong>verified answer</strong>, detailed technical explanation, and a <strong>direct anchor link</strong> that opens in a new tab without interrupting your exam session.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 min-w-[280px]">
          <div className="bg-white/10 border border-white/15 backdrop-blur-md rounded-xl p-3 text-center">
            <div className="text-2xl font-extrabold">{questions.length}</div>
            <div className="text-[11px] uppercase tracking-wide text-blue-200">Total Questions</div>
          </div>
          <div className="bg-white/10 border border-white/15 backdrop-blur-md rounded-xl p-3 text-center">
            <div className="text-2xl font-extrabold text-emerald-300">{answerableQuestions.length}</div>
            <div className="text-[11px] uppercase tracking-wide text-emerald-200">Verified Answers</div>
          </div>
        </div>
      </div>

      {/* Comprehensive Filter and Search Bar */}
      <Card className="p-4 bg-white border-gray-200 shadow-sm space-y-3">
        {/* Row 1: Search and Source Filter */}
        <div className="flex flex-col lg:flex-row gap-3 lg:items-center">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search questions, standards (e.g. 62443-4-1, DMZ, FR 6), options or explanations..."
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
              className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-blue-500/30 font-medium"
            >
              <option value="all">All Sources ({sourceCounts.all})</option>
              <option value="pdf">ISA/IEC 62443 PDF Bank ({sourceCounts.pdf})</option>
              <option value="excel">ITExam Excel Bank ({sourceCounts.excel})</option>
              <option value="external">External Question Bank ({sourceCounts.external})</option>
              <option value="test_bank_127">Test Bank 127 ({sourceCounts.test_bank_127})</option>
              <option value="real_exam">Real Exam Bank ({sourceCounts.real_exam})</option>
              <option value="quiz">Existing Quiz ({sourceCounts.quiz})</option>
              <option value="kc">Course KC ({sourceCounts.kc})</option>
            </select>
          </div>
        </div>

        {/* Row 2: Chapter Filter, Answer Type Filter, and Filter Actions */}
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-600">
              <BookOpen className="w-4 h-4 text-indigo-600" />
              <span>Chapter:</span>
            </div>
            <select
              value={chapterFilter}
              onChange={(event) => setChapterFilter(event.target.value)}
              className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-blue-500/30 max-w-xs truncate font-medium"
            >
              <option value="all">All Chapters ({availableChapters.length} sections)</option>
              {availableChapters.map((ch) => (
                <option key={ch} value={ch}>
                  {ch}
                </option>
              ))}
            </select>

            <select
              value={answerFilter}
              onChange={(event) => setAnswerFilter(event.target.value)}
              className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-xs text-gray-700 outline-none focus:ring-2 focus:ring-blue-500/30 font-medium"
            >
              <option value="all">All Question Types</option>
              <option value="answerable">Verified Answer Key</option>
              <option value="self-check">Self-Check Only</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500 font-medium">
              Showing <strong className="text-gray-900">{filteredQuestions.length}</strong> of {questions.length} questions
            </span>
            {isFiltersActive && (
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

      {/* Score Tracker Bar & Actions */}
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
              Answered {answeredAnswerableCount} of {answerableQuestions.length} answerable questions ({incorrectQuestionIds.size} incorrect recorded)
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant={incorrectOnly ? "default" : "outline"}
            size="sm"
            onClick={() => setIncorrectOnly(!incorrectOnly)}
            className={
              incorrectOnly
                ? "bg-rose-600 hover:bg-rose-700 text-white"
                : "border-rose-200 text-rose-700 bg-rose-50/50 hover:bg-rose-100"
            }
          >
            <AlertTriangle className="w-4 h-4 mr-1.5" />
            {incorrectOnly
              ? "Showing Incorrect Answers Only"
              : `Review Incorrect (${incorrectQuestionIds.size})`}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={resetQuiz}
            className="bg-white hover:bg-gray-50 text-gray-700 border-gray-300 font-medium"
            title="Reset all answer selections and results"
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
                : "Try adjusting your search terms, source filter, chapter selection, or answer status."}
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
            const options = normaliseOptions(q.options);
            const hasAnswerKey = Boolean(q.correctAnswer);
            const multi = isMultiSelect(q.correctAnswer, q.question);
            const isCorrect = hasAnswerKey && isAnswerCorrect(userSelection, q.correctAnswer);
            const showResult = Boolean(userSelection) && (showResults[q.id] ?? true);

            return (
              <Card key={q.id} className="p-6 bg-white border-gray-200 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className="font-mono text-xs text-blue-700 bg-blue-50 border-blue-200">
                      Q#{index + 1}
                    </Badge>
                    <Badge variant="secondary" className="text-xs bg-slate-100 text-slate-800 font-medium">
                      {normaliseQuestionChapter(q)}
                    </Badge>
                    {q.source && (
                      <Badge variant="outline" className="text-[10px] text-gray-500">
                        {q.source}
                      </Badge>
                    )}
                    {multi && (
                      <Badge className="bg-indigo-50 text-indigo-700 border-indigo-200 text-[10px] font-semibold">
                        Multi-Select
                      </Badge>
                    )}
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

                {/* Options List */}
                <div className="space-y-2 pt-1">
                  {options.map((opt, optionIndex) => {
                    const isSelected = isLetterSelected(userSelection, opt.letter, multi);
                    const isTheCorrectAnswer = hasAnswerKey && isLetterInCorrectAnswer(opt.letter, q.correctAnswer);

                    let optionStyle = "border-gray-200 bg-white hover:bg-gray-50 text-gray-800";
                    if (isSelected) {
                      optionStyle = "border-blue-500 bg-blue-50/70 text-blue-900 font-semibold shadow-xs";
                    }
                    if (showResult && hasAnswerKey) {
                      if (isTheCorrectAnswer) {
                        optionStyle = "border-emerald-500 bg-emerald-50 text-emerald-900 font-bold shadow-xs";
                      } else if (isSelected && !isCorrect) {
                        optionStyle = "border-rose-400 bg-rose-50 text-rose-900 font-medium";
                      }
                    }

                    return (
                      <button
                        type="button"
                        key={`${q.id}-option-${optionIndex}`}
                        onClick={() => handleSelectOption(q.id, opt.letter, multi)}
                        disabled={quizSubmitted}
                        className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start gap-3 cursor-pointer ${optionStyle}`}
                      >
                        <span
                          className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-mono font-bold flex-shrink-0 transition-colors ${
                            isSelected ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {multi ? (
                            isSelected ? (
                              <CheckSquare className="w-4 h-4 text-white" />
                            ) : (
                              <Square className="w-4 h-4 text-gray-400" />
                            )
                          ) : (
                            opt.letter
                          )}
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
                {hasAnswerKey && Boolean(userSelection) && (
                  <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-gray-100">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleShowResult(q.id)}
                      className="text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 self-start"
                    >
                      <HelpCircle className="w-3.5 h-3.5 mr-1.5" />
                      {showResult ? "Hide Explanation & Anchor" : "Check Answer & Anchor"}
                    </Button>

                    {userSelection && (
                      <div className="text-xs font-medium">
                        {isCorrect ? (
                          <span className="text-emerald-600 flex items-center gap-1 font-bold">
                            <CheckCircle2 className="w-4 h-4" /> Correct! Answer is {q.correctAnswer}
                          </span>
                        ) : (
                          <span className="text-rose-600 flex items-center gap-1 font-bold">
                            <XCircle className="w-4 h-4" /> Incorrect. Correct answer is {q.correctAnswer}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* EXPLANATIONS AND ANCHORS BOX */}
                {showResult && (q.explanation || q.explanationAnchor || q.anchor) && (
                  <div className="rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50/70 via-indigo-50/40 to-slate-50 p-4 text-xs sm:text-sm text-slate-800 space-y-3 shadow-xs animate-in fade-in duration-200">
                    {/* Header with Standard Anchor if present */}
                    {q.anchor && (
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-blue-200/60 pb-2.5">
                        <div className="flex items-center gap-1.5 font-bold text-blue-900 text-xs uppercase tracking-wider">
                          <Bookmark className="w-4 h-4 text-blue-600" />
                          <span>ISA/IEC 62443 Course & Standard Anchor</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-1.5">
                          {q.anchor.standard && (
                            <Badge className="bg-blue-700 text-white font-mono text-[11px]">
                              {q.anchor.standard}
                            </Badge>
                          )}
                          {q.anchor.chapterNumber && q.anchor.chapterId ? (
                            <a
                              href={`/?page=chapter&chapterId=${q.anchor.chapterId}${q.anchor.topicId ? `&topicId=${encodeURIComponent(q.anchor.topicId)}` : ""}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white text-blue-800 border border-blue-300 text-[11px] font-semibold hover:bg-blue-50 transition-colors no-underline shadow-2xs cursor-pointer"
                              title="Open chapter and topic in a new tab"
                            >
                              <span>{q.anchor.chapterNumber} (Topic {q.anchor.topicId})</span>
                              <ExternalLink className="w-3 h-3 text-blue-600" />
                            </a>
                          ) : q.anchor.chapterNumber ? (
                            <Badge variant="outline" className="bg-white text-blue-800 border-blue-300 text-[11px] font-semibold">
                              {q.anchor.chapterNumber} {q.anchor.topicId ? `(Topic ${q.anchor.topicId})` : ""}
                            </Badge>
                          ) : null}
                          {q.anchor.chapterId && (
                            <a
                              href={`/?page=chapter&chapterId=${q.anchor.chapterId}${q.anchor.topicId ? `&topicId=${encodeURIComponent(q.anchor.topicId)}` : ""}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center h-7 px-2.5 rounded-md text-xs bg-white hover:bg-blue-100 text-blue-800 border border-blue-300 font-semibold gap-1 shadow-2xs cursor-pointer no-underline transition-colors"
                              title="Open course chapter and topic in a new tab"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              Open in Course (New Tab)
                            </a>
                          )}
                        </div>
                      </div>
                    )}

                    {q.anchor?.clause && (
                      <div className="text-xs font-medium text-slate-700">
                        <span className="font-bold text-slate-900">Standard Section / Clause:</span> {q.anchor.clause}
                      </div>
                    )}

                    {/* Explanatory Course & Standard Excerpt */}
                    {q.anchor?.excerpt && (
                      <div className="rounded-lg bg-white border border-blue-100 p-3.5 text-slate-800 shadow-2xs space-y-1.5">
                        <div className="text-[11px] font-bold uppercase tracking-wider text-blue-700 flex items-center gap-1">
                          <span>⚓ Explanatory Course & Standard Excerpt:</span>
                        </div>
                        <blockquote className="text-xs leading-relaxed italic text-slate-800 border-l-3 border-blue-500 pl-3 bg-blue-50/40 py-1.5 rounded-r">
                          "{q.anchor.excerpt}"
                        </blockquote>
                      </div>
                    )}

                    {/* Technical Explanation */}
                    {q.explanation && (
                      <div className="space-y-1 pt-1">
                        <div className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                          Technical Explanation & Answer Justification:
                        </div>
                        <p className="leading-relaxed text-xs sm:text-sm text-slate-700 bg-white/80 p-3 rounded-lg border border-slate-200/60">
                          {q.explanation}
                        </p>
                      </div>
                    )}

                    {/* OT/ICS Hub Explanation Anchor (Opens in new tab) */}
                    {q.explanationAnchor && (
                      <div className="pt-2 border-t border-blue-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <a
                          href={q.explanationAnchor.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-white px-3 py-2 text-xs font-bold text-blue-800 transition hover:border-blue-400 hover:bg-blue-50 no-underline shadow-2xs cursor-pointer"
                          title="Open OT/ICS Hub anchor in a new tab without leaving Knowledge Check"
                        >
                          <Link2 className="h-3.5 w-3.5 text-blue-600" />
                          <span>Review OT Anchor: {q.explanationAnchor.anchor} · {q.explanationAnchor.label}</span>
                          <ExternalLink className="h-3 w-3 ml-1 text-blue-500" />
                        </a>
                        {q.explanationAnchor.reason && (
                          <span className="text-[11px] text-slate-600 italic">
                            {q.explanationAnchor.reason}
                          </span>
                        )}
                      </div>
                    )}
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
