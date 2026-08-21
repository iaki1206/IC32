import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, ShieldCheck, FileText, Layers, Info, CheckCircle2, Clock } from "lucide-react";
import seriesData from "@/data/seriesOverviewData.json";

export default function SeriesOverview() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [activeItem, setActiveItem] = useState<any>(null);

  const categories = seriesData.categories;
  const documentTypes = seriesData.documentTypes;

  const filteredCategories = selectedCategory === "all"
    ? categories
    : categories.filter(c => c.id === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-2xl p-8 text-white shadow-xl">
        <div className="max-w-3xl">
          <Badge className="bg-blue-500/20 text-blue-300 border-blue-400/30 mb-4 px-3 py-1 text-sm font-medium">
            ISA/IEC 62443 Standards Ecosystem
          </Badge>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl mb-4">
            Series Overview & Document Taxonomy
          </h1>
          <p className="text-blue-100 text-lg leading-relaxed mb-6">
            Explore the complete structure of the ISA/IEC 62443 series. Understand the difference between Standards, Technical Specifications (TS), Technical Reports (TR), and Publicly Available Specifications (PAS).
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-blue-800/60">
            {documentTypes.map((dt) => (
              <div key={dt.code} className="bg-white/10 backdrop-blur-md rounded-lg p-3 border border-white/10">
                <div className="font-bold text-blue-200 text-sm">{dt.code}</div>
                <div className="text-xs text-blue-300 mt-1 line-clamp-2">{dt.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Beginner Explanation Box for Document Types */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {documentTypes.map((dt, idx) => (
          <Card key={idx} className="border-l-4 border-l-blue-600 bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="font-mono font-bold text-blue-700 bg-blue-50">
                  {dt.code}
                </Badge>
                <FileText className="w-4 h-4 text-gray-400" />
              </div>
              <CardTitle className="text-base mt-2">{dt.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-gray-600 leading-relaxed mb-3">{dt.description}</p>
              <div className="bg-emerald-50 border border-emerald-100 rounded p-2 text-xs text-emerald-900">
                <strong className="text-emerald-800">Pentru începători:</strong> {dt.beginnerExplanation}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-medium text-gray-700">Filtrează după grup:</span>
          <Button
            size="sm"
            variant={selectedCategory === "all" ? "default" : "outline"}
            onClick={() => setSelectedCategory("all")}
          >
            Toate Grupurile
          </Button>
          {categories.map((cat) => (
            <Button
              key={cat.id}
              size="sm"
              variant={selectedCategory === cat.id ? "default" : "outline"}
              onClick={() => setSelectedCategory(cat.id)}
            >
              {cat.name}
            </Button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Tip document:</span>
          <select
            className="text-sm border border-gray-300 rounded-md px-3 py-1.5 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="all">Toate tipurile</option>
            <option value="Standard">Standard</option>
            <option value="TS">Technical Specification (TS)</option>
            <option value="TR/TS">Technical Report (TR/TS)</option>
            <option value="PAS">Publicly Available Spec (PAS)</option>
          </select>
        </div>
      </div>

      {/* Categories and Standards Grid (Matching the User's Image Structure) */}
      <div className="space-y-6">
        {filteredCategories.map((cat) => (
          <Card key={cat.id} className="overflow-hidden border border-gray-200 shadow-md">
            <div className={`px-6 py-4 text-white flex flex-col md:flex-row md:items-center justify-between gap-2 ${cat.color}`}>
              <div>
                <h2 className="text-xl font-bold">{cat.name}</h2>
                <p className="text-white/80 text-sm mt-0.5">{cat.description}</p>
              </div>
              <Badge className="bg-white/20 text-white border-white/30 self-start md:self-auto">
                {cat.items.length} documente
              </Badge>
            </div>

            <CardContent className="p-6 bg-gray-50/50">
              <div className="mb-4 bg-blue-50 border border-blue-100 rounded-lg p-3 text-xs text-blue-900 flex items-start gap-2">
                <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="font-semibold">Context pentru Examen:</strong> {cat.summary}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {cat.items
                  .filter(item => selectedType === "all" || item.type === selectedType)
                  .map((item, idx) => (
                    <div
                      key={idx}
                      onClick={() => setActiveItem(item)}
                      className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-400 transition-all cursor-pointer flex flex-col justify-between group"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-mono font-bold text-sm text-blue-600 group-hover:text-blue-700">
                            {item.code}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <Badge
                              variant="outline"
                              className={`text-[10px] px-1.5 py-0 ${
                                item.type === "Standard"
                                  ? "bg-purple-50 text-purple-700 border-purple-200"
                                  : item.type === "PAS"
                                  ? "bg-amber-50 text-amber-700 border-amber-200"
                                  : item.type === "TS"
                                  ? "bg-blue-50 text-blue-700 border-blue-200"
                                  : "bg-emerald-50 text-emerald-700 border-emerald-200"
                              }`}
                            >
                              {item.type}
                            </Badge>
                            <span
                              className={`w-2 h-2 rounded-full ${
                                item.status === "Published" ? "bg-emerald-500" : "bg-red-500"
                              }`}
                              title={item.status}
                            />
                          </div>
                        </div>
                        <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2">
                          {item.title}
                        </h3>
                        <p className="text-xs text-gray-500 line-clamp-2 mb-3">
                          {item.description}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-blue-600 font-medium">
                        <span>Vezi explicație simplă</span>
                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal / Detailed Drawer for Selected Item */}
      {activeItem && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge className="bg-blue-600 text-white font-mono">{activeItem.code}</Badge>
                  <Badge variant="outline" className="text-xs">{activeItem.type}</Badge>
                  <Badge
                    variant="outline"
                    className={`text-xs ${
                      activeItem.status === "Published" ? "text-emerald-700 bg-emerald-50" : "text-red-700 bg-red-50"
                    }`}
                  >
                    {activeItem.status === "Published" ? "Publicat" : "În curând"}
                  </Badge>
                </div>
                <h2 className="text-xl font-bold text-gray-900">{activeItem.title}</h2>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveItem(null)}
                className="h-8 w-8 rounded-full p-0"
              >
                ✕
              </Button>
            </div>

            <div className="space-y-3 pt-2">
              <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700 border border-gray-200">
                <strong className="text-gray-900 block mb-1">Descriere Oficială:</strong>
                {activeItem.description}
              </div>

              {activeItem.targetAudience && (
                <div className="bg-blue-50 rounded-lg p-3 text-sm text-blue-900 border border-blue-200">
                  <strong className="text-blue-800 block mb-1">Public Țintă / Destinatar:</strong>
                  {activeItem.targetAudience}
                </div>
              )}

              <div className="bg-emerald-50 rounded-lg p-4 text-sm text-emerald-900 border border-emerald-200">
                <strong className="text-emerald-800 block mb-1 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Explicație pentru Începători:
                </strong>
                {activeItem.beginnerExplanation}
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <Button onClick={() => setActiveItem(null)}>Am înțeles</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
