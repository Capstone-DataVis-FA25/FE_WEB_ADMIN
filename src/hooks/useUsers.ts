import { useQuery } from '@tanstack/react-query'
import { userService } from '../services/user'

interface User {
    id: number | string;
    name: string;
    email: string;
    firstName?: string;
    lastName?: string;
    role?: 'USER' | 'ADMIN';
    isActive?: boolean;
    isVerified?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export const useUsers = () => {
    return useQuery<User[]>({
        queryKey: ['users'],
        queryFn: () => userService.getUsers(),
    })
}

export const useUser = (id: number | string) => {
    return useQuery<User>({
        queryKey: ['user', id],
        queryFn: () => userService.getUserById(id),
    })
}