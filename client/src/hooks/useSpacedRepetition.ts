import { useState, useEffect } from "react";

interface RepetitionCard {
  id: string;
  sectionId: number;
  topicId: string;
  title: string;
  content: string;
  box: number; // 0-4 (Leitner system boxes)
  lastReviewedAt: number;
  nextReviewAt: number;
  reviewCount: number;
  easeFactor: number; // SM-2 algorithm
  interval: number; // days
}

interface RepetitionStats {
  totalCards: number;
  reviewedToday: number;
  dueToday: number;
  averageEase: number;
}

const STORAGE_KEY = "ic32-spaced-repetition";

// Leitner system intervals (in days)
const LEITNER_INTERVALS = [1, 3, 7, 14, 30];

// SM-2 algorithm parameters
const DEFAULT_EASE_FACTOR = 2.5;
const MIN_EASE_FACTOR = 1.3;

export function useSpacedRepetition() {
  const [cards, setCards] = useState<Record<string, RepetitionCard>>({});
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cards from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setCards(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Failed to load spaced repetition cards:", error);
    }
    setIsLoaded(true);
  }, []);

  // Save cards to localStorage
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
      } catch (error) {
        console.error("Failed to save spaced repetition cards:", error);
      }
    }
  }, [cards, isLoaded]);

  // Add a new card to the system
  const addCard = (item: Omit<RepetitionCard, "box" | "lastReviewedAt" | "nextReviewAt" | "reviewCount" | "easeFactor" | "interval">) => {
    const newCard: RepetitionCard = {
      ...item,
      box: 0,
      lastReviewedAt: Date.now(),
      nextReviewAt: Date.now() + 24 * 60 * 60 * 1000, // Review tomorrow
      reviewCount: 0,
      easeFactor: DEFAULT_EASE_FACTOR,
      interval: 1,
    };

    setCards((prev) => ({
      ...prev,
      [item.id]: newCard,
    }));
  };

  // Record a review using SM-2 algorithm
  const recordReview = (cardId: string, quality: number) => {
    // quality: 0-5 (0=complete blackout, 5=perfect response)
    setCards((prev) => {
      const card = prev[cardId];
      if (!card) return prev;

      let newBox = card.box;
      let newInterval = card.interval;
      let newEaseFactor = card.easeFactor;

      // SM-2 algorithm
      newEaseFactor = Math.max(
        MIN_EASE_FACTOR,
        card.easeFactor + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)
      );

      if (quality < 3) {
        // Incorrect - reset to box 0
        newBox = 0;
        newInterval = 1;
      } else {
        // Correct - move to next box
        newBox = Math.min(card.box + 1, 4);
        newInterval = LEITNER_INTERVALS[newBox];
      }

      const updatedCard: RepetitionCard = {
        ...card,
        box: newBox,
        lastReviewedAt: Date.now(),
        nextReviewAt: Date.now() + newInterval * 24 * 60 * 60 * 1000,
        reviewCount: card.reviewCount + 1,
        easeFactor: newEaseFactor,
        interval: newInterval,
      };

      return {
        ...prev,
        [cardId]: updatedCard,
      };
    });
  };

  // Get cards due for review today
  const getCardsDueToday = (): RepetitionCard[] => {
    const now = Date.now();
    return Object.values(cards).filter((card) => card.nextReviewAt <= now);
  };

  // Get recommended cards for review (spaced repetition algorithm)
  const getRecommendedCards = (limit: number = 10): RepetitionCard[] => {
    const now = Date.now();
    const allCards = Object.values(cards);

    // Sort by priority: due cards first, then by ease factor (harder cards first)
    return allCards
      .sort((a, b) => {
        // Cards due for review come first
        const aDue = a.nextReviewAt <= now ? 0 : 1;
        const bDue = b.nextReviewAt <= now ? 0 : 1;

        if (aDue !== bDue) return aDue - bDue;

        // Among due cards, prioritise by box (lower box = more important)
        if (a.nextReviewAt <= now && b.nextReviewAt <= now) {
          return a.box - b.box;
        }

        // Among non-due cards, show those closest to being due
        return a.nextReviewAt - b.nextReviewAt;
      })
      .slice(0, limit);
  };

  // Get statistics
  const getStats = (): RepetitionStats => {
    const now = Date.now();
    const allCards = Object.values(cards);
    const reviewedToday = allCards.filter(
      (card) => card.lastReviewedAt > now - 24 * 60 * 60 * 1000
    ).length;
    const dueToday = allCards.filter((card) => card.nextReviewAt <= now).length;
    const averageEase =
      allCards.length > 0
        ? allCards.reduce((sum, card) => sum + card.easeFactor, 0) / allCards.length
        : 0;

    return {
      totalCards: allCards.length,
      reviewedToday,
      dueToday,
      averageEase: Math.round(averageEase * 100) / 100,
    };
  };

  // Get cards by section for targeted review
  const getCardsBySection = (sectionId: number): RepetitionCard[] => {
    return Object.values(cards).filter((card) => card.sectionId === sectionId);
  };

  // Reset a card to initial state
  const resetCard = (cardId: string) => {
    setCards((prev) => {
      const card = prev[cardId];
      if (!card) return prev;

      return {
        ...prev,
        [cardId]: {
          ...card,
          box: 0,
          lastReviewedAt: Date.now(),
          nextReviewAt: Date.now() + 24 * 60 * 60 * 1000,
          reviewCount: 0,
          easeFactor: DEFAULT_EASE_FACTOR,
          interval: 1,
        },
      };
    });
  };

  // Clear all cards
  const clearAllCards = () => {
    setCards({});
  };

  return {
    cards,
    addCard,
    recordReview,
    getCardsDueToday,
    getRecommendedCards,
    getStats,
    getCardsBySection,
    resetCard,
    clearAllCards,
  };
}
