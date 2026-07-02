import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import ContentPanel from "@/components/ContentPanel";
import ContextPanel from "@/components/ContextPanel";
import ModelsPage from "./ModelsPage";
import GoalsPage from "./GoalsPage";
import { Button } from "@/components/ui/button";
import { Menu, X, Layers, Target, BookOpen } from "lucide-react";

interface CourseData {
  course: {
    title: string;
    version: string;
    goals: Array<{ id: number; title: string; relatedSections: number[] }>;
  };
  sections: Array<{
    id: number;
    day: number;
    title: string;
    description: string;
    topics: Array<{ id: string; title: string; keyPoints?: string[] }>;
  }>;
  models: {
    referenceModel: { levels: Array<{ id: number; name: string; description: string; systems: string; color: string }> };
    securityLevels: { levels: Array<{ id: number; name: string; description: string; threat: string; color: string }> };
    foundationalRequirements: { requirements: Array<{ id: string; name: string; acronym: string; description: string }> };
  };
  correlations: {
    sectionToGoals: Record<string, number[]>;
    sectionDependencies: Record<string, number[]>;
  };
}

export default function LearningApp() {
  const [courseData, setCourseData] = useState<CourseData | null>(null);
  const [selectedSection, setSelectedSection] = useState<number>(1);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [contextOpen, setContextOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState<"sections" | "models" | "goals">("sections");

  useEffect(() => {
    fetch("/courseData.json")
      .then((res) => res.json())
      .then((data) => {
        setCourseData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load course data:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-foreground">Loading IC32 Learning App...</p>
        </div>
      </div>
    );
  }

  if (!courseData) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-center">
          <p className="text-destructive">Failed to load course data</p>
        </div>
      </div>
    );
  }

  const currentSection = courseData.sections.find((s) => s.id === selectedSection);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Mobile Menu Button */}
      <div className="fixed top-4 left-4 z-50 flex gap-2 md:hidden">
        <Button
          size="icon"
          variant="outline"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="bg-white"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>
      </div>

      {/* Sidebar */}
      {currentPage === "sections" && (
        <div
          className={`${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } fixed md:relative md:translate-x-0 transition-transform duration-300 z-40 h-screen w-64 border-r border-border bg-sidebar overflow-y-auto`}
        >
          <Sidebar
            courseData={courseData}
            selectedSection={selectedSection}
            onSelectSection={(id: number) => {
              setSelectedSection(id);
              setSelectedTopic(null);
              setSidebarOpen(false);
            }}
            onSelectTopic={setSelectedTopic}
          />
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="border-b border-border bg-card px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">{courseData.course.title}</h1>
              <p className="text-sm text-muted-foreground">Version {courseData.course.version}</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant={currentPage === "sections" ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage("sections")}
                className="flex items-center gap-2"
              >
                <BookOpen size={16} />
                <span className="hidden sm:inline">Sections</span>
              </Button>
              <Button
                variant={currentPage === "models" ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage("models")}
                className="flex items-center gap-2"
              >
                <Layers size={16} />
                <span className="hidden sm:inline">Models</span>
              </Button>
              <Button
                variant={currentPage === "goals" ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage("goals")}
                className="flex items-center gap-2"
              >
                <Target size={16} />
                <span className="hidden sm:inline">Goals</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Main Content Panel */}
          <div className="flex-1 overflow-y-auto">
            {currentPage === "sections" && currentSection && (
              <ContentPanel
                section={currentSection}
                selectedTopic={selectedTopic}
                courseData={courseData}
                onSelectTopic={setSelectedTopic}
              />
            )}
            {currentPage === "models" && <ModelsPage courseData={courseData} />}
            {currentPage === "goals" && (
              <GoalsPage goals={courseData.course.goals} sections={courseData.sections} />
            )}
          </div>

          {/* Context Panel */}
          {currentPage === "sections" && (
            <div
              className={`${
                contextOpen ? "translate-x-0" : "translate-x-full"
              } fixed md:relative md:translate-x-0 transition-transform duration-300 w-80 border-l border-border bg-card overflow-y-auto`}
            >
              {currentSection && (
                <ContextPanel
                  section={currentSection}
                  courseData={courseData}
                  onClose={() => setContextOpen(false)}
                />
              )}
            </div>
          )}

          {/* Mobile Context Toggle */}
          {currentPage === "sections" && (
            <Button
              size="icon"
              variant="outline"
              className="fixed bottom-4 right-4 z-40 md:hidden bg-white"
              onClick={() => setContextOpen(!contextOpen)}
            >
              {contextOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
