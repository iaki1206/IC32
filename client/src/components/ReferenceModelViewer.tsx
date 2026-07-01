import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

interface Level {
  id: number;
  name: string;
  description: string;
  systems: string;
  color: string;
}

interface ReferenceModelViewerProps {
  levels: Level[];
}

export default function ReferenceModelViewer({ levels }: ReferenceModelViewerProps) {
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);

  // Reverse to show from top (Level 4) to bottom (Level 0)
  const sortedLevels = [...levels].reverse();

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-2">Purdue Reference Model</h3>
        <p className="text-sm text-muted-foreground mb-4">
          ISA/IEC 62443 defines five hierarchical levels from Enterprise to Process
        </p>
      </div>

      {/* Visual Model */}
      <div className="space-y-2">
        {sortedLevels.map((level) => (
          <div
            key={level.id}
            className="cursor-pointer transition-all"
            onClick={() => setSelectedLevel(selectedLevel === level.id ? null : level.id)}
          >
            <div
              className="p-4 rounded-lg text-white font-semibold transition-all hover:shadow-lg"
              style={{
                backgroundColor: level.color,
                opacity: selectedLevel === null || selectedLevel === level.id ? 1 : 0.5,
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Level {level.id}</p>
                  <p className="text-lg font-bold">{level.name}</p>
                </div>
                <Badge variant="secondary" className="text-xs">
                  Click for details
                </Badge>
              </div>
            </div>

            {/* Expanded Details */}
            {selectedLevel === level.id && (
              <Card className="p-4 mt-2 border-l-4" style={{ borderLeftColor: level.color }}>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase">Purpose</p>
                    <p className="text-sm text-foreground">{level.description}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase">Systems</p>
                    <p className="text-sm text-foreground">{level.systems}</p>
                  </div>
                </div>
              </Card>
            )}
          </div>
        ))}
      </div>

      {/* Key Principle */}
      <Card className="p-4 bg-primary/5 border-primary/30">
        <p className="text-sm text-foreground">
          <span className="font-semibold">Key Principle:</span> Each level builds upon the previous,
          working together in a layered approach to security, with lower levels protecting physical
          systems and higher levels managing and integrating broader operational and enterprise
          security.
        </p>
      </Card>
    </div>
  );
}
