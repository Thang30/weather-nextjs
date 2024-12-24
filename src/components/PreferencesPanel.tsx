'use client';

import { usePreferences } from '@/contexts/PreferencesContext';
import { useState } from 'react';

export function PreferencesPanel() {
  const { preferences, updatePreferences } = usePreferences();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-gray-600 hover:text-gray-800"
      >
        <span className="sr-only">Settings</span>
        ⚙️
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg p-4 z-50">
          <h3 className="text-lg font-semibold mb-4">Units</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Temperature
              </label>
              <select
                value={preferences.temperatureUnit}
                onChange={(e) => updatePreferences({ 
                  temperatureUnit: e.target.value as 'celsius' | 'fahrenheit' 
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              >
                <option value="celsius">Celsius (°C)</option>
                <option value="fahrenheit">Fahrenheit (°F)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Wind Speed
              </label>
              <select
                value={preferences.speedUnit}
                onChange={(e) => updatePreferences({ 
                  speedUnit: e.target.value as 'ms' | 'kmh' | 'mph' 
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              >
                <option value="ms">Meters per second (m/s)</option>
                <option value="kmh">Kilometers per hour (km/h)</option>
                <option value="mph">Miles per hour (mph)</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 