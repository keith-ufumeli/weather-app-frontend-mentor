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

export function Header() {
  const { units, setUnits } = useWeather();

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
              className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors text-neutral-0"
              aria-label="Units selector"
            >
              <img src={unitsIcon} alt="" className="w-5 h-5" aria-hidden="true" />
              <span className="text-sm font-medium">
                {units === 'imperial' ? 'Imperial' : 'Metric'}
              </span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem
                onClick={() => setUnits('metric')}
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
                onClick={() => setUnits('imperial')}
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
