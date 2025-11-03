// Weather condition types based on WMO weather codes
export const WeatherCondition = {
  SUNNY: 0,
  MAINLY_CLEAR: 1,
  PARTLY_CLOUDY: 2,
  OVERCAST: 3,
  FOG: 45,
  DEPOSITING_RIME_FOG: 48,
  LIGHT_DRIZZLE: 51,
  MODERATE_DRIZZLE: 53,
  DENSE_DRIZZLE: 55,
  FREEZING_LIGHT_DRIZZLE: 56,
  FREEZING_DENSE_DRIZZLE: 57,
  SLIGHT_RAIN: 61,
  MODERATE_RAIN: 63,
  HEAVY_RAIN: 65,
  FREEZING_LIGHT_RAIN: 66,
  FREEZING_HEAVY_RAIN: 67,
  SLIGHT_SNOW: 71,
  MODERATE_SNOW: 73,
  HEAVY_SNOW: 75,
  SNOW_GRAINS: 77,
  SLIGHT_RAIN_SHOWERS: 80,
  MODERATE_RAIN_SHOWERS: 81,
  VIOLENT_RAIN_SHOWERS: 82,
  SLIGHT_SNOW_SHOWERS: 85,
  HEAVY_SNOW_SHOWERS: 86,
  THUNDERSTORM: 95,
  THUNDERSTORM_WITH_HAIL: 96,
} as const;

export type Units = 'imperial' | 'metric';

export interface Location {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string;
}

export interface CurrentWeather {
  temperature: number;
  weatherCode: number;
  windSpeed: number;
  windDirection: number;
}

export interface DailyForecast {
  date: string;
  weatherCode: number;
  maxTemperature: number;
  minTemperature: number;
}

export interface HourlyForecast {
  time: string;
  temperature: number;
  weatherCode: number;
}

export interface WeatherData {
  location: Location;
  current: CurrentWeather;
  daily: DailyForecast[];
  hourly: HourlyForecast[];
  feelsLike: number;
  humidity: number;
  precipitation: number;
}

// API Response Types
export interface GeocodingResponse {
  results: Array<{
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    country: string;
    admin1?: string;
  }>;
}

export interface ForecastResponse {
  latitude: number;
  longitude: number;
  current: {
    temperature_2m: number;
    weather_code: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
  };
  current_units: {
    temperature_2m: string;
    wind_speed_10m: string;
  };
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
  };
  daily_units: {
    temperature_2m_max: string;
    temperature_2m_min: string;
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    weather_code: number[];
    apparent_temperature?: number[];
    relative_humidity_2m?: number[];
    precipitation?: number[];
  };
  hourly_units?: {
    temperature_2m: string;
    apparent_temperature?: string;
    relative_humidity_2m?: string;
    precipitation?: string;
  };
}

export interface WeatherError {
  message: string;
  code?: string;
}
