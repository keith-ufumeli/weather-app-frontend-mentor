import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SearchBar } from '@/components/SearchBar';
import { useWeather } from '@/hooks/useWeather';
import logoIcon from '@/assets/images/logo.svg';
import unitsIcon from '@/assets/images/icon-units.svg';
import checkmarkIcon from '@/assets/images/icon-checkmark.svg';

const UNITS_STORAGE_KEY = 'weather-app-units';

export function Header() {
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

  return (
    <header className="bg-neutral-900">
      <div className="container mx-auto px-4 md:px-6 py-6 max-w-7xl">
        {/* Top row: Logo and Units */}
        <div className="flex items-center justify-between mb-6">
          <img 
            src={logoIcon} 
            alt="Weather App Logo" 
            className="h-8"
          />
          
          <DropdownMenu>
            <DropdownMenuTrigger 
              className="flex items-center gap-2 px-4 py-2.5 rounded-md bg-neutral-800 hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors text-neutral-0 border border-neutral-700"
              aria-label="Units selector"
            >
              <img src={unitsIcon} alt="" className="w-5 h-5" aria-hidden="true" />
              <span className="text-sm font-medium">
                {displayText}
              </span>
              <ChevronDown className="w-4 h-4" aria-hidden="true" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem
                onClick={() => handleUnitsChange('metric')}
                className="flex items-center justify-between cursor-pointer"
              >
                <div>
                  <div className="font-medium">Metric</div>
                  <div className="text-xs text-neutral-600">
                    Celsius (°C), km/h, mm
                  </div>
                </div>
                {units === 'metric' && (
                  <img src={checkmarkIcon} alt="" className="w-4 h-4" aria-hidden="true" />
                )}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleUnitsChange('imperial')}
                className="flex items-center justify-between cursor-pointer"
              >
                <div>
                  <div className="font-medium">Imperial</div>
                  <div className="text-xs text-neutral-600">
                    Fahrenheit (°F), mph, in
                  </div>
                </div>
                {units === 'imperial' && (
                  <img src={checkmarkIcon} alt="" className="w-4 h-4" aria-hidden="true" />
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Main heading */}
        <h1 className="text-3xl md:text-4xl font-bold text-neutral-0 text-center mb-6 font-display">
          How's the sky looking today?
        </h1>

        {/* Search bar centered */}
        <div className="flex justify-center">
          <SearchBar />
        </div>
      </div>
    </header>
  );
}
