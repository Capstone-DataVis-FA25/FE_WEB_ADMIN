import { useMutation, useQueryClient } from '@tanstack/react-query';
import { subscriptionPlansApi } from '../services/subscriptionPlans';
import type { CreateSubscriptionPlanDto, UpdateSubscriptionPlanDto } from '../types';
import { subscriptionPlanKeys } from './subscriptionPlanKeys';

// Hook for creating a subscription plan
export const useCreateSubscriptionPlan = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (planData: CreateSubscriptionPlanDto) =>
            subscriptionPlansApi.createPlan(planData),
        onSuccess: () => {
            // Invalidate and refetch all subscription plans
            queryClient.invalidateQueries({ queryKey: subscriptionPlanKeys.lists() });
        },
    });
};

// Hook for updating a subscription plan
export const useUpdateSubscriptionPlan = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, planData }: { id: string; planData: UpdateSubscriptionPlanDto }) =>
            subscriptionPlansApi.updatePlan(id, planData),
        onSuccess: (_, variables) => {
            // Invalidate and refetch the updated plan
            queryClient.invalidateQueries({ queryKey: subscriptionPlanKeys.detail(variables.id) });
            // Also invalidate the list to update the list view
            queryClient.invalidateQueries({ queryKey: subscriptionPlanKeys.lists() });
        },
    });
};

// Hook for deleting a subscription plan
export const useDeleteSubscriptionPlan = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => subscriptionPlansApi.deletePlan(id),
        onSuccess: () => {
            // Invalidate and refetch all subscription plans
            queryClient.invalidateQueries({ queryKey: subscriptionPlanKeys.lists() });
        },
    });
};