import { useState } from "react";
import { ChevronDown, ChevronRight, BookOpen, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Section {
  id: number;
  day: number;
  title: string;
  description: string;
  topics: Array<{ id: string; title: string }>;
}

interface EnhancedSidebarProps {
  sections: Section[];
  selectedSection: Section;
  onSelectSection: (section: Section) => void;
  completedSections: Set<number>;
  onToggleCompletion: (sectionId: number) => void;
}

export default function EnhancedSidebar({
  sections,
  selectedSection,
  onSelectSection,
  completedSections,
  onToggleCompletion,
}: EnhancedSidebarProps) {
  const [expandedSections, setExpandedSections] = useState<Set<number>>(
    new Set([selectedSection.id])
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
  const day1Sections = sections.filter((s) => s.day === 1);
  const day2Sections = sections.filter((s) => s.day === 2);

  const renderSectionGroup = (groupSections: Section[]) => (
    <div className="mb-4">
      <div className="space-y-1">
        {groupSections.map((section) => {
          const isSelected = selectedSection.id === section.id;
          const isExpanded = expandedSections.has(section.id);
          const isCompleted = completedSections.has(section.id);

          return (
            <div key={section.id}>
              <div
                className={`mx-2 px-3 py-2 rounded-lg cursor-pointer transition-all flex items-center gap-2 ${
                  isSelected
                    ? "bg-blue-100 border-l-4 border-blue-500"
                    : "hover:bg-gray-100"
                }`}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSection(section.id);
                  }}
                  className="flex-shrink-0"
                >
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>

                <button
                  onClick={() => onSelectSection(section)}
                  className="flex-1 text-left"
                >
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <span className={`text-sm font-medium ${isSelected ? "text-blue-900" : "text-gray-700"}`}>
                      {section.title}
                    </span>
                  </div>
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleCompletion(section.id);
                  }}
                  className="flex-shrink-0"
                >
                  <CheckCircle
                    className={`w-4 h-4 transition-colors ${
                      isCompleted ? "text-green-500" : "text-gray-300 hover:text-green-400"
                    }`}
                  />
                </button>
              </div>

              {isExpanded && (
                <div className="ml-6 mt-1 space-y-1 border-l border-gray-200 pl-2">
                  {section.topics.map((topic) => (
                    <div
                      key={topic.id}
                      className="px-3 py-1 text-xs text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded cursor-pointer transition-colors"
                    >
                      {topic.title}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2 mb-2">
          <BookOpen className="w-5 h-5 text-blue-600" />
          <h2 className="text-sm font-bold text-gray-900">Course Sections</h2>
        </div>
        <p className="text-xs text-gray-600">Click to expand topics</p>
      </div>

      {/* Sections List */}
      <div className="flex-1 overflow-y-auto">
        {renderSectionGroup(day1Sections)}
        {renderSectionGroup(day2Sections)}
      </div>

      {/* Progress Footer */}
      <div className="border-t border-gray-200 p-4 bg-gray-50">
        <div className="text-xs text-gray-600 mb-2">
          Progress: {completedSections.size} / {sections.length} sections
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-green-500 h-2 rounded-full transition-all"
            style={{
              width: `${(completedSections.size / sections.length) * 100}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
