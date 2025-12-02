import apiClient from '@/lib/apiClient';
import type { SubscriptionPlan, CreateSubscriptionPlanDto, UpdateSubscriptionPlanDto } from '../types';
// Subscription Plans API Service
export const subscriptionPlansApi = {
    // Get all subscription plans
    getAllPlans: async (): Promise<SubscriptionPlan[]> => {
        return apiClient.get('/subscription-plans', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
            },
        });
    },

    // Get a specific subscription plan by ID
    getPlanById: async (id: string): Promise<SubscriptionPlan> => {
        return apiClient.get(`/subscription-plans/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
            },
        });
    },

    // Create a new subscription plan
    createPlan: async (planData: CreateSubscriptionPlanDto): Promise<{ plan: SubscriptionPlan; message: string }> => {
        // axios expects (url, data, config). apiClient.post forwards to axios.post.
        // The auth header is already added by the apiClient interceptor, so just pass planData as the request body.
        return apiClient.post('/subscription-plans', planData);
    },

    // Update an existing subscription plan
    updatePlan: async (id: string, planData: UpdateSubscriptionPlanDto): Promise<{ plan: SubscriptionPlan; message: string }> => {
        // Pass planData directly so axios sends proper JSON body
        return apiClient.patch(`/subscription-plans/${id}`, planData);
    },

    // Delete a subscription plan
    deletePlan: async (id: string): Promise<{ message: string }> => {
        return apiClient.delete(`/subscription-plans/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
            },
        });
    },
};