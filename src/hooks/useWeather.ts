import { useContext } from 'react';
import { WeatherContext } from '@/context/WeatherContext';
import type { WeatherContextType } from '@/context/WeatherContextProvider';

export function useWeather(): WeatherContextType {
  const context = useContext(WeatherContext);
  if (context === undefined) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }
  return context;
}
