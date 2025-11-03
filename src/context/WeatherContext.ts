import { createContext } from 'react';
import type { WeatherContextType } from './WeatherContextProvider';

// This file only contains the context creation for Fast Refresh compatibility
// It imports the type from WeatherContextProvider (no circular dependency since it's a type-only import)
export const WeatherContext = createContext<WeatherContextType | undefined>(undefined);
