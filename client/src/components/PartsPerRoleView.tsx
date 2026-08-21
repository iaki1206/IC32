import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Cpu,
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
  explanation: string;
};

type Role = (typeof data.roles)[number];
type AlignmentPhase = (typeof data.alignmentPhases)[number];

const roleIcons = {
  asset_owner: Building2,
  product_supplier: Cpu,
  service_provider: Wrench,
} as const;

export default function PartsPerRoleView() {
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<"roles" | "alignment">("roles");
  const [selectedPhases, setSelectedPhases] = useState<string[]>(["prevention"]);
  const [activePartModal, setActivePartModal] = useState<Part | null>(null);

  const partsCatalog = data.partsCatalog as Record<string, Part>;

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
    if (selectedRoles.length === 0) {
      return {
        all: Object.values(partsCatalog),
        shared: [] as Part[],
        roleSpecific: [] as Part[],
      };
    }

    const selectedRoleObjects = data.roles.filter((role) => selectedRoles.includes(role.id));
    const roleSpecificCodes = new Set<string>();
    selectedRoleObjects.forEach((role) => role.parts.forEach((code) => roleSpecificCodes.add(code)));

    const sharedCodes = new Set<string>();
    data.overlaps.forEach((overlap) => {
      if (overlap.roles.every((roleId) => selectedRoles.includes(roleId))) {
        overlap.parts.forEach((code) => sharedCodes.add(code));
      }
    });

    // These parts provide a common foundation whenever at least one stakeholder role is selected.
    ["62443-1-1", "62443-2-3", "62443-3-3"].forEach((code) => sharedCodes.add(code));

    sharedCodes.forEach((code) => roleSpecificCodes.delete(code));

    const shared = Array.from(sharedCodes)
      .map((code) => partsCatalog[code])
      .filter(Boolean);
    const roleSpecific = Array.from(roleSpecificCodes)
      .map((code) => partsCatalog[code])
      .filter(Boolean);

    return { all: [...shared, ...roleSpecific], shared, roleSpecific };
  }, [partsCatalog, selectedRoles]);

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
            Interactive ecosystem and case study
          </Badge>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl mb-2">
            Parts per Role & 62443 Alignment
          </h1>
          <p className="text-blue-100 text-sm sm:text-base max-w-2xl leading-relaxed">
            Combine stakeholder roles or incident-response phases to see which ISA/IEC 62443 parts apply, where responsibilities overlap, and how the standards support a complete security strategy.
          </p>
        </div>

        <div className="flex bg-white/10 p-1.5 rounded-xl border border-white/15 backdrop-blur-md self-start md:self-auto">
          <Button
            variant={activeTab === "roles" ? "default" : "ghost"}
            className={`text-sm ${activeTab === "roles" ? "bg-blue-600 text-white" : "text-white hover:bg-white/10"}`}
            onClick={() => setActiveTab("roles")}
          >
            <Users className="w-4 h-4 mr-2" />
            Parts per Role
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-4">
              <Card className="p-6 border border-gray-200 shadow-sm bg-white">
                <h2 className="text-lg font-bold text-gray-900 mb-2">Select stakeholder roles</h2>
                <p className="text-xs text-gray-600 mb-4">
                  Select one or more roles. The results separate role-specific parts from the standards shared by the selected stakeholders.
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

                {selectedRoles.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-4 text-xs text-gray-600"
                    onClick={() => setSelectedRoles([])}
                  >
                    <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Reset selection
                  </Button>
                )}
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
                        ? "All ISA/IEC 62443 parts"
                        : `Combined standards for: ${selectedRoleNames}`}
                    </h2>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {selectedRoles.length === 0
                        ? "Select roles to reveal shared and role-specific responsibilities."
                        : "Click a part to view its purpose in the ecosystem."}
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
                      <p className="text-xs text-indigo-800 mt-1">Parts that apply across the selected combination.</p>
                    </div>
                    <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">
                      <div className="text-xs uppercase tracking-wide font-bold text-slate-700">Role-specific coverage</div>
                      <div className="text-2xl font-bold text-slate-950 mt-1">{roleResults.roleSpecific.length}</div>
                      <p className="text-xs text-slate-700 mt-1">Parts linked to the selected responsibilities.</p>
                    </div>
                  </div>
                )}

                {selectedRoles.length > 0 && (
                  <div className="space-y-5 mb-5">
                    <PartGroup title="Shared foundation" parts={roleResults.shared} onSelect={setActivePartModal} />
                    <PartGroup title="Role-specific coverage" parts={roleResults.roleSpecific} onSelect={setActivePartModal} />
                  </div>
                )}

                {selectedRoles.length === 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {roleResults.all.map((part) => (
                      <PartCard key={part.code} part={part} onSelect={setActivePartModal} />
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
              <span className="text-xs text-gray-500 ml-1">
                {selectedPhases.length} of {data.alignmentPhases.length} phases selected
              </span>
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

      {activePartModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge className="bg-blue-600 text-white font-mono">{activePartModal.code}</Badge>
                  <Badge variant="outline" className="text-xs">{activePartModal.category}</Badge>
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

            <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700 border border-gray-200">
              <strong className="text-gray-900 block mb-1">Standard overview:</strong>
              {activePartModal.explanation}
            </div>

            <div className="pt-4 flex justify-end">
              <Button onClick={() => setActivePartModal(null)}>Got it</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PartGroup({ title, parts, onSelect }: { title: string; parts: Part[]; onSelect: (part: Part) => void }) {
  if (parts.length === 0) return null;
  return (
    <div>
      <h3 className="text-sm font-bold text-gray-900 mb-2">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {parts.map((part) => (
          <PartCard key={part.code} part={part} onSelect={onSelect} />
        ))}
      </div>
    </div>
  );
}

function PartCard({ part, onSelect }: { part: Part; onSelect: (part: Part) => void }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(part)}
      className="text-left p-4 rounded-xl border border-gray-200 bg-white hover:border-blue-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
    >
      <div>
        <div className="flex items-center justify-between mb-2 gap-2">
          <span className="font-mono font-bold text-sm text-blue-600 group-hover:underline">{part.code}</span>
          <Badge variant="outline" className="text-[10px] bg-gray-50 text-gray-600">{part.category}</Badge>
        </div>
        <h3 className="font-semibold text-gray-900 text-sm mb-1">{part.title}</h3>
        <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">{part.explanation}</p>
      </div>
      <div className="pt-3 mt-3 border-t border-gray-100 flex items-center justify-between text-xs text-blue-600 font-medium">
        <span>View part details</span>
        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
      </div>
    </button>
  );
}
