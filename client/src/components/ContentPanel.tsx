import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, BookMarked, Lightbulb } from "lucide-react";

interface Topic {
  id: string;
  title: string;
  keyPoints?: string[];
}

interface Section {
  id: number;
  day: number;
  title: string;
  description: string;
  topics: Topic[];
}

interface CourseData {
  course: { goals: Array<{ id: number; title: string }> };
  correlations: { sectionToGoals: Record<string, number[]> };
}

interface ContentPanelProps {
  section: Section;
  selectedTopic: string | null;
  courseData: CourseData;
}

export default function ContentPanel({
  section,
  selectedTopic,
  courseData,
}: ContentPanelProps) {
  const relatedGoals = courseData.correlations.sectionToGoals[section.id.toString()] || [];
  const selectedTopicData = section.topics.find((t) => t.id === selectedTopic);

  return (
    <div className="p-6 max-w-4xl">
      {/* Section Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
            Section {section.id}
          </Badge>
          <Badge variant="secondary">Day {section.day}</Badge>
        </div>
        <h1 className="text-4xl font-bold text-foreground mb-2">{section.title}</h1>
        <p className="text-lg text-muted-foreground">{section.description}</p>
      </div>

      {/* Related Goals */}
      {relatedGoals.length > 0 && (
        <Card className="mb-8 p-4 border-l-4 border-l-accent bg-accent/5">
          <div className="flex gap-3">
            <Lightbulb className="text-accent flex-shrink-0 mt-1" size={20} />
            <div>
              <h3 className="font-semibold text-foreground mb-2">Learning Goals</h3>
              <ul className="space-y-1">
                {relatedGoals.map((goalId) => {
                  const goal = courseData.course.goals.find((g) => g.id === goalId);
                  return (
                    <li key={goalId} className="text-sm text-foreground">
                      • {goal?.title}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </Card>
      )}

      {/* Topics List */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-4">Topics</h2>
        <div className="grid gap-3">
          {section.topics.map((topic) => (
            <Card
              key={topic.id}
              className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                selectedTopic === topic.id
                  ? "border-primary bg-primary/5 border-l-4 border-l-primary"
                  : "hover:border-primary/50"
              }`}
            >
              <h3 className="font-semibold text-foreground">{topic.title}</h3>
              {topic.keyPoints && topic.keyPoints.length > 0 && (
                <p className="text-sm text-muted-foreground mt-1">
                  {topic.keyPoints.length} key points
                </p>
              )}
            </Card>
          ))}
        </div>
      </div>

      {/* Selected Topic Details */}
      {selectedTopicData && (
        <div className="mb-8">
          <Card className="p-6 border-l-4 border-l-primary bg-gradient-to-br from-primary/5 to-transparent">
            <div className="flex gap-3 mb-4">
              <BookMarked className="text-primary flex-shrink-0" size={24} />
              <h2 className="text-2xl font-bold text-foreground">{selectedTopicData.title}</h2>
            </div>

            {selectedTopicData.keyPoints && selectedTopicData.keyPoints.length > 0 && (
              <div>
                <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <AlertCircle size={18} className="text-accent" />
                  Key Points
                </h3>
                <ul className="space-y-2">
                  {selectedTopicData.keyPoints.map((point, idx) => (
                    <li key={idx} className="flex gap-3 text-foreground">
                      <span className="font-semibold text-primary min-w-6">{idx + 1}.</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Card>
        </div>
      )}

      {/* Empty State */}
      {!selectedTopicData && section.topics.length > 0 && (
        <Card className="p-8 text-center border-dashed">
          <BookMarked size={40} className="mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground">
            Select a topic from the list above to view details
          </p>
        </Card>
      )}
    </div>
  );
}
