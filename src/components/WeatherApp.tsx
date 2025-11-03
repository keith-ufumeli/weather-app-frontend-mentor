import { Header } from '@/components/Header';
import { CurrentWeather } from '@/components/CurrentWeather';
import { WeatherMetrics } from '@/components/WeatherMetrics';
import { DailyForecast } from '@/components/DailyForecast';
import { HourlyForecast } from '@/components/HourlyForecast';
import { LoadingState } from '@/components/LoadingState';
import { ErrorState } from '@/components/ErrorState';
import { EmptyState } from '@/components/EmptyState';
import { useWeather } from '@/hooks/useWeather';

export function WeatherApp() {
  const { weatherData, loading, error, loadWeatherData, clearError } = useWeather();

  const handleRetry = () => {
    if (weatherData?.location) {
      loadWeatherData(weatherData.location);
    }
    clearError();
  };

  return (
    <div className="min-h-screen bg-neutral-900">
      <Header />
      
      <main className="container mx-auto px-4 md:px-6 py-8 max-w-7xl">
        {loading && !weatherData && <LoadingState />}
        
        {error && !weatherData && (
          <ErrorState message={error.message} onRetry={handleRetry} />
        )}
        
        {!loading && !error && !weatherData && <EmptyState />}

        {weatherData && (
          <div className="space-y-8">
            <CurrentWeather />
            <WeatherMetrics />
            <DailyForecast />
            <HourlyForecast />
          </div>
        )}
      </main>
    </div>
  );
}
