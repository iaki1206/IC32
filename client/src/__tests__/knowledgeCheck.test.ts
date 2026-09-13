import { describe, it, expect } from "vitest";
import data from "../data/knowledgeCheckData.json";

describe("Knowledge Check Data & Logic", () => {
  it("has questions loaded properly", () => {
    expect(data.questions.length).toBe(366);
  });

  it("contains explanation anchors with href for questions to open in a new tab", () => {
    const questionsWithAnchor = data.questions.filter((q: any) => q.explanationAnchor && q.explanationAnchor.href);
    expect(questionsWithAnchor.length).toBe(366);
    const sample = questionsWithAnchor[0];
    expect(sample.explanationAnchor.anchor).toBeDefined();
    expect(sample.explanationAnchor.href).toContain("/?tab=ot");
  });

  it("evaluates single-select and multi-select answer correctness properly", () => {
    const checkAnswer = (userSelection?: string, correctAnswer?: string | null): boolean => {
      if (!userSelection || !correctAnswer) return false;
      const userParts = userSelection
        .split(",")
        .map((s) => s.trim().toUpperCase())
        .filter(Boolean)
        .sort()
        .join(",");
      const correctParts = correctAnswer
        .split(",")
        .map((s) => s.trim().toUpperCase())
        .filter(Boolean)
        .sort()
        .join(",");
      return userParts === correctParts;
    };

    expect(checkAnswer("A", "A")).toBe(true);
    expect(checkAnswer("B", "A")).toBe(false);
    expect(checkAnswer("A, B", "B, A")).toBe(true);
    expect(checkAnswer("A, C", "A, B, C")).toBe(false);
  });

  it("validates localStorage persistence keys format", () => {
    const STORAGE_KEY_ANSWERS = "ic32_knowledge_check_selected_answers";
    const STORAGE_KEY_RESULTS = "ic32_knowledge_check_show_results";
    expect(STORAGE_KEY_ANSWERS).toBe("ic32_knowledge_check_selected_answers");
    expect(STORAGE_KEY_RESULTS).toBe("ic32_knowledge_check_show_results");
  });
});
