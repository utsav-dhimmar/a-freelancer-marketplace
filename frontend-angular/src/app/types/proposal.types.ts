export type ProposalStatus = 'pending' | 'shortlisted' | 'accepted' | 'rejected';
export type ProposalBudgetType = 'fixed' | 'hourly';

export interface ProposalJob {
  _id: string;
  title: string;
  description: string;
  budget: number;
  budgetType: ProposalBudgetType;
}

export interface ProposalFreelancer {
  _id: string;
  username: string;
  fullname: string;
  profilePicture: string | null;
}

export interface Proposal {
  _id: string;
  job: ProposalJob;
  freelancer: ProposalFreelancer;
  coverLetter: string;
  bidAmount: number;
  estimatedTime: string;
  status: ProposalStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProposalRequest {
  job: string;
  coverLetter: string;
  bidAmount: number;
  estimatedTime: string;
}

export interface ProposalSearchParams {
  job?: string;
  freelancer?: string;
  status?: ProposalStatus;
  page?: number;
  limit?: number;
}

export interface ProposalsResponse {
  proposals: Proposal[];
  total: number;
  page: number;
  totalPages: number;
}
