import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { X, Link2, Layers, Shield } from "lucide-react";

interface Section {
  id: number;
  title: string;
}

interface CourseData {
  sections: Section[];
  models: {
    referenceModel: {
      levels: Array<{ id: number; name: string; description: string; color: string }>;
    };
    securityLevels: {
      levels: Array<{ id: number; name: string; description: string; color: string }>;
    };
    foundationalRequirements: {
      requirements: Array<{ id: string; name: string; acronym: string }>;
    };
  };
  correlations: {
    sectionToGoals: Record<string, number[]>;
    sectionDependencies: Record<string, number[]>;
  };
}

interface ContextPanelProps {
  section: Section;
  courseData: CourseData;
  onClose: () => void;
}

export default function ContextPanel({ section, courseData, onClose }: ContextPanelProps) {
  const dependencies = courseData.correlations.sectionDependencies[section.id.toString()] || [];
  const dependentSections = Object.entries(courseData.correlations.sectionDependencies)
    .filter(([_, deps]) => deps.includes(section.id))
    .map(([sectionId]) => parseInt(sectionId));

  const relatedSections = courseData.sections.filter(
    (s) => dependencies.includes(s.id) || dependentSections.includes(s.id)
  );

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h3 className="font-semibold text-foreground">Context & Correlations</h3>
        <Button size="icon" variant="ghost" onClick={onClose} className="md:hidden">
          <X size={18} />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <Tabs defaultValue="correlations" className="w-full">
          <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0 h-auto">
            <TabsTrigger
              value="correlations"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              <Link2 size={16} className="mr-2" />
              Relations
            </TabsTrigger>
            <TabsTrigger
              value="models"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              <Layers size={16} className="mr-2" />
              Models
            </TabsTrigger>
            <TabsTrigger
              value="fr"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              <Shield size={16} className="mr-2" />
              FR
            </TabsTrigger>
          </TabsList>

          {/* Correlations Tab */}
          <TabsContent value="correlations" className="p-4 space-y-4">
            {relatedSections.length > 0 ? (
              <>
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-2">Related Sections</h4>
                  <div className="space-y-2">
                    {relatedSections.map((s) => {
                      const isPrerequisite = dependencies.includes(s.id);
                      return (
                        <Card key={s.id} className="p-3 text-sm">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="font-medium text-foreground">Section {s.id}</p>
                              <p className="text-xs text-muted-foreground">{s.title}</p>
                            </div>
                            <Badge
                              variant={isPrerequisite ? "default" : "secondary"}
                              className="text-xs whitespace-nowrap"
                            >
                              {isPrerequisite ? "Prerequisite" : "Related"}
                            </Badge>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">No related sections</p>
            )}
          </TabsContent>

          {/* Models Tab */}
          <TabsContent value="models" className="p-4 space-y-4">
            {/* Reference Model */}
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-2">Reference Model Levels</h4>
              <div className="space-y-2">
                {courseData.models.referenceModel.levels.map((level) => (
                  <div
                    key={level.id}
                    className="p-3 rounded-lg border"
                    style={{ borderLeftColor: level.color, borderLeftWidth: "4px" }}
                  >
                    <p className="font-medium text-sm text-foreground">Level {level.id}: {level.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">{level.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Security Levels */}
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-2">Security Levels</h4>
              <div className="space-y-2">
                {courseData.models.securityLevels.levels.slice(0, 3).map((level) => (
                  <div
                    key={level.id}
                    className="p-2 rounded-lg border text-xs"
                    style={{ backgroundColor: level.color + "20", borderColor: level.color }}
                  >
                    <p className="font-medium text-foreground">{level.name}</p>
                    <p className="text-muted-foreground">{level.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* FR Tab */}
          <TabsContent value="fr" className="p-4 space-y-2">
            <p className="text-xs text-muted-foreground mb-3">
              Seven Foundational Requirements that form the basis of ISA/IEC 62443
            </p>
            <div className="grid grid-cols-2 gap-2">
              {courseData.models.foundationalRequirements.requirements.map((fr) => (
                <Card key={fr.id} className="p-2 text-center border-primary/30 bg-primary/5">
                  <p className="font-bold text-primary text-sm">{fr.acronym}</p>
                  <p className="text-xs text-muted-foreground mt-1">{fr.id}</p>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
