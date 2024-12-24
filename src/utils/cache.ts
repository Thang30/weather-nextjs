import { WeatherData, ForecastData, LocationData } from '@/types';

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

interface WeatherCache {
  weather: { [key: string]: CacheEntry<WeatherData> };
  forecast: { [key: string]: CacheEntry<ForecastData> };
  search: { [key: string]: CacheEntry<LocationData[]> };
}

const cache: WeatherCache = {
  weather: {},
  forecast: {},
  search: {}
};

function isCacheValid<T>(entry?: CacheEntry<T>): boolean {
  if (!entry) return false;
  return Date.now() - entry.timestamp < CACHE_DURATION;
}

function getCacheKey(type: keyof WeatherCache, params: Record<string, string | number>): string {
  return Object.entries(params)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}:${value}`)
    .join('|');
}

export async function getWeatherFromCache(lat: number, lon: number): Promise<WeatherData | null> {
  const key = getCacheKey('weather', { lat, lon });
  const entry = cache.weather[key];
  return isCacheValid(entry) ? entry.data : null;
}

export async function getForecastFromCache(lat: number, lon: number): Promise<ForecastData | null> {
  const key = getCacheKey('forecast', { lat, lon });
  const entry = cache.forecast[key];
  return isCacheValid(entry) ? entry.data : null;
}

export async function getSearchResultsFromCache(query: string): Promise<LocationData[] | null> {
  const key = getCacheKey('search', { query });
  const entry = cache.search[key];
  return isCacheValid(entry) ? entry.data : null;
}

export function setWeatherCache(lat: number, lon: number, data: WeatherData): void {
  const key = getCacheKey('weather', { lat, lon });
  cache.weather[key] = { data, timestamp: Date.now() };
}

export function setForecastCache(lat: number, lon: number, data: ForecastData): void {
  const key = getCacheKey('forecast', { lat, lon });
  cache.forecast[key] = { data, timestamp: Date.now() };
}

export function setSearchCache(query: string, data: LocationData[]): void {
  const key = getCacheKey('search', { query });
  cache.search[key] = { data, timestamp: Date.now() };
} 