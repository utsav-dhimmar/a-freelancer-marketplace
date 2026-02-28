export type ContractStatus = 'active' | 'submitted' | 'completed' | 'disputed';

export interface ContractJob {
  _id: string;
  title: string;
  description: string;
  budget: number;
}

export interface ContractClient {
  _id: string;
  username: string;
  fullname: string;
  profilePicture: string | null;
}

export interface ContractFreelancer {
  _id: string;
  username: string;
  fullname: string;
  profilePicture: string | null;
}

export interface ContractProposal {
  _id: string;
  bidAmount: number;
}

export interface Contract {
  _id: string;
  job: ContractJob;
  client: ContractClient;
  freelancer: ContractFreelancer;
  proposal: ContractProposal;
  amount: number;
  status: ContractStatus;
  startDate: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateContractRequest {
  proposal: string;
}

export interface ContractSearchParams {
  status?: ContractStatus;
  role?: 'client' | 'freelancer';
  page?: number;
  limit?: number;
}

export interface ContractsResponse {
  contracts: Contract[];
  total: number;
  page: number;
  totalPages: number;
}

export interface SubmitWorkRequest {
  submittedWork?: string;
}
