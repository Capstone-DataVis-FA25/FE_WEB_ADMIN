import { useState, useEffect, useCallback } from 'react'

interface AsyncState<T> {
    loading: boolean
    error: Error | null
    value: T | null
}

interface UseAsyncReturn<T> extends AsyncState<T> {
    execute: () => Promise<T | void>
}

/**
 * Custom hook for handling asynchronous operations.
 * 
 * @param asyncFunction - The async function to execute
 * @param immediate - Whether to execute immediately
 * @returns The async state and execute function
 */
export function useAsync<T>(
    asyncFunction: () => Promise<T>,
    immediate = false
): UseAsyncReturn<T> {
    const [state, setState] = useState<AsyncState<T>>({
        loading: false,
        error: null,
        value: null,
    })

    // Execute the async function
    const execute = useCallback(() => {
        setState({ loading: true, error: null, value: null })

        return asyncFunction()
            .then((value) => {
                setState({ loading: false, error: null, value })
                return value
            })
            .catch((error) => {
                setState({ loading: false, error, value: null })
            })
    }, [asyncFunction])

    // Execute immediately if requested
    useEffect(() => {
        if (immediate) {
            execute()
        }
    }, [execute, immediate])

    return { ...state, execute }
}