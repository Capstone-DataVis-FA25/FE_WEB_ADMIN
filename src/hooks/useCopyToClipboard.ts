import { useState } from 'react'

type CopyFn = (text: string) => Promise<boolean>

interface UseCopyToClipboardReturn {
    copiedText: string | null
    copy: CopyFn
    isSuccess: boolean
}

/**
 * Custom hook for copying text to clipboard.
 * 
 * @returns The copied text, copy function, and success status
 */
export function useCopyToClipboard(): UseCopyToClipboardReturn {
    const [copiedText, setCopiedText] = useState<string | null>(null)
    const [isSuccess, setIsSuccess] = useState(false)

    const copy: CopyFn = async (text) => {
        if (!navigator?.clipboard) {
            console.warn('Clipboard not supported')
            return false
        }

        try {
            await navigator.clipboard.writeText(text)
            setCopiedText(text)
            setIsSuccess(true)
            return true
        } catch (error) {
            console.warn('Copy failed', error)
            setCopiedText(null)
            setIsSuccess(false)
            return false
        }
    }

    return { copiedText, copy, isSuccess }
}