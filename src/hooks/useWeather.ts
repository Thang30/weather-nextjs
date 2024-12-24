'use client';

import { useState, useCallback } from 'react';
import { fetchWeatherData, fetchForecast, searchLocation } from '@/utils/api';
import { WeatherData, ForecastData, LocationData } from '@/types';

export function useWeather() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [forecastData, setForecastData] = useState<ForecastData | null>(null);

  // Function to fetch both current weather and forecast
  const fetchWeather = useCallback(async (lat: number, lon: number) => {
    setIsLoading(true);
    setError(null);

    try {
      // Fetch both current weather and forecast in parallel
      const [weather, forecast] = await Promise.all([
        fetchWeatherData(lat, lon),
        fetchForecast(lat, lon)
      ]);

      setWeatherData(weather);
      setForecastData(forecast);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Function to search for a location
  const searchCity = useCallback(async (query: string): Promise<LocationData[]> => {
    setError(null);

    try {
      const locations = await searchLocation(query);
      return locations;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search location');
      return [];
    }
  }, []);

  return {
    weatherData,
    forecastData,
    isLoading,
    error,
    fetchWeather,
    searchCity,
  };
} 