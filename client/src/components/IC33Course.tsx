import { useMemo, useState } from "react";
import { BookOpen, CheckCircle2, ClipboardCheck, FileText, FlaskConical, RotateCcw, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ic33DiscoveryScript,
  ic33Labs,
  ic33Metadata,
  ic33Modules,
  ic33Questions,
  ic33Sds,
} from "@/data/ic33CourseData";
import IC33KnowledgeCheckView from "@/components/IC33KnowledgeCheckView";

type View = "overview" | "modules" | "labs" | "evidence" | "check";

function AnchorLink({ anchor, children, onNavigate }: { anchor: string; children: React.ReactNode; onNavigate: (anchor: string) => void }) {
  return (
    <button type="button" className="font-semibold text-blue-700 underline-offset-2 hover:underline" onClick={() => onNavigate(anchor)}>
      {children}
    </button>
  );
}

export default function IC33Course() {
  const [view, setView] = useState<View>("overview");
  const [selectedModule, setSelectedModule] = useState(ic33Modules[0].id);
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState<Record<string, boolean>>({});
  const [showScript, setShowScript] = useState(false);

  const selected = useMemo(() => ic33Modules.find((module) => module.id === selectedModule) ?? ic33Modules[0], [selectedModule]);

  const navigateToAnchor = (anchor: string) => {
    setView("modules");
    window.requestAnimationFrame(() => document.getElementById(anchor)?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };

  const resetQuestion = (id: string) => {
    setChecked((current) => ({ ...current, [id]: false }));
    setSubmitted((current) => ({ ...current, [id]: false }));
  };

  const questionResult = (questionId: string, answers: number[]) => {
    const selectedAnswers = Object.entries(checked)
      .filter(([key, value]) => key.startsWith(`${questionId}:`) && value)
      .map(([key]) => Number(key.split(":")[1]))
      .sort((a, b) => a - b);
    return selectedAnswers.length === answers.length && selectedAnswers.every((answer, index) => answer === answers[index]);
  };

  return (
    <div className="h-full overflow-y-auto bg-slate-50 p-4 sm:p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <Card className="overflow-hidden border-0 bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-900 text-white shadow-xl">
          <div className="p-6 sm:p-9">
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-cyan-100">
              <span className="rounded-full border border-cyan-200/30 bg-cyan-200/10 px-3 py-1">Separate course</span>
              <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1">UK English</span>
            </div>
            <div className="mt-5 grid gap-6 lg:grid-cols-[1.45fr_0.8fr] lg:items-end">
              <div>
                <p className="text-sm font-semibold text-cyan-200">IC33</p>
                <h1 className="mt-1 text-3xl font-extrabold tracking-tight sm:text-5xl">{ic33Metadata.title.replace("IC33 — ", "")}</h1>
                <p className="mt-4 max-w-3xl text-sm leading-7 text-blue-100 sm:text-base">{ic33Metadata.subtitle}</p>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/10 p-4 text-sm text-blue-50">
                <p className="font-bold text-white">Course map</p>
                <p className="mt-2 leading-6">Lifecycle → Risk → Discovery → Zones → Security Levels → HSE evidence</p>
              </div>
            </div>
          </div>
        </Card>

        <nav className="flex gap-2 overflow-x-auto rounded-xl border border-slate-200 bg-white p-2 shadow-sm" aria-label="IC33 course navigation">
          {([
            ["overview", "Overview", BookOpen],
            ["modules", "Anchored modules", ShieldCheck],
            ["labs", "Laboratories", FlaskConical],
            ["evidence", "Evidence library", FileText],
            ["check", "Knowledge check", ClipboardCheck],
          ] as const).map(([id, label, Icon]) => (
            <Button key={id} size="sm" variant={view === id ? "default" : "ghost"} className="flex-shrink-0 gap-2" onClick={() => setView(id)}>
              <Icon className="h-4 w-4" /> {label}
            </Button>
          ))}
        </nav>

        {view === "overview" && (
          <div className="grid gap-5 lg:grid-cols-[1fr_1.2fr]">
            <Card className="border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-700">How to use IC33</p>
              <h2 className="mt-2 text-2xl font-bold text-slate-900">Study the decision chain, not isolated definitions.</h2>
              <p className="mt-3 leading-7 text-slate-600">Start with the lifecycle, use discovery evidence to understand the system, partition it into zones and conduits, then translate the risk decision into security-level requirements. The laboratories turn each step into an assessable activity.</p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {["Six anchored modules", "Six practical laboratories", "Eight answer-keyed questions", "Five SDS evidence references"].map((item) => <div key={item} className="rounded-lg bg-slate-50 p-3 text-sm font-semibold text-slate-700">{item}</div>)}
              </div>
            </Card>
            <Card className="border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-700">Learning route</p>
              <div className="mt-4 space-y-3">
                {ic33Modules.map((module, index) => (
                  <button key={module.id} type="button" className="flex w-full items-start gap-3 rounded-xl border border-slate-200 p-3 text-left transition hover:border-blue-300 hover:bg-blue-50" onClick={() => { setSelectedModule(module.id); setView("modules"); }}>
                    <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-800">{index + 1}</span>
                    <span><span className="block font-bold text-slate-900">{module.title}</span><span className="mt-1 block text-sm text-slate-600">{module.summary}</span></span>
                  </button>
                ))}
              </div>
            </Card>
          </div>
        )}

        {view === "modules" && (
          <div className="grid gap-5 lg:grid-cols-[260px_1fr]">
            <Card className="h-fit border-slate-200 bg-white p-3 shadow-sm lg:sticky lg:top-2">
              <p className="px-2 py-2 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Anchors</p>
              <div className="space-y-1">{ic33Modules.map((module) => <button key={module.id} type="button" className={`w-full rounded-lg px-3 py-2 text-left text-sm font-semibold ${selectedModule === module.id ? "bg-blue-700 text-white" : "text-slate-700 hover:bg-slate-100"}`} onClick={() => { setSelectedModule(module.id); document.getElementById(module.anchor)?.scrollIntoView({ behavior: "smooth", block: "start" }); }}>{module.number}. {module.title}</button>)}</div>
            </Card>
            <div className="space-y-5">
              {ic33Modules.map((module) => <Card id={module.anchor} key={module.id} className={`scroll-mt-5 border-slate-200 bg-white p-6 shadow-sm ${selected.id === module.id ? "ring-2 ring-blue-200" : ""}`}>
                <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-700">Anchor {module.number}: {module.anchor}</p><h2 className="mt-1 text-2xl font-bold text-slate-900">{module.title}</h2></div><span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{module.artefacts.length} source artefacts</span></div>
                <p className="mt-3 max-w-4xl leading-7 text-slate-600">{module.summary}</p>
                <div className="mt-5 grid gap-5 md:grid-cols-2"><div><h3 className="font-bold text-slate-900">Learning objectives</h3><ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-600">{module.objectives.map((point) => <li key={point}>{point}</li>)}</ul></div><div><h3 className="font-bold text-slate-900">Remember</h3><ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-600">{module.keyPoints.map((point) => <li key={point}>{point}</li>)}</ul></div></div>
                <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50 p-4"><p className="text-xs font-bold uppercase tracking-[0.14em] text-blue-800">Anchored artefacts</p><p className="mt-2 text-sm leading-6 text-blue-950">{module.artefacts.join(" · ")}</p></div>
              </Card>)}
            </div>
          </div>
        )}

        {view === "labs" && <div className="grid gap-4 md:grid-cols-2">{ic33Labs.map((lab) => <Card key={lab.id} className="border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-start gap-3"><span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100 font-bold text-emerald-800">{lab.number}</span><div><p className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-700">Laboratory {lab.number}</p><h2 className="mt-1 text-xl font-bold text-slate-900">{lab.title}</h2></div></div><p className="mt-4 leading-7 text-slate-600">{lab.objective}</p><div className="mt-4 grid gap-3 sm:grid-cols-2"><div><h3 className="text-sm font-bold text-slate-800">Inputs</h3><ul className="mt-1 list-disc pl-5 text-sm leading-6 text-slate-600">{lab.inputs.map((item) => <li key={item}>{item}</li>)}</ul></div><div><h3 className="text-sm font-bold text-slate-800">Outputs</h3><ul className="mt-1 list-disc pl-5 text-sm leading-6 text-slate-600">{lab.outputs.map((item) => <li key={item}>{item}</li>)}</ul></div></div><div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm leading-6 text-amber-950"><strong>Safety boundary:</strong> {lab.safety}</div></Card>)}</div>}

        {view === "evidence" && <div className="space-y-5"><Card className="border-slate-200 bg-white p-6 shadow-sm"><p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-700">Supplied evidence</p><h2 className="mt-1 text-2xl font-bold text-slate-900">Workbooks, script and SDS references</h2><p className="mt-3 leading-7 text-slate-600">These references are included as course evidence. The TeamViewer remote-login document is intentionally excluded and is not part of IC33.</p><div className="mt-5 grid gap-3 md:grid-cols-2">{ic33Sds.map((item) => <div key={item.file} className="rounded-xl border border-slate-200 p-4"><p className="font-bold text-slate-900">{item.substance}</p><p className="mt-1 text-xs text-slate-500">{item.file}</p><p className="mt-2 text-sm leading-6 text-slate-600">{item.use}</p></div>)}</div></Card><Card className="border-slate-200 bg-white p-6 shadow-sm"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-700">Discovery artefact</p><h2 className="mt-1 text-xl font-bold text-slate-900">IC33-Discovery.ps1</h2></div><Button size="sm" variant="outline" onClick={() => setShowScript((value) => !value)}>{showScript ? "Hide script" : "Show script"}</Button></div><p className="mt-3 text-sm leading-6 text-slate-600">The script inventories local users, running services, installed products, adapters, IPv4 addresses and TCP connections. Run it only on an authorised assessment target and protect the output.</p>{showScript && <pre className="mt-4 max-h-96 overflow-auto rounded-xl bg-slate-950 p-4 text-xs leading-6 text-cyan-100"><code>{ic33DiscoveryScript}</code></pre>}</Card></div>}

        {view === "check" && <IC33KnowledgeCheckView />}

        <p className="pb-4 text-xs leading-5 text-slate-500">{ic33Metadata.sourceNote} {ic33Metadata.excludedMaterial}</p>
      </div>
    </div>
  );
}
