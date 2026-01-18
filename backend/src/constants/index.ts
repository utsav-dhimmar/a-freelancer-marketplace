/**
 * HTTP Status codes
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
} as const;

/**
 * API Endpoints
 */
export const API_ENDPOINTS = {
  USERS: {
    REGISTER: '/api/users/register',
    LOGIN: '/api/users/login',
    ME: '/api/users/me',
    LOGOUT: '/api/users/logout',
    REFRESH_TOKEN: '/api/users/refresh-token',
  },
} as const;
