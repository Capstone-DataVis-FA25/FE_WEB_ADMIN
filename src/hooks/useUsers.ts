import { useQuery } from '@tanstack/react-query'
import { userService } from '../services/user'
import type { User } from '@/types'

export const useUsers = () => {
    return useQuery<User[]>({
        queryKey: ['users'],
        queryFn: () => userService.getUsers(),
    })
}

export const useUser = (id: string) => {
    return useQuery<User>({
        queryKey: ['user', id],
        queryFn: () => userService.getUserById(id),
    })
}