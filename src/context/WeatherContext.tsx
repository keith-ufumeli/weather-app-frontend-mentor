import React, { createContext, useContext, useState, useCallback } from 'react';
import type { WeatherData, Location, Units, WeatherError } from '@/types/weather';
import { fetchWeatherData } from '@/services/weatherApi';

interface WeatherContextType {
  weatherData: WeatherData | null;
  units: Units;
  loading: boolean;
  error: WeatherError | null;
  setUnits: (units: Units) => void;
  loadWeatherData: (location: Location) => Promise<void>;
  clearError: () => void;
}

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

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

export function useWeather() {
  const context = useContext(WeatherContext);
  if (context === undefined) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }
  return context;
}
