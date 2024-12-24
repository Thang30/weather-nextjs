export interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  description: string;
  humidity: number;
  windSpeed: number;
  feelsLike: number;
  icon: string;
  pressure: number;
  visibility: number;
  sunrise: number;
  sunset: number;
  airQuality?: {
    aqi: number;
    components: {
      co: number;
      no2: number;
      o3: number;
      pm2_5: number;
      pm10: number;
    };
  };
  precipitation?: {
    probability: number;
    amount: number;
  };
  sun?: {
    sunrise: number;
    sunset: number;
    dayLength: number;
  };
}

export interface ForecastData {
  list: Array<{
    dt: number;
    temp: number;
    weather: Array<{
      description: string;
      icon: string;
    }>;
  }>;
}

export interface LocationData {
  name: string;
  country: string;
  lat: number;
  lon: number;
}

export interface LocationHistoryItem extends LocationData {
  timestamp: number;
  lastWeather?: {
    temperature: number;
    condition: string;
  };
}

export interface UserPreferences {
  temperatureUnit: 'celsius' | 'fahrenheit';
  speedUnit: 'ms' | 'kmh' | 'mph';
  theme: 'light' | 'dark';
  defaultLocation?: {
    lat: number;
    lon: number;
  };
}

export interface WeatherAlert {
  senderName: string;
  event: string;
  start: number;
  end: number;
  description: string;
  severity: 'moderate' | 'severe' | 'extreme';
} 