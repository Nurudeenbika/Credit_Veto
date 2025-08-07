import { useState, useEffect } from "react";
import { storage } from "../lib/utils";

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  // Get initial value from localStorage or use provided initial value
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = storage.get(key);
      return item !== null ? item : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;

      // Save state
      setStoredValue(valueToStore);

      // Save to localStorage
      storage.set(key, valueToStore);
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
}

// Hook for managing form state with localStorage persistence
export function usePersistedFormState<T extends Record<string, any>>(
  key: string,
  initialState: T
): [T, (field: keyof T, value: any) => void, () => void] {
  const [formState, setFormState] = useLocalStorage<T>(key, initialState);

  const updateField = (field: keyof T, value: any) => {
    setFormState((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const resetForm = () => {
    setFormState(initialState);
  };

  return [formState, updateField, resetForm];
}

// Hook for managing theme preference
export function useTheme() {
  const [theme, setTheme] = useLocalStorage<"light" | "dark" | "system">(
    "theme",
    "system"
  );

  useEffect(() => {
    const root = document.documentElement;

    if (
      theme === "dark" ||
      (theme === "system" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  return [theme, setTheme] as const;
}

// Hook for managing user preferences
export function useUserPreferences() {
  const [preferences, setPreferences] = useLocalStorage("userPreferences", {
    notifications: true,
    emailUpdates: true,
    darkMode: false,
    language: "en",
  });

  const updatePreference = <K extends keyof typeof preferences>(
    key: K,
    value: (typeof preferences)[K]
  ) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return [preferences, updatePreference] as const;
}
