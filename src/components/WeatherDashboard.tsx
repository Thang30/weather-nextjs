import { useWeather } from '@/hooks/useWeather';
import { useEffect, useState } from 'react';
import { SearchHistory } from '@/components/SearchHistory';
import { addToSearchHistory } from '@/utils/searchHistory';

export function WeatherDashboard() {
  const { weatherData, forecastData, isLoading, error, fetchWeather, searchCity } = useWeather();
  const [searchQuery, setSearchQuery] = useState('');

  // Demo coordinates (London)
  useEffect(() => {
    fetchWeather(51.5074, -0.1278);
  }, [fetchWeather]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    const locations = await searchCity(searchQuery);
    if (locations.length > 0) {
      const { lat, lon, name } = locations[0];
      
      // Add to search history
      addToSearchHistory({
        query: name,
        lat,
        lon
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

      <SearchHistory onSelectLocation={handleLocationSelect} />

      {isLoading && <div>Loading...</div>}
      {error && <div className="text-red-500">Error: {error}</div>}

      {weatherData && (
        <div className="weather-info mt-4">
          <h2 className="text-2xl font-bold">{weatherData.location}</h2>
          <p>Temperature: {weatherData.temperature}°C</p>
          <p>Condition: {weatherData.condition}</p>
          <p>Humidity: {weatherData.humidity}%</p>
          <p>Wind Speed: {weatherData.windSpeed} m/s</p>
        </div>
      )}

      {/* Add forecast display here */}
    </div>
  );
} 