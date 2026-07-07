import { jsPDF } from "jspdf";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { toast } from "sonner";

interface StudyGuideItem {
  sectionId: number;
  sectionTitle: string;
  topics: Array<{
    id: string;
    title: string;
    definition?: string;
    explanation?: string;
    keyPoints?: string[];
    tierCorrelations?: Record<string, string>;
  }>;
}

export function PDFExport({ bookmarkedItems }: { bookmarkedItems: StudyGuideItem[] }) {
  const generatePDF = async () => {
    if (bookmarkedItems.length === 0) {
      toast.error("No bookmarked items to export. Please bookmark some content first.");
      return;
    }

    try {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 15;
      const contentWidth = pageWidth - 2 * margin;
      let yPosition = margin;

      // Title page
      doc.setFontSize(24);
      doc.setTextColor(25, 71, 153); // Dark blue
      doc.text("IC32 Learning Platform", pageWidth / 2, yPosition + 40, { align: "center" });

      doc.setFontSize(16);
      doc.setTextColor(100, 100, 100);
      doc.text("ISA/IEC 62443 Standards", pageWidth / 2, yPosition + 60, { align: "center" });
      doc.text("Study Guide - Bookmarked Content", pageWidth / 2, yPosition + 75, { align: "center" });

      doc.setFontSize(12);
      doc.setTextColor(150, 150, 150);
      const generatedDate = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      doc.text(`Generated: ${generatedDate}`, pageWidth / 2, yPosition + 100, { align: "center" });

      // Add page break
      doc.addPage();
      yPosition = margin;

      // Table of Contents
      doc.setFontSize(16);
      doc.setTextColor(25, 71, 153);
      doc.text("Table of Contents", margin, yPosition);
      yPosition += 15;

      doc.setFontSize(11);
      doc.setTextColor(0, 0, 0);
      bookmarkedItems.forEach((item, index) => {
        const tocText = `${index + 1}. ${item.sectionTitle}`;
        doc.text(tocText, margin + 5, yPosition);
        yPosition += 8;
      });

      // Content sections
      bookmarkedItems.forEach((section, sectionIndex) => {
        // Add page break before each section
        doc.addPage();
        yPosition = margin;

        // Section title
        doc.setFontSize(14);
        doc.setTextColor(25, 71, 153);
        doc.text(`${sectionIndex + 1}. ${section.sectionTitle}`, margin, yPosition);
        yPosition += 12;

        // Section content
        section.topics.forEach((topic) => {
          // Topic title
          doc.setFontSize(12);
          doc.setTextColor(50, 50, 50);
          doc.text(topic.title, margin + 5, yPosition);
          yPosition += 8;

          // Definition
          if (topic.definition) {
            doc.setFontSize(10);
            doc.setTextColor(80, 80, 80);
            doc.setFont(undefined as any, "bold");
            doc.text("Definition:", margin + 10, yPosition);
            yPosition += 6;

            doc.setFont(undefined as any, "normal");
            const defLines = doc.splitTextToSize(topic.definition, contentWidth - 20);
            defLines.forEach((line: string) => {
              if (yPosition > pageHeight - margin) {
                doc.addPage();
                yPosition = margin;
              }
              doc.text(line, margin + 15, yPosition);
              yPosition += 6;
            });
            yPosition += 4;
          }

          // Explanation
          if (topic.explanation) {
            doc.setFontSize(10);
            doc.setTextColor(80, 80, 80);
            doc.setFont(undefined as any, "bold");
            doc.text("Explanation:", margin + 10, yPosition);
            yPosition += 6;

            doc.setFont(undefined as any, "normal");
            const expLines = doc.splitTextToSize(topic.explanation, contentWidth - 20);
            expLines.forEach((line: string) => {
              if (yPosition > pageHeight - margin) {
                doc.addPage();
                yPosition = margin;
              }
              doc.text(line, margin + 15, yPosition);
              yPosition += 6;
            });
            yPosition += 4;
          }

          // Key Points
          if (topic.keyPoints && topic.keyPoints.length > 0) {
            doc.setFontSize(10);
            doc.setTextColor(80, 80, 80);
            doc.setFont(undefined as any, "bold");
            doc.text("Key Points:", margin + 10, yPosition);
            yPosition += 6;

            doc.setFont(undefined as any, "normal");
            topic.keyPoints.forEach((point: string) => {
              if (yPosition > pageHeight - margin) {
                doc.addPage();
                yPosition = margin;
              }
              const pointLines = doc.splitTextToSize(`• ${point}`, contentWidth - 25);
              pointLines.forEach((line: string) => {
                doc.text(line, margin + 15, yPosition);
                yPosition += 5;
              });
            });
            yPosition += 4;
          }

          // Tier Correlations
          if (topic.tierCorrelations && Object.keys(topic.tierCorrelations).length > 0) {
            doc.setFontSize(10);
            doc.setTextColor(80, 80, 80);
            doc.setFont(undefined as any, "bold");
            doc.text("Tier Correlations:", margin + 10, yPosition);
            yPosition += 6;

            doc.setFont(undefined as any, "normal");
            Object.entries(topic.tierCorrelations).forEach(([tier, correlation]) => {
              if (yPosition > pageHeight - margin) {
                doc.addPage();
                yPosition = margin;
              }
              const tierText = `${tier}: ${correlation}`;
              const tierLines = doc.splitTextToSize(tierText, contentWidth - 25);
              tierLines.forEach((line: string) => {
                doc.text(line, margin + 15, yPosition);
                yPosition += 5;
              });
            });
            yPosition += 6;
          }

          // Add spacing between topics
          yPosition += 4;
        });
      });

      // Save the PDF
      doc.save("IC32_Study_Guide.pdf");
      toast.success("Study guide exported successfully!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to export study guide");
    }
  };

  return (
    <Button onClick={generatePDF} variant="outline" size="sm" className="gap-2">
      <Download className="w-4 h-4" />
      Export as PDF
    </Button>
  );
}
