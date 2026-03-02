import type { User } from './auth.types';

export interface DashboardStats {
  users: {
    total: number;
    clients: number;
    freelancers: number;
    admins: number;
  };
  jobs: {
    total: number;
    open: number;
    inProgress: number;
    completed: number;
    cancelled: number;
  };
  contracts: {
    total: number;
    active: number;
    submitted: number;
    completed: number;
    disputed: number;
  };
  proposals: {
    total: number;
    pending: number;
    accepted: number;
    rejected: number;
  };
  reviews: {
    total: number;
  };
}

export interface PaginatedResponse<T> {
  total: number;
  page: number;
  totalPages: number;
  [key: string]: T[] | number;
}

export interface AdminUsersResponse {
  users: User[];
  total: number;
  page: number;
  totalPages: number;
}

export interface AdminJob {
  _id: string;
  title: string;
  description: string;
  budget: number;
  budgetType: string;
  difficulty: string;
  skills: string[];
  status: 'open' | 'in_progress' | 'completed' | 'cancelled';
  client: User;
  createdAt: string;
  updatedAt: string;
}

export interface AdminJobsResponse {
  jobs: AdminJob[];
  total: number;
  page: number;
  totalPages: number;
}

export interface AdminContract {
  _id: string;
  client: User;
  freelancer: User;
  job: { _id: string; title: string; status: string };
  status: 'active' | 'submitted' | 'completed' | 'disputed';
  amount: number;
  startDate: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminContractsResponse {
  contracts: AdminContract[];
  total: number;
  page: number;
  totalPages: number;
}

export interface AdminReview {
  _id: string;
  reviewer: {
    _id: string;
    username: string;
    fullname: string;
    email: string;
    profilePicture: string | null;
  };
  reviewee: {
    _id: string;
    username: string;
    fullname: string;
    email: string;
    profilePicture: string | null;
  };
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminReviewsResponse {
  reviews: AdminReview[];
  total: number;
  page: number;
  totalPages: number;
}
