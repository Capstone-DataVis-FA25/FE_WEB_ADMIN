export interface PlanLimits {
    maxDatasets?: number;
    maxCharts?: number;
    maxFileSize?: number;
}

export interface SubscriptionPlan {
    id: string;
    name: string;
    description?: string;
    price: number;
    currency: string;
    interval: string;
    features?: string[];
    limits?: PlanLimits;
    isActive: boolean;
    sortOrder: number;
    stripePriceId?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateSubscriptionPlanDto {
    name: string;
    description?: string;
    price: number;
    currency?: string;
    interval?: string;
    features?: string[];
    limits?: PlanLimits;
    isActive?: boolean;
    sortOrder?: number;
    stripePriceId?: string;
}

export interface UpdateSubscriptionPlanDto {
    name?: string;
    description?: string;
    price?: number;
    currency?: string;
    interval?: string;
    features?: string[];
    limits?: PlanLimits;
    isActive?: boolean;
    sortOrder?: number;
    stripePriceId?: string;
}