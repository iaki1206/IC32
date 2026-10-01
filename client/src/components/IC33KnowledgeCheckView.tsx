import { useState, useMemo } from "react";
import {
  CheckCircle2,
  XCircle,
  RotateCcw,
  Search,
  Filter,
  AlertCircle,
  Bookmark,
  BookmarkCheck,
  Award,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import data from "@/data/ic33QuestionsData.json";

export type Ic33BankQuestion = {
  id: string;
  number: number;
  module: string;
  domain: string;
  source: string;
  prompt: string;
  options: string[];
  answers: number[];
  explanation: string;
  anchor: string;
  questionSet: number;
};

const questions = data.questions as Ic33BankQuestion[];

export default function IC33KnowledgeCheckView() {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number[]>>({});
  const [showResults, setShowResults] = useState<Record<string, boolean>>({});
  const [questionSetFilter, setQuestionSetFilter] = useState("all");
  const [domainFilter, setDomainFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [markedQuestionIds, setMarkedQuestionIds] = useState<Set<string>>(() => {
    if (typeof window === "undefined") return new Set<string>();
    try {
      return new Set<string>(JSON.parse(window.localStorage.getItem("ic33_marked_questions") || "[]"));
    } catch {
      return new Set<string>();
    }
  });

  const availableSets = useMemo(() => {
    const setNums = Array.from(new Set(questions.map((q) => q.questionSet))).sort((a, b) => a - b);
    return setNums.map((s) => ({
      id: s,
      name: `Set ${s} (Max 100 Q)`,
      count: questions.filter((q) => q.questionSet === s).length,
    }));
  }, []);

  const availableDomains = useMemo(() => {
    const dMap: Record<string, number> = {};
    for (const q of questions) {
      dMap[q.domain] = (dMap[q.domain] || 0) + 1;
    }
    return Object.entries(dMap)
      .map(([domain, count]) => ({ domain, count }))
      .sort((a, b) => b.count - a.count);
  }, []);

  const handleSelectOption = (questionId: string, optionIndex: number, isMultiple: boolean) => {
    setSelectedAnswers((prev) => {
      const current = prev[questionId] || [];
      let next: number[];
      if (isMultiple) {
        next = current.includes(optionIndex)
          ? current.filter((i) => i !== optionIndex)
          : [...current, optionIndex].sort((a, b) => a - b);
      } else {
        next = [optionIndex];
      }
      return { ...prev, [questionId]: next };
    });
  };

  const handleCheckAnswer = (questionId: string) => {
    setShowResults((prev) => ({ ...prev, [questionId]: true }));
  };

  const resetQuestion = (questionId: string) => {
    setSelectedAnswers((prev) => {
      const next = { ...prev };
      delete next[questionId];
      return next;
    });
    setShowResults((prev) => {
      const next = { ...prev };
      delete next[questionId];
      return next;
    });
  };

  const resetAllAnswers = () => {
    setSelectedAnswers({});
    setShowResults({});
  };

  const toggleMarked = (questionId: string) => {
    setMarkedQuestionIds((prev) => {
      const next = new Set(prev);
      if (next.has(questionId)) next.delete(questionId);
      else next.add(questionId);
      try {
        window.localStorage.setItem("ic33_marked_questions", JSON.stringify(Array.from(next)));
      } catch {}
      return next;
    });
  };

  const isQuestionCorrect = (q: Ic33BankQuestion) => {
    const user = (selectedAnswers[q.id] || []).slice().sort((a, b) => a - b);
    const expected = q.answers.slice().sort((a, b) => a - b);
    return user.length === expected.length && user.every((val, idx) => val === expected[idx]);
  };

  const filteredQuestions = useMemo(() => {
    const qTerm = searchTerm.trim().toLowerCase();
    return questions.filter((q) => {
      if (questionSetFilter !== "all" && String(q.questionSet) !== questionSetFilter) {
        return false;
      }
      if (domainFilter !== "all" && q.domain !== domainFilter) {
        return false;
      }
      if (qTerm) {
        const matchesPrompt = q.prompt.toLowerCase().includes(qTerm);
        const matchesExplanation = q.explanation.toLowerCase().includes(qTerm);
        const matchesOptions = q.options.some((opt) => opt.toLowerCase().includes(qTerm));
        if (!matchesPrompt && !matchesExplanation && !matchesOptions) {
          return false;
        }
      }
      return true;
    });
  }, [questionSetFilter, domainFilter, searchTerm]);

  // Score statistics
  const answeredCount = Object.keys(selectedAnswers).filter((id) => selectedAnswers[id]?.length > 0).length;
  const correctCount = questions.filter((q) => selectedAnswers[q.id]?.length && isQuestionCorrect(q)).length;
  const scorePct = answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 rounded-2xl shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 border border-blue-400/30 text-blue-200">
              ISA/IEC 62443-3-2 Specialist
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 border border-emerald-400/30 text-emerald-200">
              Exam Practice Bank
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">IC33 Knowledge Checks</h1>
          <p className="text-sm text-blue-200 mt-1 max-w-2xl">
            Simulare completă pentru examenul de certificare IEC 62443 Risk Assessment Specialist. Întrebările sunt organizate pe seturi de maximum 100 de întrebări.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 min-w-[240px]">
          <div className="bg-white/10 border border-white/15 backdrop-blur-md rounded-xl p-3 text-center">
            <div className="text-2xl font-extrabold">{questions.length}</div>
            <div className="text-[11px] uppercase tracking-wide text-blue-200">Total Întrebări</div>
          </div>
          <div className="bg-white/10 border border-white/15 backdrop-blur-md rounded-xl p-3 text-center">
            <div className="text-2xl font-extrabold">{availableSets.length}</div>
            <div className="text-[11px] uppercase tracking-wide text-blue-200">Seturi Active</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4 bg-white border-slate-200 shadow-sm space-y-3">
        <div className="flex flex-col lg:flex-row gap-3 lg:items-center">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Caută în întrebări, opțiuni de răspuns sau explicații..."
              className="w-full h-10 pl-9 pr-3 rounded-lg border border-slate-200 bg-slate-50 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
              <Layers className="w-4 h-4 text-indigo-600" />
              <span>Set:</span>
            </div>
            <select
              value={questionSetFilter}
              onChange={(e) => setQuestionSetFilter(e.target.value)}
              className="h-10 rounded-lg border border-indigo-200 bg-indigo-50 px-3 text-sm text-indigo-900 outline-none focus:ring-2 focus:ring-indigo-500/30"
            >
              <option value="all">Toate seturile ({questions.length} Q)</option>
              {availableSets.map((s) => (
                <option key={s.id} value={String(s.id)}>
                  Set {s.id} ({s.count} Q)
                </option>
              ))}
            </select>

            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
              <Filter className="w-4 h-4 text-blue-600" />
              <span>Domeniu:</span>
            </div>
            <select
              value={domainFilter}
              onChange={(e) => setDomainFilter(e.target.value)}
              className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-blue-500/30 max-w-xs truncate"
            >
              <option value="all">Toate domeniile ({availableDomains.length})</option>
              {availableDomains.map((d) => (
                <option key={d.domain} value={d.domain}>
                  {d.domain} ({d.count})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between pt-2 border-t border-slate-100">
          <span className="text-xs text-slate-500 font-medium">
            Se afișează <strong className="text-slate-900">{filteredQuestions.length}</strong> din {questions.length} întrebări
          </span>

          {(questionSetFilter !== "all" || domainFilter !== "all" || searchTerm !== "") && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchTerm("");
                setQuestionSetFilter("all");
                setDomainFilter("all");
              }}
              className="text-xs h-8"
            >
              Resetează filtrele
            </Button>
          )}
        </div>
      </Card>

      {/* Score Tracker */}
      <Card className="p-4 sm:p-5 bg-blue-50/70 border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-sm">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-900">
              Scor curent: <span className="text-blue-600">{correctCount}</span> / {answeredCount} ({scorePct}%)
            </div>
            <div className="text-xs text-slate-600">
              Ai răspuns la {answeredCount} din {questions.length} întrebări ({questions.length - answeredCount} rămase)
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={resetAllAnswers}
            className="bg-white hover:bg-slate-50 text-slate-700 border-slate-300"
          >
            <RotateCcw className="w-4 h-4 mr-1.5" />
            Resetează toate răspunsurile
          </Button>
        </div>
      </Card>

      {/* Question List */}
      <div className="space-y-5">
        {filteredQuestions.length === 0 ? (
          <Card className="p-12 text-center bg-white border-slate-200 space-y-3">
            <AlertCircle className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="text-lg font-bold text-slate-900">Nicio întrebare găsită</h3>
            <p className="text-sm text-slate-600 max-w-md mx-auto">
              Încearcă să resetezi termenii de căutare sau filtrele de Set și Domeniu.
            </p>
          </Card>
        ) : (
          filteredQuestions.map((q, idx) => {
            const userSelections = selectedAnswers[q.id] || [];
            const hasSubmitted = showResults[q.id] || false;
            const isMultiple = q.answers.length > 1;
            const isCorrect = isQuestionCorrect(q);

            return (
              <Card key={q.id} className="p-6 bg-white border-slate-200 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className="font-mono text-xs text-blue-700 bg-blue-50 border-blue-200">
                      Q#{idx + 1}
                    </Badge>
                    <Badge variant="secondary" className="text-xs bg-slate-100 text-slate-700">
                      {q.domain}
                    </Badge>
                    <Badge variant="outline" className="text-[10px] text-slate-500">
                      Set {q.questionSet}
                    </Badge>
                    {isMultiple && (
                      <Badge className="bg-amber-100 text-amber-900 border-amber-300 text-[10px]">
                        Răspunsuri multiple
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => toggleMarked(q.id)}
                      className={
                        markedQuestionIds.has(q.id)
                          ? "h-8 border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100"
                          : "h-8 border-slate-200 text-slate-600 hover:bg-slate-50"
                      }
                    >
                      {markedQuestionIds.has(q.id) ? (
                        <BookmarkCheck className="w-3.5 h-3.5 mr-1" />
                      ) : (
                        <Bookmark className="w-3.5 h-3.5 mr-1" />
                      )}
                      {markedQuestionIds.has(q.id) ? "Marcat" : "Marchează"}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => resetQuestion(q.id)}
                      className="h-8 text-slate-500 hover:text-slate-900"
                    >
                      <RotateCcw className="w-3.5 h-3.5 mr-1" />
                      Reset
                    </Button>
                  </div>
                </div>

                <div className="text-base font-semibold text-slate-900 leading-relaxed">
                  {q.prompt}
                </div>

                {/* Options */}
                <div className="space-y-2 pt-1">
                  {q.options.map((option, optIdx) => {
                    const isSelected = userSelections.includes(optIdx);
                    const isExpected = q.answers.includes(optIdx);

                    let optionStyle = "border-slate-200 hover:border-slate-300 bg-white";
                    if (hasSubmitted) {
                      if (isExpected) {
                        optionStyle = "border-emerald-500 bg-emerald-50/80 text-emerald-950 font-medium";
                      } else if (isSelected && !isExpected) {
                        optionStyle = "border-rose-400 bg-rose-50/80 text-rose-950 line-through";
                      }
                    } else if (isSelected) {
                      optionStyle = "border-blue-500 bg-blue-50/70 text-blue-950 font-medium";
                    }

                    return (
                      <button
                        key={optIdx}
                        type="button"
                        onClick={() => handleSelectOption(q.id, optIdx, isMultiple)}
                        className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start gap-3 ${optionStyle}`}
                      >
                        <span
                          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border text-xs font-bold ${
                            isSelected
                              ? "border-blue-600 bg-blue-600 text-white"
                              : "border-slate-300 bg-slate-100 text-slate-700"
                          }`}
                        >
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span className="flex-1 text-sm leading-6">{option}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Submit & Explanation */}
                <div className="pt-2 flex flex-col gap-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <Button
                      size="sm"
                      onClick={() => handleCheckAnswer(q.id)}
                      disabled={userSelections.length === 0}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-medium"
                    >
                      Verifică răspunsul
                    </Button>

                    {hasSubmitted && (
                      <span
                        className={`inline-flex items-center gap-1.5 text-sm font-bold ${
                          isCorrect ? "text-emerald-700" : "text-rose-700"
                        }`}
                      >
                        {isCorrect ? (
                          <>
                            <CheckCircle2 className="h-4 w-4" /> Corect!
                          </>
                        ) : (
                          <>
                            <XCircle className="h-4 w-4" /> Răspuns greșit
                          </>
                        )}
                      </span>
                    )}
                  </div>

                  {hasSubmitted && q.explanation && (
                    <div
                      className={`p-4 rounded-xl text-sm leading-6 border ${
                        isCorrect
                          ? "bg-emerald-50/80 border-emerald-200 text-emerald-950"
                          : "bg-rose-50/80 border-rose-200 text-rose-950"
                      }`}
                    >
                      <div className="font-bold mb-1">Explicație:</div>
                      {q.explanation}
                    </div>
                  )}
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
