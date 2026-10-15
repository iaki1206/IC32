import { useState } from "react";
import { 
  FolderDown, 
  Play, 
  CheckCircle, 
  AlertTriangle, 
  ShieldAlert, 
  Network, 
  Copy, 
  Check, 
  RefreshCw,
  FileSpreadsheet,
  FileText,
  Sliders
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function IC33InteractiveLabsView() {
  const [activeLab, setActiveLab] = useState<number>(1);
  const [copied, setCopied] = useState(false);

  // Lab 1 Interactive State
  const [devices, setDevices] = useState([
    { name: "PLC_Reactor_101", ip: "192.168.10.15", type: "", verified: false },
    { name: "Operator_Workstation_01", ip: "192.168.10.5", type: "", verified: false },
    { name: "Core_Switch_Hirschmann", ip: "192.168.10.1", type: "", verified: false },
    { name: "SIS_Safety_Logic_Solver", ip: "192.168.20.10", type: "", verified: false },
  ]);

  // Lab 2 & 6 Risk Matrix State
  const [likelihood, setLikelihood] = useState<number>(3);
  const [consequence, setConsequence] = useState<number>(4);

  // Lab 5 Zone & Conduit Designer State
  const [zoneBPCS, setZoneBPCS] = useState<string[]>(["PLC_Reactor_101", "Operator_Workstation_01"]);
  const [zoneSIS, setZoneSIS] = useState<string[]>(["SIS_Safety_Logic_Solver"]);
  const [zoneError, setZoneError] = useState<string | null>(null);

  const copyScript = () => {
    const script = `$Hostname = Hostname\nGet-LocalUser | Export-Csv -Path .\\$Hostname'-users.csv'\nGet-Service | Where-Object Status -Match Running | Export-Csv -Path .\\$Hostname'-services.csv'\nGet-NetIPAddress -AddressFamily IPv4 | Export-Csv -Path .\\$Hostname'-ips.csv'\nGet-NetTCPConnection | Export-Csv -Path .\\$Hostname'-ports.csv'`;
    navigator.clipboard.writeText(script);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDeviceType = (index: number, val: string) => {
    const updated = [...devices];
    updated[index].type = val;
    const correctMap: Record<string, string> = {
      "PLC_Reactor_101": "Embedded Device",
      "Operator_Workstation_01": "Host Device",
      "Core_Switch_Hirschmann": "Network Device",
      "SIS_Safety_Logic_Solver": "Embedded Device"
    };
    updated[index].verified = val === correctMap[updated[index].name];
    setDevices(updated);
  };

  const calculateRisk = () => {
    const score = likelihood * consequence;
    let slTarget = "SL-1";
    let color = "bg-emerald-500 text-white";
    let status = "Acceptable / Tolerate";

    if (score >= 15) {
      slTarget = "SL-3 / SL-4";
      color = "bg-rose-600 text-white";
      status = "Critical (Detailed Risk Assessment & ZCR Required)";
    } else if (score >= 8) {
      slTarget = "SL-2";
      color = "bg-amber-500 text-white";
      status = "Moderate (Requires Countermeasures & Specific SL-T)";
    }

    return { score, slTarget, color, status };
  };

  const moveDeviceToZone = (device: string, target: "BPCS" | "SIS") => {
    setZoneError(null);
    if (target === "BPCS" && device.includes("SIS")) {
      setZoneError("ALERTA DE SECURITATE (ZCR 3.3): Activele SIS (Safety) NU pot fi plasate în aceeași zonă cu BPCS! Trebuie segregate fizic sau logic.");
      return;
    }
    if (target === "BPCS") {
      setZoneSIS((prev) => prev.filter((d) => d !== device));
      if (!zoneBPCS.includes(device)) setZoneBPCS([...zoneBPCS, device]);
    } else {
      setZoneBPCS((prev) => prev.filter((d) => d !== device));
      if (!zoneSIS.includes(device)) setZoneSIS([...zoneSIS, device]);
    }
  };

  const riskRes = calculateRisk();

  return (
    <div className="space-y-6">
      {/* Top Navigation for Labs */}
      <div className="flex gap-2 overflow-x-auto pb-2 border-b border-slate-200">
        {[
          { id: 1, name: "Lab 1: Asset Inventory", tag: "Discovery" },
          { id: 2, name: "Lab 2: Initial Risk (CSET)", tag: "Risk 5x5" },
          { id: 3, name: "Lab 3: Windows Scanning", tag: "Advisories" },
          { id: 4, name: "Lab 4: Pentest Legacy XP", tag: "Exploit Mitigation" },
          { id: 5, name: "Lab 5: Zones & Conduits", tag: "ISA-62443-3-2" },
          { id: 6, name: "Lab 6: Detailed Risk & SL-T", tag: "BSI & Workbooks" },
        ].map((lab) => (
          <button
            key={lab.id}
            type="button"
            onClick={() => setActiveLab(lab.id)}
            className={`flex-shrink-0 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 ${
              activeLab === lab.id
                ? "bg-blue-700 text-white shadow-md shadow-blue-500/20"
                : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            <span>{lab.name}</span>
            <Badge variant="outline" className={`text-[10px] ${activeLab === lab.id ? "border-blue-400 text-blue-100" : "bg-slate-100"}`}>
              {lab.tag}
            </Badge>
          </button>
        ))}
      </div>

      {/* Lab 1 Simulator */}
      {activeLab === 1 && (
        <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <Card className="p-6 bg-white border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Lab 1: Colector & Clasificator de Active IACS</h3>
                <p className="text-sm text-slate-500 mt-1">Conform ISA/IEC 62443-4-2, asignează corect tipul fiecărui activ descoperit.</p>
              </div>
              <Badge className="bg-emerald-100 text-emerald-800">Simulator Activ</Badge>
            </div>

            <div className="space-y-3 pt-2">
              {devices.map((dev, idx) => (
                <div key={dev.name} className="flex flex-wrap items-center justify-between p-3.5 rounded-lg border border-slate-100 bg-slate-50 gap-3">
                  <div>
                    <div className="font-bold text-slate-900 text-sm">{dev.name}</div>
                    <div className="text-xs text-slate-500 font-mono">{dev.ip}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={dev.type}
                      onChange={(e) => handleDeviceType(idx, e.target.value)}
                      className="text-xs rounded-md border border-slate-300 bg-white px-2.5 py-1.5 outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Alege tipul ISA 62443-4-2...</option>
                      <option value="Host Device">Host Device (HMI, Workstation)</option>
                      <option value="Embedded Device">Embedded Device (PLC, SIS)</option>
                      <option value="Network Device">Network Device (Switch, Router)</option>
                    </select>
                    {dev.verified ? (
                      <CheckCircle className="w-5 h-5 text-emerald-600" />
                    ) : dev.type ? (
                      <AlertTriangle className="w-5 h-5 text-amber-500" />
                    ) : null}
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 flex items-center justify-between gap-4">
              <div className="text-sm text-blue-950 font-medium">
                Descarcă șablonul oficial de inventar de active pentru laborator:
              </div>
              <a
                href="/ic33-docs/Additional Assessment Information/Asset Inventory.xlsx"
                download
                className="inline-flex items-center gap-2 px-3 py-2 bg-blue-700 text-white rounded-lg text-xs font-bold hover:bg-blue-800 transition shadow-sm"
              >
                <FileSpreadsheet className="w-4 h-4" /> Descarcă Asset Inventory.xlsx
              </a>
            </div>
          </Card>

          <Card className="p-6 bg-slate-900 text-white border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-sm text-cyan-300">Script PowerShell Oficial: IC33-Discovery.ps1</h4>
              <Button size="sm" variant="ghost" onClick={copyScript} className="text-xs text-slate-300 hover:text-white">
                {copied ? <Check className="w-4 h-4 text-emerald-400 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
                {copied ? "Copiat!" : "Copiază script"}
              </Button>
            </div>
            <pre className="p-3 bg-slate-950 rounded-lg text-xs font-mono text-cyan-100 overflow-x-auto leading-5">
{`# 1. Extrage utilizatori locali
Get-LocalUser | Export-Csv -Path .\\users.csv

# 2. Servicii active
Get-Service | Where Status -eq Running | Export-Csv -Path .\\services.csv

# 3. Interfețe de rețea & adrese IPv4
Get-NetIPAddress -AddressFamily IPv4 | Export-Csv -Path .\\network.csv

# 4. Conexiuni și porturi deschise (TCP/IP)
Get-NetTCPConnection | Export-Csv .\\ports.csv`}
            </pre>
            <p className="text-xs text-slate-400">
              Rulați scriptul în mediul de laborator pentru a genera evidențele necesare inventarierii fără a perturba procesul industrial.
            </p>
          </Card>
        </div>
      )}

      {/* Lab 2 Simulator */}
      {activeLab === 2 && (
        <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <Card className="p-6 bg-white border-slate-200 shadow-sm space-y-5">
            <div>
              <h3 className="text-xl font-bold text-slate-900">Lab 2: Calculator Matrice de Risc CSET (5x5)</h3>
              <p className="text-sm text-slate-500 mt-1">Calculează riscul neamortizat și stabilește prioritățile conform ISA-62443-3-2.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">
                  Probabilitate Amenințare (Likelihood 1-5): {likelihood}
                </label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={likelihood}
                  onChange={(e) => setLikelihood(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">
                  Consecință HSE / Financiară (Impact 1-5): {consequence}
                </label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={consequence}
                  onChange={(e) => setConsequence(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-500 uppercase font-bold">Scor de Risc Rezultat:</div>
                  <div className="text-3xl font-extrabold text-slate-900">{riskRes.score} / 25</div>
                </div>
                <div className="text-right">
                  <Badge className={`${riskRes.color} px-3 py-1 font-bold text-sm`}>
                    Target SL: {riskRes.slTarget}
                  </Badge>
                  <div className="text-xs text-slate-600 mt-1">{riskRes.status}</div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white border-slate-200 shadow-sm space-y-4">
            <h4 className="font-bold text-slate-900 text-sm">Documente de Consecință & Amplasament</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Pentru a determina impactul financiar și HSE în CSET, consultați documentele oficiale din laborator:
            </p>
            <div className="space-y-2.5">
              <a
                href="/ic33-docs/Additional Assessment Information/Financial Anual Report.pdf"
                target="_blank"
                className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition"
              >
                <span className="text-xs font-semibold text-slate-800 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-600" /> Financial Annual Report.pdf
                </span>
                <span className="text-xs text-blue-600 font-bold">Vizualizează</span>
              </a>
              <a
                href="/ic33-docs/Additional Assessment Information/Location.pdf"
                target="_blank"
                className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition"
              >
                <span className="text-xs font-semibold text-slate-800 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-600" /> Location & Plant Layout.pdf
                </span>
                <span className="text-xs text-blue-600 font-bold">Vizualizează</span>
              </a>
            </div>
          </Card>
        </div>
      )}

      {/* Lab 5 Zones and Conduits Simulator */}
      {activeLab === 5 && (
        <div className="space-y-5">
          <Card className="p-6 bg-white border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Lab 5: Designer Interactiv de Zone & Conduits</h3>
                <p className="text-sm text-slate-500 mt-1">Conform ISA-62443-3-2 ZCR 3.3: Sistemele critice de siguranță (SIS) trebuie separate de cele de control (BPCS).</p>
              </div>
              <a
                href="/ic33-docs/Additional Assessment Information/Phisical Network Diagram.pdf"
                target="_blank"
                className="inline-flex items-center gap-2 px-3 py-2 bg-blue-700 text-white rounded-lg text-xs font-bold hover:bg-blue-800 transition shadow-sm"
              >
                <Network className="w-4 h-4" /> Vezi Physical Network Diagram.pdf
              </a>
            </div>

            {zoneError && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2 font-semibold">
                <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                <span>{zoneError}</span>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-4 pt-2">
              {/* Zone 1 BPCS */}
              <div className="p-4 rounded-xl border-2 border-dashed border-blue-200 bg-blue-50/30 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-blue-900 flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-blue-600"></span> Zona 1: BPCS (Process Control)
                  </h4>
                  <Badge variant="outline" className="text-xs bg-white text-blue-700">Target: SL-T 2</Badge>
                </div>
                <div className="space-y-2 min-h-[90px]">
                  {zoneBPCS.map((item) => (
                    <div key={item} className="flex items-center justify-between bg-white p-2.5 rounded-lg border border-blue-100 shadow-2xs text-xs font-semibold text-slate-800">
                      <span>{item}</span>
                      <button
                        type="button"
                        onClick={() => moveDeviceToZone(item, "SIS")}
                        className="text-[11px] text-blue-600 hover:underline"
                      >
                        Mută în SIS →
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Zone 2 SIS */}
              <div className="p-4 rounded-xl border-2 border-dashed border-amber-200 bg-amber-50/30 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-amber-900 flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-amber-600"></span> Zona 2: SIS (Safety Instrumented System)
                  </h4>
                  <Badge variant="outline" className="text-xs bg-white text-amber-700">Target: SL-T 3</Badge>
                </div>
                <div className="space-y-2 min-h-[90px]">
                  {zoneSIS.map((item) => (
                    <div key={item} className="flex items-center justify-between bg-white p-2.5 rounded-lg border border-amber-100 shadow-2xs text-xs font-semibold text-slate-800">
                      <span>{item}</span>
                      <button
                        type="button"
                        onClick={() => moveDeviceToZone(item, "BPCS")}
                        className="text-[11px] text-amber-700 hover:underline"
                      >
                        ← Mută în BPCS
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600 flex items-center justify-between">
              <span><strong>Conduit 1:</strong> Firewall industrial inspectează traficul dintre Zona BPCS și Zona SIS conform regulilor ZCR 3.5.</span>
              <Badge className="bg-emerald-600 text-white text-[10px]">Conduit Securizat</Badge>
            </div>
          </Card>
        </div>
      )}

      {/* Lab 6 Detailed Risk Assessment */}
      {activeLab === 6 && (
        <Card className="p-6 bg-white border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-slate-900">Lab 6: Evaluare Detaliată de Risc & BSI Threats</h3>
              <p className="text-sm text-slate-500 mt-1">
                Combină cataloagele de amenințări BSI cu foaia oficială de calcul IC33 pentru a defini contramăsurile și SL-T.
              </p>
            </div>
            <a
              href="/ic33-docs/Additional Assessment Information/Lab Exercise - Detailed Risk Assessment - IC33 Blank.xlsx"
              download
              className="inline-flex items-center gap-2 px-3 py-2 bg-emerald-700 text-white rounded-lg text-xs font-bold hover:bg-emerald-800 transition shadow-sm"
            >
              <FileSpreadsheet className="w-4 h-4" /> Descarcă Detailed Risk Assessment.xlsx
            </a>
          </div>

          <div className="grid md:grid-cols-3 gap-3 pt-2">
            <a
              href="/ic33-docs/Additional Assessment Information/Threat Catalogs/BSI - Threats Catalogue - Elementary Threats.pdf"
              target="_blank"
              className="p-3.5 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 transition block"
            >
              <div className="font-bold text-xs text-slate-900">BSI Elementary Threats (T 0.1 - T 0.46)</div>
              <div className="text-[11px] text-slate-500 mt-1">Catalogul de 46 de amenințări elementare utilizat în analiza ISA-62443.</div>
            </a>
            <a
              href="/ic33-docs/Additional Assessment Information/Policies & Procedures/Access_Control_Procedure_OT_IEC62443.pdf"
              target="_blank"
              className="p-3.5 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 transition block"
            >
              <div className="font-bold text-xs text-slate-900">Procedura de Control al Accesului OT</div>
              <div className="text-[11px] text-slate-500 mt-1">Contramăsuri administrative și procedurale pentru reducerea riscului rezidual.</div>
            </a>
            <a
              href="/ic33-docs/Additional Assessment Information/Threat Catalogs/Threat taxonomy v 2016.xlsx"
              download
              className="p-3.5 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 transition block"
            >
              <div className="font-bold text-xs text-slate-900">Threat Taxonomy.xlsx</div>
              <div className="text-[11px] text-slate-500 mt-1">Taxonomia completă a vectorilor de amenințare IACS.</div>
            </a>
          </div>
        </Card>
      )}

      {/* Fallback for Labs 3 and 4 */}
      {(activeLab === 3 || activeLab === 4) && (
        <Card className="p-6 bg-white border-slate-200 shadow-sm space-y-4">
          <h3 className="text-xl font-bold text-slate-900">
            {activeLab === 3 ? "Lab 3: Scanare de Vulnerabilități & Analiză Advisory" : "Lab 4: Evaluare Sisteme Legacy & Patching"}
          </h3>
          <p className="text-sm text-slate-500">
            În acest laborator, analizați rapoartele CVE reale emise pentru mediile industriale:
          </p>
          <div className="grid md:grid-cols-2 gap-3 pt-2">
            <a
              href="/ic33-docs/Additional Assessment Information/Security_Advisory/Security_Advisory-CVE-2022-4304_CVE-2023-2673.pdf"
              target="_blank"
              className="p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition flex items-center justify-between"
            >
              <span className="text-xs font-semibold text-slate-800">Security Advisory CVE-2022-4304 / CVE-2023-2673</span>
              <span className="text-xs text-blue-600 font-bold">Deschide PDF</span>
            </a>
            <a
              href="/ic33-docs/Additional Assessment Information/Security_Advisory/Security_Advisory_CVE-2021-2100-3-5.pdf"
              target="_blank"
              className="p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition flex items-center justify-between"
            >
              <span className="text-xs font-semibold text-slate-800">Security Advisory CVE-2021-2100-3-5</span>
              <span className="text-xs text-blue-600 font-bold">Deschide PDF</span>
            </a>
          </div>
        </Card>
      )}
    </div>
  );
}
