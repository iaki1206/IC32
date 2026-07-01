import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, BookOpen, Link2 } from "lucide-react";
import { useState } from "react";

interface Goal {
  id: number;
  title: string;
  relatedSections: number[];
}

interface Section {
  id: number;
  title: string;
}

interface GoalsPageProps {
  goals: Goal[];
  sections: Section[];
}

export default function GoalsPage({ goals, sections }: GoalsPageProps) {
  const [selectedGoal, setSelectedGoal] = useState<number | null>(null);

  return (
    <div className="p-6 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2">Learning Goals</h1>
        <p className="text-lg text-muted-foreground">
          10 core objectives that guide the IC32 course structure
        </p>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {goals.map((goal) => (
          <Card
            key={goal.id}
            className={`p-4 cursor-pointer transition-all border-l-4 border-l-primary ${
              selectedGoal === goal.id ? "bg-primary/5 shadow-lg" : "hover:shadow-md"
            }`}
            onClick={() => setSelectedGoal(selectedGoal === goal.id ? null : goal.id)}
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 font-bold text-sm">
                {goal.id}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground">{goal.title}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {goal.relatedSections.length} related section{goal.relatedSections.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>

            {/* Expanded Details */}
            {selectedGoal === goal.id && (
              <div className="mt-4 pt-4 border-t border-border">
                <div className="flex items-center gap-2 mb-3">
                  <Link2 size={16} className="text-accent" />
                  <p className="text-sm font-semibold text-foreground">Related Sections</p>
                </div>
                <div className="space-y-2">
                  {goal.relatedSections.map((sectionId) => {
                    const section = sections.find((s) => s.id === sectionId);
                    return (
                      <div key={sectionId} className="flex items-center gap-2 p-2 rounded bg-secondary/50">
                        <CheckCircle2 size={14} className="text-primary" />
                        <div>
                          <p className="text-sm font-medium text-foreground">Section {sectionId}</p>
                          <p className="text-xs text-muted-foreground">{section?.title}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Goals Summary */}
      <Card className="p-6 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/30">
        <div className="flex items-start gap-3">
          <BookOpen className="text-primary flex-shrink-0 mt-1" size={24} />
          <div>
            <h3 className="font-semibold text-foreground mb-2">How to Use These Goals</h3>
            <ul className="space-y-2 text-sm text-foreground">
              <li>• <span className="font-medium">Track Progress:</span> Mark goals as you complete related sections</li>
              <li>• <span className="font-medium">Understand Connections:</span> See how sections contribute to each goal</li>
              <li>• <span className="font-medium">Study Effectively:</span> Focus on sections that support your target goals</li>
              <li>• <span className="font-medium">Assess Understanding:</span> Test yourself on each goal's concepts</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Goals by Category */}
      <div className="mt-8 pt-8 border-t border-border">
        <h2 className="text-2xl font-bold text-foreground mb-4">Goals by Category</h2>

        <div className="space-y-6">
          {[
            {
              category: "Fundamentals",
              description: "Understanding core concepts and importance",
              goalIds: [1, 2, 3],
            },
            {
              category: "Architecture & Design",
              description: "Models, frameworks, and design principles",
              goalIds: [4, 6, 8],
            },
            {
              category: "Implementation & Verification",
              description: "Practical application and validation",
              goalIds: [5, 7, 9],
            },
            {
              category: "Advanced Topics",
              description: "Profiles and specialized applications",
              goalIds: [10],
            },
          ].map((category, idx) => (
            <div key={idx}>
              <h3 className="text-lg font-semibold text-foreground mb-3">{category.category}</h3>
              <p className="text-sm text-muted-foreground mb-3">{category.description}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {goals
                  .filter((g) => category.goalIds.includes(g.id))
                  .map((goal) => (
                    <Card key={goal.id} className="p-3 bg-secondary/50">
                      <div className="flex items-start gap-2">
                        <Badge className="text-xs">Goal {goal.id}</Badge>
                        <p className="text-sm text-foreground">{goal.title}</p>
                      </div>
                    </Card>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
