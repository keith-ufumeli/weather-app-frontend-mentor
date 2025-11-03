import { useState, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useWeather } from '@/hooks/useWeather';
import unitsIcon from '@/assets/images/icon-units.svg';

const UNITS_STORAGE_KEY = 'weather-app-units';

interface UnitOption {
  value: 'metric' | 'imperial';
  label: string;
}

const temperatureOptions: UnitOption[] = [
  { value: 'metric', label: 'Celsius (°C)' },
  { value: 'imperial', label: 'Fahrenheit (°F)' },
];

const windSpeedOptions: UnitOption[] = [
  { value: 'metric', label: 'km/h' },
  { value: 'imperial', label: 'mph' },
];

const precipitationOptions: UnitOption[] = [
  { value: 'metric', label: 'Millimeters (mm)' },
  { value: 'imperial', label: 'Inches (in)' },
];

export function UnitsDropdown() {
  const { units, setUnits } = useWeather();
  const [hasSelectedUnits, setHasSelectedUnits] = useState(false);

  useEffect(() => {
    // Check if user has previously selected units
    const saved = localStorage.getItem(UNITS_STORAGE_KEY);
    setHasSelectedUnits(saved === 'imperial' || saved === 'metric');
  }, []);

  const handleUnitsChange = (newUnits: 'metric' | 'imperial') => {
    setUnits(newUnits);
    setHasSelectedUnits(true);
  };

  const displayText = hasSelectedUnits 
    ? (units === 'imperial' ? 'Imperial' : 'Metric')
    : 'Units';

  const oppositeUnits = units === 'metric' ? 'Imperial' : 'Metric';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger 
        className="flex items-center gap-2 px-4 py-2.5 rounded-md bg-neutral-800 hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-0 focus:ring-offset-2 focus:ring-offset-neutral-900 transition-colors text-neutral-0 border border-neutral-700"
        aria-label="Units selector"
      >
        <img src={unitsIcon} alt="" className="w-5 h-5" aria-hidden="true" />
        <span className="text-sm font-medium">
          {displayText}
        </span>
        <ChevronDown className="w-4 h-4" aria-hidden="true" />
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        align="end" 
        className="w-64 bg-neutral-800 border border-neutral-700 shadow-lg rounded-lg p-0 overflow-hidden"
      >
        {/* Switch Units Button */}
        <div className="p-4 pb-3">
          <button
            type="button"
            onClick={() => handleUnitsChange(units === 'metric' ? 'imperial' : 'metric')}
            className="w-full px-4 py-2.5 bg-neutral-700 hover:bg-neutral-600 rounded-lg text-sm font-medium text-neutral-0 transition-colors"
          >
            Switch to {oppositeUnits}
          </button>
        </div>

        {/* Temperature Section */}
        <div className="px-4 pb-3">
          <h3 className="text-xs font-semibold text-neutral-400 mb-2 uppercase tracking-wide">
            Temperature
          </h3>
          <div className="space-y-1">
            {temperatureOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleUnitsChange(option.value)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors ${
                  units === option.value
                    ? 'bg-neutral-700 text-neutral-0'
                    : 'text-neutral-200 hover:bg-neutral-700'
                }`}
              >
                <span>{option.label}</span>
                {units === option.value && (
                  <Check className="w-4 h-4 text-blue-500" aria-hidden="true" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Wind Speed Section */}
        <div className="px-4 pb-3">
          <h3 className="text-xs font-semibold text-neutral-400 mb-2 uppercase tracking-wide">
            Wind Speed
          </h3>
          <div className="space-y-1">
            {windSpeedOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleUnitsChange(option.value)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors ${
                  units === option.value
                    ? 'bg-neutral-700 text-neutral-0'
                    : 'text-neutral-200 hover:bg-neutral-700'
                }`}
              >
                <span>{option.label}</span>
                {units === option.value && (
                  <Check className="w-4 h-4 text-blue-500" aria-hidden="true" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Precipitation Section */}
        <div className="px-4 pb-4">
          <h3 className="text-xs font-semibold text-neutral-400 mb-2 uppercase tracking-wide">
            Precipitation
          </h3>
          <div className="space-y-1">
            {precipitationOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleUnitsChange(option.value)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors ${
                  units === option.value
                    ? 'bg-neutral-700 text-neutral-0'
                    : 'text-neutral-200 hover:bg-neutral-700'
                }`}
              >
                <span>{option.label}</span>
                {units === option.value && (
                  <Check className="w-4 h-4 text-blue-500" aria-hidden="true" />
                )}
              </button>
            ))}
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

