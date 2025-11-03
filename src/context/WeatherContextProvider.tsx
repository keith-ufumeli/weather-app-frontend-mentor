import React, { useState, useCallback, useEffect, useRef } from 'react';
import type { WeatherData, Location, Units, WeatherError } from '@/types/weather';
import { fetchWeatherData, getLocationFromCoordinates, DEFAULT_LOCATION } from '@/services/weatherApi';
import { useGeolocation } from '@/hooks/useGeolocation';
import { WeatherContext } from './WeatherContext';

export interface WeatherContextType {
  weatherData: WeatherData | null;
  units: Units;
  loading: boolean;
  error: WeatherError | null;
  setUnits: (units: Units) => void;
  loadWeatherData: (location: Location) => Promise<void>;
  clearError: () => void;
}

const UNITS_STORAGE_KEY = 'weather-app-units';

export function WeatherProvider({ children }: { children: React.ReactNode }) {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [units, setUnitsState] = useState<Units>(() => {
    // Load from localStorage or default to metric
    const saved = localStorage.getItem(UNITS_STORAGE_KEY);
    return (saved === 'imperial' || saved === 'metric') ? saved : 'metric';
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<WeatherError | null>(null);
  const hasInitializedRef = useRef(false);

  const loadWeatherData = useCallback(async (
    location: Location,
    unitsOverride?: Units
  ) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await fetchWeatherData(location, unitsOverride || units);
      setWeatherData(data);
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Failed to load weather data';
      setError({ message: errorMessage });
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  }, [units]);

  // Persist units preference
  const setUnits = useCallback((newUnits: Units) => {
    setUnitsState(newUnits);
    localStorage.setItem(UNITS_STORAGE_KEY, newUnits);
    // Reload weather data if we have a location
    if (weatherData?.location) {
      loadWeatherData(weatherData.location, newUnits);
    }
  }, [weatherData?.location, loadWeatherData]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Auto-load weather on initial mount
  const { coordinates, loading: geolocationLoading, error: geolocationError } = useGeolocation();

  useEffect(() => {
    // Only run once on initial mount when weatherData is null
    if (hasInitializedRef.current || weatherData !== null) {
      return;
    }

    // Wait for geolocation to finish (loading or error)
    if (geolocationLoading) {
      setLoading(true);
      return;
    }

    // Mark as initialized to prevent re-running
    hasInitializedRef.current = true;

    const initializeWeather = async () => {
      try {
        let locationToLoad: Location;

        if (coordinates) {
          // User granted geolocation permission and we have coordinates
          try {
            locationToLoad = await getLocationFromCoordinates(
              coordinates.latitude,
              coordinates.longitude
            );
          } catch {
            // If reverse geocoding fails, use default location
            console.warn('Reverse geocoding failed, using default location');
            locationToLoad = DEFAULT_LOCATION;
          }
        } else {
          // Geolocation denied, unavailable, or error - use default location
          locationToLoad = DEFAULT_LOCATION;
        }

        await loadWeatherData(locationToLoad);
      } catch (err) {
        // Error already handled in loadWeatherData
        console.error('Failed to initialize weather:', err);
      }
    };

    initializeWeather();
  }, [coordinates, geolocationLoading, geolocationError, weatherData, loadWeatherData]);

  return (
    <WeatherContext.Provider
      value={{
        weatherData,
        units,
        loading,
        error,
        setUnits,
        loadWeatherData,
        clearError,
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
}
