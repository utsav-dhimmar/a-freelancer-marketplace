export type JobDifficulty = 'entry' | 'intermediate' | 'expert';
export type JobBudgetType = 'fixed' | 'hourly';
export type JobStatus = 'open' | 'in_progress' | 'completed' | 'cancelled';

export interface JobClient {
  _id: string;
  username: string;
  fullname: string;
  email: string;
  profilePicture: string | null;
}

export interface Job {
  _id: string;
  client: JobClient;
  title: string;
  description: string;
  difficulty: JobDifficulty;
  budget: number;
  budgetType: JobBudgetType;
  skillsRequired: string[];
  status: JobStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateJobRequest {
  title: string;
  description: string;
  difficulty: JobDifficulty;
  budget: number;
  budgetType: JobBudgetType;
  skillsRequired: string[];
}

export interface JobSearchParams {
  search?: string;
  difficulty?: JobDifficulty;
  minBudget?: number;
  maxBudget?: number;
  budgetType?: JobBudgetType;
  skills?: string;
  status?: JobStatus;
  page?: number;
  limit?: number;
}

export interface JobsResponse {
  jobs: Job[];
  total: number;
  page: number;
  totalPages: number;
}
