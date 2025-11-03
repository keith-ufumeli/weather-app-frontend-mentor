import { WeatherIcon } from '@/components/WeatherIcon';
import { useWeather } from '@/hooks/useWeather';
import { formatTemperature, getLocationDisplayName } from '@/utils/weatherUtils';
import bgTodayLarge from '@/assets/images/bg-today-large.svg';
import bgTodaySmall from '@/assets/images/bg-today-small.svg';

export function CurrentWeather() {
  const { weatherData, units } = useWeather();

  if (!weatherData) {
    return null;
  }

  const { current, location } = weatherData;
  const displayName = getLocationDisplayName(location.name, location.admin1, location.country);

  return (
    <div 
      className="relative overflow-hidden rounded-2xl bg-cover bg-center min-h-[300px] lg:min-h-[320px]"
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
      
      <div className="relative z-10 p-6 md:p-8 flex flex-col items-center justify-center min-h-[300px] lg:min-h-[320px]">
        <WeatherIcon 
          weatherCode={current.weatherCode} 
          size="lg" 
          className="mb-3 lg:mb-4"
        />
        
        <div className="text-center">
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-neutral-0 mb-2 font-display">
            {formatTemperature(current.temperature, units)}
          </h1>
          
          <p className="text-lg md:text-xl lg:text-2xl text-neutral-200">
            {displayName}
          </p>
        </div>
      </div>
    </div>
  );
}
