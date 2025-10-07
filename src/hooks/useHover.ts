import { useState, useEffect, useRef } from 'react'
import type { RefObject } from 'react'

/**
 * Custom hook for detecting hover state on an element.
 * 
 * @returns A ref to attach to the element and the hover state
 */
export function useHover<T extends HTMLElement = HTMLElement>(): [
    RefObject<T>,
    boolean
] {
    const [isHovered, setIsHovered] = useState(false)
    const ref = useRef<T>(null)

    useEffect(() => {
        const element = ref.current

        if (!element) return

        const handleMouseEnter = () => setIsHovered(true)
        const handleMouseLeave = () => setIsHovered(false)

        element.addEventListener('mouseenter', handleMouseEnter)
        element.addEventListener('mouseleave', handleMouseLeave)

        return () => {
            element.removeEventListener('mouseenter', handleMouseEnter)
            element.removeEventListener('mouseleave', handleMouseLeave)
        }
    }, [])

    return [ref as RefObject<T>, isHovered]
}