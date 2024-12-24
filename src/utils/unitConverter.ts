export type TemperatureUnit = 'celsius' | 'fahrenheit';
export type SpeedUnit = 'ms' | 'kmh' | 'mph';

export const UnitConverter = {
  temperature: {
    celsiusToFahrenheit: (celsius: number): number => {
      return (celsius * 9/5) + 32;
    },
    fahrenheitToCelsius: (fahrenheit: number): number => {
      return (fahrenheit - 32) * 5/9;
    },
    format: (value: number, unit: TemperatureUnit): string => {
      return `${Math.round(value)}°${unit === 'celsius' ? 'C' : 'F'}`;
    }
  },
  
  speed: {
    msToKmh: (ms: number): number => {
      return ms * 3.6;
    },
    msToMph: (ms: number): number => {
      return ms * 2.237;
    },
    format: (value: number | undefined, unit: SpeedUnit): string => {
      if (value === undefined || value === null) return 'N/A';
      
      switch (unit) {
        case 'ms':
          return `${value.toFixed(1)} m/s`;
        case 'kmh':
          return `${Math.round(UnitConverter.speed.msToKmh(value))} km/h`;
        case 'mph':
          return `${Math.round(UnitConverter.speed.msToMph(value))} mph`;
      }
    }
  }
}; 