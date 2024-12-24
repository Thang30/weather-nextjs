import { useState, useEffect } from 'react';
import { 
  getWeatherFromCache, 
  getForecastFromCache, 
  getSearchResultsFromCache,
  setWeatherCache,
  setForecastCache,
  setSearchCache
} from '@/utils/cache';
import { WeatherData, ForecastData, LocationData } from '@/types';

interface UseCacheResult<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  setData: (data: T) => void;
}

export function useWeatherCache(lat: number, lon: number): UseCacheResult<WeatherData> {
  const [data, setData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFromCache() {
      try {
        const cachedData = await getWeatherFromCache(lat, lon);
        if (cachedData) {
          setData(cachedData);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
      } finally {
        setIsLoading(false);
      }
    }

    fetchFromCache();
  }, [lat, lon]);

  const updateData = (newData: WeatherData) => {
    setWeatherCache(lat, lon, newData);
    setData(newData);
  };

  return { data, isLoading, error, setData: updateData };
}

export function useForecastCache(lat: number, lon: number): UseCacheResult<ForecastData> {
  const [data, setData] = useState<ForecastData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFromCache() {
      try {
        const cachedData = await getForecastFromCache(lat, lon);
        if (cachedData) {
          setData(cachedData);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch forecast data');
      } finally {
        setIsLoading(false);
      }
    }

    fetchFromCache();
  }, [lat, lon]);

  const updateData = (newData: ForecastData) => {
    setForecastCache(lat, lon, newData);
    setData(newData);
  };

  return { data, isLoading, error, setData: updateData };
}

export function useSearchCache(query: string): UseCacheResult<LocationData[]> {
  const [data, setData] = useState<LocationData[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFromCache() {
      try {
        const cachedData = await getSearchResultsFromCache(query);
        if (cachedData) {
          setData(cachedData);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch search results');
      } finally {
        setIsLoading(false);
      }
    }

    fetchFromCache();
  }, [query]);

  const updateData = (newData: LocationData[]) => {
    setSearchCache(query, newData);
    setData(newData);
  };

  return { data, isLoading, error, setData: updateData };
} 