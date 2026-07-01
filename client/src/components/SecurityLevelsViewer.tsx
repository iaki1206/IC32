import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { AlertCircle } from "lucide-react";

interface SecurityLevel {
  id: number;
  name: string;
  description: string;
  threat: string;
  color: string;
}

interface SecurityLevelsViewerProps {
  levels: SecurityLevel[];
}

export default function SecurityLevelsViewer({ levels }: SecurityLevelsViewerProps) {
  const [selectedLevel, setSelectedLevel] = useState<number>(2);

  const frAcronyms = ["IAC", "UC", "SI", "DC", "RDF", "TRE", "RA"];
  const frNames = [
    "Identification & Authentication",
    "Use Control",
    "System Integrity",
    "Data Confidentiality",
    "Restrict Data Flow",
    "Timely Response",
    "Resource Availability",
  ];

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-2">Security Levels (SL 0-4)</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Five levels representing increasing protection against different threat levels
        </p>
      </div>

      {/* Security Levels Grid */}
      <div className="grid grid-cols-2 gap-3">
        {levels.map((level) => (
          <button
            key={level.id}
            onClick={() => setSelectedLevel(level.id)}
            className={`p-3 rounded-lg text-left transition-all ${
              selectedLevel === level.id
                ? "ring-2 ring-primary shadow-lg"
                : "hover:shadow-md"
            }`}
            style={{
              backgroundColor: level.color + "20",
              borderColor: level.color,
              borderWidth: "2px",
            }}
          >
            <p className="font-bold" style={{ color: level.color }}>
              {level.name}
            </p>
            <p className="text-xs text-muted-foreground mt-1">{level.id === 0 ? "No protection" : `SL ${level.id}`}</p>
          </button>
        ))}
      </div>

      {/* Selected Level Details */}
      {levels.find((l) => l.id === selectedLevel) && (
        <Card className="p-4 border-l-4" style={{ borderLeftColor: levels.find((l) => l.id === selectedLevel)?.color }}>
          <div className="space-y-3">
            <div>
              <p className="font-semibold text-foreground text-lg">
                {levels.find((l) => l.id === selectedLevel)?.name}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {levels.find((l) => l.id === selectedLevel)?.description}
              </p>
            </div>

            <div className="pt-3 border-t border-border">
              <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Threat Profile</p>
              <p className="text-sm text-foreground">
                {levels.find((l) => l.id === selectedLevel)?.threat}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Foundational Requirements */}
      <div className="pt-4 border-t border-border">
        <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <AlertCircle size={16} className="text-accent" />
          Seven Foundational Requirements (FR)
        </h4>
        <div className="grid grid-cols-2 gap-2">
          {frAcronyms.map((acronym, idx) => (
            <div key={idx} className="p-2 rounded-lg bg-primary/5 border border-primary/30">
              <p className="font-bold text-primary text-sm">{acronym}</p>
              <p className="text-xs text-muted-foreground mt-1">{frNames[idx]}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FR Vector Explanation */}
      <Card className="p-4 bg-accent/5 border-accent/30">
        <p className="text-xs font-semibold text-accent uppercase mb-2">FR Vector Notation</p>
        <p className="text-sm text-foreground">
          Instead of a single SL number, use a vector: SL-T(Zone) = {"{2, 2, 0, 1, 3, 1, 3}"} representing the target
          security level for each FR individually.
        </p>
      </Card>
    </div>
  );
}
