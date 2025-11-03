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
const NOMINATIM_API_URL = 'https://nominatim.openstreetmap.org/reverse';

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
 * Calculate distance between two coordinates using Haversine formula
 */
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Get location from coordinates using Nominatim (OpenStreetMap) reverse geocoding
 * This API provides more accurate city and country information
 */
async function getLocationFromNominatim(
  latitude: number,
  longitude: number
): Promise<Location | null> {
  try {
    const params = new URLSearchParams({
      lat: latitude.toString(),
      lon: longitude.toString(),
      format: 'json',
      addressdetails: '1',
      'accept-language': 'en',
    });

    // Nominatim requires a user agent header (usage policy)
    const response = await fetch(`${NOMINATIM_API_URL}?${params}`, {
      headers: {
        'User-Agent': 'WeatherApp/1.0',
      },
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    if (data && data.address) {
      const address = data.address;
      
      // Extract city name (prefer city, town, or village)
      const cityName = 
        address.city || 
        address.town || 
        address.village || 
        address.municipality ||
        address.suburb ||
        address.county ||
        'Current Location';

      // Extract country
      const country = address.country || 'Unknown';
      
      // Extract admin/state
      const admin1 = address.state || address.region || undefined;

      return {
        id: data.place_id || Date.now(),
        name: cityName,
        latitude,
        longitude,
        country,
        admin1,
      };
    }

    return null;
  } catch (error) {
    console.error('Error with Nominatim reverse geocoding:', error);
    return null;
  }
}

/**
 * Get location from coordinates using reverse geocoding with improved fallback
 * Tries Nominatim first (more accurate), then falls back to Open-Meteo
 */
export async function getLocationFromCoordinates(
  latitude: number,
  longitude: number
): Promise<Location> {
  // First, try Nominatim (OpenStreetMap) - more reliable for reverse geocoding
  let nominatimResult: Location | null = null;
  try {
    nominatimResult = await getLocationFromNominatim(latitude, longitude);
    if (nominatimResult && nominatimResult.country !== 'Unknown') {
      return nominatimResult;
    }
  } catch (error) {
    console.error('Error with Nominatim, trying fallback:', error);
  }

  // Fallback to Open-Meteo reverse geocoding
  try {
    const params = new URLSearchParams({
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      count: '10', // Get more results to find a good match
      language: 'en',
      format: 'json',
    });

    const response = await fetch(`${GEOCODING_API_URL}?${params}`);

    if (!response.ok) {
      throw new Error(`Geocoding API error: ${response.status}`);
    }

    const data: GeocodingResponse = await response.json();

    if (data.results && data.results.length > 0) {
      // Find the best match - prefer results with proper country names
      // and calculate distance to pick the closest valid one
      const validResults = data.results.filter(
        (result) => result.country && result.country !== 'Unknown'
      );

      if (validResults.length > 0) {
        // Calculate distances and pick the closest one
        const resultsWithDistance = validResults.map((result) => ({
          ...result,
          distance: calculateDistance(
            latitude,
            longitude,
            result.latitude,
            result.longitude
          ),
        }));

        // Sort by distance and pick the closest
        resultsWithDistance.sort((a, b) => a.distance - b.distance);
        const closest = resultsWithDistance[0];

        return {
          id: closest.id,
          name: closest.name,
          latitude: closest.latitude,
          longitude: closest.longitude,
          country: closest.country,
          admin1: closest.admin1,
        };
      }

      // If no valid country, try the first result anyway
      const firstResult = data.results[0];
      if (firstResult.name && firstResult.name !== 'Unknown') {
        return {
          id: firstResult.id,
          name: firstResult.name,
          latitude: firstResult.latitude,
          longitude: firstResult.longitude,
          country: firstResult.country || 'Unknown',
          admin1: firstResult.admin1,
        };
      }
    }
  } catch (error) {
    console.error('Error with Open-Meteo reverse geocoding:', error);
  }

  // If Nominatim returned a result (even with Unknown country), use it
  if (nominatimResult) {
    return nominatimResult;
  }

  // Final fallback: return location with coordinates
  console.warn('All reverse geocoding methods failed');
  return {
    id: Date.now(),
    name: 'Current Location',
    latitude,
    longitude,
    country: 'Unknown',
  };
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
