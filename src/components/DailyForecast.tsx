import { useWeather } from '@/context/WeatherContext';
import { WeatherIcon } from '@/components/WeatherIcon';
import { formatShortDayName, formatTemperature } from '@/utils/weatherUtils';
import { Card, CardContent } from '@/components/ui/card';

export function DailyForecast() {
  const { weatherData, units } = useWeather();

  if (!weatherData || !weatherData.daily.length) {
    return null;
  }

  return (
    <section aria-label="7-day forecast">
      <h2 className="text-2xl font-bold text-neutral-0 mb-4 font-display">
        Daily forecast
      </h2>
      
      <div className="flex gap-4 overflow-x-auto pb-4 md:grid md:grid-cols-7 md:overflow-x-visible">
        {weatherData.daily.map((day) => (
          <Card 
            key={day.date} 
            className="min-w-[120px] md:min-w-0 bg-neutral-800 border-neutral-700 flex-shrink-0"
          >
            <CardContent className="p-4 flex flex-col items-center text-center">
              <p className="text-neutral-300 text-sm mb-3 font-medium">
                {formatShortDayName(day.date)}
              </p>
              <WeatherIcon 
                weatherCode={day.weatherCode} 
                size="md"
                className="mb-3"
              />
              <div className="flex gap-2 items-center">
                <span className="text-neutral-0 font-semibold">
                  {formatTemperature(day.maxTemperature, units)}
                </span>
                <span className="text-neutral-300 text-sm">
                  {formatTemperature(day.minTemperature, units)}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
