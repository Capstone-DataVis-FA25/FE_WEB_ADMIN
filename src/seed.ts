/**
 * Seed data for the application
 * This file contains sample users for development and testing purposes
 */

// Based on the Prisma schema provided
interface User {
    id: string;
    email: string;
    password?: string;
    firstName?: string;
    lastName?: string;
    name: string; // Computed field
    role: 'USER' | 'ADMIN';
    isActive: boolean;
    isVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
    currentHashedRefreshToken?: string;
    currentVerifyToken?: string;
}

// Sample users data
export const seedUsers: User[] = [
    // Admin user
    {
        id: '1',
        email: 'admin@example.com',
        password: '$2b$10$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', // hashed password for "admin123"
        firstName: 'Admin',
        lastName: 'User',
        name: 'Admin User',
        role: 'ADMIN',
        isActive: true,
        isVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    // Regular users
    {
        id: '2',
        email: 'user1@example.com',
        password: '$2b$10$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', // hashed password for "user123"
        firstName: 'John',
        lastName: 'Doe',
        name: 'John Doe',
        role: 'USER',
        isActive: true,
        isVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: '3',
        email: 'user2@example.com',
        password: '$2b$10$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', // hashed password for "user456"
        firstName: 'Jane',
        lastName: 'Smith',
        name: 'Jane Smith',
        role: 'USER',
        isActive: true,
        isVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
];

// Export the seed data
export default seedUsers;