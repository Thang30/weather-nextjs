import { useWeather } from '@/hooks/useWeather';
import { useEffect, useState } from 'react';
import { LocationHistory } from '@/components/LocationHistory';
import { addToLocationHistory } from '@/utils/locationHistory';
import { PreferencesPanel } from '@/components/PreferencesPanel';
import { usePreferences } from '@/contexts/PreferencesContext';

export function WeatherDashboard() {
  const { weatherData, forecastData, isLoading, error, fetchWeather, searchCity } = useWeather();
  const [searchQuery, setSearchQuery] = useState('');
  const { preferences } = usePreferences();

  // Use default location from preferences if available
  useEffect(() => {
    if (preferences.defaultLocation) {
      const { lat, lon } = preferences.defaultLocation;
      fetchWeather(lat, lon);
    } else {
      // Fallback to London
      fetchWeather(51.5074, -0.1278);
    }
  }, [fetchWeather, preferences.defaultLocation]);

  const convertTemperature = (celsius: number): number => {
    if (preferences.temperatureUnit === 'fahrenheit') {
      return (celsius * 9/5) + 32;
    }
    return celsius;
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    const locations = await searchCity(searchQuery);
    if (locations.length > 0) {
      const { lat, lon, name, country } = locations[0];
      
      // Add to location history with current weather
      addToLocationHistory({
        name,
        country,
        lat,
        lon,
        lastWeather: weatherData ? {
          temperature: weatherData.temperature,
          condition: weatherData.condition
        } : undefined
      });

      fetchWeather(lat, lon);
      setSearchQuery('');
    }
  };

  const handleLocationSelect = (lat: number, lon: number) => {
    fetchWeather(lat, lon);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Weather Dashboard</h1>
        <PreferencesPanel />
      </div>

      <div className="mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="Search city..."
          className="p-2 border rounded"
        />
        <button
          onClick={handleSearch}
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Search
        </button>
      </div>

      <LocationHistory onSelectLocation={handleLocationSelect} />

      {isLoading && <div>Loading...</div>}
      {error && <div className="text-red-500">Error: {error}</div>}

      {weatherData && (
        <div className="weather-info mt-4">
          <h2 className="text-2xl font-bold">{weatherData.location}</h2>
          <p>Temperature: {convertTemperature(weatherData.temperature)}°
            {preferences.temperatureUnit === 'celsius' ? 'C' : 'F'}
          </p>
          <p>Condition: {weatherData.condition}</p>
          <p>Humidity: {weatherData.humidity}%</p>
          <p>Wind Speed: {weatherData.windSpeed} m/s</p>
        </div>
      )}

      {/* Add forecast display here */}
    </div>
  );
} 