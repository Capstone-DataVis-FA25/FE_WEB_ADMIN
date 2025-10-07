import { useState, useEffect, useCallback } from 'react'

/**
 * Custom hook that manages state in localStorage.
 * 
 * @param key - The localStorage key
 * @param initialValue - The initial value
 * @returns A stateful value and a function to update it
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
    // Get value from localStorage or use initialValue
    const readValue = useCallback((): T => {
        if (typeof window === 'undefined') {
            return initialValue
        }

        try {
            const item = window.localStorage.getItem(key)
            return item ? JSON.parse(item) : initialValue
        } catch (error) {
            console.warn(`Error reading localStorage key "${key}":`, error)
            return initialValue
        }
    }, [initialValue, key])

    const [storedValue, setStoredValue] = useState<T>(readValue)

    // Update localStorage when state changes
    const setValue: (value: T | ((val: T) => T)) => void = (value) => {
        if (typeof window === 'undefined') {
            console.warn(`Tried setting localStorage key "${key}" even though environment is not a client`)
            return
        }

        try {
            // Allow value to be a function so we have the same API as useState
            const newValue = value instanceof Function ? value(storedValue) : value

            // Save to localStorage
            window.localStorage.setItem(key, JSON.stringify(newValue))

            // Save state
            setStoredValue(newValue)

            // Dispatch custom event to notify other hooks
            window.dispatchEvent(new Event('local-storage'))
        } catch (error) {
            console.warn(`Error setting localStorage key "${key}":`, error)
        }
    }

    useEffect(() => {
        setStoredValue(readValue())
    }, [readValue])

    useEffect(() => {
        const handleStorageChange = () => {
            setStoredValue(readValue())
        }

        // Listen to storage changes
        window.addEventListener('storage', handleStorageChange)

        // Listen to custom local-storage event
        window.addEventListener('local-storage', handleStorageChange)

        return () => {
            window.removeEventListener('storage', handleStorageChange)
            window.removeEventListener('local-storage', handleStorageChange)
        }
    }, [readValue])

    return [storedValue, setValue]
}