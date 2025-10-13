import apiClient from '../lib/apiClient'
import type { User, CreateUserDto, UpdateUserDto, ChangePasswordDto } from '../types'

class UserService {
    async getUsers(): Promise<User[]> {
        return apiClient.get<User[]>('/users')
    }

    async getUserById(id: number | string): Promise<User> {
        return apiClient.get<User>(`/users/${id}`)
    }

    async getProfile(): Promise<User> {
        return apiClient.get<User>('/users/me')
    }

    // Additional API methods can be added here
    async createUser(userData: CreateUserDto): Promise<User> {
        return apiClient.post<User>('/users', userData)
    }

    async updateUser(id: number | string, userData: UpdateUserDto): Promise<User> {
        return apiClient.put<User>(`/users/${id}`, userData)
    }

    async updateProfile(userData: UpdateUserDto): Promise<User> {
        return apiClient.patch<User>('/users/me/update-profile', userData)
    }

    async changePassword(passwordData: ChangePasswordDto): Promise<void> {
        return apiClient.patch<void>('/users/me/change-password', passwordData)
    }

    async deleteUser(id: number | string): Promise<void> {
        // For delete with email confirmation, we need to send email in body
        return apiClient.delete<void>(`/users/${id}`)
    }
}

export const userService = new UserService()