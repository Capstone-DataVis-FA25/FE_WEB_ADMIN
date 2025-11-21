export function formatPrice(price: number | string | undefined, currency?: string): string {
    const value = typeof price === 'number' ? price : Number(price ?? NaN);
    const raw = (currency || '').toString().trim();
    const curr = raw.toUpperCase();
    const isThreeLetter = /^[A-Z]{3}$/.test(curr);

    try {
        if (isThreeLetter && Number.isFinite(value)) {
            return new Intl.NumberFormat(undefined, {
                style: 'currency',
                currency: curr,
            }).format(value);
        }

        if (Number.isFinite(value)) {
            return new Intl.NumberFormat(undefined, {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2,
            }).format(value);
        }

        return String(price ?? '');
    } catch {
        const safe = Number.isFinite(value) ? value.toFixed(2) : String(price ?? '');
        return isThreeLetter ? `${safe} ${curr}` : safe;
    }
}

export function formatInterval(interval?: string): string {
    if (!interval) return '';
    switch (interval.toLowerCase()) {
        case 'month':
            return '/month';
        case 'year':
            return '/year';
        default:
            return `/${interval}`;
    }
}

export function formatDate(dateString?: string): string {
    if (!dateString) return '-';
    const d = new Date(dateString);
    if (Number.isNaN(d.getTime())) return '-';
    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}
