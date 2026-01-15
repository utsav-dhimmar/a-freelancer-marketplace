/**
 * User types
 */
export type IUser = {
    id: string;
    username: string;
    fullname: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
    password: string;
}

/**
 * User registration request
 */
export type RegisterUserRequest = Pick<IUser, "username" | "fullname" | "email" | "password">


/**
 * User login request
 */
export type LoginUserRequest = Pick<IUser, "email" | "password">

/**
 * Auth response with tokens
 */
export type AuthResponse = {
    user: IUser;
    accessToken: string;
    refreshToken: string;
}

/**
 * Refresh token request
 */
export type RefreshTokenRequest = {
    refreshToken: string;
}

/**
 * Refresh token response
 */
export type RefreshTokenResponse = {
    accessToken: string;
}
