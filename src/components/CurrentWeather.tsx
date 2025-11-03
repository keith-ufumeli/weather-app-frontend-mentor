import { WeatherIcon } from '@/components/WeatherIcon';
import { useWeather } from '@/hooks/useWeather';
import { formatTemperature, getLocationDisplayName, formatFullDate } from '@/utils/weatherUtils';
import bgTodayLarge from '@/assets/images/bg-today-large.svg';
import bgTodaySmall from '@/assets/images/bg-today-small.svg';

export function CurrentWeather() {
  const { weatherData, units } = useWeather();

  if (!weatherData) {
    return null;
  }

  const { current, location } = weatherData;
  const displayName = getLocationDisplayName(location.name, location.country);
  const currentDate = formatFullDate();

  return (
    <div 
      className="relative overflow-hidden rounded-2xl bg-cover bg-center min-h-[280px] lg:min-h-[300px]"
      style={{
        backgroundImage: `url(${bgTodaySmall})`,
      }}
    >
      {/* Large background for desktop */}
      <div 
        className="hidden md:block absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${bgTodayLarge})`,
        }}
        aria-hidden="true"
      />
      
      <div className="relative z-10 p-6 md:p-8 lg:p-10 flex items-center justify-between min-h-[280px] lg:min-h-[300px]">
        {/* Left side - Location and Date */}
        <div className="flex flex-col justify-center">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold text-neutral-0 mb-1 lg:mb-2">
            {displayName}
          </h2>
          <p className="text-sm md:text-base lg:text-base text-neutral-200">
            {currentDate}
          </p>
        </div>
        
        {/* Right side - Temperature and Icon */}
        <div className="flex items-center gap-4 md:gap-6">
          <WeatherIcon 
            weatherCode={current.weatherCode} 
            size="lg" 
            className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24"
          />
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-0 font-display">
            {formatTemperature(current.temperature, units)}
          </h1>
        </div>
      </div>
    </div>
  );
}
