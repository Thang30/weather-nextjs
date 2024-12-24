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
        className="p-2 text-gray-600 hover:text-gray-800 transition-colors rounded-full hover:bg-gray-100"
        aria-label="Settings"
      >
        ⚙️
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/20 z-40 lg:hidden" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-72 sm:w-96 lg:w-80 bg-white rounded-lg shadow-lg p-4 z-50">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Units</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 lg:hidden"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Temperature
                </label>
                <select
                  value={preferences.temperatureUnit}
                  onChange={(e) => updatePreferences({ 
                    temperatureUnit: e.target.value as 'celsius' | 'fahrenheit' 
                  })}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="celsius">Celsius (°C)</option>
                  <option value="fahrenheit">Fahrenheit (°F)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Wind Speed
                </label>
                <select
                  value={preferences.speedUnit}
                  onChange={(e) => updatePreferences({ 
                    speedUnit: e.target.value as 'ms' | 'kmh' | 'mph' 
                  })}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="ms">Meters per second (m/s)</option>
                  <option value="kmh">Kilometers per hour (km/h)</option>
                  <option value="mph">Miles per hour (mph)</option>
                </select>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
} 