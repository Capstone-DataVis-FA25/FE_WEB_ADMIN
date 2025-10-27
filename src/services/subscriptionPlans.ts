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
        return apiClient.post('/subscription-plans', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
            },
            body: planData,
        });
    },

    // Update an existing subscription plan
    updatePlan: async (id: string, planData: UpdateSubscriptionPlanDto): Promise<{ plan: SubscriptionPlan; message: string }> => {
        return apiClient.patch(`/subscription-plans/${id}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
            },
            body: JSON.stringify(planData),
        });
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