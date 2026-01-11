import { useState, useEffect } from "react";
import { movieAPI } from "../services/tmdb";

/**
 * Hook for fetching search suggestions as user types
 */
export const useSearchSuggestions = (query, enabled = true) => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Debounce the search
    const timeoutId = setTimeout(() => {
      if (!enabled || !query || query.trim().length < 2) {
        setSuggestions([]);
        setLoading(false);
        return;
      }

      const fetchSuggestions = async () => {
        try {
          setLoading(true);
          const data = await movieAPI.searchMovies(query.trim(), 1);
          // Limit to 8 suggestions for autocomplete
          const limitedResults = (data.results || []).slice(0, 8);
          setSuggestions(limitedResults);
        } catch (err) {
          console.error("Error fetching suggestions:", err);
          setSuggestions([]);
        } finally {
          setLoading(false);
        }
      };

      fetchSuggestions();
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [query, enabled]);

  return { suggestions, loading };
};
