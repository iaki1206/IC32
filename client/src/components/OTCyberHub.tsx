import { useMemo, useState } from "react";
import {
  BookOpenCheck,
  Check,
  CheckCircle2,
  ChevronRight,
  Circle,
  Copy,
  Eye,
  Factory,
  Link2,
  Network,
  Radar,
  Route,
  Search,
  ShieldAlert,
  Sparkles,
  Terminal,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { aiPrompts, learningPath, modules, quickChecks, type LearningModule } from "@/data/otCyberData";

const iconByAnchor = {
  WHY: ShieldAlert,
  WHAT: BookOpenCheck,
  WHERE: Network,
  FLOW: Route,
  SEE: Eye,
  TEST: Terminal,
  IMPROVE: Sparkles,
};

const colourByAnchor: Record<string, { active: string; soft: string; border: string; text: string }> = {
  WHY: { active: "bg-cyan-600", soft: "bg-cyan-50", border: "border-cyan-200", text: "text-cyan-800" },
  WHAT: { active: "bg-blue-700", soft: "bg-blue-50", border: "border-blue-200", text: "text-blue-800" },
  WHERE: { active: "bg-emerald-600", soft: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-800" },
  FLOW: { active: "bg-violet-600", soft: "bg-violet-50", border: "border-violet-200", text: "text-violet-800" },
  SEE: { active: "bg-amber-600", soft: "bg-amber-50", border: "border-amber-200", text: "text-amber-900" },
  TEST: { active: "bg-rose-600", soft: "bg-rose-50", border: "border-rose-200", text: "text-rose-800" },
  IMPROVE: { active: "bg-indigo-600", soft: "bg-indigo-50", border: "border-indigo-200", text: "text-indigo-800" },
};

function normalise(value: string) {
  return value.toLocaleLowerCase("en-GB");
}

function copyText(text: string) {
  if (navigator.clipboard) navigator.clipboard.writeText(text).catch(() => undefined);
}

const standardFamilies = [
  { label: "General", colour: "bg-cyan-500", parts: ["62443-1-1 Concepts and models", "62443-1-2 Glossary", "62443-1-3 Conformance metrics", "62443-1-4 Lifecycle and use-cases", "62443-1-5 Security profiles", "62443-1-6 IIoT application"] },
  { label: "Policies & procedures", colour: "bg-lime-500", parts: ["62443-2-1 Security programme requirements", "PAS 62443-2-2 Protection rating", "62443-2-3 Patch management", "62443-2-4 IACS service providers", "62443-2-5 Asset-owner guidance"] },
  { label: "System", colour: "bg-orange-500", parts: ["62443-3-1 Security technologies", "62443-3-2 Risk assessment and system design", "62443-3-3 System requirements and security levels"] },
  { label: "Component", colour: "bg-yellow-400", parts: ["62443-4-1 Secure product development", "62443-4-2 Technical component requirements"] },
  { label: "Profiles", colour: "bg-slate-500", parts: ["62443-5-x Domain-specific profiles"] },
  { label: "Evaluation", colour: "bg-fuchsia-500", parts: ["62443-6-1 Evaluation methodology for 62443-2-4", "62443-6-2 Evaluation methodology for 62443-4-2"] },
];

function StandardsMap() {
  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm leading-6 text-slate-700">Use the colour bands as a memory route: <strong>General → Policies → System → Component → Profiles → Evaluation</strong>. The red marker in the source visual means “not yet published”, not a security level.</div>
      <div className="grid gap-2 sm:grid-cols-2">
        {standardFamilies.map((family) => (
          <div key={family.label} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className={`${family.colour} px-3 py-2 text-sm font-black text-slate-950`}>{family.label}</div>
            <div className="space-y-1 p-3">{family.parts.map((part) => <div key={part} className="rounded-lg bg-slate-50 px-2.5 py-2 text-xs leading-5 text-slate-700">{part}</div>)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

const securityLevelData = [
  ["SL 0", "No specific requirements or security protection necessary", "Baseline / no defined protection"],
  ["SL 1", "Protection against casual or coincidental violation", "Basic protection against accidental or opportunistic events"],
  ["SL 2", "Protection against intentional violation using simple means with low resources, generic skills and low motivation", "Protection against a motivated but relatively capable attacker"],
  ["SL 3", "Protection against intentional violation using sophisticated means with moderate resources, IACS-specific skills and moderate motivation", "Protection against a capable, motivated attacker with OT knowledge"],
  ["SL 4", "Protection against intentional violation using sophisticated means with extended resources, IACS-specific skills and high motivation", "Highest protection target for the most demanding threat profile"],
];

function SecurityLevelLab() {
  const [selected, setSelected] = useState(2);
  const current = securityLevelData[selected];
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
        {securityLevelData.map((level, index) => (
          <button key={level[0]} type="button" onClick={() => setSelected(index)} className={`rounded-xl border-2 p-3 text-left transition hover:-translate-y-0.5 ${selected === index ? "border-slate-950 bg-slate-950 text-white shadow-lg" : "border-slate-200 bg-white text-slate-800"}`}>
            <div className="text-lg font-black">{level[0]}</div>
            <div className="mt-1 text-[11px] leading-4 opacity-80">{index === 0 ? "No defined protection" : `Security step ${index}`}</div>
          </button>
        ))}
      </div>
      <Card className="border-l-4 border-l-blue-700 bg-blue-50 p-4">
        <Badge className="bg-blue-700 text-white hover:bg-blue-700">Selected: {current[0]}</Badge>
        <p className="mt-3 text-sm font-bold leading-6 text-slate-950">{current[1]}</p>
        <p className="mt-2 text-xs leading-5 text-slate-700">Threat interpretation: {current[2]}.</p>
      </Card>
      <div className="rounded-xl border border-slate-200 bg-white p-3 text-xs leading-5 text-slate-600"><strong>Remember:</strong> SL is a protection target and capability statement, not a guarantee that a plant is permanently secure. Compare SL-T, SL-C and SL-A during risk assessment and verification.</div>
    </div>
  );
}

const lifecyclePhases = [
  ["1", "Specification", "Define cybersecurity requirements, partition zones and conduits, and set the target security level."],
  ["2", "Design", "Perform detailed risk assessment and design technical and organisational measures."],
  ["3", "Implementation", "Implement technical measures, product updates and organisational controls."],
  ["4–5", "Verification & validation", "Verify technical and organisational measures, approve handover and change credentials before operation."],
  ["6", "Operation", "Operate equipment under control, reassess risk and trigger maintenance when needed."],
  ["7", "Maintenance", "Monitor threats, implement change procedures and apply product security updates."],
  ["8", "Decommissioning", "Approve change management, purge sensitive data and decommission IACS assets."],
];

function LifecycleInteractive() {
  const [selected, setSelected] = useState(0);
  const phase = lifecyclePhases[selected];
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">{lifecyclePhases.map((item, index) => <button key={item[0]} type="button" onClick={() => setSelected(index)} className={`rounded-full border px-3 py-2 text-xs font-black transition ${selected === index ? "border-blue-700 bg-blue-700 text-white" : "border-slate-200 bg-white text-slate-700 hover:border-blue-400"}`}>Phase {item[0]} · {item[1]}</button>)}</div>
      <Card className="border-slate-200 bg-slate-50 p-4"><div className="text-xs font-black uppercase tracking-widest text-slate-500">Selected lifecycle phase</div><h4 className="mt-1 text-xl font-black text-slate-950">{phase[1]}</h4><p className="mt-2 text-sm leading-6 text-slate-700">{phase[2]}</p><div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200"><div className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 transition-all" style={{ width: `${((selected + 1) / lifecyclePhases.length) * 100}%` }} /></div></Card>
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs leading-5 text-emerald-950"><strong>Continuous loop:</strong> maintenance and operational evidence feed the next specification and risk assessment cycle. Security is sustained, not completed once.</div>
    </div>
  );
}

const patchSteps = [
  ["Information gathering", "Inventory assets, supplier relationships and supportability; assess the environment and classify assets."],
  ["Monitoring & evaluation", "Monitor and identify patches, determine applicability, perform risk assessment and make the decision."],
  ["Patch testing", "Check file authenticity, review changes, define the install and removal procedure, qualify the patch and mitigate risk."],
  ["Patch deployment", "Notify stakeholders, prepare, schedule and deploy in a controlled maintenance window."],
  ["Verification & reporting", "Verify the result, train operators and preserve documentation and evidence."],
];

function PatchCycleInteractive() {
  const [selected, setSelected] = useState(0);
  const step = patchSteps[selected];
  return (
    <div className="space-y-4">
      <div className="grid gap-2 sm:grid-cols-5">{patchSteps.map((item, index) => <button key={item[0]} type="button" onClick={() => setSelected(index)} className={`rounded-xl border p-3 text-left transition ${selected === index ? "border-orange-600 bg-orange-50 shadow-md" : "border-slate-200 bg-white hover:border-orange-300"}`}><div className="text-[10px] font-black uppercase tracking-widest text-orange-700">{index + 1}</div><div className="mt-1 text-xs font-black text-slate-900">{item[0]}</div></button>)}</div>
      <Card className="border-orange-200 bg-orange-50 p-4"><h4 className="text-lg font-black text-orange-950">{step[0]}</h4><p className="mt-2 text-sm leading-6 text-orange-950">{step[1]}</p></Card>
      <p className="text-xs leading-5 text-slate-600"><strong>OT rule:</strong> a patch is not “safe” merely because it is available. Applicability, testing, rollback, scheduling and evidence are part of the security control.</p>
    </div>
  );
}

const osiLayers = [
  ["7", "Application", "HTTP request: GET /index.html", "The user-facing request and the data the application wants."],
  ["6", "Presentation", "SSL/TLS encryption", "Protects and formats the application data; think of a locked box."],
  ["5", "Session", "Session ID · authentication · timeout", "Keeps track of the conversation between endpoints."],
  ["4", "Transport", "TCP · source 54321 · destination 443 · sequence", "Provides reliable delivery, ordering and flow control."],
  ["3", "Network", "IP 192.168.1.100 → 93.184.216.34", "Adds routing information so packets can cross networks."],
  ["2", "Data Link", "MAC source → MAC destination", "Delivers frames across the local network segment."],
  ["1", "Physical", "Electrical signals / Wi-Fi radio", "Carries raw bits across the physical medium."],
];

function OSIEncapsulationLab() {
  const [stage, setStage] = useState(0);
  const transmitStage = osiLayers.length;
  const isReturn = stage > transmitStage;
  const returnIndex = stage - transmitStage - 1;
  const activeLayer = !isReturn && stage < osiLayers.length ? osiLayers[stage] : isReturn ? osiLayers[Math.max(0, osiLayers.length - returnIndex - 2)] : osiLayers[osiLayers.length - 1];
  const visible = stage === 0
    ? [osiLayers[0]]
    : stage < transmitStage
      ? osiLayers.slice(0, stage + 1)
      : stage === transmitStage
        ? osiLayers
        : osiLayers.slice(0, Math.max(1, osiLayers.length - (returnIndex + 1)));
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3"><div><div className="text-xs font-black uppercase tracking-widest text-violet-700">Encapsulation simulator</div><p className="mt-1 text-sm text-slate-700">Step down from Layer 7 to Layer 1, transmit, then decapsulate back up.</p></div><div className="flex gap-2"><Button type="button" size="sm" variant="outline" onClick={() => setStage(0)}>Reset</Button><Button type="button" size="sm" onClick={() => setStage((value) => Math.min(value + 1, osiLayers.length * 2 + 1))}>{stage < osiLayers.length ? "Add next header" : stage === osiLayers.length ? "Transmit" : "Remove next header"}</Button></div></div>
      <div className="grid gap-3 sm:grid-cols-7">{osiLayers.map((layer, index) => <div key={layer[0]} className={`rounded-xl border p-3 text-center transition ${(!isReturn && index <= stage) || (stage === transmitStage) || (isReturn && index < osiLayers.length - (returnIndex + 1)) ? "border-violet-500 bg-violet-100" : "border-slate-200 bg-white"}`}><div className="text-lg font-black text-violet-800">L{layer[0]}</div><div className="mt-1 text-[10px] font-bold leading-4 text-slate-700">{layer[1]}</div></div>)}</div>
      <Card className="border-violet-200 bg-slate-950 p-4 text-white"><div className="text-xs font-black uppercase tracking-widest text-violet-300">Current data unit</div><div className="mt-3 flex flex-wrap gap-2">{visible.length === 0 ? <Badge className="bg-emerald-500 text-white hover:bg-emerald-500">HTTP request recovered</Badge> : visible.map((layer) => <Badge key={layer[0]} className="bg-violet-500 text-white hover:bg-violet-500">{layer[1]} · {layer[2]}</Badge>)}</div><p className="mt-3 text-xs leading-5 text-slate-300">{stage === 0 ? "Start with the pure application payload." : stage < transmitStage ? `Layer ${activeLayer[0]} adds: ${activeLayer[2]}.` : stage === transmitStage ? "The fully wrapped packet travels through routers, switches and the physical medium." : stage === transmitStage + 1 ? "The receiving stack begins removing the outer physical header." : stage === transmitStage * 2 + 1 ? "The HTTP request is recovered and ready for the application." : "The receiving stack removes one outer header at a time."}</p></Card>
      <div className="grid gap-2 sm:grid-cols-2"><div className="rounded-xl border border-cyan-200 bg-cyan-50 p-3 text-xs leading-5 text-cyan-950"><strong>Send:</strong> application data is wrapped as it moves down the stack.</div><div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs leading-5 text-emerald-950"><strong>Receive:</strong> headers are removed in reverse order until the HTTP request is processed.</div></div>
    </div>
  );
}

function InteractiveBlock({ kind }: { kind: NonNullable<LearningModule["blocks"][number]["interactive"]> }) {
  if (kind === "standards") return <StandardsMap />;
  if (kind === "securityLevels") return <SecurityLevelLab />;
  if (kind === "lifecycle") return <LifecycleInteractive />;
  if (kind === "patchCycle") return <PatchCycleInteractive />;
  return <OSIEncapsulationLab />;
}

function ModuleBlock({ block }: { block: LearningModule["blocks"][number] }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <h3 className="text-base font-extrabold text-slate-950">{block.title}</h3>
      {block.body && <p className="mt-2 text-sm leading-6 text-slate-600">{block.body}</p>}

      {block.interactive && <div className="mt-4"><InteractiveBlock kind={block.interactive} /></div>}

      {block.warning && (
        <div className="mt-3 flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm leading-6 text-amber-950">
          <ShieldAlert className="mt-0.5 h-5 w-5 flex-none text-amber-700" />
          <p>{block.warning}</p>
        </div>
      )}

      {block.bullets && (
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {block.bullets.map((item) => (
            <div key={item} className="flex gap-2 rounded-xl bg-slate-50 px-3 py-2 text-sm leading-5 text-slate-700">
              <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none text-emerald-600" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      )}

      {block.code && (
        <div className="mt-3 space-y-2">
          {block.code.map((line) => {
            const code = line.includes("→") ? line.split("→").slice(1).join("→").trim() : line;
            return (
              <div key={line} className="group flex items-start justify-between gap-3 rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5">
                <code className="min-w-0 whitespace-pre-wrap break-all text-xs leading-5 text-cyan-100 sm:text-sm">{line}</code>
                <button
                  type="button"
                  onClick={() => copyText(code)}
                  className="rounded-md p-1.5 text-slate-400 transition hover:bg-white/10 hover:text-white"
                  aria-label={`Copy ${code}`}
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {block.table && (
        <div className="mt-3 overflow-x-auto rounded-xl border border-slate-200">
          <table className="min-w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-900 text-white">
              <tr>
                {block.table.headers.map((header) => (
                  <th key={header} className="whitespace-nowrap px-3 py-3 font-bold">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {block.table.rows.map((row, rowIndex) => (
                <tr key={`${block.title}-${rowIndex}`} className="align-top hover:bg-slate-50">
                  {row.map((cell, cellIndex) => (
                    <td key={`${cell}-${cellIndex}`} className={`px-3 py-3 leading-5 text-slate-700 ${cellIndex === 0 ? "font-bold text-slate-950" : ""}`}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function PromptLibrary({ query }: { query: string }) {
  const [industry, setIndustry] = useState("manufacturing");
  const filtered = aiPrompts.filter((item) => normalise(`${item.title} ${item.goal} ${item.prompt} ${item.links.join(" ")}`).includes(normalise(query)));

  return (
    <div className="space-y-4">
      <Card className="border-indigo-200 bg-indigo-50 p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label htmlFor="industry" className="text-xs font-bold uppercase tracking-wide text-indigo-900">Industry used in prompts</label>
            <input
              id="industry"
              value={industry}
              onChange={(event) => setIndustry(event.target.value)}
              className="mt-1 h-10 w-full rounded-lg border border-indigo-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500/30"
              placeholder="manufacturing, water, energy..."
            />
          </div>
          <div className="text-xs leading-5 text-indigo-800 sm:max-w-sm">
            We automatically replace <strong>[industry]</strong>. Always verify AI output with an OT specialist and with the approved documentation.
          </div>
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        {filtered.map((item) => {
          const renderedPrompt = item.prompt.replaceAll("[industry]", industry || "[industry]");
          return (
            <Card key={item.id} className="flex flex-col border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <Badge className="mb-2 bg-indigo-100 text-indigo-800 hover:bg-indigo-100">Prompt {item.id}</Badge>
                  <h3 className="font-extrabold text-slate-950">{item.title}</h3>
                  <p className="mt-1 text-xs font-medium text-slate-500">{item.goal}</p>
                </div>
                <Button type="button" size="sm" variant="outline" onClick={() => copyText(renderedPrompt)} className="flex-none gap-1.5">
                  <Copy className="h-3.5 w-3.5" /> Copy
                </Button>
              </div>
              <p className="mt-4 flex-1 rounded-xl bg-slate-950 p-4 text-sm leading-6 text-slate-100">{renderedPrompt}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {item.links.map((link) => <Badge key={link} variant="outline" className="text-[10px]">{link}</Badge>)}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function QuickCheck() {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const score = quickChecks.filter((item, index) => answers[index] === item.answer).length;

  return (
    <Card className="border-slate-800 bg-slate-950 p-5 text-white shadow-xl sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Badge className="bg-cyan-400/15 text-cyan-100 hover:bg-cyan-400/15">Recall Lab</Badge>
          <h2 className="mt-2 text-2xl font-extrabold">Check the anchors</h2>
          <p className="mt-1 text-sm text-slate-300">Feedback appears only after you select an answer.</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-center">
          <div className="text-2xl font-black text-cyan-300">{score}/{quickChecks.length}</div>
          <div className="text-[10px] uppercase tracking-widest text-slate-400">correct</div>
        </div>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        {quickChecks.map((item, index) => {
          const selected = answers[index];
          return (
            <div key={item.question} className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="text-sm font-bold leading-6">{index + 1}. {item.question}</p>
              <div className="mt-3 grid gap-2">
                {item.options.map((option) => {
                  const revealed = Boolean(selected);
                  const isCorrect = option === item.answer;
                  const isSelected = option === selected;
                  let style = "border-white/10 bg-white/5 text-slate-200 hover:bg-white/10";
                  if (revealed && isCorrect) style = "border-emerald-400 bg-emerald-500/15 text-emerald-100";
                  else if (revealed && isSelected) style = "border-rose-400 bg-rose-500/15 text-rose-100";
                  return (
                    <button key={option} type="button" onClick={() => setAnswers((previous) => ({ ...previous, [index]: option }))} className={`rounded-lg border px-3 py-2 text-left text-xs transition ${style}`}>
                      {option}
                    </button>
                  );
                })}
              </div>
              {selected && (
                <p className={`mt-3 text-xs font-bold ${selected === item.answer ? "text-emerald-300" : "text-rose-300"}`}>
                  {selected === item.answer ? "Correct." : `Note: ${item.answer}.`}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}

export default function OTCyberHub() {
  const [activeId, setActiveId] = useState(() => {
    const requestedAnchor = new URLSearchParams(window.location.search).get("anchor")?.toUpperCase();
    return modules.find((module) => module.anchor === requestedAnchor)?.id || "foundations";
  });
  const [query, setQuery] = useState("");
  const [showSources, setShowSources] = useState(false);
  const [completed, setCompleted] = useState<Set<string>>(() => {
    try {
      return new Set(JSON.parse(localStorage.getItem("otCyberCompleted") || "[]"));
    } catch {
      return new Set();
    }
  });

  const activeModule = modules.find((module) => module.id === activeId) || modules[0];
  const progress = Math.round((completed.size / modules.length) * 100);
  const searchableModules = useMemo(() => {
    if (!query.trim()) return modules;
    const needle = normalise(query);
    return modules.filter((module) => normalise(JSON.stringify(module)).includes(needle));
  }, [query]);

  const selectModule = (id: string) => {
    setActiveId(id);
    const module = modules.find((item) => item.id === id);
    const url = new URL(window.location.href);
    url.searchParams.set("tab", "ot");
    if (module) url.searchParams.set("anchor", module.anchor.toLowerCase());
    window.history.replaceState({}, "", url);
    window.setTimeout(() => document.getElementById("ot-module")?.scrollIntoView({ behavior: "smooth", block: "start" }), 20);
  };

  const toggleComplete = (id: string) => {
    setCompleted((previous) => {
      const next = new Set(previous);
      if (next.has(id)) next.delete(id); else next.add(id);
      localStorage.setItem("otCyberCompleted", JSON.stringify(Array.from(next)));
      return next;
    });
  };

  return (
    <div className="h-full overflow-y-auto bg-slate-50">
      <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6">
        <Card className="overflow-hidden border-0 bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-950 text-white shadow-2xl">
          <div className="grid gap-8 p-6 sm:p-9 lg:grid-cols-[1fr_330px] lg:items-center">
            <div>
              <div className="flex flex-wrap gap-2">
                <Badge className="border border-cyan-300/20 bg-cyan-300/10 text-cyan-100 hover:bg-cyan-300/10">OT/ICS Knowledge Hub</Badge>
                <Badge className="border border-white/15 bg-white/10 text-slate-200 hover:bg-white/10">10 integrated visual sources</Badge>
              </div>
              <h1 className="mt-4 text-3xl font-black tracking-tight sm:text-5xl">Learn by anchors, not by isolated memorisation.</h1>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-200 sm:text-base">
                The path connects IEC 62443, zones, the Purdue model, protocols, monitoring and safe practice into a single narrative: <strong className="text-white">WHY → WHAT → WHERE → FLOW → SEE → TEST → IMPROVE</strong>.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-xs uppercase tracking-[0.18em] text-cyan-200">Personal progress</div>
                  <div className="mt-1 text-4xl font-black">{progress}%</div>
                </div>
                <Factory className="h-10 w-10 text-cyan-300" />
              </div>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                <div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-400 transition-all" style={{ width: `${progress}%` }} />
              </div>
              <p className="mt-3 text-xs text-slate-300">{completed.size} of {modules.length} modules marked as learnt on this device.</p>
            </div>
          </div>
        </Card>

        <Card className="border-slate-200 bg-white p-4 shadow-sm">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search: Modbus, SL-T, DMZ, port 502, Wireshark..." className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" />
          </div>
        </Card>

        <section aria-label="Learning path" className="grid gap-2 sm:grid-cols-2 lg:grid-cols-7">
          {learningPath.map((path, index) => {
            const Icon = iconByAnchor[path.key as keyof typeof iconByAnchor];
            const module = modules.find((item) => item.id === path.moduleId)!;
            const active = activeId === module.id;
            const palette = colourByAnchor[path.key];
            return (
              <button key={path.key} type="button" onClick={() => selectModule(module.id)} className={`relative rounded-2xl border p-3 text-left transition hover:-translate-y-0.5 hover:shadow-md ${active ? `${palette.active} border-transparent text-white shadow-lg` : `${palette.soft} ${palette.border} ${palette.text}`}`}>
                <div className="flex items-center justify-between">
                  <Icon className="h-5 w-5" />
                  <span className="text-[10px] font-black tracking-widest">0{index + 1}</span>
                </div>
                <div className="mt-4 text-sm font-black">{path.key}</div>
                <div className={`mt-1 text-[11px] leading-4 ${active ? "text-white/80" : "opacity-75"}`}>{path.label}</div>
                {completed.has(module.id) && <Check className="absolute right-2 top-2 h-4 w-4" />}
              </button>
            );
          })}
        </section>

        <div className="grid gap-6 lg:grid-cols-[270px_minmax(0,1fr)]">
          <aside className="space-y-3 lg:sticky lg:top-4 lg:self-start">
            <Card className="border-slate-200 bg-white p-3 shadow-sm">
              <div className="px-2 pb-2 text-xs font-black uppercase tracking-[0.16em] text-slate-500">Module map</div>
              <div className="space-y-1">
                {searchableModules.map((module) => {
                  const active = activeId === module.id;
                  return (
                    <button key={module.id} type="button" onClick={() => selectModule(module.id)} className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition ${active ? "bg-slate-950 text-white" : "text-slate-700 hover:bg-slate-100"}`}>
                      {completed.has(module.id) ? <CheckCircle2 className="h-4 w-4 flex-none text-emerald-500" /> : <Circle className="h-4 w-4 flex-none text-slate-400" />}
                      <span className="min-w-0 flex-1">
                        <span className="block text-[10px] font-black tracking-widest opacity-60">{module.anchor}</span>
                        <span className="block truncate text-xs font-bold">{module.title}</span>
                      </span>
                      <ChevronRight className="h-4 w-4 flex-none opacity-60" />
                    </button>
                  );
                })}
              </div>
            </Card>

            <Card className="border-amber-200 bg-amber-50 p-4 text-amber-950">
              <div className="flex gap-2">
                <ShieldAlert className="h-5 w-5 flex-none" />
                <div>
                  <div className="text-sm font-black">OT rule</div>
                  <p className="mt-1 text-xs leading-5">Passive observation is the first choice. Active scanning and testing require authorisation, a rollback plan and a controlled environment.</p>
                </div>
              </div>
            </Card>
          </aside>

          <main id="ot-module" className="min-w-0 scroll-mt-4 space-y-5">
            <Card className={`border-2 p-5 shadow-sm sm:p-7 ${colourByAnchor[activeModule.anchor].soft} ${colourByAnchor[activeModule.anchor].border}`}>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge className={`${colourByAnchor[activeModule.anchor].active} text-white hover:${colourByAnchor[activeModule.anchor].active}`}>Step {activeModule.step} · {activeModule.anchor}</Badge>
                    <Badge variant="outline">{activeModule.blocks.length || aiPrompts.length} resources</Badge>
                  </div>
                  <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950">{activeModule.title}</h2>
                  <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-700">{activeModule.subtitle}</p>
                </div>
                <Button type="button" variant={completed.has(activeModule.id) ? "default" : "outline"} onClick={() => toggleComplete(activeModule.id)} className={completed.has(activeModule.id) ? "bg-emerald-600 hover:bg-emerald-700" : "bg-white"}>
                  {completed.has(activeModule.id) ? <CheckCircle2 className="mr-2 h-4 w-4" /> : <Circle className="mr-2 h-4 w-4" />}
                  {completed.has(activeModule.id) ? "Learnt" : "Mark as learnt"}
                </Button>
              </div>

              <div className="mt-5 grid gap-3 md:grid-cols-[1fr_auto] md:items-center">
                <div className="rounded-xl border border-white/60 bg-white/75 p-4">
                  <div className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">Memory anchor</div>
                  <p className="mt-1 text-sm font-bold leading-6 text-slate-900">{activeModule.remember}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {activeModule.connectsTo.map((targetId) => {
                    const target = modules.find((module) => module.id === targetId)!;
                    return (
                      <button key={targetId} type="button" onClick={() => selectModule(targetId)} className="inline-flex items-center gap-1.5 rounded-full border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:border-blue-400 hover:text-blue-700">
                        <Link2 className="h-3.5 w-3.5" /> {target.anchor}
                      </button>
                    );
                  })}
                </div>
              </div>
            </Card>

            {activeModule.id === "playbooks" ? <PromptLibrary query={query} /> : activeModule.blocks.map((block) => <ModuleBlock key={block.title} block={block} />)}

            <Card className="border-slate-200 bg-white p-4">
              <button type="button" onClick={() => setShowSources((previous) => !previous)} className="flex w-full items-center justify-between gap-3 text-left">
                <span>
                  <span className="block text-sm font-black text-slate-950">Module visual sources</span>
                  <span className="mt-0.5 block text-xs text-slate-500">Preserved for transcript verification and original context.</span>
                </span>
                <ChevronRight className={`h-5 w-5 transition ${showSources ? "rotate-90" : ""}`} />
              </button>
              {showSources && (
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {activeModule.sourceImages.map((source) => (
                    <a key={source} href={source} target="_blank" rel="noreferrer" className="group overflow-hidden rounded-xl border border-slate-200 bg-slate-950">
                      <img src={source} alt={`Visual source for ${activeModule.title}`} className="h-72 w-full object-contain transition group-hover:scale-[1.01]" />
                    </a>
                  ))}
                </div>
              )}
            </Card>

            <QuickCheck />
          </main>
        </div>
      </div>
    </div>
  );
}
