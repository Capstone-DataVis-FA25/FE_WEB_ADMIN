export interface SubscriptionFormFields {
    name: string;
    price: string | number;
    maxDatasets?: string | number | null;
    maxCharts?: string | number | null;
    maxFileSize?: string | number | null;
}

export type ShowErrorFn = (args: {
    title: string;
    description: string;
    variant?: 'default' | 'success' | 'destructive' | 'info';
    duration?: number;
}) => string;

export function validateSubscriptionPlanForm(
    fields: SubscriptionFormFields,
    showError: ShowErrorFn
): boolean {
    const { name, price, maxDatasets, maxCharts, maxFileSize } = fields;

    if (!name || !String(name).trim()) {
        showError({ title: 'Validation', description: 'Plan name is required', variant: 'destructive' });
        return false;
    }

    const parsedPrice = typeof price === 'number' ? price : parseFloat(String(price || ''));
    if (Number.isNaN(parsedPrice) || parsedPrice < 0) {
        showError({ title: 'Validation', description: 'Valid price is required', variant: 'destructive' });
        return false;
    }

    if (maxDatasets !== undefined && maxDatasets !== null && String(maxDatasets).trim() !== '') {
        const parsed = parseInt(String(maxDatasets), 10);
        if (Number.isNaN(parsed) || parsed <= 0) {
            showError({ title: 'Validation', description: 'Max datasets must be a positive number', variant: 'destructive' });
            return false;
        }
    }

    if (maxCharts !== undefined && maxCharts !== null && String(maxCharts).trim() !== '') {
        const parsed = parseInt(String(maxCharts), 10);
        if (Number.isNaN(parsed) || parsed <= 0) {
            showError({ title: 'Validation', description: 'Max charts must be a positive number', variant: 'destructive' });
            return false;
        }
    }

    if (maxFileSize !== undefined && maxFileSize !== null && String(maxFileSize).trim() !== '') {
        const parsed = parseInt(String(maxFileSize), 10);
        if (Number.isNaN(parsed) || parsed <= 0) {
            showError({ title: 'Validation', description: 'Max file size must be a positive number', variant: 'destructive' });
            return false;
        }
    }

    return true;
}
