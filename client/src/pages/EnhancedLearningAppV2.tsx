/*
 * Design reminder: keep the platform shell calm, technical, and editorial.
 * Use British English, navy/blue accents, restrained borders, and clear hierarchy.
 * All existing IC32 study tools remain grouped under the IC32 top-level tab.
 */
import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Menu,
  X,
  BookOpen,
  Brain,
  Target,
  Bookmark,
  Layers,
  Users,
  Shield,
  CheckCircle2,
  Radar,
} from "lucide-react";
import EnhancedSidebar from "@/components/EnhancedSidebar";
import EnhancedContentPanel from "@/components/EnhancedContentPanel";
import InteractiveMindmap, {
  createPurdueModelMindmap,
  createSecurityLevelsMindmap,
  createFoundationalRequirementsMindmap,
} from "@/components/InteractiveMindmap";
import GlobalSearch from "@/components/GlobalSearch";
import BookmarksPanel from "@/components/BookmarksPanel";
import SeriesOverview from "@/components/SeriesOverview";
import PartsPerRoleView from "@/components/PartsPerRoleView";
import KnowledgeCheckView from "@/components/KnowledgeCheckView";
import ChaptersView from "@/components/ChaptersView";
import OTCyberHub from "@/components/OTCyberHub";
import { ProgressDashboard } from "@/components/ProgressDashboard";
import { useBookmarks } from "@/hooks/useBookmarks";
import completeCourseData from "@/data/completeCourseData.json";

const enhancedCourseData = completeCourseData;

type InnerPage =
  | "chapter"
  | "sections"
  | "series"
  | "roles"
  | "models"
  | "goals"
  | "quiz"
  | "knowledge"
  | "bookmarks";

type PlatformTab = "ic32" | "ot" | "reference" | "practice" | "progress";

const platformTabs: Array<{
  id: PlatformTab;
  label: string;
  eyebrow: string;
  description: string;
}> = [
  {
    id: "ic32",
    label: "IC32 Course",
    eyebrow: "Syllabus Workspace",
    description: "Cybersecurity Fundamentals study workspace with chapters, models, and goals",
  },
  {
    id: "ot",
    label: "OT/ICS Hub",
    eyebrow: "Interactive modules",
    description: "Hands-on OT/ICS cybersecurity tools, memory maps, and simulators",
  },
  {
    id: "practice",
    label: "Exam Practice",
    eyebrow: "Self-assessment",
    description: "Comprehensive question bank, verified keys, explanations, and course anchors",
  },
  {
    id: "reference",
    label: "Reference Library",
    eyebrow: "Standards & Roles",
    description: "ISA/IEC 62443 standard family overview and parts per stakeholder role",
  },
  {
    id: "progress",
    label: "Progress & Bookmarks",
    eyebrow: "Metrics & Review",
    description: "Learning progress metrics, completion tracker, and saved bookmarks",
  },
];

const innerNavigation: Array<{
  id: InnerPage;
  label: string;
  icon: typeof BookOpen;
}> = [
  { id: "chapter", label: "Chapter", icon: BookOpen },
  { id: "sections", label: "Sections", icon: BookOpen },
  { id: "series", label: "62443 Series", icon: Layers },
  { id: "roles", label: "Parts per Role & Alignment", icon: Users },
  { id: "models", label: "Models", icon: Brain },
  { id: "goals", label: "Goals", icon: Target },
  { id: "knowledge", label: "Knowledge Check", icon: CheckCircle2 },
  { id: "bookmarks", label: "Bookmarks", icon: Bookmark },
];

