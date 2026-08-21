import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Menu, X, BookOpen, Brain, Target, FileText, Bookmark, Layers, Users, Shield, CheckCircle2 } from "lucide-react";
import EnhancedSidebar from "@/components/EnhancedSidebar";
import EnhancedContentPanel from "@/components/EnhancedContentPanel";
import InteractiveMindmap, {
  createPurdueModelMindmap,
  createSecurityLevelsMindmap,
  createFoundationalRequirementsMindmap,
} from "@/components/InteractiveMindmap";
import QuizComponent from "@/components/QuizComponent";
import GlobalSearch from "@/components/GlobalSearch";
import BookmarksPanel from "@/components/BookmarksPanel";
import SeriesOverview from "@/components/SeriesOverview";
import PartsPerRoleView from "@/components/PartsPerRoleView";
import KnowledgeCheckView from "@/components/KnowledgeCheckView";
import { useBookmarks } from "@/hooks/useBookmarks";
import { useQuizProgress } from "@/hooks/useQuizProgress";
import completeCourseData from "@/data/completeCourseData.json";
import quizData from "@/data/quizData.json";

const enhancedCourseData = completeCourseData;

export default function EnhancedLearningAppV2() {
  const [currentPage, setCurrentPage] = useState<"sections" | "series" | "roles" | "models" | "goals" | "quiz" | "knowledge" | "bookmarks">("sections");
  const [selectedSection, setSelectedSection] = useState(enhancedCourseData.sections[0]);
  const [selectedTopic, setSelectedTopic] = useState<any>(enhancedCourseData.sections[0].topics[0]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [completedSections, setCompletedSections] = useState<Set<number>>(new Set());
  const [selectedQuiz, setSelectedQuiz] = useState<any>(null);

  const { bookmarks, toggleBookmark, removeBookmark, bookmarkIds } = useBookmarks();
  const { recordQuizScore, getAverageScore, getCompletedQuizzes } = useQuizProgress();

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

  const handleSearchResult = (result: any) => {
    if (result.sectionId) {
      const section = enhancedCourseData.sections.find((s) => s.id === result.sectionId);
      if (section) {
        handleSelectSection(section);
        setCurrentPage("sections");
      }
    }
  };

  const handleBookmarkToggle = (itemId: string) => {
    const result = {
      id: itemId,
      type: "topic" as const,
      title: selectedTopic?.title || "",
      content: selectedTopic?.explanation || "",
      sectionId: selectedSection.id,
      sectionTitle: selectedSection.title,
      topicId: selectedTopic?.id,
      topicTitle: selectedTopic?.title,
    };
    toggleBookmark(result);
  };

  const handleQuizComplete = (score: number, total: number) => {
    if (selectedQuiz) {
      recordQuizScore(selectedQuiz.id, score, total);
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-4">
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
                size="sm"
                className="gap-2"
              >
                <BookOpen className="w-4 h-4" />
                Sections
              </Button>
              <Button
                variant={currentPage === "series" ? "default" : "outline"}
                onClick={() => setCurrentPage("series")}
                size="sm"
                className="gap-2"
              >
                <Layers className="w-4 h-4" />
                62443 Series
              </Button>
              <Button
                variant={currentPage === "roles" ? "default" : "outline"}
                onClick={() => setCurrentPage("roles")}
                size="sm"
                className="gap-2"
              >
                <Users className="w-4 h-4" />
                Parts per Role & Alignment
              </Button>
              <Button
                variant={currentPage === "models" ? "default" : "outline"}
                onClick={() => setCurrentPage("models")}
                size="sm"
                className="gap-2"
              >
                <Brain className="w-4 h-4" />
                Models
              </Button>
              <Button
                variant={currentPage === "goals" ? "default" : "outline"}
                onClick={() => setCurrentPage("goals")}
                size="sm"
                className="gap-2"
              >
                <Target className="w-4 h-4" />
                Goals
              </Button>
              <Button
                variant={currentPage === "quiz" ? "default" : "outline"}
                onClick={() => setCurrentPage("quiz")}
                size="sm"
                className="gap-2"
              >
                <FileText className="w-4 h-4" />
                Quiz
              </Button>
              <Button
                variant={currentPage === "knowledge" ? "default" : "outline"}
                onClick={() => setCurrentPage("knowledge")}
                size="sm"
                className="gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                Knowledge Check
              </Button>
              <Button
                variant={currentPage === "bookmarks" ? "default" : "outline"}
                onClick={() => setCurrentPage("bookmarks")}
                size="sm"
                className="gap-2"
              >
                <Bookmark className="w-4 h-4" />
                Bookmarks ({bookmarks.length})
              </Button>
            </div>
          </div>

          {/* Global Search */}
          <div className="max-w-2xl">
            <GlobalSearch
              courseData={enhancedCourseData}
              onSelectResult={handleSearchResult}
              bookmarkedItems={bookmarkIds}
              onToggleBookmark={handleBookmarkToggle}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        {sidebarOpen && currentPage === "sections" && (
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
              <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <EnhancedContentPanel
                  section={selectedSection}
                  selectedTopic={selectedTopic}
                  onSelectTopic={setSelectedTopic}
                />
              </div>
              <div className="w-80 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hidden xl:flex flex-col">
                <InteractiveMindmap
                  title="Purdue Model Overview"
                  rootNode={createPurdueModelMindmap()}
                />
              </div>
            </div>
          )}

          {currentPage === "series" && (
            <div className="h-full overflow-y-auto">
              <SeriesOverview />
            </div>
          )}

          {currentPage === "roles" && (
            <div className="h-full overflow-y-auto">
              <PartsPerRoleView
                onNavigateToSection={(sectionId) => {
                  const section = enhancedCourseData.sections.find((s) => s.id === sectionId);
                  if (section) {
                    handleSelectSection(section);
                    setCurrentPage("sections");
                  }
                }}
                onNavigateToQuiz={(quizId) => {
                  const quiz = quizData.quizzes.find((q) => q.id === quizId);
                  if (quiz) {
                    setSelectedQuiz(quiz);
                    setCurrentPage("quiz");
                  }
                }}
              />
            </div>
          )}

          {currentPage === "models" && (
            <div className="h-full overflow-y-auto p-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <Card className="p-4 bg-white">
                  <InteractiveMindmap
                    title="Purdue Reference Model"
                    rootNode={createPurdueModelMindmap()}
                  />
                </Card>
                <Card className="p-4 bg-white">
                  <InteractiveMindmap
                    title="Security Levels (SL 0-4)"
                    rootNode={createSecurityLevelsMindmap()}
                  />
                </Card>
                <Card className="p-4 bg-white">
                  <InteractiveMindmap
                    title="7 Foundational Requirements"
                    rootNode={createFoundationalRequirementsMindmap()}
                  />
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
                    These 10 learning objectives guide the entire course.
                  </p>
                </Card>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {enhancedCourseData.sections.slice(0, 10).map((section, idx) => (
                    <Card key={section.id} className="p-4 hover:shadow-lg transition-shadow">
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600">
                          {idx + 1}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{section.title}</h3>
                          <p className="text-sm text-gray-600 mt-2">{section.description}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentPage === "knowledge" && (
            <div className="h-full overflow-y-auto">
              <KnowledgeCheckView />
            </div>
          )}

          {currentPage === "quiz" && (
            <div className="h-full overflow-y-auto p-4">
              <div className="max-w-2xl mx-auto">
                {!selectedQuiz ? (
                  <>
                    <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 mb-6">
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">Quizzes</h2>
                      <p className="text-gray-700">
                        Test your knowledge with interactive quizzes. Average Score: {getAverageScore()}% | Completed: {getCompletedQuizzes()}
                      </p>
                    </Card>

                    <div className="grid grid-cols-1 gap-4">
                      {quizData.quizzes.map((quiz) => (
                        <Card
                          key={quiz.id}
                          className="p-4 hover:shadow-lg transition-shadow cursor-pointer"
                          onClick={() => setSelectedQuiz(quiz)}
                        >
                          <h3 className="font-semibold text-gray-900 mb-2">{quiz.title}</h3>
                          <p className="text-sm text-gray-600 mb-3">{quiz.description}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">
                              {quiz.questions.length} questions
                            </span>
                            <Button size="sm">Start Quiz</Button>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="mb-4">
                    <Button
                      variant="outline"
                      onClick={() => setSelectedQuiz(null)}
                      className="mb-4"
                    >
                      ← Back to Quizzes
                    </Button>
                    <QuizComponent quiz={selectedQuiz} onComplete={handleQuizComplete} />
                  </div>
                )}
              </div>
            </div>
          )}

          {currentPage === "bookmarks" && (
            <div className="h-full p-4">
              <div className="max-w-2xl mx-auto h-full">
                <BookmarksPanel
                  bookmarks={bookmarks}
                  onRemoveBookmark={removeBookmark}
                  onSelectBookmark={handleSearchResult}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-gray-200 bg-white p-2 flex gap-1 overflow-x-auto">
        <Button
          variant={currentPage === "sections" ? "default" : "outline"}
          onClick={() => setCurrentPage("sections")}
          size="sm"
          className="flex-shrink-0"
        >
          Sections
        </Button>
        <Button
          variant={currentPage === "series" ? "default" : "outline"}
          onClick={() => setCurrentPage("series")}
          size="sm"
          className="flex-shrink-0"
        >
          Series
        </Button>
        <Button
          variant={currentPage === "roles" ? "default" : "outline"}
          onClick={() => setCurrentPage("roles")}
          size="sm"
          className="flex-shrink-0"
        >
          Roles & Alignment
        </Button>
        <Button
          variant={currentPage === "models" ? "default" : "outline"}
          onClick={() => setCurrentPage("models")}
          size="sm"
          className="flex-shrink-0"
        >
          Models
        </Button>
        <Button
          variant={currentPage === "quiz" ? "default" : "outline"}
          onClick={() => setCurrentPage("quiz")}
          size="sm"
          className="flex-shrink-0"
        >
          Quiz
        </Button>
      </div>
    </div>
  );
}
