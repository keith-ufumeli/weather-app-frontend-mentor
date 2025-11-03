import { Header } from '@/components/Header';
import { CurrentWeather } from '@/components/CurrentWeather';
import { WeatherMetrics } from '@/components/WeatherMetrics';
import { DailyForecast } from '@/components/DailyForecast';
import { HourlyForecast } from '@/components/HourlyForecast';
import { LoadingState } from '@/components/LoadingState';
import { ErrorState } from '@/components/ErrorState';
import { EmptyState } from '@/components/EmptyState';
import { Footer } from '@/components/Footer';
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
    <div className="min-h-screen bg-neutral-900 flex flex-col">
      <Header />
      
      <main className="container mx-auto px-4 md:px-6 py-6 md:py-8 max-w-7xl flex-1">
        {loading && !weatherData && <LoadingState />}
        
        {error && !weatherData && (
          <ErrorState message={error.message} onRetry={handleRetry} />
        )}
        
        {!loading && !error && !weatherData && <EmptyState />}

        {weatherData && (
          <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-6 lg:gap-8">
            {/* Left Column */}
            <div className="flex flex-col gap-6">
              <CurrentWeather />
              <WeatherMetrics />
              <DailyForecast />
            </div>
            
            {/* Right Column */}
            <div className="flex flex-col">
              <HourlyForecast />
            </div>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}
