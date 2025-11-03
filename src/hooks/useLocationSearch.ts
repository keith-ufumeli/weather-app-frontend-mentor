import { useState, useEffect, useCallback } from 'react';
import { searchLocations } from '@/services/weatherApi';
import type { Location } from '@/types/weather';

export function useLocationSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const locations = await searchLocations(searchQuery);
      setResults(locations);
      if (locations.length === 0) {
        setError('No results found');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Search failed';
      setError(errorMessage);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounce search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query) {
        search(query);
      } else {
        setResults([]);
        setError(null);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, search]);

  const clearResults = useCallback(() => {
    setResults([]);
    setError(null);
    setQuery('');
  }, []);

  return {
    query,
    setQuery,
    results,
    loading,
    error,
    clearResults,
  };
}
