'use client';

import { JSX, Suspense } from 'react';
import { useWeather } from '@/hooks/useWeather';
import { useEffect, useState } from 'react';
import { LocationHistory } from '@/components/LocationHistory';
import { addToLocationHistory } from '@/utils/locationHistory';
import { PreferencesPanel } from '@/components/PreferencesPanel';
import { usePreferences } from '@/contexts/PreferencesContext';
import { TemperatureDisplay, WindSpeedDisplay } from '@/components/UnitDisplay';
import { ThemeToggle } from '@/components/ThemeToggle';
import { WeatherSkeleton } from '@/components/WeatherSkeleton';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ErrorMessage } from '@/components/ErrorMessage';
import { LocationData, LocationHistoryItem } from '@/types';
import { useDebouncedCallback } from 'use-debounce';
import { formatTime } from '@/utils/dateUtils';
import { ForecastDisplay } from '@/components/ForecastDisplay';
import { AirQuality } from '@/components/AirQuality';

export function WeatherDashboard(): JSX.Element {
  const { weatherData, forecastData, isLoading, error, fetchWeather, detectLocation, searchCity } = useWeather();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<LocationData[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { preferences } = usePreferences();

  // Use default location from preferences if available
  useEffect(() => {
    if (preferences.defaultLocation) {
      const { lat, lon } = preferences.defaultLocation;
      fetchWeather(lat, lon);
    } else {
      // Start of Selection
      // Fallback to Helsinki
      fetchWeather(60.1699, 24.9384);
    }
  }, [fetchWeather, preferences.defaultLocation]);

  // const convertTemperature = (celsius: number): number => {
  //   if (preferences.temperatureUnit === 'fahrenheit') {
  //     return (celsius * 9/5) + 32;
  //   }
  //   return celsius;
  // };

  const handleSearch = useDebouncedCallback(async (term: string) => {
    if (!term.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const locations = await searchCity(term);
      setSearchResults(locations);
    } catch (err) {
      console.error('Search failed:', err);
    } finally {
      setIsSearching(false);
    }
  }, 300);

  const handleLocationSelect = async (location: LocationData) => {
    setSearchQuery('');
    setSearchResults([]);
    
    // Add to location history
    const historyItem: LocationHistoryItem = {
      ...location,
      timestamp: Date.now(),
      lastWeather: weatherData ? {
        temperature: weatherData.temperature,
        condition: weatherData.condition
      } : undefined
    };
    
    addToLocationHistory(historyItem);
    await fetchWeather(location.lat, location.lon);
  };

  const handleRetry = () => {
    if (preferences.defaultLocation) {
      const { lat, lon } = preferences.defaultLocation;
      fetchWeather(lat, lon);
    }
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark transition-colors">
      {/* Header */}
      <header className="bg-surface-light dark:bg-surface-dark shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-text-light dark:text-text-dark">
              Weather Dashboard
            </h1>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <PreferencesPanel />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-4">
            <ErrorBoundary>
              <div className="bg-surface-light dark:bg-surface-dark rounded-lg shadow p-4">
                {/* Search */}
                <div className="mb-6">
                  <div className="flex flex-col gap-2">
                    {/* Location Detection Button */}
                    <button
                      onClick={() => detectLocation()}
                      disabled={isLoading}
                      className="w-full px-4 py-2 bg-primary-light dark:bg-primary-dark text-white rounded-md hover:bg-blue-600 dark:hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isLoading ? (
                        <>
                          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Detecting...
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                            <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          Use My Location
                        </>
                      )}
                    </button>

                    <div className="relative">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => {
                          setSearchQuery(e.target.value);
                          handleSearch(e.target.value);
                        }}
                        placeholder="Search city..."
                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark focus:border-transparent bg-white dark:bg-gray-700 text-text-light dark:text-text-dark"
                      />
                      
                      {/* Search Results Dropdown */}
                      {searchResults.length > 0 && searchQuery && (
                        <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 rounded-md shadow-lg max-h-60 overflow-auto">
                          {searchResults.map((location) => (
                            <button
                              key={`${location.lat}-${location.lon}`}
                              onClick={() => handleLocationSelect(location)}
                              className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                            >
                              <div className="font-medium text-gray-900 dark:text-gray-100">
                                {location.name}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {location.country}
                              </div>
                            </button>
                          ))}
                        </div>
                      )}

                      {isSearching && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <div className="animate-spin h-5 w-5 text-gray-400">
                            <svg className="h-5 w-5" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <LocationHistory onSelectLocation={handleLocationSelect} />
              </div>
            </ErrorBoundary>
          </div>

          {/* Weather Display */}
          <div className="lg:col-span-8">
            <ErrorBoundary>
              <Suspense fallback={<WeatherSkeleton />}>
                {error ? (
                  <ErrorMessage
                    title="Failed to load weather data"
                    message={error}
                    retry={handleRetry}
                  />
                ) : weatherData && forecastData ? (
                  <div className="bg-surface-light dark:bg-surface-dark rounded-lg shadow overflow-hidden">
                    <div className="p-6">
                      {/* Current Weather Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                        <div>
                          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                            {weatherData.location}
                          </h2>
                          <p className="mt-1 text-gray-500 dark:text-gray-400 flex items-center">
                            <img 
                              src={`https://openweathermap.org/img/wn/${weatherData.icon}@2x.png`}
                              alt={weatherData.condition}
                              className="w-10 h-10 -ml-2"
                            />
                            <span className="capitalize">{weatherData.description}</span>
                          </p>
                        </div>
                        <div className="mt-4 sm:mt-0 text-right">
                          <div className="text-4xl font-bold text-gray-900 dark:text-gray-100">
                            <TemperatureDisplay value={weatherData.temperature} />
                          </div>
                          <p className="text-gray-500 dark:text-gray-400">
                            Feels like <TemperatureDisplay value={weatherData.feelsLike} />
                          </p>
                        </div>
                      </div>

                      {/* Weather Details Grid */}
                      {isLoading ? (
                        <div className="animate-pulse space-y-4">
                          {/* Loading skeletons for weather details */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[...Array(6)].map((_, i) => (
                              <div key={i} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2"></div>
                                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Humidity</p>
                            <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-gray-100">
                              {weatherData.humidity}%
                            </p>
                          </div>

                          {weatherData.windSpeed !== undefined && (
                            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Wind Speed</p>
                              <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-gray-100">
                                <WindSpeedDisplay value={weatherData.windSpeed} />
                              </p>
                            </div>
                          )}

                          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Pressure</p>
                            <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-gray-100">
                              {weatherData.pressure} hPa
                            </p>
                          </div>

                          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Visibility</p>
                            <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-gray-100">
                              {weatherData.visibility} km
                            </p>
                          </div>

                          {weatherData.airQuality && (
                            <div>
                              <AirQuality 
                                aqi={weatherData.airQuality.aqi} 
                                components={weatherData.airQuality.components} 
                              />
                            </div>
                          )}

                          {weatherData.precipitation && (
                            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                                Precipitation
                              </h3>
                              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                {Math.round(weatherData.precipitation.probability * 100)}%
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                Amount: {weatherData.precipitation.amount}mm
                              </p>
                            </div>
                          )}

                          {weatherData.sun && (
                            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                                Daylight
                              </h3>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-gray-600 dark:text-gray-300">Sunrise</span>
                                  <span className="text-gray-900 dark:text-gray-100">{formatTime(weatherData.sun.sunrise)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600 dark:text-gray-300">Sunset</span>
                                  <span className="text-gray-900 dark:text-gray-100">{formatTime(weatherData.sun.sunset)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600 dark:text-gray-300">Day Length</span>
                                  <span className="text-gray-900 dark:text-gray-100">
                                    {Math.floor(weatherData.sun.dayLength / 60)}h {weatherData.sun.dayLength % 60}m
                                  </span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Forecast section */}
                    <div className="border-t border-gray-200 dark:border-gray-700">
                      <div className="p-6">
                        <ForecastDisplay forecast={forecastData} />
                      </div>
                    </div>
                  </div>
                ) : null}
              </Suspense>
            </ErrorBoundary>
          </div>
        </div>
      </main>
    </div>
  );
} 