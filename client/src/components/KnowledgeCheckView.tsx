import { useMemo, useState } from "react";
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
  chapter?: string;
  question: string;
  options: Option[];
  correctAnswer?: string | null;
  explanation?: string;
  answerStatus?: string;
};

const questions = data.questions as KnowledgeQuestion[];

const sourceLabels: Record<string, string> = {
  all: "All sources",
  pdf_noteset: "IC32 PDF noteset",
  course_knowledge_check: "Course Knowledge Checks",
  existing_quiz: "Existing Quiz questions",
};

function sourceLabel(sourceType?: string) {
  return sourceLabels[sourceType ?? ""] ?? "Merged source";
}

export default function KnowledgeCheckView() {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState<Record<string, boolean>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [sourceFilter, setSourceFilter] = useState("all");
  const [answerFilter, setAnswerFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredQuestions = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return questions.filter((question) => {
      const sourceMatches = sourceFilter === "all" || question.sourceType === sourceFilter;
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
      return sourceMatches && answerMatches && searchMatches;
    });
  }, [answerFilter, searchTerm, sourceFilter]);

  const answerableQuestions = questions.filter((question) => Boolean(question.correctAnswer));
  const answeredAnswerableCount = answerableQuestions.filter((question) => Boolean(selectedAnswers[question.id])).length;
  const answeredVisibleCount = filteredQuestions.filter((question) => Boolean(selectedAnswers[question.id])).length;
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
    setQuizSubmitted(false);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
      <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-blue-950 rounded-2xl p-6 sm:p-8 text-white shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <Badge className="bg-blue-500/20 text-blue-200 border-blue-400/30 mb-3 px-3 py-1 text-sm font-medium">
            Consolidated question bank
          </Badge>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl mb-2">Knowledge Checks</h1>
          <p className="text-blue-100 text-sm sm:text-base max-w-3xl leading-relaxed">
            One non-redundant learning bank combining the IC32 PDF noteset, course Knowledge Checks, and existing Quiz questions. Use the filters to focus your revision.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 min-w-[250px]">
          <div className="bg-white/10 border border-white/15 backdrop-blur-md rounded-xl p-3 text-center">
            <div className="text-2xl font-extrabold">{questions.length}</div>
            <div className="text-[11px] uppercase tracking-wide text-blue-200">Unique questions</div>
          </div>
          <div className="bg-white/10 border border-white/15 backdrop-blur-md rounded-xl p-3 text-center">
            <div className="text-2xl font-extrabold">{answerableQuestions.length}</div>
            <div className="text-[11px] uppercase tracking-wide text-blue-200">With answer key</div>
          </div>
        </div>
      </div>

      <Card className="p-4 bg-white border-gray-200 shadow-sm">
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
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
            <Filter className="w-4 h-4" />
            <select
              value={sourceFilter}
              onChange={(event) => setSourceFilter(event.target.value)}
              className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-blue-500/30"
            >
              <option value="all">All sources</option>
              <option value="pdf_noteset">IC32 PDF noteset</option>
              <option value="course_knowledge_check">Course Knowledge Checks</option>
              <option value="existing_quiz">Existing Quiz questions</option>
            </select>
          </div>
          <select
            value={answerFilter}
            onChange={(event) => setAnswerFilter(event.target.value)}
            className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-blue-500/30"
          >
            <option value="all">All answer status</option>
            <option value="answerable">Answer key available</option>
            <option value="self-check">PDF self-check: no supplied key</option>
          </select>
          <Button variant="outline" size="sm" onClick={() => { setSearchTerm(""); setSourceFilter("all"); setAnswerFilter("all"); }}>
            Clear filters
          </Button>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-gray-500">
          <span className="font-semibold text-gray-700">Showing {filteredQuestions.length} of {questions.length}</span>
          <span>•</span>
          <span>{answeredVisibleCount} visible questions answered</span>
          <span>•</span>
          <span>{questions.length - answerableQuestions.length} PDF self-check questions have no answer key in the supplied noteset</span>
        </div>
      </Card>

      {quizSubmitted && (
        <Card className="p-5 bg-emerald-50 border-emerald-200 text-emerald-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 shadow-md">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Knowledge Check Results</h3>
              <p className="text-sm text-emerald-700">
                {score} correct out of {answeredAnswerableCount} answerable questions attempted ({scorePercentage}%). PDF items without a supplied key are excluded from the score.
              </p>
            </div>
          </div>
          <Button onClick={resetQuiz} variant="outline" className="border-emerald-300 text-emerald-800 hover:bg-emerald-100">
            <RotateCcw className="w-4 h-4 mr-2" /> Reset answers
          </Button>
        </Card>
      )}

      <div className="space-y-5">
        {filteredQuestions.map((question, index) => {
          const userAnswer = selectedAnswers[question.id];
          const isAnswered = Boolean(userAnswer);
          const hasAnswerKey = Boolean(question.correctAnswer);
          const isCorrect = hasAnswerKey && userAnswer === question.correctAnswer;
          const displayExplanation = Boolean(showResults[question.id] || (quizSubmitted && isAnswered));

          return (
            <Card key={question.id} className="p-5 sm:p-6 border border-gray-200 shadow-sm bg-white space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className="bg-blue-600 text-white font-mono text-xs">Question {question.number || index + 1}</Badge>
                  {question.chapter && <Badge variant="outline" className="text-xs">{question.chapter}</Badge>}
                  <span className="text-xs font-medium text-gray-500">{sourceLabel(question.sourceType)}</span>
                </div>
                {isAnswered && hasAnswerKey && (
                  <Badge variant="outline" className={isCorrect ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-red-50 text-red-700 border-red-200"}>
                    {isCorrect ? "Correct" : "Incorrect"}
                  </Badge>
                )}
                {isAnswered && !hasAnswerKey && (
                  <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Self-check recorded</Badge>
                )}
              </div>

              <h3 className="font-bold text-gray-900 text-base sm:text-lg leading-snug">{question.question}</h3>

              <div className="space-y-2.5">
                {question.options.map((option) => {
                  const isChosen = userAnswer === option.letter;
                  const isRightOption = hasAnswerKey && option.letter === question.correctAnswer;
                  let optionStyle = "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50 text-gray-800";
                  if (quizSubmitted || showResults[question.id]) {
                    if (isRightOption) optionStyle = "border-emerald-500 bg-emerald-50 text-emerald-950 font-semibold ring-1 ring-emerald-500";
                    else if (isChosen && hasAnswerKey) optionStyle = "border-red-400 bg-red-50 text-red-950";
                    else if (isChosen) optionStyle = "border-blue-500 bg-blue-50 text-blue-950 font-medium";
                  } else if (isChosen) {
                    optionStyle = "border-blue-600 bg-blue-50 text-blue-950 font-medium ring-2 ring-blue-500/20";
                  }

                  return (
                    <button
                      type="button"
                      key={option.letter}
                      onClick={() => handleSelectOption(question.id, option.letter)}
                      disabled={quizSubmitted}
                      className={`w-full text-left p-3.5 rounded-xl border-2 transition-all flex items-start gap-3 ${optionStyle}`}
                    >
                      <span className="w-6 h-6 rounded-lg bg-white border border-gray-300 flex items-center justify-center font-mono font-bold text-xs flex-shrink-0 text-gray-700">
                        {option.letter}
                      </span>
                      <span className="text-sm leading-relaxed flex-1">{option.text}</span>
                      {displayExplanation && isRightOption && <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />}
                      {displayExplanation && isChosen && !isRightOption && hasAnswerKey && <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>

              <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t border-gray-100">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-blue-600 hover:bg-blue-50 p-0 h-auto font-medium justify-start"
                  onClick={() => handleToggleShowResult(question.id)}
                >
                  <HelpCircle className="w-4 h-4 mr-1.5" />
                  {displayExplanation ? "Hide explanation" : "Show explanation & answer status"}
                </Button>
                {!isAnswered && <span className="text-[11px] text-gray-400 italic">Select an option above</span>}
              </div>

              {displayExplanation && (
                <div className={`rounded-xl p-4 text-xs sm:text-sm space-y-2 ${hasAnswerKey ? "bg-blue-50/70 border border-blue-200 text-blue-950" : "bg-amber-50 border border-amber-200 text-amber-950"}`}>
                  <div className="font-bold flex items-center gap-1.5">
                    {hasAnswerKey ? <CheckCircle2 className="w-4 h-4 text-blue-600" /> : <AlertCircle className="w-4 h-4 text-amber-600" />}
                    {hasAnswerKey ? `Correct answer: Option ${question.correctAnswer}` : "No answer key supplied in the PDF noteset"}
                  </div>
                  <p className="leading-relaxed">{question.explanation || "Review the corresponding chapter material and record your own reasoning for this self-check question."}</p>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {filteredQuestions.length === 0 && (
        <Card className="p-10 text-center bg-white border-dashed">
          <BookOpenCheck className="w-10 h-10 mx-auto text-gray-300 mb-3" />
          <h3 className="font-bold text-gray-900">No questions match these filters</h3>
          <p className="text-sm text-gray-500 mt-1">Clear the filters or try a broader search term.</p>
        </Card>
      )}

      {!quizSubmitted && (
        <div className="flex flex-col sm:flex-row items-end justify-between gap-3 pt-2">
          <p className="text-xs text-gray-500 max-w-xl">
            The score uses only questions with a supplied answer key. PDF noteset questions without an answer key remain available as guided self-checks so no course material is lost.
          </p>
          <Button
            size="lg"
            disabled={!isComplete}
            onClick={() => setQuizSubmitted(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-xl shadow-lg disabled:opacity-50"
          >
            Submit answer-key questions ({answeredAnswerableCount}/{answerableQuestions.length})
          </Button>
        </div>
      )}
    </div>
  );
}
