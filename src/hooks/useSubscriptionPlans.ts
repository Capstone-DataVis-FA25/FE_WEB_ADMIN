import { useQuery } from '@tanstack/react-query';
import { subscriptionPlansApi } from '../services/subscriptionPlans';
import type { SubscriptionPlan } from '../types';
import { subscriptionPlanKeys } from './subscriptionPlanKeys';

// Hook to fetch all subscription plans
export const useSubscriptionPlans = () => {
    return useQuery<SubscriptionPlan[], Error>({
        queryKey: subscriptionPlanKeys.lists(),
        queryFn: () => subscriptionPlansApi.getAllPlans(),
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};

// Hook to fetch a single subscription plan by ID
export const useSubscriptionPlan = (id: string) => {
    return useQuery<SubscriptionPlan, Error>({
        queryKey: subscriptionPlanKeys.detail(id),
        queryFn: () => subscriptionPlansApi.getPlanById(id),
        enabled: !!id,
    });
};