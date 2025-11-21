import { Role } from './role.enum'

export interface User {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    role?: Role;
    isActive?: boolean;
    isVerified?: boolean;
    createdAt?: string;
    updatedAt?: string;
    currentHashedRefreshToken?: string;
    currentVerifyToken?: string | null;
    isSocialAccount?: boolean;
    name?: string;
}

export interface CreateUserDto {
    name: string;
    email: string;
    password: string;
}

export interface UpdateUserDto {
    name?: string;
    email?: string;
}

export interface ChangePasswordDto {
    currentPassword: string;
    newPassword: string;
}

export interface LockUnlockUserDto {
    isActive: boolean;
}

export interface AuthUser {
    userId: string;
    email: string;
}