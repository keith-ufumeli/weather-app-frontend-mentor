import { useState, useMemo } from 'react';
import { useWeather } from '@/hooks/useWeather';
import { formatShortDayName, formatTime, formatTemperature } from '@/utils/weatherUtils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { WeatherIcon } from '@/components/WeatherIcon';

export function HourlyForecast() {
  const { weatherData, units } = useWeather();
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);

  // Get hourly data for selected day
  // Open-Meteo returns hourly data for the next 7 days
  // We need to group by day
  const hourlyByDay = useMemo(() => {
    if (!weatherData?.hourly) return [];
    const days: { date: string; hours: typeof weatherData.hourly }[] = [];
    
    weatherData.hourly.forEach((hour) => {
      const hourDate = new Date(hour.time);
      const dateKey = hourDate.toDateString();
      
      const existingDay = days.find((d) => new Date(d.date).toDateString() === dateKey);
      
      if (existingDay) {
        existingDay.hours.push(hour);
      } else {
        days.push({
          date: hourDate.toISOString().split('T')[0],
          hours: [hour],
        });
      }
    });

    return days.slice(0, 7); // First 7 days
  }, [weatherData]);

  if (!weatherData || !weatherData.daily.length) {
    return null;
  }

  const selectedDayHours = hourlyByDay[selectedDayIndex]?.hours || [];

  return (
    <section aria-label="Hourly forecast" className="flex flex-col h-full lg:max-h-[calc(100vh-12rem)]">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-neutral-0 font-display">
          Hourly forecast
        </h2>
      </div>

      {/* Day selector tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {weatherData.daily.map((day, index) => (
          <Button
            key={day.date}
            variant={selectedDayIndex === index ? 'default' : 'outline'}
            onClick={() => setSelectedDayIndex(index)}
            className={`flex-shrink-0 ${
              selectedDayIndex === index
                ? 'bg-blue-500 text-neutral-0 hover:bg-blue-600'
                : 'bg-neutral-800 border-neutral-700 text-neutral-300 hover:bg-neutral-700 hover:text-neutral-0'
            }`}
            aria-pressed={selectedDayIndex === index}
          >
            {formatShortDayName(day.date)}
          </Button>
        ))}
      </div>

      {/* Hourly temperatures - vertical scrollable list */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden pr-2 custom-scrollbar">
        <div className="flex flex-col gap-3">
          {selectedDayHours.map((hour) => (
            <Card 
              key={hour.time}
              className="bg-neutral-800 border-neutral-700"
            >
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <WeatherIcon 
                    weatherCode={hour.weatherCode} 
                    size="sm" 
                    className="flex-shrink-0"
                  />
                  <p className="text-neutral-300 text-sm">
                    {formatTime(hour.time)}
                  </p>
                </div>
                <p className="text-neutral-0 text-lg font-semibold">
                  {formatTemperature(hour.temperature, units)}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
