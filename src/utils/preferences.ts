export interface UserPreferences {
  temperatureUnit: 'celsius' | 'fahrenheit';
  speedUnit: 'ms' | 'kmh' | 'mph';
  theme: 'light' | 'dark' | 'system';
  defaultLocation?: {
    name: string;
    lat: number;
    lon: number;
  };
}

const PREFERENCES_KEY = 'weatherAppPreferences';

const DEFAULT_PREFERENCES: UserPreferences = {
  temperatureUnit: 'celsius',
  speedUnit: 'ms',
  theme: 'system',
};

export function getUserPreferences(): UserPreferences {
  if (typeof window === 'undefined') return DEFAULT_PREFERENCES;
  
  const stored = localStorage.getItem(PREFERENCES_KEY);
  return stored ? JSON.parse(stored) : DEFAULT_PREFERENCES;
}

export function saveUserPreferences(preferences: Partial<UserPreferences>): void {
  const current = getUserPreferences();
  const updated = { ...current, ...preferences };
  localStorage.setItem(PREFERENCES_KEY, JSON.stringify(updated));
}

export function clearUserPreferences(): void {
  localStorage.removeItem(PREFERENCES_KEY);
} 