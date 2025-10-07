// API service using Axios client with TanStack Query
import apiClient from '../lib/apiClient'

export interface User {
    id: number
    name: string
    email: string
}

class ApiService {
    async getUsers(): Promise<User[]> {
        return apiClient.get<User[]>('/users')
    }

    async getUserById(id: number): Promise<User> {
        return apiClient.get<User>(`/users/${id}`)
    }

    // Additional API methods can be added here
    async createUser(userData: Omit<User, 'id'>): Promise<User> {
        return apiClient.post<User>('/users', userData)
    }

    async updateUser(id: number, userData: Partial<User>): Promise<User> {
        return apiClient.put<User>(`/users/${id}`, userData)
    }

    async deleteUser(id: number): Promise<void> {
        return apiClient.delete<void>(`/users/${id}`)
    }
}

export const apiService = new ApiService()