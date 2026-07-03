import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Menu, X, BookOpen, Brain, Target } from "lucide-react";
import EnhancedSidebar from "@/components/EnhancedSidebar";
import EnhancedContentPanel from "@/components/EnhancedContentPanel";
import InteractiveMindmap, {
  createPurdueModelMindmap,
  createSecurityLevelsMindmap,
  createFoundationalRequirementsMindmap,
} from "@/components/InteractiveMindmap";
import enhancedCourseData from "@/data/enhancedCourseData.json";

export default function EnhancedLearningApp() {
  const [currentPage, setCurrentPage] = useState<"sections" | "models" | "goals">("sections");
  const [selectedSection, setSelectedSection] = useState(enhancedCourseData.sections[0]);
  const [selectedTopic, setSelectedTopic] = useState<any>(enhancedCourseData.sections[0].topics[0]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [completedSections, setCompletedSections] = useState<Set<number>>(new Set());

  const toggleSectionCompletion = (sectionId: number) => {
    const newCompleted = new Set(completedSections);
    if (newCompleted.has(sectionId)) {
      newCompleted.delete(sectionId);
    } else {
      newCompleted.add(sectionId);
    }
    setCompletedSections(newCompleted);
  };

  const handleSelectSection = (section: any) => {
    setSelectedSection(section);
    setSelectedTopic(section.topics?.[0] || null);
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">IC32 Learning Platform</h1>
              <p className="text-sm text-gray-600">ISA/IEC 62443 Standards Course</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="hidden md:flex gap-2">
            <Button
              variant={currentPage === "sections" ? "default" : "outline"}
              onClick={() => setCurrentPage("sections")}
              className="gap-2"
            >
              <BookOpen className="w-4 h-4" />
              Sections
            </Button>
            <Button
              variant={currentPage === "models" ? "default" : "outline"}
              onClick={() => setCurrentPage("models")}
              className="gap-2"
            >
              <Brain className="w-4 h-4" />
              Models
            </Button>
            <Button
              variant={currentPage === "goals" ? "default" : "outline"}
              onClick={() => setCurrentPage("goals")}
              className="gap-2"
            >
              <Target className="w-4 h-4" />
              Goals
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        {sidebarOpen && (
          <div className="w-64 border-r border-gray-200 bg-white overflow-y-auto hidden lg:block">
            <EnhancedSidebar
              sections={enhancedCourseData.sections}
              selectedSection={selectedSection}
              onSelectSection={handleSelectSection}
              completedSections={completedSections}
              onToggleCompletion={toggleSectionCompletion}
            />
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 overflow-hidden">
          {currentPage === "sections" && (
            <div className="h-full flex gap-4 p-4">
              {/* Content Panel */}
              <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <EnhancedContentPanel
                  section={selectedSection}
                  selectedTopic={selectedTopic}
                  onSelectTopic={setSelectedTopic}
                />
              </div>

              {/* Right Panel - Mindmap */}
              <div className="w-80 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hidden xl:flex flex-col">
                <InteractiveMindmap
                  title="Purdue Model Overview"
                  rootNode={createPurdueModelMindmap()}
                />
              </div>
            </div>
          )}

          {currentPage === "models" && (
            <div className="h-full overflow-y-auto p-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Purdue Model */}
                <Card className="p-4 bg-white">
                  <InteractiveMindmap
                    title="Purdue Reference Model"
                    rootNode={createPurdueModelMindmap()}
                  />
                </Card>

                {/* Security Levels */}
                <Card className="p-4 bg-white">
                  <InteractiveMindmap
                    title="Security Levels (SL 0-4)"
                    rootNode={createSecurityLevelsMindmap()}
                  />
                </Card>

                {/* Foundational Requirements */}
                <Card className="p-4 bg-white">
                  <InteractiveMindmap
                    title="7 Foundational Requirements"
                    rootNode={createFoundationalRequirementsMindmap()}
                  />
                </Card>
              </div>

              {/* Model Explanations */}
              <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Purdue Model Details */}
                <Card className="p-6 bg-gradient-to-br from-blue-50 to-white">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Purdue Reference Model</h3>
                  <p className="text-sm text-gray-700 mb-4">
                    The Purdue Model organizes industrial control systems into five hierarchical levels, each with specific security requirements and functions.
                  </p>
                  <div className="space-y-3">
                    {enhancedCourseData.models.referenceModel.levels.map((level) => (
                      <div key={level.id} className="border-l-4 border-blue-400 pl-3">
                        <p className="font-semibold text-gray-900">
                          Level {level.id}: {level.name}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">{level.explanation}</p>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Security Levels Details */}
                <Card className="p-6 bg-gradient-to-br from-orange-50 to-white">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Security Levels</h3>
                  <p className="text-sm text-gray-700 mb-4">
                    Five levels representing increasing protection against different threat profiles. Each level requires stronger security measures.
                  </p>
                  <div className="space-y-3">
                    {enhancedCourseData.models.securityLevels.levels.map((level) => (
                      <div key={level.id} className="border-l-4 border-orange-400 pl-3">
                        <p className="font-semibold text-gray-900">
                          {level.name}: {level.title}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">{level.explanation}</p>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Foundational Requirements Details */}
                <Card className="p-6 bg-gradient-to-br from-green-50 to-white lg:col-span-2">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">7 Foundational Requirements</h3>
                  <p className="text-sm text-gray-700 mb-4">
                    Core security functions that must be implemented at each security level. Each system gets a security level for each FR individually.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {enhancedCourseData.models.foundationalRequirements.requirements.map((fr) => (
                      <div key={fr.id} className="border-l-4 border-green-400 pl-3">
                        <p className="font-semibold text-gray-900">
                          {fr.id}: {fr.name}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">{fr.explanation}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          )}

          {currentPage === "goals" && (
            <div className="h-full overflow-y-auto p-4">
              <div className="max-w-4xl mx-auto">
                <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Learning Objectives</h2>
                  <p className="text-gray-700">
                    These 10 learning objectives guide the entire course. Each section contributes to achieving these goals.
                  </p>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {enhancedCourseData.course.goals.map((goal) => (
                    <Card key={goal.id} className="p-4 hover:shadow-lg transition-shadow">
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600">
                          {goal.id}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{goal.title}</h3>
                          <p className="text-sm text-gray-600 mt-2">{goal.description}</p>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {goal.relatedSections.map((sectionId) => (
                              <button
                                key={sectionId}
                                onClick={() => {
                                  const section = enhancedCourseData.sections.find(
                                    (s) => s.id === sectionId
                                  );
                                  if (section) {
                                    setCurrentPage("sections");
                                    handleSelectSection(section);
                                  }
                                }}
                                className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
                              >
                                Section {sectionId}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-gray-200 bg-white p-2 flex gap-2">
        <Button
          variant={currentPage === "sections" ? "default" : "outline"}
          onClick={() => setCurrentPage("sections")}
          size="sm"
          className="flex-1"
        >
          Sections
        </Button>
        <Button
          variant={currentPage === "models" ? "default" : "outline"}
          onClick={() => setCurrentPage("models")}
          size="sm"
          className="flex-1"
        >
          Models
        </Button>
        <Button
          variant={currentPage === "goals" ? "default" : "outline"}
          onClick={() => setCurrentPage("goals")}
          size="sm"
          className="flex-1"
        >
          Goals
        </Button>
      </div>
    </div>
  );
}
