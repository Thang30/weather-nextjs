export interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed?: number;
  feelsLike: number;
  icon: string;
  description: string;
  pressure: number;
  visibility: number;
  sunrise?: number;
  sunset?: number;
  alerts?: WeatherAlert[];
  airQuality?: {
    aqi: number;  // 1-5 scale
    components: {
      co: number;   // Carbon monoxide (μg/m3)
      no2: number;  // Nitrogen dioxide (μg/m3)
      o3: number;   // Ozone (μg/m3)
      pm2_5: number; // Fine particles (μg/m3)
      pm10: number;  // Coarse particles (μg/m3)
    };
  };
  precipitation?: {
    probability: number; // 0-1
    amount: number;     // mm
  };
  sun: {
    sunrise: number;
    sunset: number;
    dayLength: number; // in minutes
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