import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  HelpCircle,
  Lightbulb,
  Shield,
  Target,
} from "lucide-react";
import data from "@/data/chaptersCourseData.json";

type Chapter = (typeof data.chapters)[number];
type Topic = Chapter["topics"][number];

export default function ChaptersView({
  onNavigateToQuiz,
  onNavigateToKnowledge,
  initialChapterId,
  initialTopicId,
}: {
  onNavigateToQuiz?: (quizId: string) => void;
  onNavigateToKnowledge?: () => void;
  initialChapterId?: number;
  initialTopicId?: string;
}) {
  const [selectedChapterId, setSelectedChapterId] = useState<number>(initialChapterId || 1);
  const [expandedTopics, setExpandedTopics] = useState<Record<string, boolean>>({
    [initialTopicId || "1.1"]: true,
  });
  const [completedChapters, setCompletedChapters] = useState<Record<number, boolean>>({});

  useEffect(() => {
    if (initialChapterId) {
      setSelectedChapterId(initialChapterId);
    }
    if (initialTopicId) {
      setExpandedTopics((prev) => ({ ...prev, [initialTopicId]: true }));
      setTimeout(() => {
        const el = document.getElementById(`topic-${initialTopicId}`);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 150);
    }
  }, [initialChapterId, initialTopicId]);

  const activeChapter = data.chapters.find((c) => c.id === selectedChapterId) || data.chapters[0];

  const toggleTopic = (topicId: string) => {
    setExpandedTopics((prev) => ({ ...prev, [topicId]: !prev[topicId] }));
  };

  const toggleCompleteChapter = (chapterId: number) => {
    setCompletedChapters((prev) => ({ ...prev, [chapterId]: !prev[chapterId] }));
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8 animate-in fade-in duration-300">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 rounded-2xl p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <Badge className="bg-blue-500/20 text-blue-300 border-blue-400/30 mb-3 px-3 py-1 text-sm font-medium">
            Official IC32 Version 6.0 Curriculum
          </Badge>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl mb-2">
            Course Chapters & Study Guide
          </h1>
          <p className="text-blue-100 text-sm sm:text-base max-w-2xl leading-relaxed">
            Explore all 15 official course chapters extracted directly from the PDF noteset. Each chapter includes learning objectives, definitions, beginner explanations, key points, and exam tips.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          {onNavigateToKnowledge && (
            <Button
              onClick={onNavigateToKnowledge}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md"
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Take Knowledge Checks
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Chapters Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="p-4 border border-gray-200 shadow-sm bg-white space-y-2">
            <div className="font-bold text-xs uppercase tracking-wider text-gray-500 px-2 mb-2">
              All 15 Chapters
            </div>

            <div className="space-y-1">
              {data.chapters.map((ch: Chapter) => {
                const isSelected = ch.id === selectedChapterId;
                const isDone = completedChapters[ch.id];
                return (
                  <button
                    type="button"
                    key={ch.id}
                    onClick={() => {
                      setSelectedChapterId(ch.id);
                      // Expand first topic by default
                      if (ch.topics.length > 0) {
                        setExpandedTopics({ [ch.topics[0].id]: true });
                      }
                    }}
                    className={`w-full text-left p-3 rounded-xl transition-all flex items-center justify-between gap-2 cursor-pointer ${
                      isSelected
                        ? "bg-blue-600 text-white font-bold shadow-md"
                        : "hover:bg-gray-100 text-gray-800 bg-white border border-gray-100"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-mono flex-shrink-0 ${
                        isSelected ? "bg-white/20 text-white" : "bg-gray-100 text-gray-700"
                      }`}>
                        {ch.id}
                      </span>
                      <div className="truncate">
                        <div className="text-[10px] uppercase tracking-wide opacity-80">{ch.number}</div>
                        <div className="text-xs truncate">{ch.title}</div>
                      </div>
                    </div>

                    {isDone && (
                      <CheckCircle2 className={`w-4 h-4 flex-shrink-0 ${isSelected ? "text-white" : "text-emerald-600"}`} />
                    )}
                  </button>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Chapter Detail Content */}
        <div className="lg:col-span-3 space-y-6">
          <Card className="p-6 sm:p-8 border border-gray-200 shadow-sm bg-white space-y-6">
            {/* Chapter Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-blue-100 text-blue-800 border-blue-200 font-mono text-xs">{activeChapter.number}</Badge>
                  <Badge variant="outline" className="text-xs">Day {activeChapter.day} Course Material</Badge>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                  {activeChapter.title}
                </h2>
                <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                  {activeChapter.description}
                </p>
              </div>

              <Button
                variant={completedChapters[activeChapter.id] ? "default" : "outline"}
                className={`flex-shrink-0 ${completedChapters[activeChapter.id] ? "bg-emerald-600 hover:bg-emerald-700 text-white" : ""}`}
                onClick={() => toggleCompleteChapter(activeChapter.id)}
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                {completedChapters[activeChapter.id] ? "Completed" : "Mark as Completed"}
              </Button>
            </div>

            {/* Learning Objectives */}
            <div className="rounded-2xl bg-indigo-50/70 border border-indigo-200 p-5 space-y-3">
              <div className="flex items-center gap-2 text-indigo-900 font-bold text-sm">
                <Target className="w-4 h-4 text-indigo-600" />
                <span>Section Learning Objectives</span>
              </div>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {activeChapter.learningObjectives.map((obj, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-indigo-950 leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 flex-shrink-0" />
                    <span>{obj}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Topics Accordion / Cards */}
            <div className="space-y-4 pt-2">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
                <span>Chapter Topics & Detailed Explanations</span>
              </h3>

              <div className="space-y-4">
                {activeChapter.topics.map((topic: Topic) => {
                  const isExpanded = expandedTopics[topic.id];
                  return (
                    <div
                      id={`topic-${topic.id}`}
                      key={topic.id}
                      className={`rounded-2xl bg-white shadow-sm overflow-hidden transition-all border ${
                        initialTopicId === topic.id
                          ? "border-blue-600 ring-2 ring-blue-500/40 shadow-md"
                          : "border-gray-200"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => toggleTopic(topic.id)}
                        className="w-full text-left p-5 bg-gray-50/70 hover:bg-gray-100/70 transition-colors flex items-center justify-between gap-4 cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-7 h-7 rounded-lg bg-blue-600 text-white font-mono font-bold text-xs flex items-center justify-center flex-shrink-0">
                            {topic.id}
                          </span>
                          <h4 className="font-bold text-gray-900 text-base">{topic.title}</h4>
                        </div>
                        {isExpanded ? (
                          <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                        ) : (
                          <ChevronRight className="w-5 h-5 text-gray-500 flex-shrink-0" />
                        )}
                      </button>

                      {isExpanded && (
                        <div className="p-6 space-y-5 border-t border-gray-100 animate-in fade-in duration-200 bg-white">
                          {/* Definition */}
                          <div className="bg-blue-50/80 border border-blue-200 rounded-xl p-4 space-y-1.5">
                            <div className="text-xs font-bold uppercase tracking-wider text-blue-800 flex items-center gap-1.5">
                              <Shield className="w-3.5 h-3.5" />
                              <span>Standard Definition</span>
                            </div>
                            <p className="text-sm text-blue-950 font-medium leading-relaxed">{topic.definition}</p>
                          </div>

                          {/* Beginner Explanation */}
                          <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 space-y-1.5">
                            <div className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                              <Lightbulb className="w-3.5 h-3.5" />
                              <span>Beginner-Friendly Explanation</span>
                            </div>
                            <p className="text-sm text-emerald-950 leading-relaxed">{topic.beginnerExplanation}</p>
                          </div>

                          {/* Key Points */}
                          <div className="space-y-2">
                            <div className="text-xs font-bold uppercase tracking-wider text-gray-700">Key Points</div>
                            <div className="grid grid-cols-1 gap-2">
                              {topic.keyPoints.map((pt, idx) => (
                                <div key={idx} className="flex items-start gap-2.5 p-2.5 rounded-lg bg-gray-50 border border-gray-200 text-xs sm:text-sm text-gray-800">
                                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                                  <span>{pt}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Exam Tip */}
                          {topic.examTip && (
                            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                              <span className="text-lg">💡</span>
                              <div>
                                <div className="text-xs font-bold uppercase tracking-wider text-amber-900 mb-0.5">Exam Tip</div>
                                <p className="text-xs sm:text-sm text-amber-950 leading-relaxed">{topic.examTip}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Chapter Footer Navigation */}
            <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
              <Button
                variant="outline"
                disabled={selectedChapterId === 1}
                onClick={() => setSelectedChapterId((prev) => Math.max(1, prev - 1))}
              >
                ← Previous Chapter
              </Button>

              <Button
                disabled={selectedChapterId === data.chapters.length}
                onClick={() => setSelectedChapterId((prev) => Math.min(data.chapters.length, prev + 1))}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Next Chapter →
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
