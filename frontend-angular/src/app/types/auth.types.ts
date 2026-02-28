export type UserRole = 'client' | 'admin' | 'freelancer';
export type RegisterRole = 'client' | 'freelancer';

export interface User {
  _id: string;
  username: string;
  fullname: string;
  email: string;
  password?: string;
  refreshToken?: string;
  createdAt: string;
  updatedAt: string;
  role: UserRole;
  profilePicture: string | null;
  clientRating: number;
  clientReviewCount: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  fullname: string;
  email: string;
  password: string;
  role: RegisterRole;
  profilePicture?: string | null;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}
