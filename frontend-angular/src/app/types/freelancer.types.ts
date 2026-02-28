export interface PortfolioItem {
  title: string;
  link: string;
  desc: string;
}

export interface FreelancerUser {
  _id: string;
  username: string;
  fullname: string;
  email: string;
  profilePicture: string | null;
}

export interface Freelancer {
  _id: string;
  user: FreelancerUser;
  title: string;
  bio: string;
  skills: string[];
  hourlyRate: number;
  portfolio: PortfolioItem[];
  rating: number;
  reviewCount: number;
  totalJobs: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFreelancerRequest {
  title: string;
  bio: string;
  skills: string[];
  hourlyRate: number;
  portfolio?: PortfolioItem[];
}

export interface FreelancerSearchParams {
  skills?: string;
  minRate?: number;
  maxRate?: number;
  title?: string;
  page?: number;
  limit?: number;
}

export interface FreelancersResponse {
  freelancers: Freelancer[];
  total: number;
  page: number;
  totalPages: number;
}
