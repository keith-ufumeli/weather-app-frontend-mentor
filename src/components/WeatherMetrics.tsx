import { useWeather } from '@/hooks/useWeather';
import { formatTemperature, formatHumidity, formatWindSpeed, formatPrecipitation } from '@/utils/weatherUtils';
import { Card, CardContent } from '@/components/ui/card';

export function WeatherMetrics() {
  const { weatherData, units } = useWeather();

  if (!weatherData) {
    return null;
  }

  const { feelsLike, humidity, current, precipitation } = weatherData;

  const metrics = [
    {
      label: 'Feels like',
      value: formatTemperature(feelsLike, units),
    },
    {
      label: 'Humidity',
      value: formatHumidity(humidity),
    },
    {
      label: 'Wind',
      value: formatWindSpeed(current.windSpeed, units),
    },
    {
      label: 'Precipitation',
      value: formatPrecipitation(precipitation, units),
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric) => (
        <Card key={metric.label} className="bg-neutral-800 border-neutral-700">
          <CardContent className="p-4">
            <p className="text-neutral-300 text-sm mb-1">{metric.label}</p>
            <p className="text-neutral-0 text-xl font-semibold">{metric.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
