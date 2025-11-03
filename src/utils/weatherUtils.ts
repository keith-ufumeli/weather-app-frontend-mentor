import { WeatherCondition } from '@/types/weather';

/**
 * Map WMO weather code to weather icon name
 */
export function getWeatherIconName(weatherCode: number): string {
  // Map WMO weather codes to icon names
  if (weatherCode === WeatherCondition.SUNNY) {
    return 'sunny';
  }
  
  if (
    weatherCode === WeatherCondition.MAINLY_CLEAR ||
    weatherCode === WeatherCondition.PARTLY_CLOUDY
  ) {
    return 'partly-cloudy';
  }
  
  if (weatherCode === WeatherCondition.OVERCAST) {
    return 'overcast';
  }
  
  if (
    weatherCode === WeatherCondition.FOG ||
    weatherCode === WeatherCondition.DEPOSITING_RIME_FOG
  ) {
    return 'fog';
  }
  
  if (
    weatherCode === WeatherCondition.LIGHT_DRIZZLE ||
    weatherCode === WeatherCondition.MODERATE_DRIZZLE ||
    weatherCode === WeatherCondition.DENSE_DRIZZLE ||
    weatherCode === WeatherCondition.FREEZING_LIGHT_DRIZZLE ||
    weatherCode === WeatherCondition.FREEZING_DENSE_DRIZZLE
  ) {
    return 'drizzle';
  }
  
  if (
    weatherCode === WeatherCondition.SLIGHT_RAIN ||
    weatherCode === WeatherCondition.MODERATE_RAIN ||
    weatherCode === WeatherCondition.HEAVY_RAIN ||
    weatherCode === WeatherCondition.FREEZING_LIGHT_RAIN ||
    weatherCode === WeatherCondition.FREEZING_HEAVY_RAIN ||
    weatherCode === WeatherCondition.SLIGHT_RAIN_SHOWERS ||
    weatherCode === WeatherCondition.MODERATE_RAIN_SHOWERS ||
    weatherCode === WeatherCondition.VIOLENT_RAIN_SHOWERS
  ) {
    return 'rain';
  }
  
  if (
    weatherCode === WeatherCondition.THUNDERSTORM ||
    weatherCode === WeatherCondition.THUNDERSTORM_WITH_HAIL
  ) {
    return 'storm';
  }
  
  if (
    weatherCode === WeatherCondition.SLIGHT_SNOW ||
    weatherCode === WeatherCondition.MODERATE_SNOW ||
    weatherCode === WeatherCondition.HEAVY_SNOW ||
    weatherCode === WeatherCondition.SNOW_GRAINS ||
    weatherCode === WeatherCondition.SLIGHT_SNOW_SHOWERS ||
    weatherCode === WeatherCondition.HEAVY_SNOW_SHOWERS
  ) {
    return 'snow';
  }
  
  // Default to partly cloudy for unknown codes
  return 'partly-cloudy';
}

/**
 * Format date to day name (e.g., "Monday", "Tuesday")
 */
export function formatDayName(dateString: string): string {
  const date = new Date(dateString);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  // Check if it's today
  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  }
  
  // Check if it's tomorrow
  if (date.toDateString() === tomorrow.toDateString()) {
    return 'Tomorrow';
  }
  
  return date.toLocaleDateString('en-US', { weekday: 'long' });
}

/**
 * Format date to short day name (e.g., "Mon", "Tue")
 */
export function formatShortDayName(dateString: string): string {
  const date = new Date(dateString);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  }
  
  if (date.toDateString() === tomorrow.toDateString()) {
    return 'Tomorrow';
  }
  
  return date.toLocaleDateString('en-US', { weekday: 'short' });
}

/**
 * Format time from ISO string to 12-hour format (e.g., "2:00 PM")
 */
export function formatTime(timeString: string): string {
  const date = new Date(timeString);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Format time to 24-hour format (e.g., "14:00")
 */
export function formatTime24Hour(timeString: string): string {
  const date = new Date(timeString);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

/**
 * Format temperature with unit symbol
 */
export function formatTemperature(temp: number, unit: 'imperial' | 'metric'): string {
  const rounded = Math.round(temp);
  const symbol = unit === 'imperial' ? '°F' : '°C';
  return `${rounded}${symbol}`;
}

/**
 * Format wind speed with unit
 */
export function formatWindSpeed(speed: number, unit: 'imperial' | 'metric'): string {
  const rounded = Math.round(speed);
  const unitText = unit === 'imperial' ? 'mph' : 'km/h';
  return `${rounded} ${unitText}`;
}

/**
 * Format precipitation with unit
 */
export function formatPrecipitation(amount: number, unit: 'imperial' | 'metric'): string {
  const rounded = Math.round(amount * 10) / 10;
  const unitText = unit === 'imperial' ? 'in' : 'mm';
  return `${rounded} ${unitText}`;
}

/**
 * Format humidity percentage
 */
export function formatHumidity(humidity: number): string {
  return `${Math.round(humidity)}%`;
}

/**
 * Get location display name (city, country)
 */
export function getLocationDisplayName(
  name: string,
  country?: string
): string {
  const parts = [name];
  if (country) {
    parts.push(country);
  }
  return parts.join(', ');
}

/**
 * Format date to readable format (e.g., "Tuesday, Aug 5, 2025")
 */
export function formatFullDate(dateString?: string): string {
  const date = dateString ? new Date(dateString) : new Date();
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}
