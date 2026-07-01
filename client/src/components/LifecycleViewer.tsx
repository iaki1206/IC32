import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, CheckCircle2 } from "lucide-react";

interface LifecycleViewerProps {}

export default function LifecycleViewer({}: LifecycleViewerProps) {
  const phases = [
    {
      id: 1,
      name: "Assess",
      color: "#fef3c7",
      textColor: "#b45309",
      description: "Gather information where cybersecurity improvements are needed",
      activities: [
        "Evaluate existing security controls",
        "Identify high-level risks",
        "Discover potential vulnerabilities",
        "Understand current risk landscape",
      ],
      output: "Risk Assessment Report",
    },
    {
      id: 2,
      name: "Develop & Implement",
      color: "#dbeafe",
      textColor: "#1e40af",
      description: "Deploy protective measures and ensure system security",
      activities: [
        "Design security architecture",
        "Implement countermeasures",
        "Configure systems",
        "Integrate security controls",
      ],
      output: "Implemented Security Measures",
    },
    {
      id: 3,
      name: "Maintain",
      color: "#dcfce7",
      textColor: "#15803d",
      description: "Monitor and upgrade security measures continuously",
      activities: [
        "Audit countermeasures",
        "Test security controls",
        "Apply patches and updates",
        "Maintain compliance",
      ],
      output: "Maintained Security Posture",
    },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-2">IACS Cybersecurity Lifecycle</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Three continuous phases ensuring SL-A (Achieved) ≥ SL-T (Target)
        </p>
      </div>

      {/* Lifecycle Flow */}
      <div className="space-y-3">
        {phases.map((phase, idx) => (
          <div key={phase.id}>
            <Card
              className="p-4 border-l-4"
              style={{
                backgroundColor: phase.color,
                borderLeftColor: phase.textColor,
              }}
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-white"
                  style={{ backgroundColor: phase.textColor }}
                >
                  {phase.id}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-lg" style={{ color: phase.textColor }}>
                    {phase.name}
                  </p>
                  <p className="text-sm text-foreground mt-1">{phase.description}</p>

                  {/* Activities */}
                  <div className="mt-3 space-y-1">
                    {phase.activities.map((activity, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-foreground">
                        <CheckCircle2 size={14} style={{ color: phase.textColor }} />
                        {activity}
                      </div>
                    ))}
                  </div>

                  {/* Output */}
                  <div className="mt-3 pt-3 border-t border-gray-300">
                    <Badge
                      variant="secondary"
                      className="text-xs"
                      style={{
                        backgroundColor: phase.textColor + "20",
                        color: phase.textColor,
                        borderColor: phase.textColor,
                      }}
                    >
                      Output: {phase.output}
                    </Badge>
                  </div>
                </div>
              </div>
            </Card>

            {/* Arrow between phases */}
            {idx < phases.length - 1 && (
              <div className="flex justify-center py-2">
                <ArrowRight size={24} className="text-muted-foreground rotate-90" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Continuous Loop */}
      <Card className="p-4 bg-primary/5 border-primary/30">
        <p className="text-sm text-foreground">
          <span className="font-semibold">Continuous Process:</span> The lifecycle is not linear but
          continuous. After the Maintain phase, the cycle returns to Assess to identify new risks and
          improvements. This ensures that SL-A (Achieved Security Level) remains ≥ SL-T (Target
          Security Level) at all times.
        </p>
      </Card>

      {/* Key Roles */}
      <div className="pt-4 border-t border-border">
        <h4 className="text-sm font-semibold text-foreground mb-3">Key Stakeholders</h4>
        <div className="grid grid-cols-2 gap-3">
          {[
            { role: "Asset Owner", responsibility: "Responsible for IACS and its cybersecurity" },
            { role: "Integration Provider", responsibility: "Design and implement security measures" },
            { role: "Maintenance Provider", responsibility: "Provide scheduled maintenance services" },
            { role: "Product Supplier", responsibility: "Develop and manufacture components" },
          ].map((stakeholder, idx) => (
            <Card key={idx} className="p-3 bg-secondary/50">
              <p className="font-semibold text-sm text-foreground">{stakeholder.role}</p>
              <p className="text-xs text-muted-foreground mt-1">{stakeholder.responsibility}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
