import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { useLocationSearch } from '@/hooks/useLocationSearch';
import { useWeather } from '@/hooks/useWeather';
import type { Location } from '@/types/weather';
import searchIcon from '@/assets/images/icon-search.svg';
import loadingIcon from '@/assets/images/icon-loading.svg';

export function SearchBar() {
  const { query, setQuery, results, loading, error, clearResults } = useLocationSearch();
  const { loadWeatherData } = useWeather();
  const [showResults, setShowResults] = useState(false);

  const handleSelectLocation = (location: Location) => {
    loadWeatherData(location);
    setQuery('');
    clearResults();
    setShowResults(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setShowResults(true);
  };

  const handleInputFocus = () => {
    if (results.length > 0 || error) {
      setShowResults(true);
    }
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      <div className="relative">
        <img
          src={loading ? loadingIcon : searchIcon}
          alt=""
          className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${loading ? 'animate-spin' : ''}`}
          aria-hidden="true"
        />
        <Input
          type="text"
          placeholder="Search for a city, e.g., New York"
          value={query}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          className="pl-12 pr-4 py-3 text-base bg-neutral-0 border-neutral-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0"
          aria-label="Search for a city"
          aria-autocomplete="list"
          aria-expanded={showResults && results.length > 0}
          aria-controls="search-results"
          aria-haspopup="listbox"
        />
      </div>

      {showResults && error && (
        <div 
          className="absolute top-full left-0 right-0 mt-2 bg-neutral-0 border border-neutral-200 rounded-md shadow-lg z-50 p-4"
          role="alert"
        >
          <div className="text-sm text-neutral-600 text-center">{error}</div>
        </div>
      )}

      {showResults && results.length > 0 && (
        <div 
          id="search-results"
          className="absolute top-full left-0 right-0 mt-2 bg-neutral-0 border border-neutral-200 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto py-2"
          role="listbox"
        >
          {results.map((location) => (
            <button
              key={location.id}
              type="button"
              onClick={() => handleSelectLocation(location)}
              className="w-full text-left px-4 py-2 hover:bg-neutral-200 focus:bg-neutral-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset transition-colors"
              role="option"
              aria-selected="false"
            >
              <div className="font-medium">{location.name}</div>
              {location.admin1 && (
                <div className="text-sm text-neutral-600">
                  {location.admin1}, {location.country}
                </div>
              )}
              {!location.admin1 && location.country && (
                <div className="text-sm text-neutral-600">{location.country}</div>
              )}
            </button>
          ))}
        </div>
      )}

      {showResults && (results.length > 0 || error) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowResults(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
}
