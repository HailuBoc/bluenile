"use client";

import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://bluenile.onrender.com";

// Cache for static cards to support offline mode
const staticCardsCache = {};

/**
 * Hook to fetch and merge static cards with dynamic cards
 * @param {string} cardType - Type of card ('product', 'house', 'car', 'carsale', 'tourism', 'specialoffer')
 * @param {Function} fetchDynamicFn - Function to fetch dynamic cards
 * @returns {Object} { data, loading, error, refetch }
 */
export function useCardsWithStatic(cardType, fetchDynamicFn) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOffline, setIsOffline] = useState(false);

  const fetchCards = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      let staticCards = [];
      let dynamicCards = [];

      // Try to fetch static cards (from cache if offline)
      try {
        const res = await axios.get(`${BASE_URL}/api/static-cards/public`, {
          params: { cardType },
          timeout: 5000,
        });
        staticCards = res.data.cards || [];
        // Update cache
        staticCardsCache[cardType] = staticCards;
      } catch (staticErr) {
        console.warn("Failed to fetch static cards, using cache:", staticErr);
        // Use cached static cards if available
        if (staticCardsCache[cardType]) {
          staticCards = staticCardsCache[cardType];
        }
      }

      // Try to fetch dynamic cards
      try {
        dynamicCards = await fetchDynamicFn();
      } catch (dynamicErr) {
        console.warn("Failed to fetch dynamic cards:", dynamicErr);
        setIsOffline(true);
      }

      // Merge cards: static first (sorted by priority), then dynamic
      // Filter out static cards that have linkedPropertyId duplicates
      const staticCardsWithoutDuplicates = staticCards.filter(
        (staticCard) =>
          !staticCard.linkedPropertyId ||
          !dynamicCards.some(
            (dynamicCard) =>
              dynamicCard._id?.toString() ===
              staticCard.linkedPropertyId?.toString()
          )
      );

      // Sort static cards by priority (high to low), then by display order
      const sortedStaticCards = staticCardsWithoutDuplicates.sort(
        (a, b) => {
          if (b.priority !== a.priority) {
            return b.priority - a.priority;
          }
          return a.displayOrder - b.displayOrder;
        }
      );

      // Combine: static cards first, then dynamic
      const combined = [...sortedStaticCards, ...dynamicCards];

      setData(combined);
    } catch (err) {
      console.error("Error fetching cards:", err);
      setError(err);
      // Fallback to cache only
      if (staticCardsCache[cardType]) {
        setData(staticCardsCache[cardType]);
      }
    } finally {
      setLoading(false);
    }
  }, [cardType, fetchDynamicFn]);

  useEffect(() => {
    fetchCards();
  }, [fetchCards]);

  return {
    data,
    loading,
    error,
    isOffline,
    refetch: fetchCards,
  };
}

/**
 * Get static cards from cache (for offline use)
 * @param {string} cardType
 * @returns {Array} Cached static cards
 */
export function getCachedStaticCards(cardType) {
  return staticCardsCache[cardType] || [];
}

/**
 * Prefetch static cards for offline support
 * @param {string} cardType
 */
export async function prefetchStaticCards(cardType) {
  try {
    const res = await axios.get(`${BASE_URL}/api/static-cards/public`, {
      params: { cardType },
      timeout: 5000,
    });
    staticCardsCache[cardType] = res.data.cards || [];
  } catch (err) {
    console.warn(`Failed to prefetch ${cardType} cards:`, err);
  }
}

/**
 * Clear static cards cache
 */
export function clearStaticCardsCache() {
  Object.keys(staticCardsCache).forEach((key) => {
    delete staticCardsCache[key];
  });
}
