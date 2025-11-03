import { useState, useMemo, useEffect } from 'react';
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

/**
 * Parse time string to Date object, handling multiple formats
 */
function parseHourTime(timeString: string): Date {
  if (timeString.includes('T')) {
    return new Date(timeString);
  } else if (timeString.includes(' ')) {
    return new Date(timeString);
  } else {
    // Assume it's just a date, add midnight time
    return new Date(`${timeString}T00:00:00`);
  }
}

export function HourlyForecast() {
  const { weatherData, units } = useWeather();
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(() => new Date());

  // Update current time every minute to refresh the filtered list
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  // Get hourly data for selected day, filtered to show only current and future hours
  // Open-Meteo returns hourly data for the next 7 days
  // We need to group by day and filter past hours
  const hourlyByDay = useMemo(() => {
    if (!weatherData?.hourly || !weatherData?.daily) return [];
    
    // Get current hour time for comparison (use currentTime state to trigger recalculation)
    const now = currentTime;
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hour = String(now.getHours()).padStart(2, '0');
    const currentHourTime = `${year}-${month}-${day}T${hour}:00`;
    const currentHourDate = parseHourTime(currentHourTime);
    
    // Create a map of date strings to hourly data
    const hourlyMap = new Map<string, typeof weatherData.hourly>();
    
    weatherData.hourly.forEach((hour) => {
      // Extract date from timestamp string
      const hourDateStr = hour.time;
      let dateKey: string;
      
      if (hourDateStr.includes('T')) {
        dateKey = hourDateStr.split('T')[0];
      } else if (hourDateStr.includes(' ')) {
        dateKey = hourDateStr.split(' ')[0];
      } else {
        dateKey = hourDateStr;
      }
      
      if (!hourlyMap.has(dateKey)) {
        hourlyMap.set(dateKey, []);
      }
      hourlyMap.get(dateKey)!.push(hour);
    });

    // Match hourly data to daily forecast dates and filter past hours
    const days = weatherData.daily.map((day) => {
      const dayHours = hourlyMap.get(day.date) || [];
      
      // Filter out past hours - only keep current hour and future hours
      const futureHours = dayHours.filter((hour) => {
        const hourDate = parseHourTime(hour.time);
        // Include if hour is >= current hour (same hour or future)
        return hourDate >= currentHourDate;
      });

      return {
        date: day.date,
        hours: futureHours,
      };
    });

    return days;
  }, [weatherData, currentTime]);

  // Auto-select first day that has forecast data (current day with future hours)
  useEffect(() => {
    const firstDayWithHours = hourlyByDay.findIndex((day) => day.hours.length > 0);
    if (firstDayWithHours !== -1 && firstDayWithHours !== selectedDayIndex) {
      setSelectedDayIndex(firstDayWithHours);
    }
  }, [hourlyByDay, selectedDayIndex]);

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
