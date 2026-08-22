import { useState } from "react";
import { ChevronDown, ChevronRight, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CourseData {
  course: { title: string };
  sections: Array<{
    id: number;
    day: number;
    title: string;
    topics: Array<{ id: string; title: string }>;
  }>;
}

interface SidebarProps {
  courseData: CourseData;
  selectedSection: number;
  onSelectSection: (id: number) => void;
  onSelectTopic: (topicId: string | null) => void;
}

export default function Sidebar({
  courseData,
  selectedSection,
  onSelectSection,
  onSelectTopic,
}: SidebarProps) {
  const [expandedSections, setExpandedSections] = useState<Set<number>>(
    new Set([selectedSection])
  );

  const toggleSection = (id: number) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedSections(newExpanded);
  };

  // Group sections by day
  const day1Sections = courseData.sections.filter((s) => s.day === 1);
  const day2Sections = courseData.sections.filter((s) => s.day === 2);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <BookOpen size={18} className="text-primary-foreground" />
          </div>
          <h2 className="font-bold text-sidebar-foreground text-sm">IC32 Course</h2>
        </div>
        <p className="text-xs text-muted-foreground">ISA/IEC 62443 Standards</p>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-2 py-4">
          <div className="space-y-1">
            {day1Sections.map((section) => (
              <div key={section.id}>
                <Button
                  variant={selectedSection === section.id ? "default" : "ghost"}
                  size="sm"
                  className="w-full justify-between text-left h-auto py-2 px-3"
                  onClick={() => {
                    onSelectSection(section.id);
                    toggleSection(section.id);
                  }}
                >
                  <span className="flex-1 text-sm font-medium truncate">
                    {section.id}. {section.title}
                  </span>
                  {expandedSections.has(section.id) ? (
                    <ChevronDown size={16} className="flex-shrink-0 ml-2" />
                  ) : (
                    <ChevronRight size={16} className="flex-shrink-0 ml-2" />
                  )}
                </Button>

                {/* Topics */}
                {expandedSections.has(section.id) && (
                  <div className="ml-4 space-y-1 mt-1">
                    {section.topics.map((topic) => (
                      <Button
                        key={topic.id}
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start text-left h-auto py-1 px-3 text-xs"
                        onClick={() => onSelectTopic(topic.id)}
                      >
                        <span className="truncate text-muted-foreground hover:text-foreground">
                          {topic.title}
                        </span>
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="px-2 py-4 border-t border-sidebar-border">
          <div className="space-y-1">
            {day2Sections.map((section) => (
              <div key={section.id}>
                <Button
                  variant={selectedSection === section.id ? "default" : "ghost"}
                  size="sm"
                  className="w-full justify-between text-left h-auto py-2 px-3"
                  onClick={() => {
                    onSelectSection(section.id);
                    toggleSection(section.id);
                  }}
                >
                  <span className="flex-1 text-sm font-medium truncate">
                    {section.id}. {section.title}
                  </span>
                  {expandedSections.has(section.id) ? (
                    <ChevronDown size={16} className="flex-shrink-0 ml-2" />
                  ) : (
                    <ChevronRight size={16} className="flex-shrink-0 ml-2" />
                  )}
                </Button>

                {/* Topics */}
                {expandedSections.has(section.id) && (
                  <div className="ml-4 space-y-1 mt-1">
                    {section.topics.map((topic) => (
                      <Button
                        key={topic.id}
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start text-left h-auto py-1 px-3 text-xs"
                        onClick={() => onSelectTopic(topic.id)}
                      >
                        <span className="truncate text-muted-foreground hover:text-foreground">
                          {topic.title}
                        </span>
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border text-xs text-muted-foreground">
        <p>© 2025 ISA</p>
        <p>Version 6.0</p>
      </div>
    </div>
  );
}
