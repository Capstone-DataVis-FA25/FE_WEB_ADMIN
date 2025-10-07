import { useEffect } from 'react'
import type { RefObject } from 'react'

type AnyEvent = MouseEvent | TouchEvent

/**
 * Custom hook that detects clicks outside of a specified element.
 * 
 * @param ref - The React ref of the element to detect clicks outside of
 * @param callback - The callback function to call when a click outside is detected
 */
export function useOnClickOutside<T extends HTMLElement = HTMLElement>(
    ref: RefObject<T | null>,
    callback: (event: AnyEvent) => void
): void {
    useEffect(() => {
        const listener = (event: AnyEvent) => {
            const el = ref?.current

            // Do nothing if clicking ref's element or descendent elements
            if (!el || el.contains(event.target as Node)) {
                return
            }

            callback(event)
        }

        document.addEventListener('mousedown', listener)
        document.addEventListener('touchstart', listener)

        return () => {
            document.removeEventListener('mousedown', listener)
            document.removeEventListener('touchstart', listener)
        }
    }, [ref, callback])
}