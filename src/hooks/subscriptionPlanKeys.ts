// Query keys for subscription plans
export const subscriptionPlanKeys = {
    all: ['subscriptionPlans'] as const,
    lists: () => [...subscriptionPlanKeys.all, 'list'] as const,
    list: (filters: Record<string, unknown>) => [...subscriptionPlanKeys.lists(), filters] as const,
    details: () => [...subscriptionPlanKeys.all, 'detail'] as const,
    detail: (id: string) => [...subscriptionPlanKeys.details(), id] as const,
};