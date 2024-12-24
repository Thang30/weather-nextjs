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
        {/* You can add an icon here */}
        ⚙️
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg p-4 z-50">
          <h3 className="text-lg font-semibold mb-4">Preferences</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Temperature Unit
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
                Theme
              </label>
              <select
                value={preferences.theme}
                onChange={(e) => updatePreferences({ 
                  theme: e.target.value as 'light' | 'dark' | 'system' 
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 