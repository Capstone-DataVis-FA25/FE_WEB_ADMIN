import { useState, useCallback } from 'react'

interface UseModalProps {
    defaultOpen?: boolean
}

interface UseModalReturn {
    isOpen: boolean
    open: () => void
    close: () => void
    toggle: () => void
}

/**
 * Custom hook for managing modal state.
 * 
 * @param props - Configuration options
 * @returns Modal state and control functions
 */
export function useModal(props: UseModalProps = {}): UseModalReturn {
    const { defaultOpen = false } = props
    const [isOpen, setIsOpen] = useState(defaultOpen)

    const open = useCallback(() => {
        setIsOpen(true)
    }, [])

    const close = useCallback(() => {
        setIsOpen(false)
    }, [])

    const toggle = useCallback(() => {
        setIsOpen(prev => !prev)
    }, [])

    return {
        isOpen,
        open,
        close,
        toggle,
    }
}