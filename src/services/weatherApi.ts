import type {
  Location,
  GeocodingResponse,
  ForecastResponse,
  WeatherData,
  Units,
  WeatherError,
} from '@/types/weather';

const GEOCODING_API_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_API_URL = 'https://api.open-meteo.com/v1/forecast';

/**
 * Default fallback location: Harare, Zimbabwe
 */
export const DEFAULT_LOCATION: Location = {
  id: 890298,
  name: 'Harare',
  latitude: -17.8292,
  longitude: 31.0522,
  country: 'Zimbabwe',
  admin1: 'Harare',
};

/**
 * Search for locations by name using Open-Meteo Geocoding API
 */
export async function searchLocations(
  query: string
): Promise<Location[]> {
  if (!query.trim()) {
    return [];
  }

  try {
    const params = new URLSearchParams({
      name: query.trim(),
      count: '10',
      language: 'en',
      format: 'json',
    });

    const response = await fetch(`${GEOCODING_API_URL}?${params}`);

    if (!response.ok) {
      throw new Error(`Geocoding API error: ${response.status}`);
    }

    const data: GeocodingResponse = await response.json();

    if (!data.results) {
      return [];
    }

    return data.results.map((result) => ({
      id: result.id,
      name: result.name,
      latitude: result.latitude,
      longitude: result.longitude,
      country: result.country,
      admin1: result.admin1,
    }));
  } catch (error) {
    console.error('Error searching locations:', error);
    throw new Error('Failed to search locations. Please try again.');
  }
}

/**
 * Get location from coordinates using reverse geocoding
 */
export async function getLocationFromCoordinates(
  latitude: number,
  longitude: number
): Promise<Location> {
  try {
    const params = new URLSearchParams({
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      count: '1',
      language: 'en',
      format: 'json',
    });

    const response = await fetch(`${GEOCODING_API_URL}?${params}`);

    if (!response.ok) {
      throw new Error(`Geocoding API error: ${response.status}`);
    }

    const data: GeocodingResponse = await response.json();

    if (data.results && data.results.length > 0) {
      const result = data.results[0];
      return {
        id: result.id,
        name: result.name,
        latitude: result.latitude,
        longitude: result.longitude,
        country: result.country,
        admin1: result.admin1,
      };
    }

    // Fallback: create minimal location object from coordinates
    return {
      id: Date.now(), // Temporary ID
      name: 'Current Location',
      latitude,
      longitude,
      country: 'Unknown',
    };
  } catch (error) {
    console.error('Error reverse geocoding coordinates:', error);
    // Fallback: create minimal location object from coordinates
    return {
      id: Date.now(), // Temporary ID
      name: 'Current Location',
      latitude,
      longitude,
      country: 'Unknown',
    };
  }
}

/**
 * Fetch weather forecast data for a given location
 */
export async function fetchWeatherData(
  location: Location,
  units: Units = 'metric'
): Promise<WeatherData> {
  try {
    const temperatureUnit = units === 'imperial' ? 'fahrenheit' : 'celsius';
    const windSpeedUnit = units === 'imperial' ? 'mph' : 'kmh';
    const precipitationUnit = units === 'imperial' ? 'inch' : 'mm';

    const params = new URLSearchParams({
      latitude: location.latitude.toString(),
      longitude: location.longitude.toString(),
      current: [
        'temperature_2m',
        'weather_code',
        'wind_speed_10m',
        'wind_direction_10m',
      ].join(','),
      daily: [
        'weather_code',
        'temperature_2m_max',
        'temperature_2m_min',
      ].join(','),
      hourly: [
        'temperature_2m',
        'weather_code',
        'apparent_temperature',
        'relative_humidity_2m',
        'precipitation',
      ].join(','),
      temperature_unit: temperatureUnit,
      wind_speed_unit: windSpeedUnit,
      precipitation_unit: precipitationUnit,
      timezone: 'auto',
      forecast_days: '7',
    });

    const response = await fetch(`${FORECAST_API_URL}?${params}`);

    if (!response.ok) {
      throw new Error(`Forecast API error: ${response.status}`);
    }

    const data: ForecastResponse = await response.json();

    // Get current hour's apparent temperature and humidity
    const currentHourIndex = 0;
    const feelsLike =
      data.hourly?.apparent_temperature?.[currentHourIndex] ??
      data.current.temperature_2m;
    const humidity =
      data.hourly?.relative_humidity_2m?.[currentHourIndex] ?? 0;
    const precipitation =
      data.hourly?.precipitation?.[currentHourIndex] ?? 0;

    // Map daily forecast
    const daily = data.daily.time.map((date, index) => ({
      date,
      weatherCode: data.daily.weather_code[index],
      maxTemperature: data.daily.temperature_2m_max[index],
      minTemperature: data.daily.temperature_2m_min[index],
    }));

    // Map hourly forecast (all hours for 7 days)
    const hourly = data.hourly.time.map((time, index) => ({
      time,
      temperature: data.hourly.temperature_2m[index],
      weatherCode: data.hourly.weather_code[index],
    }));

    return {
      location,
      current: {
        temperature: data.current.temperature_2m,
        weatherCode: data.current.weather_code,
        windSpeed: data.current.wind_speed_10m,
        windDirection: data.current.wind_direction_10m,
      },
      daily,
      hourly,
      feelsLike,
      humidity,
      precipitation,
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to fetch weather data';
    throw new Error(errorMessage);
  }
}

/**
 * Helper to create a weather error object
 */
export function createWeatherError(
  message: string,
  code?: string
): WeatherError {
  return { message, code };
}
