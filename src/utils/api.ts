import { WeatherData, ForecastData, LocationData } from '@/types';

const WEATHER_API_BASE_URL = 'https://api.openweathermap.org/data/2.5';
const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;

// Cache keys
const CACHE_KEYS = {
  weather: (lat: number, lon: number) => `weather:${lat}:${lon}`,
  forecast: (lat: number, lon: number) => `forecast:${lat}:${lon}`,
  location: (query: string) => `location:${query}`,
} as const;

// Cache durations in milliseconds
const CACHE_DURATION = {
  WEATHER: 5 * 60 * 1000,      // 5 minutes
  FORECAST: 30 * 60 * 1000,    // 30 minutes
  LOCATION: 24 * 60 * 60 * 1000, // 24 hours
} as const;

interface CacheItem<T> {
  data: T;
  timestamp: number;
}

class WeatherCache {
  private static instance: WeatherCache;
  private cache: Map<string, CacheItem<any>>;

  private constructor() {
    this.cache = new Map();
  }

  static getInstance(): WeatherCache {
    if (!WeatherCache.instance) {
      WeatherCache.instance = new WeatherCache();
    }
    return WeatherCache.instance;
  }

  set<T>(key: string, data: T, duration: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now() + duration,
    });
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() > item.timestamp) {
      this.cache.delete(key);
      return null;
    }

    return item.data as T;
  }

  clear(): void {
    this.cache.clear();
  }
}

const cache = WeatherCache.getInstance();

export async function fetchWeatherData(lat: number, lon: number): Promise<WeatherData> {
  const cacheKey = CACHE_KEYS.weather(lat, lon);
  const cachedData = cache.get<WeatherData>(cacheKey);
  
  if (cachedData) {
    return cachedData;
  }

  const url = `${WEATHER_API_BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Weather API error: ${response.statusText}`);
  }

  const data = await response.json();
  cache.set(cacheKey, data, CACHE_DURATION.WEATHER);
  return data;
}

export async function fetchForecast(lat: number, lon: number): Promise<ForecastData> {
  const cacheKey = CACHE_KEYS.forecast(lat, lon);
  const cachedData = cache.get<ForecastData>(cacheKey);
  
  if (cachedData) {
    return cachedData;
  }

  const url = `${WEATHER_API_BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Forecast API error: ${response.statusText}`);
  }

  const data = await response.json();
  cache.set(cacheKey, data, CACHE_DURATION.FORECAST);
  return data;
}

export async function searchLocation(query: string): Promise<LocationData[]> {
  const cacheKey = CACHE_KEYS.location(query);
  const cachedData = cache.get<LocationData[]>(cacheKey);
  
  if (cachedData) {
    return cachedData;
  }

  const url = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=5&appid=${API_KEY}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Geocoding API error: ${response.statusText}`);
  }

  const data = await response.json();
  cache.set(cacheKey, data, CACHE_DURATION.LOCATION);
  return data;
}

// Utility function to clear cache (useful for testing or manual cache invalidation)
export function clearCache(): void {
  cache.clear();
} 