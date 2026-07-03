import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp, Lightbulb, BookOpen, Target } from "lucide-react";
import { useState } from "react";

interface Topic {
  id: string;
  title: string;
  definition?: string | undefined;
  explanation?: string | undefined;
  keyPoints?: string[] | undefined;
  examples?: string[] | undefined;
  examTips?: string | undefined;
  tierCorrelations?: Record<string, string> | undefined;
  bestPractices?: string[] | undefined;
  organizationalImpact?: string[] | undefined;
  societalImpact?: string[] | undefined;
  historicalExamples?: string[] | undefined;
}

interface EnhancedContentPanelProps {
  section: {
    id: number;
    title: string;
    description: string;
    topics: Topic[];
  };
  selectedTopic?: Topic;
  onSelectTopic?: (topic: Topic) => void;
}

export default function EnhancedContentPanel({
  section,
  selectedTopic,
  onSelectTopic,
}: EnhancedContentPanelProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    definition: true,
    explanation: true,
    keyPoints: true,
    tierCorrelations: false,
  });

  const toggleSection = (key: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const topic = selectedTopic || section.topics[0];

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Section Header */}
      <div className="px-6 py-4 border-b border-border bg-gradient-to-r from-blue-50 to-transparent">
        <h2 className="text-2xl font-bold text-gray-900">{section.title}</h2>
        <p className="text-sm text-gray-600 mt-1">{section.description}</p>
      </div>

      {/* Topic Selector */}
      <div className="px-6 py-4 border-b border-border bg-white">
        <p className="text-sm font-semibold text-gray-700 mb-3">Topics in this section:</p>
        <div className="grid grid-cols-1 gap-2 max-h-24 overflow-y-auto">
          {section.topics.map((t) => (
            <button
              key={t.id}
              onClick={() => onSelectTopic?.(t)}
              className={`text-left px-4 py-2 rounded-lg border-2 transition-all ${
                topic?.id === t.id
                  ? "border-blue-500 bg-blue-50 text-blue-900 font-semibold"
                  : "border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50"
              }`}
            >
              {t.title}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        {topic && (
          <div className="space-y-4">
            {/* Topic Title */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{topic.title}</h3>
            </div>

            {/* Definition Section */}
            {topic.definition && (
              <Card className="border-blue-200 bg-blue-50">
                <CardHeader
                  className="pb-3 cursor-pointer hover:bg-blue-100 transition-colors"
                  onClick={() => toggleSection("definition")}
                >
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2 text-blue-900">
                      <BookOpen className="w-4 h-4" />
                      Definition
                    </CardTitle>
                    {expandedSections.definition ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                </CardHeader>
                {expandedSections.definition && (
                  <CardContent className="text-sm text-blue-900 font-medium">
                    {topic.definition}
                  </CardContent>
                )}
              </Card>
            )}

            {/* Explanation Section */}
            {topic.explanation && (
              <Card className="border-green-200 bg-green-50">
                <CardHeader
                  className="pb-3 cursor-pointer hover:bg-green-100 transition-colors"
                  onClick={() => toggleSection("explanation")}
                >
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2 text-green-900">
                      <Lightbulb className="w-4 h-4" />
                      Beginner Explanation
                    </CardTitle>
                    {expandedSections.explanation ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                </CardHeader>
                {expandedSections.explanation && (
                  <CardContent className="text-sm text-green-900 leading-relaxed">
                    {topic.explanation}
                  </CardContent>
                )}
              </Card>
            )}

            {/* Key Points Section */}
            {topic.keyPoints && topic.keyPoints.length > 0 && (
              <Card className="border-purple-200 bg-purple-50">
                <CardHeader
                  className="pb-3 cursor-pointer hover:bg-purple-100 transition-colors"
                  onClick={() => toggleSection("keyPoints")}
                >
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2 text-purple-900">
                      <Target className="w-4 h-4" />
                      Key Points
                    </CardTitle>
                    {expandedSections.keyPoints ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                </CardHeader>
                {expandedSections.keyPoints && (
                  <CardContent>
                    <ul className="space-y-2">
                      {topic.keyPoints.map((point, idx) => (
                        <li key={idx} className="flex gap-3 text-sm text-purple-900">
                          <span className="font-bold text-purple-600 flex-shrink-0">•</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                )}
              </Card>
            )}

            {/* Examples Section */}
            {topic.examples && topic.examples.length > 0 && (
              <Card className="border-orange-200 bg-orange-50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base text-orange-900">Real-World Examples</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {topic.examples.map((example, idx) => (
                      <li key={idx} className="flex gap-3 text-sm text-orange-900">
                        <span className="font-bold text-orange-600 flex-shrink-0">→</span>
                        <span>{example}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Tier Correlations Section */}
            {topic.tierCorrelations && (
              <Card className="border-indigo-200 bg-indigo-50">
                <CardHeader
                  className="pb-3 cursor-pointer hover:bg-indigo-100 transition-colors"
                  onClick={() => toggleSection("tierCorrelations")}
                >
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base text-indigo-900">
                      How This Applies to Each Tier
                    </CardTitle>
                    {expandedSections.tierCorrelations ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                </CardHeader>
                {expandedSections.tierCorrelations && (
                  <CardContent>
                    <div className="space-y-3">
                      {Object.entries(topic.tierCorrelations).map(([level, description]) => (
                        <div key={level} className="border-l-4 border-indigo-400 pl-3">
                          <p className="font-semibold text-indigo-900 text-sm capitalize">
                            {level.replace("level", "Tier ")}
                          </p>
                          <p className="text-sm text-indigo-800 mt-1">{description}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                )}
              </Card>
            )}

            {/* Exam Tips Section */}
            {topic.examTips && (
              <Card className="border-red-200 bg-red-50 border-2">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base text-red-900 flex items-center gap-2">
                    📝 Exam Tip
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-red-900 font-medium">{topic.examTips}</CardContent>
              </Card>
            )}

            {/* Best Practices Section */}
            {topic.bestPractices && topic.bestPractices.length > 0 && (
              <Card className="border-teal-200 bg-teal-50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base text-teal-900">Best Practices</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {topic.bestPractices.map((practice, idx) => (
                      <li key={idx} className="flex gap-3 text-sm text-teal-900">
                        <span className="font-bold text-teal-600 flex-shrink-0">✓</span>
                        <span>{practice}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Historical Examples Section */}
            {topic.historicalExamples && topic.historicalExamples.length > 0 && (
              <Card className="border-gray-300 bg-gray-50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base text-gray-900">Historical Examples</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {topic.historicalExamples.map((example, idx) => (
                      <li key={idx} className="text-sm text-gray-800 leading-relaxed">
                        <span className="font-semibold text-gray-900">{example.split(":")[0]}:</span>
                        {example.includes(":") && ` ${example.split(":").slice(1).join(":")}`}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
