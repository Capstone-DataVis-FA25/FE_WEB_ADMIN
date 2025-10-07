import { useState, useCallback } from 'react'

/**
 * Custom hook that manages a boolean toggle state.
 * 
 * @param initialValue - The initial toggle value (default: false)
 * @returns The toggle state and functions to control it
 */
export function useToggle(initialValue = false) {
    const [value, setValue] = useState(initialValue)

    const toggle = useCallback(() => {
        setValue(prev => !prev)
    }, [])

    const setTrue = useCallback(() => {
        setValue(true)
    }, [])

    const setFalse = useCallback(() => {
        setValue(false)
    }, [])

    return [value, { toggle, setTrue, setFalse }] as const
}