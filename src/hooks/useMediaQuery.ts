import { useState, useEffect } from 'react'

/**
 * Custom hook that returns whether a media query matches.
 * 
 * @param query - The media query to match
 * @returns Whether the media query matches
 */
export function useMediaQuery(query: string): boolean {
    const [matches, setMatches] = useState(false)

    useEffect(() => {
        // Check if window is defined (so code runs client-side only)
        if (typeof window !== 'undefined') {
            const media = window.matchMedia(query)

            // Set initial value
            if (media.matches !== matches) {
                setMatches(media.matches)
            }

            // Create event listener
            const listener = () => setMatches(media.matches)
            media.addEventListener('change', listener)

            // Cleanup
            return () => media.removeEventListener('change', listener)
        }
    }, [matches, query])

    return matches
}