function FutureTabPanel({ tab }: { tab: PlatformTab }) {
  const tabInfo = platformTabs.find((item) => item.id === tab);
  if (!tabInfo || tab === "ic32") return null;

  return (
    <div className="h-full overflow-y-auto p-4 sm:p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <Card className="overflow-hidden border-0 bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 text-white shadow-xl">
          <div className="p-7 sm:p-10">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="rounded-full border border-blue-300/25 bg-blue-400/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-blue-100">
                {tabInfo.eyebrow}
              </span>
              <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs text-blue-100">
                ISA/IEC 62443 Learning Platform
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">{tabInfo.label}</h2>
            <p className="mt-3 max-w-2xl text-sm sm:text-base leading-relaxed text-blue-100">
              {tabInfo.description}. This area is reserved for the next learning layer while your complete IC32 course remains available under the active IC32 tab.
            </p>
          </div>
        </Card>

        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              title: "Built around the course",
              text: "The existing IC32 chapters, explanations, models, Knowledge Checks, filters, and bookmarks are kept together in one focused workspace.",
            },
            {
              title: "Ready to extend",
              text: "This tab is structured as a separate destination so future features can be added without making the IC32 study flow harder to navigate.",
            },
            {
              title: "Your next step",
              text: "Open IC32 whenever you want to study the current syllabus, practise questions, explore the 62443 series, or review your saved material.",
            },
          ].map((item) => (
            <Card key={item.title} className="border-gray-200 bg-white p-5 shadow-sm">
              <h3 className="font-bold text-gray-900">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">{item.text}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function EnhancedLearningAppV2() {
  const [activePlatform, setActivePlatform] = useState<PlatformTab>(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const platform = params.get("platform") as PlatformTab | null;
      if (platform && platformTabs.some((p) => p.id === platform)) {
        return platform;
      }
    }
    return "ic32";
  });

  const [currentPage, setCurrentPage] = useState<InnerPage>(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const page = params.get("page") as InnerPage | null;
      if (page && innerNavigation.some((p) => p.id === page)) {
        return page;
      }
    }
    return "chapter";
  });

  const [selectedSection, setSelectedSection] = useState(enhancedCourseData.sections[0]);
  const [selectedTopic, setSelectedTopic] = useState<any>(enhancedCourseData.sections[0].topics[0]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [completedSections, setCompletedSections] = useState<Set<number>>(new Set());

  const [targetChapterId, setTargetChapterId] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const ch = params.get("chapterId");
      if (ch) {
        const parsed = parseInt(ch, 10);
        if (!isNaN(parsed)) return parsed;
      }
    }
    return 1;
  });

  const [targetTopicId, setTargetTopicId] = useState<string | undefined>(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const t = params.get("topicId");
      if (t) return t;
    }
    return undefined;
  });

  // Keep state in sync if URL query parameters change (e.g. browser navigation)
  useEffect(() => {
    const handleLocationChange = () => {
      const params = new URLSearchParams(window.location.search);
      const platform = params.get("platform") as PlatformTab | null;
      const page = params.get("page") as InnerPage | null;
      const ch = params.get("chapterId");
      const t = params.get("topicId");

      if (platform && platformTabs.some((p) => p.id === platform)) {
        setActivePlatform(platform);
      }
      if (page && innerNavigation.some((p) => p.id === page)) {
        setCurrentPage(page);
      }
      if (ch) {
        const parsed = parseInt(ch, 10);
        if (!isNaN(parsed)) setTargetChapterId(parsed);
      }
      if (t) {
        setTargetTopicId(t);
      }
    };

    window.addEventListener("popstate", handleLocationChange);
    return () => window.removeEventListener("popstate", handleLocationChange);
  }, []);

  const handleNavigateToTopic = (chapterId: number, topicId?: string) => {
    setTargetChapterId(chapterId);
    setTargetTopicId(topicId);
    setActivePlatform("ic32");
    setCurrentPage("chapter");
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("page", "chapter");
      url.searchParams.set("chapterId", String(chapterId));
      if (topicId) {
        url.searchParams.set("topicId", topicId);
      } else {
        url.searchParams.delete("topicId");
      }
      window.history.replaceState({}, "", url.toString());
    }
  };

  const { bookmarks, toggleBookmark, removeBookmark, bookmarkIds } = useBookmarks();

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

  const navigateToInnerPage = (page: InnerPage) => {
    setActivePlatform("ic32");
    setCurrentPage(page);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("page", page);
      url.searchParams.delete("chapterId");
      url.searchParams.delete("topicId");
      window.history.replaceState({}, "", url.toString());
    }
  };

  const handleSearchResult = (result: any) => {
    if (result.sectionId) {
      const section = enhancedCourseData.sections.find((s) => s.id === result.sectionId);
      if (section) {
        handleSelectSection(section);
        navigateToInnerPage("sections");
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

  const stats = useMemo(() => {
    const totalSections = enhancedCourseData.sections.length;
    const completed = completedSections.size;
    const inProgress = completed > 0 && completed < totalSections ? 1 : 0;
    const notStarted = Math.max(0, totalSections - completed - inProgress);
    return {
      totalSections,
      completedSections: completed,
      inProgressSections: inProgress,
      notStartedSections: notStarted,
      quizzesTaken: 1,
      averageQuizScore: 85,
      bookmarkedItems: bookmarks.length,
      studyStreak: 3,
      totalStudyTime: 120,
      lastStudyDate: new Date().toLocaleDateString("en-GB"),
    };
  }, [completedSections.size, bookmarks.length]);

  const quizHistory = useMemo(
    () => [
      {
        sectionName: "Section 1 - Control Systems",
        score: 80,
        questionsAnswered: 5,
        correctAnswers: 4,
        date: new Date().toLocaleDateString("en-GB"),
      },
      {
        sectionName: "Section 4 - Security Levels",
        score: 100,
        questionsAnswered: 5,
        correctAnswers: 5,
        date: new Date().toLocaleDateString("en-GB"),
      },
    ],
    []
  );

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-4 py-4 sm:px-6">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex items-start gap-3">
              <button
                type="button"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="mt-1 rounded-lg p-2 hover:bg-gray-100 lg:hidden"
                aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              <div>
                <div className="flex items-center gap-2">
                  <Shield className="mt-0.5 h-5 w-5 text-blue-700" />
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-700">ISA/IEC 62443</p>
                </div>
                <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl">Learning Platform</h1>
                <p className="text-sm text-gray-600">Structured industrial cybersecurity learning</p>
              </div>
            </div>

            <nav aria-label="Primary platform navigation" className="flex flex-wrap gap-2 xl:justify-end">
              {platformTabs.map((tab) => (
                <Button
                  key={tab.id}
                  variant={activePlatform === tab.id ? "default" : "outline"}
                  onClick={() => setActivePlatform(tab.id)}
                  size="sm"
                  className={`gap-2 ${activePlatform === tab.id ? "bg-blue-700 hover:bg-blue-800 text-white font-semibold" : "bg-white"}`}
                >
                  {tab.id === "ic32" && <BookOpen className="h-4 w-4" />}
                  {tab.id === "ot" && <Radar className="h-4 w-4" />}
                  {tab.id === "reference" && <Layers className="h-4 w-4" />}
                  {tab.id === "practice" && <CheckCircle2 className="h-4 w-4" />}
                  {tab.id === "progress" && <Target className="h-4 w-4" />}
                  {tab.label}
                </Button>
              ))}
            </nav>
          </div>

          {activePlatform === "ic32" && (
            <div className="mt-4 flex flex-wrap gap-2 border-t border-gray-100 pt-3" aria-label="IC32 course navigation">
              {innerNavigation.map((item) => {
                const Icon = item.icon;
                const label = item.id === "bookmarks" ? `${item.label} (${bookmarks.length})` : item.label;
                return (
                  <Button
                    key={item.id}
                    variant={currentPage === item.id ? "secondary" : "ghost"}
                    onClick={() => navigateToInnerPage(item.id)}
                    size="sm"
                    className={`gap-2 ${currentPage === item.id ? "bg-blue-50 text-blue-800 font-semibold" : "text-gray-600"}`}
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </Button>
                );
              })}
            </div>
          )}

          {activePlatform === "ic32" && (
            <div className="mt-3 max-w-2xl">
              <GlobalSearch
                courseData={enhancedCourseData}
                onSelectResult={handleSearchResult}
                bookmarkedItems={bookmarkIds}
                onToggleBookmark={handleBookmarkToggle}
              />
            </div>
          )}
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {activePlatform === "ic32" && sidebarOpen && currentPage === "sections" && (
          <div className="hidden w-64 overflow-y-auto border-r border-gray-200 bg-white lg:block">
            <EnhancedSidebar
              sections={enhancedCourseData.sections}
              selectedSection={selectedSection}
              onSelectSection={handleSelectSection}
              completedSections={completedSections}
              onToggleCompletion={toggleSectionCompletion}
            />
          </div>
        )}

        <main className="flex-1 overflow-hidden">
          {/* OT/ICS Hub Tab */}
          {activePlatform === "ot" && (
            <div className="h-full overflow-y-auto">
              <OTCyberHub />
            </div>
          )}

          {/* Exam Practice Tab */}
          {activePlatform === "practice" && (
            <div className="h-full overflow-y-auto">
              <KnowledgeCheckView onNavigateToTopic={handleNavigateToTopic} />
            </div>
          )}

          {/* Reference Library Tab */}
          {activePlatform === "reference" && (
            <div className="h-full overflow-y-auto p-4 sm:p-6 space-y-6">
              <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-3">
                <Button
                  variant={currentPage === "series" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage("series")}
                  className="gap-2"
                >
                  <Layers className="w-4 h-4" />
                  62443 Series Overview
                </Button>
                <Button
                  variant={currentPage === "roles" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage("roles")}
                  className="gap-2"
                >
                  <Users className="w-4 h-4" />
                  Parts per Stakeholder Role
                </Button>
              </div>
              {currentPage === "roles" ? (
                <PartsPerRoleView
                  onNavigateToSection={(sectionId) => {
                    const section = enhancedCourseData.sections.find((s) => s.id === sectionId);
                    if (section) {
                      handleSelectSection(section);
                      setActivePlatform("ic32");
                      navigateToInnerPage("sections");
                    }
                  }}
                  onNavigateToQuiz={() => {
                    setActivePlatform("practice");
                  }}
                />
              ) : (
                <SeriesOverview />
              )}
            </div>
          )}

          {/* Progress & Bookmarks Tab */}
          {activePlatform === "progress" && (
            <div className="h-full overflow-y-auto p-4 sm:p-6 space-y-6">
              <ProgressDashboard stats={stats} quizHistory={quizHistory} />
              <Card className="p-4 bg-white border-gray-200">
                <h3 className="font-bold text-gray-900 text-base mb-3 flex items-center gap-2">
                  <Bookmark className="w-4 h-4 text-blue-600" />
                  Saved Bookmarks ({bookmarks.length})
                </h3>
                <BookmarksPanel bookmarks={bookmarks} onRemoveBookmark={removeBookmark} onSelectBookmark={handleSearchResult} />
              </Card>
            </div>
          )}

          {/* IC32 Active Course Sub-Pages */}
          {activePlatform === "ic32" && currentPage === "chapter" && (
            <div className="h-full overflow-y-auto">
              <ChaptersView
                onNavigateToKnowledge={() => navigateToInnerPage("knowledge")}
                initialChapterId={targetChapterId}
                initialTopicId={targetTopicId}
              />
            </div>
          )}

          {activePlatform === "ic32" && currentPage === "sections" && (
            <div className="h-full flex gap-4 p-4">
              <div className="flex-1 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
                <EnhancedContentPanel
                  section={selectedSection}
                  selectedTopic={selectedTopic}
                  onSelectTopic={setSelectedTopic}
                />
              </div>
              <div className="hidden w-80 flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm xl:flex">
                <InteractiveMindmap title="Purdue Model Overview" rootNode={createPurdueModelMindmap()} />
              </div>
            </div>
          )}

          {activePlatform === "ic32" && currentPage === "series" && (
            <div className="h-full overflow-y-auto">
              <SeriesOverview />
            </div>
          )}

          {activePlatform === "ic32" && currentPage === "roles" && (
            <div className="h-full overflow-y-auto">
              <PartsPerRoleView
                onNavigateToSection={(sectionId) => {
                  const section = enhancedCourseData.sections.find((s) => s.id === sectionId);
                  if (section) {
                    handleSelectSection(section);
                    navigateToInnerPage("sections");
                  }
                }}
                onNavigateToQuiz={() => navigateToInnerPage("knowledge")}
              />
            </div>
          )}

          {activePlatform === "ic32" && currentPage === "models" && (
            <div className="h-full overflow-y-auto p-4">
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                <Card className="bg-white p-4">
                  <InteractiveMindmap title="Purdue Reference Model" rootNode={createPurdueModelMindmap()} />
                </Card>
                <Card className="bg-white p-4">
                  <InteractiveMindmap title="Security Levels (SL 0-4)" rootNode={createSecurityLevelsMindmap()} />
                </Card>
                <Card className="bg-white p-4">
                  <InteractiveMindmap title="7 Foundational Requirements" rootNode={createFoundationalRequirementsMindmap()} />
                </Card>
              </div>
            </div>
          )}

          {activePlatform === "ic32" && currentPage === "goals" && (
            <div className="h-full overflow-y-auto p-4">
              <div className="mx-auto max-w-4xl">
                <Card className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
                  <h2 className="mb-2 text-2xl font-bold text-gray-900">Learning Objectives</h2>
                  <p className="text-gray-700">These learning objectives guide the IC32 course.</p>
                </Card>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {enhancedCourseData.sections.slice(0, 10).map((section, idx) => (
                    <Card key={section.id} className="p-4 transition-shadow hover:shadow-lg">
                      <div className="flex gap-3">
                        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-600">{idx + 1}</div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{section.title}</h3>
                          <p className="mt-2 text-sm text-gray-600">{section.description}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activePlatform === "ic32" && (currentPage === "knowledge" || currentPage === "quiz") && (
            <div className="h-full overflow-y-auto">
              <KnowledgeCheckView onNavigateToTopic={handleNavigateToTopic} />
            </div>
          )}

          {activePlatform === "ic32" && currentPage === "bookmarks" && (
            <div className="h-full p-4">
              <div className="mx-auto h-full max-w-2xl">
                <BookmarksPanel bookmarks={bookmarks} onRemoveBookmark={removeBookmark} onSelectBookmark={handleSearchResult} />
              </div>
            </div>
          )}
        </main>
      </div>

      {activePlatform === "ic32" && (
        <nav className="flex flex-wrap gap-1.5 border-t border-gray-200 bg-white p-2 md:hidden" aria-label="Mobile IC32 navigation">
          {innerNavigation.map((item) => (
            <Button
              key={item.id}
              variant={currentPage === item.id ? "default" : "outline"}
              onClick={() => navigateToInnerPage(item.id)}
              size="sm"
              className="text-xs py-1 px-2"
            >
              {item.label === "Parts per Role & Alignment" ? "Roles" : item.label}
            </Button>
          ))}
        </nav>
      )}

      {activePlatform !== "ic32" && (
        <div className="border-t border-gray-200 bg-white px-4 py-3 text-center text-xs text-gray-500">
          Select <button type="button" className="font-semibold text-blue-700 hover:underline" onClick={() => setActivePlatform("ic32")}>IC32 Course</button> to return to the syllabus study workspace.
        </div>
      )}
    </div>
  );
}
