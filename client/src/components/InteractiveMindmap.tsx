import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

interface MindmapNode {
  id: string;
  label: string;
  color: string;
  children?: MindmapNode[];
  description?: string;
}

interface InteractiveMindmapProps {
  title: string;
  rootNode: MindmapNode;
  onNodeClick?: (nodeId: string) => void;
}

export default function InteractiveMindmap({
  title,
  rootNode,
  onNodeClick,
}: InteractiveMindmapProps) {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set([rootNode.id]));
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const toggleNode = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  const handleNodeClick = (nodeId: string) => {
    setSelectedNode(nodeId);
    onNodeClick?.(nodeId);
  };

  const renderNode = (node: MindmapNode, level: number = 0) => {
    const isExpanded = expandedNodes.has(node.id);
    const hasChildren = node.children && node.children.length > 0;
    const isSelected = selectedNode === node.id;

    return (
      <div key={node.id} className="mb-2">
        <div
          className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all ${
            isSelected
              ? `${node.color} text-white shadow-lg scale-105`
              : `${node.color} hover:shadow-md`
          }`}
          style={{ marginLeft: `${level * 1.5}rem` }}
          onClick={() => handleNodeClick(node.id)}
        >
          {hasChildren && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleNode(node.id);
              }}
              className="flex-shrink-0 w-5 h-5 flex items-center justify-center bg-white/30 rounded hover:bg-white/50 transition-colors"
            >
              <span className="text-xs font-bold">{isExpanded ? "−" : "+"}</span>
            </button>
          )}
          {!hasChildren && <div className="w-5" />}
          <span className="font-semibold text-sm flex-1">{node.label}</span>
          {node.children && (
            <Badge variant="secondary" className="text-xs">
              {node.children.length}
            </Badge>
          )}
        </div>

        {isExpanded && hasChildren && node.children && (
          <div className="mt-1">
            {node.children.map((child) => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto">
        {renderNode(rootNode)}
      </CardContent>
    </Card>
  );
}

// Helper function to create Purdue Model mindmap
export function createPurdueModelMindmap() {
  return {
    id: "purdue-root",
    label: "Purdue Reference Model",
    color: "bg-blue-600",
    children: [
      {
        id: "level0",
        label: "Level 0: Process",
        color: "bg-blue-500",
        description: "Physical equipment and processes",
        children: [
          {
            id: "level0-sensors",
            label: "Sensors & Actuators",
            color: "bg-blue-400",
          },
          {
            id: "level0-equipment",
            label: "Motors & Valves",
            color: "bg-blue-400",
          },
        ],
      },
      {
        id: "level1",
        label: "Level 1: Basic Control",
        color: "bg-indigo-500",
        description: "Local controllers",
        children: [
          {
            id: "level1-plc",
            label: "PLCs",
            color: "bg-indigo-400",
          },
          {
            id: "level1-rtu",
            label: "RTUs",
            color: "bg-indigo-400",
          },
          {
            id: "level1-dcs",
            label: "DCS Modules",
            color: "bg-indigo-400",
          },
        ],
      },
      {
        id: "level2",
        label: "Level 2: Supervisory",
        color: "bg-purple-500",
        description: "SCADA & Monitoring",
        children: [
          {
            id: "level2-scada",
            label: "SCADA Systems",
            color: "bg-purple-400",
          },
          {
            id: "level2-hmi",
            label: "HMI Interfaces",
            color: "bg-purple-400",
          },
          {
            id: "level2-historian",
            label: "Data Historians",
            color: "bg-purple-400",
          },
        ],
      },
      {
        id: "level3",
        label: "Level 3: Operations",
        color: "bg-pink-500",
        description: "Management Systems",
        children: [
          {
            id: "level3-security",
            label: "Security Management",
            color: "bg-pink-400",
          },
          {
            id: "level3-patch",
            label: "Patch Management",
            color: "bg-pink-400",
          },
          {
            id: "level3-asset",
            label: "Asset Management",
            color: "bg-pink-400",
          },
        ],
      },
      {
        id: "level4",
        label: "Level 4: Enterprise",
        color: "bg-red-500",
        description: "Business Systems",
        children: [
          {
            id: "level4-erp",
            label: "ERP Systems",
            color: "bg-red-400",
          },
          {
            id: "level4-business",
            label: "Business Intelligence",
            color: "bg-red-400",
          },
          {
            id: "level4-corporate",
            label: "Corporate Network",
            color: "bg-red-400",
          },
        ],
      },
    ],
  };
}

// Helper function to create Security Levels mindmap
export function createSecurityLevelsMindmap() {
  return {
    id: "sl-root",
    label: "Security Levels (SL 0-4)",
    color: "bg-orange-600",
    children: [
      {
        id: "sl0",
        label: "SL 0: No Protection",
        color: "bg-gray-400",
        children: [
          {
            id: "sl0-isolated",
            label: "Isolated Systems",
            color: "bg-gray-300",
          },
        ],
      },
      {
        id: "sl1",
        label: "SL 1: Basic Protection",
        color: "bg-yellow-400",
        children: [
          {
            id: "sl1-auth",
            label: "Basic Authentication",
            color: "bg-yellow-300",
          },
          {
            id: "sl1-firewall",
            label: "Simple Firewalls",
            color: "bg-yellow-300",
          },
        ],
      },
      {
        id: "sl2",
        label: "SL 2: Intentional Violation",
        color: "bg-orange-400",
        children: [
          {
            id: "sl2-mfa",
            label: "Multi-Factor Auth",
            color: "bg-orange-300",
          },
          {
            id: "sl2-segmentation",
            label: "Network Segmentation",
            color: "bg-orange-300",
          },
          {
            id: "sl2-encryption",
            label: "Encryption",
            color: "bg-orange-300",
          },
        ],
      },
      {
        id: "sl3",
        label: "SL 3: Advanced Threats",
        color: "bg-red-500",
        children: [
          {
            id: "sl3-ids",
            label: "Intrusion Detection",
            color: "bg-red-400",
          },
          {
            id: "sl3-soc",
            label: "24/7 Monitoring",
            color: "bg-red-400",
          },
          {
            id: "sl3-pentest",
            label: "Penetration Testing",
            color: "bg-red-400",
          },
        ],
      },
      {
        id: "sl4",
        label: "SL 4: Maximum Protection",
        color: "bg-red-700",
        children: [
          {
            id: "sl4-military",
            label: "Military-Grade Security",
            color: "bg-red-600",
          },
          {
            id: "sl4-automated",
            label: "Automated Response",
            color: "bg-red-600",
          },
          {
            id: "sl4-redundant",
            label: "Redundant Systems",
            color: "bg-red-600",
          },
        ],
      },
    ],
  };
}

// Helper function to create FR mindmap
export function createFoundationalRequirementsMindmap() {
  return {
    id: "fr-root",
    label: "7 Foundational Requirements",
    color: "bg-green-600",
    children: [
      {
        id: "fr1",
        label: "FR1: Identification & Authentication",
        color: "bg-green-500",
        children: [
          { id: "fr1-username", label: "Username/Password", color: "bg-green-400" },
          { id: "fr1-mfa", label: "Multi-Factor Auth", color: "bg-green-400" },
          { id: "fr1-biometric", label: "Biometric Auth", color: "bg-green-400" },
        ],
      },
      {
        id: "fr2",
        label: "FR2: Use Control",
        color: "bg-teal-500",
        children: [
          { id: "fr2-rbac", label: "Role-Based Access", color: "bg-teal-400" },
          { id: "fr2-permissions", label: "Permission Limits", color: "bg-teal-400" },
        ],
      },
      {
        id: "fr3",
        label: "FR3: System Integrity",
        color: "bg-cyan-500",
        children: [
          { id: "fr3-signatures", label: "Digital Signatures", color: "bg-cyan-400" },
          { id: "fr3-checksums", label: "File Integrity", color: "bg-cyan-400" },
        ],
      },
      {
        id: "fr4",
        label: "FR4: Data Confidentiality",
        color: "bg-blue-500",
        children: [
          { id: "fr4-encryption", label: "Data Encryption", color: "bg-blue-400" },
          { id: "fr4-access", label: "Access Restrictions", color: "bg-blue-400" },
        ],
      },
      {
        id: "fr5",
        label: "FR5: Restrict Data Flow",
        color: "bg-indigo-500",
        children: [
          { id: "fr5-firewall", label: "Firewalls", color: "bg-indigo-400" },
          { id: "fr5-zones", label: "Network Zones", color: "bg-indigo-400" },
        ],
      },
      {
        id: "fr6",
        label: "FR6: Timely Response",
        color: "bg-purple-500",
        children: [
          { id: "fr6-ids", label: "Intrusion Detection", color: "bg-purple-400" },
          { id: "fr6-monitoring", label: "24/7 Monitoring", color: "bg-purple-400" },
        ],
      },
      {
        id: "fr7",
        label: "FR7: Resource Availability",
        color: "bg-pink-500",
        children: [
          { id: "fr7-redundancy", label: "Redundant Systems", color: "bg-pink-400" },
          { id: "fr7-ddos", label: "DDoS Protection", color: "bg-pink-400" },
        ],
      },
    ],
  };
}
