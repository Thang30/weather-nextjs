export const mockWeatherData = {
  temperature: 22.5,
  condition: "Clear sky",
  humidity: 65,
  windSpeed: 5.2,
  icon: "01d",
  location: "London"
};

export const mockForecastData = {
  list: [
    {
      dt: Date.now(),
      temp: 22.5,
      weather: [{
        description: "Clear sky",
        icon: "01d"
      }]
    },
    // Add more forecast days...
  ]
};

export const mockLocationData = [
  {
    name: "London",
    lat: 51.5074,
    lon: -0.1278,
    country: "GB"
  },
  {
    name: "Paris",
    lat: 48.8566,
    lon: 2.3522,
    country: "FR"
  }
]; 