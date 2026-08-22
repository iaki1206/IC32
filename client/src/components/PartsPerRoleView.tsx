import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Cpu,
  ExternalLink,
  Filter,
  RefreshCw,
  Shield,
  Users,
  Wrench,
} from "lucide-react";
import data from "@/data/partsPerRoleData.json";

type Part = {
  code: string;
  title: string;
  category: string;
  securityLevel: string;
  explanation: string;
  linkedSectionId: number;
  linkedSectionTitle: string;
  linkedQuizId: string;
};

type Role = (typeof data.roles)[number];
type AlignmentPhase = (typeof data.alignmentPhases)[number];

const roleIcons = {
  asset_owner: Building2,
  product_supplier: Cpu,
  service_provider: Wrench,
} as const;

export default function PartsPerRoleView({
  onNavigateToSection,
  onNavigateToQuiz,
}: {
  onNavigateToSection?: (sectionId: number) => void;
  onNavigateToQuiz?: (quizId: string) => void;
}) {
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<"roles" | "alignment">("roles");
  const [selectedPhases, setSelectedPhases] = useState<string[]>(["prevention"]);
  const [activePartModal, setActivePartModal] = useState<Part | null>(null);

  // New filters
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedSecurityLevel, setSelectedSecurityLevel] = useState<string>("All");

  const partsCatalog = data.partsCatalog as Record<string, Part>;
  const categories = ["All", "General", "Policies & Procedures", "System", "Component", "Profiles", "Evaluation"];
  const securityLevels = ["All", "SL 1-2", "SL 1-3", "SL 1-4", "SL 2-4"];

  const toggleRole = (roleId: string) => {
    setSelectedRoles((previous) =>
      previous.includes(roleId)
        ? previous.filter((id) => id !== roleId)
        : [...previous, roleId],
    );
  };

  const togglePhase = (phaseId: string) => {
    setSelectedPhases((previous) =>
      previous.includes(phaseId)
        ? previous.filter((id) => id !== phaseId)
        : [...previous, phaseId],
    );
  };

  const roleResults = useMemo(() => {
    const allParts = Object.values(partsCatalog);
    let filtered = allParts;

    if (selectedRoles.length > 0) {
      const roleSpecificCodes = new Set<string>();
      const selectedRoleObjects = data.roles.filter((role) => selectedRoles.includes(role.id));
      selectedRoleObjects.forEach((role) => role.parts.forEach((code) => roleSpecificCodes.add(code)));

      const sharedCodes = new Set<string>();
      data.overlaps.forEach((overlap) => {
        if (overlap.roles.every((roleId) => selectedRoles.includes(roleId))) {
          overlap.parts.forEach((code) => sharedCodes.add(code));
        }
      });

      ["62443-1-1", "62443-2-3", "62443-3-3"].forEach((code) => sharedCodes.add(code));
      sharedCodes.forEach((code) => roleSpecificCodes.delete(code));

      filtered = [...Array.from(sharedCodes), ...Array.from(roleSpecificCodes)]
        .map((code) => partsCatalog[code])
        .filter(Boolean);
    }

    // Apply category & security level filters
    if (selectedCategory !== "All") {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }
    if (selectedSecurityLevel !== "All") {
      filtered = filtered.filter((p) => p.securityLevel.includes(selectedSecurityLevel.replace("SL ", "")));
    }

    // Split into shared vs role-specific if roles are active
    if (selectedRoles.length > 0) {
      const roleSpecificCodes = new Set<string>();
      data.roles
        .filter((role) => selectedRoles.includes(role.id))
        .forEach((role) => role.parts.forEach((code) => roleSpecificCodes.add(code)));
      
      const sharedCodes = new Set<string>();
      ["62443-1-1", "62443-2-3", "62443-3-3"].forEach((code) => sharedCodes.add(code));
      data.overlaps.forEach((overlap) => {
        if (overlap.roles.every((roleId) => selectedRoles.includes(roleId))) {
          overlap.parts.forEach((code) => sharedCodes.add(code));
        }
      });
      sharedCodes.forEach((code) => roleSpecificCodes.delete(code));

      const shared = filtered.filter((p) => sharedCodes.has(p.code));
      const roleSpecific = filtered.filter((p) => roleSpecificCodes.has(p.code));
      return { all: filtered, shared, roleSpecific };
    }

    return { all: filtered, shared: [], roleSpecific: filtered };
  }, [partsCatalog, selectedRoles, selectedCategory, selectedSecurityLevel]);

  const selectedRoleNames = selectedRoles
    .map((id) => data.roles.find((role) => role.id === id)?.name)
    .filter(Boolean)
    .join(" + ");

  const selectedPhaseObjects = data.alignmentPhases.filter((phase) => selectedPhases.includes(phase.id));

  const combinedAlignmentStandards = useMemo(() => {
    const byCode = new Map<string, { code: string; title: string; description: string; phases: string[] }>();
    selectedPhaseObjects.forEach((phase) => {
      phase.standards.forEach((standard) => {
        const existing = byCode.get(standard.code);
        if (existing) {
          existing.phases.push(phase.name);
        } else {
          byCode.set(standard.code, {
            ...standard,
            phases: [phase.name],
          });
        }
      });
    });
    return Array.from(byCode.values());
  }, [selectedPhaseObjects]);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 rounded-2xl p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <Badge className="bg-blue-500/20 text-blue-300 border-blue-400/30 mb-3 px-3 py-1 text-sm font-medium">
            Interactive Ecosystem, Filters & Study Links
          </Badge>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl mb-2">
            Parts per Role & 62443 Alignment
          </h1>
          <p className="text-blue-100 text-sm sm:text-base max-w-2xl leading-relaxed">
            Combine stakeholder roles, filter by category or Security Level, and jump directly to relevant course sections and Knowledge Checks.
          </p>
        </div>

        <div className="flex bg-white/10 p-1.5 rounded-xl border border-white/15 backdrop-blur-md self-start md:self-auto">
          <Button
            variant={activeTab === "roles" ? "default" : "ghost"}
            className={`text-sm ${activeTab === "roles" ? "bg-blue-600 text-white" : "text-white hover:bg-white/10"}`}
            onClick={() => setActiveTab("roles")}
          >
            <Users className="w-4 h-4 mr-2" />
            Parts per Role & Filters
          </Button>
          <Button
            variant={activeTab === "alignment" ? "default" : "ghost"}
            className={`text-sm ${activeTab === "alignment" ? "bg-blue-600 text-white" : "text-white hover:bg-white/10"}`}
            onClick={() => setActiveTab("alignment")}
          >
            <Shield className="w-4 h-4 mr-2" />
            62443 Alignment
          </Button>
        </div>
      </div>

      {activeTab === "roles" && (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Filter Bar */}
          <Card className="p-4 bg-white border border-gray-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 w-full md:w-auto">
              <Filter className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <span className="text-xs font-bold text-gray-700 uppercase tracking-wide">Filters:</span>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 font-medium">Category:</span>
                <select
                  aria-label="Filter standards by category"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="text-xs border border-gray-300 rounded-lg px-2.5 py-1.5 bg-white text-gray-800 font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 font-medium">Security Level:</span>
                <select
                  aria-label="Filter standards by Security Level"
                  value={selectedSecurityLevel}
                  onChange={(e) => setSelectedSecurityLevel(e.target.value)}
                  className="text-xs border border-gray-300 rounded-lg px-2.5 py-1.5 bg-white text-gray-800 font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  {securityLevels.map((sl) => (
                    <option key={sl} value={sl}>{sl}</option>
                  ))}
                </select>
              </div>

              {(selectedCategory !== "All" || selectedSecurityLevel !== "All" || selectedRoles.length > 0) && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-blue-600 hover:bg-blue-50"
                  onClick={() => {
                    setSelectedRoles([]);
                    setSelectedCategory("All");
                    setSelectedSecurityLevel("All");
                  }}
                >
                  Reset all filters
                </Button>
              )}
            </div>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-4">
              <Card className="p-6 border border-gray-200 shadow-sm bg-white">
                <h2 className="text-lg font-bold text-gray-900 mb-2">Select stakeholder roles</h2>
                <p className="text-xs text-gray-600 mb-4">
                  Combine roles to filter standards by responsibility.
                </p>

                <div className="space-y-3">
                  {data.roles.map((role: Role) => {
                    const Icon = roleIcons[role.id as keyof typeof roleIcons];
                    const isSelected = selectedRoles.includes(role.id);
                    return (
                      <button
                        type="button"
                        key={role.id}
                        onClick={() => toggleRole(role.id)}
                        className={`w-full text-left p-4 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-3 ${
                          isSelected
                            ? `${role.lightBg} ${role.borderColor} shadow-md ring-2 ring-blue-500/20`
                            : "bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white flex-shrink-0 ${role.color}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <h3 className="font-bold text-gray-900 text-sm">{role.name}</h3>
                            <input
                              aria-label={`Select ${role.name}`}
                              type="checkbox"
                              checked={isSelected}
                              readOnly
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                          </div>
                          <p className="text-xs text-gray-600 mt-1 leading-relaxed">{role.description}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </Card>

              <Card className="p-6 border border-gray-200 shadow-sm bg-white">
                <h3 className="font-bold text-gray-900 text-sm mb-3">Independent ecosystem groups</h3>
                <div className="space-y-3">
                  {data.independentCircles.map((group) => (
                    <div key={group.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="font-bold text-xs text-gray-900 mb-1">{group.name}</div>
                      <p className="text-[11px] text-gray-600 mb-2">{group.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {group.parts.map((code) => (
                          <Badge
                            key={code}
                            variant="outline"
                            className="bg-white text-gray-700 text-[10px] cursor-pointer hover:bg-blue-50"
                            onClick={() => setActivePartModal(partsCatalog[code] || null)}
                          >
                            {code}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            <div className="lg:col-span-2 space-y-4">
              <Card className="p-6 border border-gray-200 shadow-sm bg-white">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100 gap-4">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">
                      {selectedRoles.length === 0
                        ? "All ISA/IEC 62443 parts (Filtered)"
                        : `Combined standards for: ${selectedRoleNames}`}
                    </h2>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Showing {roleResults.all.length} matching parts with direct course and Knowledge Check links.
                    </p>
                  </div>
                  <Badge className="bg-blue-600 text-white font-mono text-xs px-2.5 py-1 whitespace-nowrap">
                    {roleResults.all.length} parts
                  </Badge>
                </div>

                {selectedRoles.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
                    <div className="rounded-xl bg-indigo-50 border border-indigo-200 p-4">
                      <div className="text-xs uppercase tracking-wide font-bold text-indigo-700">Shared foundation</div>
                      <div className="text-2xl font-bold text-indigo-950 mt-1">{roleResults.shared.length}</div>
                    </div>
                    <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">
                      <div className="text-xs uppercase tracking-wide font-bold text-slate-700">Role-specific coverage</div>
                      <div className="text-2xl font-bold text-slate-950 mt-1">{roleResults.roleSpecific.length}</div>
                    </div>
                  </div>
                )}

                {selectedRoles.length > 0 ? (
                  <div className="space-y-5">
                    <PartGroup
                      title="Shared foundation"
                      parts={roleResults.shared}
                      onSelect={setActivePartModal}
                      onNavigateToSection={onNavigateToSection}
                      onNavigateToQuiz={onNavigateToQuiz}
                    />
                    <PartGroup
                      title="Role-specific coverage"
                      parts={roleResults.roleSpecific}
                      onSelect={setActivePartModal}
                      onNavigateToSection={onNavigateToSection}
                      onNavigateToQuiz={onNavigateToQuiz}
                    />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {roleResults.all.map((part) => (
                      <PartCard
                        key={part.code}
                        part={part}
                        onSelect={setActivePartModal}
                        onNavigateToSection={onNavigateToSection}
                        onNavigateToQuiz={onNavigateToQuiz}
                      />
                    ))}
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>
      )}

      {activeTab === "alignment" && (
        <div className="space-y-8 animate-in fade-in duration-300">
          <Card className="p-6 border border-gray-200 shadow-sm bg-white">
            <div className="max-w-3xl mb-6">
              <Badge className="bg-amber-100 text-amber-800 border-amber-200 mb-2">
                Case study: 2015 Ukraine Power Grid Cyberattack
              </Badge>
              <h2 className="text-xl font-bold text-gray-900">
                Combine the phases to build a complete 62443 alignment view
              </h2>
              <p className="text-xs text-gray-600 mt-1">
                Select one or more phases. The combined view removes duplicates and shows where the same standard supports several stages of the security lifecycle.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 mb-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedPhases(data.alignmentPhases.map((phase) => phase.id))}
              >
                Select all phases
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedPhases([])}
              >
                Clear phases
              </Button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              {data.alignmentPhases.map((phase: AlignmentPhase) => {
                const isActive = selectedPhases.includes(phase.id);
                return (
                  <button
                    type="button"
                    key={phase.id}
                    onClick={() => togglePhase(phase.id)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      isActive
                        ? `${phase.lightColor} border-current shadow-md ring-2 ring-blue-500/20 font-bold`
                        : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-sm uppercase tracking-wide">{phase.name}</div>
                      <span className={`w-2.5 h-2.5 rounded-full ${isActive ? phase.color : "bg-gray-300"}`} />
                    </div>
                  </button>
                );
              })}
            </div>

            {selectedPhaseObjects.length === 0 ? (
              <div className="rounded-2xl border-2 border-dashed border-gray-300 p-10 text-center text-gray-500">
                Select at least one phase to see the aligned standards.
              </div>
            ) : (
              <div className="space-y-6">
                <div className="rounded-2xl bg-slate-900 text-white p-6">
                  <div className="text-xs uppercase tracking-[0.18em] text-blue-300 font-bold">Selected alignment</div>
                  <h3 className="text-2xl font-bold mt-2">{selectedPhaseObjects.map((phase) => phase.name).join(" + ")}</h3>
                  <p className="text-sm text-slate-300 mt-2">
                    {combinedAlignmentStandards.length} unique standard controls across the selected phases.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {combinedAlignmentStandards.map((standard) => (
                    <div key={standard.code} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <span className="font-mono font-bold text-sm text-gray-900">{standard.code}</span>
                      </div>
                      <h4 className="font-semibold text-sm text-gray-900 mb-1">{standard.title}</h4>
                      <p className="text-xs text-gray-600 leading-relaxed">{standard.description}</p>
                      <div className="flex flex-wrap gap-1 mt-3">
                        {standard.phases.map((phaseName) => (
                          <Badge key={phaseName} variant="outline" className="text-[10px] bg-blue-50 text-blue-700 border-blue-200">
                            {phaseName}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </div>
      )}

      {/* Part Detail Modal with Course & Quiz Links */}
      {activePartModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge className="bg-blue-600 text-white font-mono">{activePartModal.code}</Badge>
                  <Badge variant="outline" className="text-xs">{activePartModal.category}</Badge>
                  <Badge variant="secondary" className="text-xs bg-emerald-50 text-emerald-800">{activePartModal.securityLevel}</Badge>
                </div>
                <h3 className="text-lg font-bold text-gray-900">{activePartModal.title}</h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActivePartModal(null)}
                className="h-8 w-8 rounded-full p-0"
              >
                ✕
              </Button>
            </div>

            <div className="bg-gray-50 rounded-lg p-3.5 text-xs text-gray-700 border border-gray-200 leading-relaxed">
              <strong className="text-gray-900 block mb-1">Standard overview:</strong>
              {activePartModal.explanation}
            </div>

            {/* Direct Study & Quiz Cross-References */}
            <div className="border-t border-gray-100 pt-3 space-y-2">
              <div className="text-xs font-bold text-gray-800 uppercase tracking-wide">Relevant Course Section & Knowledge Check:</div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 justify-between text-xs text-blue-700 bg-blue-50/50 border-blue-200 hover:bg-blue-100"
                  onClick={() => {
                    if (onNavigateToSection && activePartModal.linkedSectionId) {
                      onNavigateToSection(activePartModal.linkedSectionId);
                      setActivePartModal(null);
                    }
                  }}
                >
                  <span className="truncate">📖 {activePartModal.linkedSectionTitle}</span>
                  <ExternalLink className="w-3.5 h-3.5 ml-1 flex-shrink-0" />
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 justify-between text-xs text-purple-700 bg-purple-50/50 border-purple-200 hover:bg-purple-100"
                  onClick={() => {
                    if (onNavigateToQuiz && activePartModal.linkedQuizId) {
                      onNavigateToQuiz(activePartModal.linkedQuizId);
                      setActivePartModal(null);
                    }
                  }}
                >
                  <span className="truncate">📝 Take Relevant Quiz</span>
                  <ExternalLink className="w-3.5 h-3.5 ml-1 flex-shrink-0" />
                </Button>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Button size="sm" onClick={() => setActivePartModal(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PartGroup({
  title,
  parts,
  onSelect,
  onNavigateToSection,
  onNavigateToQuiz,
}: {
  title: string;
  parts: Part[];
  onSelect: (part: Part) => void;
  onNavigateToSection?: (sectionId: number) => void;
  onNavigateToQuiz?: (quizId: string) => void;
}) {
  if (parts.length === 0) return null;
  return (
    <div>
      <h3 className="text-sm font-bold text-gray-900 mb-2">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {parts.map((part) => (
          <PartCard
            key={part.code}
            part={part}
            onSelect={onSelect}
            onNavigateToSection={onNavigateToSection}
            onNavigateToQuiz={onNavigateToQuiz}
          />
        ))}
      </div>
    </div>
  );
}

function PartCard({
  part,
  onSelect,
  onNavigateToSection,
  onNavigateToQuiz,
}: {
  part: Part;
  onSelect: (part: Part) => void;
  onNavigateToSection?: (sectionId: number) => void;
  onNavigateToQuiz?: (quizId: string) => void;
}) {
  return (
    <div className="p-4 rounded-xl border border-gray-200 bg-white hover:border-blue-400 hover:shadow-md transition-all flex flex-col justify-between group">
      <div>
        <div className="flex items-center justify-between mb-2 gap-2">
          <span className="font-mono font-bold text-sm text-blue-600">{part.code}</span>
          <div className="flex items-center gap-1">
            <Badge variant="outline" className="text-[10px] bg-gray-50 text-gray-600">{part.category}</Badge>
            <Badge variant="secondary" className="text-[9px] bg-emerald-50 text-emerald-800">{part.securityLevel}</Badge>
          </div>
        </div>
        <h3 className="font-semibold text-gray-900 text-sm mb-1">{part.title}</h3>
        <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">{part.explanation}</p>
      </div>

      <div className="pt-3 mt-3 border-t border-gray-100 flex items-center justify-between text-xs">
        <button
          type="button"
          onClick={() => onSelect(part)}
          className="text-blue-600 font-medium hover:underline flex items-center gap-1"
        >
          <span>Quick view</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        <div className="flex items-center gap-2">
          {part.linkedSectionId && onNavigateToSection && (
            <button
              type="button"
              onClick={() => onNavigateToSection(part.linkedSectionId)}
              className="text-gray-600 hover:text-blue-700 bg-gray-50 hover:bg-blue-50 px-2 py-1 rounded border border-gray-200 text-[11px] font-medium flex items-center gap-1"
              title={`Go to section: ${part.linkedSectionTitle}`}
            >
              <span>📖 Section</span>
            </button>
          )}
          {part.linkedQuizId && onNavigateToQuiz && (
            <button
              type="button"
              onClick={() => onNavigateToQuiz(part.linkedQuizId)}
              className="text-gray-600 hover:text-purple-700 bg-gray-50 hover:bg-purple-50 px-2 py-1 rounded border border-gray-200 text-[11px] font-medium flex items-center gap-1"
              title="Take related quiz"
            >
              <span>✓ Knowledge Check</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
