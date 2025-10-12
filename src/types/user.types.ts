export interface User {
    id: number | string; // Support both number and string for flexibility
    name: string;
    email: string;
    firstName?: string;
    lastName?: string;
    role?: 'USER' | 'ADMIN';
    isActive?: boolean;
    isVerified?: boolean;
    createdAt?: string; // Date as string
    updatedAt?: string; // Date as string
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

export interface AuthUser {
    userId: number | string;
    email: string;
}