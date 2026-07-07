import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { CheckCircle2, Clock, AlertCircle, TrendingUp } from "lucide-react";

interface ProgressStats {
  totalSections: number;
  completedSections: number;
  inProgressSections: number;
  notStartedSections: number;
  quizzesTaken: number;
  averageQuizScore: number;
  bookmarkedItems: number;
  studyStreak: number;
  totalStudyTime: number; // in minutes
  lastStudyDate: string;
}

interface QuizPerformance {
  sectionName: string;
  score: number;
  questionsAnswered: number;
  correctAnswers: number;
  date: string;
}

export function ProgressDashboard({
  stats,
  quizHistory,
}: {
  stats: ProgressStats;
  quizHistory: QuizPerformance[];
}) {
  const completionPercentage = Math.round((stats.completedSections / stats.totalSections) * 100);
  const inProgressPercentage = Math.round((stats.inProgressSections / stats.totalSections) * 100);
  const notStartedPercentage = Math.round((stats.notStartedSections / stats.totalSections) * 100);

  // Prepare data for charts
  const sectionStatusData = [
    { name: "Completed", value: stats.completedSections, color: "#10b981" },
    { name: "In Progress", value: stats.inProgressSections, color: "#f59e0b" },
    { name: "Not Started", value: stats.notStartedSections, color: "#ef4444" },
  ];

  const quizScoresData = quizHistory.slice(-10).map((quiz) => ({
    name: quiz.sectionName.substring(0, 15),
    score: quiz.score,
    correct: quiz.correctAnswers,
    total: quiz.questionsAnswered,
  }));

  const studyTimeData = [
    { day: "Mon", minutes: 45 },
    { day: "Tue", minutes: 60 },
    { day: "Wed", minutes: 30 },
    { day: "Thu", minutes: 75 },
    { day: "Fri", minutes: 90 },
    { day: "Sat", minutes: 120 },
    { day: "Sun", minutes: 50 },
  ];

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Completion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{completionPercentage}%</div>
            <p className="text-xs text-gray-500 mt-2">
              {stats.completedSections} of {stats.totalSections} sections
            </p>
            <Progress value={completionPercentage} className="mt-3" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Quiz Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{stats.averageQuizScore}%</div>
            <p className="text-xs text-gray-500 mt-2">{stats.quizzesTaken} quizzes taken</p>
            <div className="flex items-center gap-1 mt-3">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-xs text-green-600">Improving</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Study Streak</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">{stats.studyStreak}</div>
            <p className="text-xs text-gray-500 mt-2">consecutive days</p>
            <div className="flex items-center gap-1 mt-3">
              <Clock className="w-4 h-4 text-orange-600" />
              <span className="text-xs text-orange-600">Keep it up!</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Bookmarked Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">{stats.bookmarkedItems}</div>
            <p className="text-xs text-gray-500 mt-2">saved for review</p>
            <div className="flex items-center gap-1 mt-3">
              <CheckCircle2 className="w-4 h-4 text-purple-600" />
              <span className="text-xs text-purple-600">Ready to export</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="quizzes">Quiz Performance</TabsTrigger>
          <TabsTrigger value="study-time">Study Time</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Section Completion Status</CardTitle>
              <CardDescription>Progress across all course sections</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={sectionStatusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {sectionStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Completed</span>
                      <span className="text-sm text-gray-600">{completionPercentage}%</span>
                    </div>
                    <Progress value={completionPercentage} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">In Progress</span>
                      <span className="text-sm text-gray-600">{inProgressPercentage}%</span>
                    </div>
                    <Progress value={inProgressPercentage} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Not Started</span>
                      <span className="text-sm text-gray-600">{notStartedPercentage}%</span>
                    </div>
                    <Progress value={notStartedPercentage} className="h-2" />
                  </div>

                  <div className="pt-4 border-t">
                    <p className="text-sm text-gray-600">
                      Last studied: <span className="font-medium">{stats.lastStudyDate}</span>
                    </p>
                    <p className="text-sm text-gray-600 mt-2">
                      Total study time: <span className="font-medium">{Math.round(stats.totalStudyTime / 60)} hours</span>
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quizzes">
          <Card>
            <CardHeader>
              <CardTitle>Recent Quiz Performance</CardTitle>
              <CardDescription>Your scores across recent quizzes</CardDescription>
            </CardHeader>
            <CardContent>
              {quizScoresData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={quizScoresData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip formatter={(value) => `${value}%`} />
                    <Legend />
                    <Bar dataKey="score" fill="#3b82f6" name="Score %" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                  <AlertCircle className="w-12 h-12 mb-2 opacity-50" />
                  <p>No quiz data yet. Start taking quizzes to see your performance!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="study-time">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Study Time</CardTitle>
              <CardDescription>Your study activity over the past week</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={studyTimeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip formatter={(value) => `${value} min`} />
                  <Legend />
                  <Bar dataKey="minutes" fill="#10b981" name="Study Time (minutes)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Personalized Recommendations</CardTitle>
          <CardDescription>Based on your learning progress</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {stats.completedSections < stats.totalSections / 2 && (
              <div className="flex gap-3 p-3 bg-blue-50 rounded-lg">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-900">Focus on Fundamentals</p>
                  <p className="text-xs text-blue-700">You're making good progress! Continue with the remaining sections to build a complete understanding.</p>
                </div>
              </div>
            )}

            {stats.averageQuizScore < 70 && (
              <div className="flex gap-3 p-3 bg-orange-50 rounded-lg">
                <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-orange-900">Review Key Concepts</p>
                  <p className="text-xs text-orange-700">Consider reviewing sections where you scored lower. Use the spaced repetition system for better retention.</p>
                </div>
              </div>
            )}

            {stats.studyStreak > 7 && (
              <div className="flex gap-3 p-3 bg-green-50 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-green-900">Great Consistency!</p>
                  <p className="text-xs text-green-700">Your study streak is impressive. Keep maintaining this momentum for better learning outcomes.</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
