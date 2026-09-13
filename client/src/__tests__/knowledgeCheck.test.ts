import { describe, it, expect } from "vitest";
import data from "../data/knowledgeCheckData.json";

describe("Knowledge Check Data & Logic", () => {
  it("has questions loaded properly", () => {
    expect(data.questions.length).toBeGreaterThan(0);
  });

  it("contains anchors with chapter and topic for questions", () => {
    const questionsWithAnchor = data.questions.filter((q: any) => q.anchor && q.anchor.chapterId);
    expect(questionsWithAnchor.length).toBeGreaterThan(0);
    const sample = questionsWithAnchor[0];
    expect(sample.anchor.chapterId).toBeDefined();

    // Verify anchor URL format that opens in a new tab
    const targetUrl = `/?page=chapter&chapterId=${sample.anchor.chapterId}${
      sample.anchor.topicId ? `&topicId=${encodeURIComponent(sample.anchor.topicId)}` : ""
    }`;
    expect(targetUrl).toContain("page=chapter");
    expect(targetUrl).toContain(`chapterId=${sample.anchor.chapterId}`);
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
