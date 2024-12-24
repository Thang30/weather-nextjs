'use client';

import { usePreferences } from '@/contexts/PreferencesContext';
import { UnitConverter, TemperatureUnit, SpeedUnit } from '@/utils/unitConverter';

interface TemperatureDisplayProps {
  value: number;
  className?: string;
}

interface WindSpeedDisplayProps {
  value: number;
  className?: string;
}

export function TemperatureDisplay({ value, className }: TemperatureDisplayProps) {
  const { preferences } = usePreferences();
  const displayValue = preferences.temperatureUnit === 'fahrenheit' 
    ? UnitConverter.temperature.celsiusToFahrenheit(value)
    : value;

  return (
    <span className={className}>
      {UnitConverter.temperature.format(displayValue, preferences.temperatureUnit)}
    </span>
  );
}

export function WindSpeedDisplay({ value, className }: WindSpeedDisplayProps) {
  const { preferences } = usePreferences();
  const unit = preferences.speedUnit || 'ms';

  return (
    <span className={className}>
      {UnitConverter.speed.format(value, unit)}
    </span>
  );
} 