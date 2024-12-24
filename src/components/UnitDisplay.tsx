'use client';

import { usePreferences } from '@/contexts/PreferencesContext';

interface TemperatureDisplayProps {
  value: number;
}

interface WindSpeedDisplayProps {
  value: number;
}

export function TemperatureDisplay({ value }: TemperatureDisplayProps) {
  const { preferences } = usePreferences();
  const unit = preferences.temperatureUnit;
  
  const displayValue = unit === 'fahrenheit' ? (value * 9/5) + 32 : value;
  const symbol = unit === 'fahrenheit' ? '°F' : '°C';
  
  return <>{Math.round(displayValue)}{symbol}</>;
}

export function WindSpeedDisplay({ value }: WindSpeedDisplayProps) {
  const { preferences } = usePreferences();
  const unit = preferences.speedUnit;
  
  let displayValue = value;
  let symbol = 'm/s';
  
  if (unit === 'kmh') {
    displayValue = value * 3.6;
    symbol = 'km/h';
  } else if (unit === 'mph') {
    displayValue = value * 2.237;
    symbol = 'mph';
  }
  
  return <>{Math.round(displayValue)} {symbol}</>;
} 