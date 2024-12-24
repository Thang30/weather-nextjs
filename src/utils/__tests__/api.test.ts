import { fetchWeatherData, fetchForecast, searchLocation } from '../api';
import { mockWeatherData, mockForecastData, mockLocationData } from '../mockData';

describe('Weather API', () => {
  it('should fetch weather data', async () => {
    const data = await fetchWeatherData(51.5074, -0.1278);
    expect(data).toEqual(mockWeatherData);
  });

  it('should fetch forecast data', async () => {
    const data = await fetchForecast(51.5074, -0.1278);
    expect(data).toEqual(mockForecastData);
  });

  it('should search locations', async () => {
    const data = await searchLocation('London');
    expect(data).toContainEqual(mockLocationData[0]);
  });
}); 