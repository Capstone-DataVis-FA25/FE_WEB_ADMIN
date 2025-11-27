export const API_ENDPOINTS = {
    USERS: '/users',
    USER_PROFILE: '/users/me',
    USER_PROFILE_UPDATE: '/users/me/update-profile',
    USER_PASSWORD_CHANGE: '/users/me/change-password',
    REVENUE_TOTAL: '/payments/revenue/total',
    REVENUE_LAST_30_DAYS: '/payments/revenue/last-30-days',
} as const;

export const QUERY_KEYS = {
    USERS: 'users',
    USER_PROFILE: 'profile',
} as const;

export const HTTP_STATUS_CODES = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
} as const;