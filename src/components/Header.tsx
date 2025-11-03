import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useWeather } from '@/context/WeatherContext';
import logoIcon from '@/assets/images/logo.svg';
import unitsIcon from '@/assets/images/icon-units.svg';
import checkmarkIcon from '@/assets/images/icon-checkmark.svg';

export function Header() {
  const { units, setUnits } = useWeather();

  return (
    <header className="flex items-center justify-between p-6 bg-neutral-0">
      <img 
        src={logoIcon} 
        alt="Weather App Logo" 
        className="h-8"
      />
      
      <DropdownMenu>
        <DropdownMenuTrigger 
          className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-neutral-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
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
    </header>
  );
}
