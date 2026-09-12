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
  AlertCircle,
  BookOpen,
  AlertTriangle,
  Bookmark,
  ExternalLink,
  CheckSquare,
  Square,
} from "lucide-react";
import data from "@/data/knowledgeCheckData.json";

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
  explanation?: string;
  answerStatus?: string;
  anchor?: QuestionAnchor;
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

const normaliseChapter = (chapter: string | number | null | undefined): string =>
  chapter === null || chapter === undefined ? "" : String(chapter).trim();

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

// Available chapters sorted numerically
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

export default function KnowledgeCheckView({
  onNavigateToTopic,
}: {
  onNavigateToTopic?: (chapterId: number, topicId?: string) => void;
}) {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState<Record<string, boolean>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [chapterFilter, setChapterFilter] = useState("all");
  const [answerFilter, setAnswerFilter] = useState("all");
  const [incorrectOnly, setIncorrectOnly] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

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

      const chapterMatches = chapterFilter === "all" || normaliseChapter(question.chapter) === chapterFilter;

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
          ...normaliseOptions(question.options).map((option) => option.text),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(query);

      return chapterMatches && answerMatches && searchMatches;
    });
  }, [answerFilter, chapterFilter, incorrectOnly, incorrectQuestionIds, searchTerm]);

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
  };

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
            Knowledge Checks, Exam Practice & Course Anchors
          </h1>
          <p className="text-blue-100 text-sm sm:text-base max-w-3xl leading-relaxed">
            A comprehensive, deduplicated question repository covering the complete ISA/IEC 62443 syllabus. Every question includes a <strong>verified answer</strong>, detailed technical justification, and a <strong>direct anchor</strong> to the relevant standard clause and syllabus section with seamless in-app navigation.
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

      {/* Search and Chapter Filter Bar (No Vendor Filter) */}
      <Card className="p-4 bg-white border-gray-200 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search questions, standards (e.g. 62443-4-1, DMZ, FR 6), options or explanations..."
              className="w-full h-10 pl-9 pr-3 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
            />
          </div>

          <div className="flex items-center gap-2">
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
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <select
              value={answerFilter}
              onChange={(event) => setAnswerFilter(event.target.value)}
              className="h-9 rounded-lg border border-gray-200 bg-white px-3 text-xs text-gray-700 outline-none focus:ring-2 focus:ring-blue-500/30"
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
            {(chapterFilter !== "all" || answerFilter !== "all" || searchTerm !== "" || incorrectOnly) && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchTerm("");
                  setChapterFilter("all");
                  setAnswerFilter("all");
                  setIncorrectOnly(false);
                }}
                className="text-xs h-8"
              >
                Clear Filters
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Score Tracker Bar & Review Mode */}
      <Card className="p-4 sm:p-5 bg-blue-50/70 border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-sm">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-bold text-gray-900">
              Current Score: <span className="text-blue-600">{score}</span> / {answeredAnswerableCount} ({scorePercentage}%)
            </div>
            <div className="text-xs text-gray-600">
              Answered {answeredAnswerableCount} of {answerableQuestions.length} evaluable questions ({incorrectQuestionIds.size} incorrect)
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
                ? "You have no incorrect answers recorded yet matching the current chapter filter."
                : "Try adjusting your search query or chapter selection."}
            </p>
            <Button
              variant="default"
              size="sm"
              onClick={() => {
                setSearchTerm("");
                setChapterFilter("all");
                setAnswerFilter("all");
                setIncorrectOnly(false);
              }}
              className="mt-2"
            >
              Clear All Filters
            </Button>
          </Card>
        ) : (
          filteredQuestions.map((q, index) => {
            const userSelection = selectedAnswers[q.id];
            const options = normaliseOptions(q.options);
            const hasAnswerKey = Boolean(q.correctAnswer);
            const isMulti = isMultiSelect(q.correctAnswer, q.question);
            const isCorrect = hasAnswerKey && isAnswerCorrect(userSelection, q.correctAnswer);
            const showResult = showResults[q.id] || quizSubmitted;

            return (
              <Card key={q.id} className="p-6 bg-white border-gray-200 shadow-sm space-y-4">
                {/* Card Header & Badges */}
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
                    {isMulti && (
                      <Badge className="bg-amber-50 text-amber-900 border-amber-300 text-[11px] font-semibold">
                        Multi-Select (Select All that Apply)
                      </Badge>
                    )}
                  </div>

                  {!hasAnswerKey && (
                    <Badge className="bg-amber-100 text-amber-800 border-amber-300 text-[11px] self-start sm:self-auto">
                      Self-Check Item
                    </Badge>
                  )}
                </div>

                {/* Question Statement */}
                <div className="text-base font-bold text-gray-900 leading-snug">
                  {q.question}
                </div>

                {/* Options List */}
                <div className="space-y-2 pt-1">
                  {options.map((opt, optionIndex) => {
                    const isSelected = isLetterSelected(userSelection, opt.letter, isMulti);
                    const isTheCorrectLetter = hasAnswerKey && isLetterInCorrectAnswer(opt.letter, q.correctAnswer);

                    let optionStyle = "border-gray-200 bg-white hover:bg-gray-50 text-gray-800";
                    if (isSelected) {
                      optionStyle = "border-blue-500 bg-blue-50/70 text-blue-900 font-semibold shadow-xs";
                    }
                    if (showResult && hasAnswerKey) {
                      if (isTheCorrectLetter) {
                        optionStyle = "border-emerald-500 bg-emerald-50/80 text-emerald-950 font-bold shadow-xs";
                      } else if (isSelected && !isTheCorrectLetter) {
                        optionStyle = "border-rose-400 bg-rose-50 text-rose-900 font-medium";
                      }
                    }

                    return (
                      <button
                        type="button"
                        key={`${q.id}-option-${optionIndex}`}
                        onClick={() => handleSelectOption(q.id, opt.letter, isMulti)}
                        disabled={quizSubmitted}
                        className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start gap-3 cursor-pointer ${optionStyle}`}
                      >
                        <span
                          className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-mono font-bold flex-shrink-0 transition-colors ${
                            isSelected
                              ? "bg-blue-600 text-white"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {opt.letter}
                        </span>

                        <span className="text-sm leading-relaxed flex-1 pt-0.5">{opt.text}</span>

                        {isMulti ? (
                          isSelected ? (
                            <CheckSquare className="w-5 h-5 text-blue-600 flex-shrink-0" />
                          ) : (
                            <Square className="w-5 h-5 text-gray-300 flex-shrink-0" />
                          )
                        ) : null}

                        {showResult && hasAnswerKey && isTheCorrectLetter && (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                        )}
                        {showResult && hasAnswerKey && isSelected && !isTheCorrectLetter && (
                          <XCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Footer Controls */}
                {hasAnswerKey && (
                  <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-gray-100">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleShowResult(q.id)}
                      className="text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 self-start"
                    >
                      <HelpCircle className="w-3.5 h-3.5 mr-1.5" />
                      {showResult ? "Hide Explanation & Anchor" : "Check Answer & Course Anchor"}
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

                {/* COURSE & STANDARD ANCHOR WITH VERIFIED EXCERPT */}
                {showResult && q.anchor && (
                  <div className="rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50/70 via-indigo-50/40 to-slate-50 p-4 text-xs sm:text-sm text-slate-800 space-y-3 shadow-xs animate-in fade-in duration-200">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-blue-200/60 pb-2.5">
                      <div className="flex items-center gap-1.5 font-bold text-blue-900 text-xs uppercase tracking-wider">
                        <Bookmark className="w-4 h-4 text-blue-600" />
                        <span>ISA/IEC 62443 Course & Standard Anchor</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-1.5">
                        <Badge className="bg-blue-700 text-white font-mono text-[11px]">
                          {q.anchor.standard}
                        </Badge>
                        {q.anchor.chapterNumber && (
                          <Badge variant="outline" className="bg-white text-blue-800 border-blue-300 text-[11px] font-semibold">
                            {q.anchor.chapterNumber} (Topic {q.anchor.topicId})
                          </Badge>
                        )}
                        {onNavigateToTopic && q.anchor.chapterId && (
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => onNavigateToTopic(q.anchor!.chapterId!, q.anchor!.topicId)}
                            className="h-7 text-xs bg-white hover:bg-blue-100 text-blue-800 border-blue-300 font-semibold gap-1 shadow-2xs cursor-pointer"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            Open in Course
                          </Button>
                        )}
                      </div>
                    </div>

                    {q.anchor.clause && (
                      <div className="text-xs font-medium text-slate-700">
                        <span className="font-bold text-slate-900">Standard Section / Clause:</span> {q.anchor.clause}
                      </div>
                    )}

                    {/* Explanatory Course & Standard Excerpt */}
                    {q.anchor.excerpt && (
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
                        <p className="leading-relaxed text-xs sm:text-sm text-slate-700 bg-white/60 p-3 rounded-lg border border-slate-200/60">
                          {q.explanation}
                        </p>
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
