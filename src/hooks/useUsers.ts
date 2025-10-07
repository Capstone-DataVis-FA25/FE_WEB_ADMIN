import { useQuery } from '@tanstack/react-query'
import { apiService } from '../services/api'

interface User {
    id: number
    name: string
    email: string
}

export const useUsers = () => {
    return useQuery<User[]>({
        queryKey: ['users'],
        queryFn: () => apiService.getUsers(),
    })
}

export const useUser = (id: number) => {
    return useQuery<User>({
        queryKey: ['user', id],
        queryFn: () => apiService.getUserById(id),
    })
}