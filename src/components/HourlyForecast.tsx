import { useState, useMemo } from 'react';
import { useWeather } from '@/hooks/useWeather';
import { formatShortDayName, formatTime, formatTemperature } from '@/utils/weatherUtils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { WeatherIcon } from '@/components/WeatherIcon';

export function HourlyForecast() {
  const { weatherData, units } = useWeather();
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);

  // Get hourly data for selected day
  // Open-Meteo returns hourly data for the next 7 days
  // We need to group by day
  const hourlyByDay = useMemo(() => {
    if (!weatherData?.hourly || !weatherData?.daily) return [];
    
    // Create a map of date strings to hourly data
    const hourlyMap = new Map<string, typeof weatherData.hourly>();
    
    weatherData.hourly.forEach((hour) => {
      // Extract date from timestamp string
      // The API returns timestamps in format "YYYY-MM-DDTHH:mm" or "YYYY-MM-DD HH:mm:ss"
      // when timezone: 'auto' is used, dates are already in local timezone
      // Extract date part (YYYY-MM-DD) directly from the string to avoid timezone conversion
      const hourDateStr = hour.time;
      let dateKey: string;
      
      if (hourDateStr.includes('T')) {
        // ISO format: "YYYY-MM-DDTHH:mm" - extract date part before 'T'
        dateKey = hourDateStr.split('T')[0];
      } else if (hourDateStr.includes(' ')) {
        // Space-separated: "YYYY-MM-DD HH:mm:ss" - extract date part before space
        dateKey = hourDateStr.split(' ')[0];
      } else {
        // Already just a date string
        dateKey = hourDateStr;
      }
      
      if (!hourlyMap.has(dateKey)) {
        hourlyMap.set(dateKey, []);
      }
      hourlyMap.get(dateKey)!.push(hour);
    });

    // Match hourly data to daily forecast dates
    const days = weatherData.daily.map((day) => ({
      date: day.date,
      hours: hourlyMap.get(day.date) || [],
    }));

    return days;
  }, [weatherData]);

  if (!weatherData || !weatherData.daily.length) {
    return null;
  }

  const selectedDayHours = hourlyByDay[selectedDayIndex]?.hours || [];

  return (
    <section aria-label="Hourly forecast" className="flex flex-col h-full lg:max-h-[calc(100vh-12rem)]">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-neutral-0 font-display">
          Hourly forecast
        </h2>
        <Select
          value={selectedDayIndex.toString()}
          onValueChange={(value) => setSelectedDayIndex(Number(value))}
        >
          <SelectTrigger className="w-[140px] bg-neutral-800 border-neutral-700 text-neutral-0 hover:bg-neutral-700 focus:ring-2 focus:ring-blue-500">
            <SelectValue>
              {formatShortDayName(weatherData.daily[selectedDayIndex]?.date || '')}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="bg-neutral-800 border-neutral-700">
            {weatherData.daily.map((day, index) => (
              <SelectItem
                key={day.date}
                value={index.toString()}
                className="text-neutral-0 focus:bg-neutral-700 focus:text-neutral-0 cursor-pointer"
              >
                {formatShortDayName(day.date)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
