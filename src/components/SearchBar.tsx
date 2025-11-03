import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
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

  const handleSearchClick = () => {
    if (results.length > 0) {
      handleSelectLocation(results[0]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && results.length > 0) {
      handleSelectLocation(results[0]);
    }
  };

  return (
    <div className="relative w-full max-w-lg mx-auto">
      <div className="relative flex flex-col md:flex-row gap-2">
        <div className="relative flex-1">
          <img
            src={loading ? loadingIcon : searchIcon}
            alt=""
            className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${loading ? 'animate-spin' : ''}`}
            aria-hidden="true"
          />
          <Input
            type="text"
            placeholder="Search for a place..."
            value={query}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onKeyDown={handleKeyDown}
            className="pl-12 pr-4 py-3 text-base bg-neutral-800 border-neutral-700 text-neutral-0 placeholder:text-neutral-400 focus:border-neutral-0 focus:ring-2 focus:ring-neutral-0 focus:ring-offset-0 rounded-md"
            aria-label="Search for a city"
            title="Search for a city"
            aria-autocomplete="list"
            aria-expanded={showResults && results.length > 0}
            aria-controls="search-results"
            aria-haspopup="listbox"
          />
        </div>
        <Button
          onClick={handleSearchClick}
          disabled={loading || results.length === 0}
          className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-neutral-0 font-medium rounded-md disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-neutral-0 focus:ring-offset-2 focus:ring-offset-neutral-900"
        >
          Search
        </Button>
      </div>

      {showResults && error && (
        <div 
          className="absolute top-full left-0 right-0 mt-2 bg-neutral-800 border border-neutral-700 rounded-md shadow-lg z-50 p-4"
          role="alert"
        >
          <div className="text-sm text-neutral-300 text-center">{error}</div>
        </div>
      )}

      {showResults && results.length > 0 && (
        <div 
          id="search-results"
          className="absolute top-full left-0 right-0 mt-2 bg-neutral-800 border border-neutral-700 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto custom-scrollbar py-2"
          role="listbox"
          aria-label="Search results"
        >
          {results.map((location) => (
            <button
              key={location.id}
              type="button"
              onClick={() => handleSelectLocation(location)}
              className="w-full text-left px-4 py-2 hover:bg-neutral-700 focus:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-0 focus:ring-inset transition-colors"
              role="option"
              aria-selected="false"
            >
              <div className="font-medium text-neutral-0">{location.name}</div>
              {location.admin1 && (
                <div className="text-sm text-neutral-300">
                  {location.admin1}, {location.country}
                </div>
              )}
              {!location.admin1 && location.country && (
                <div className="text-sm text-neutral-300">{location.country}</div>
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
