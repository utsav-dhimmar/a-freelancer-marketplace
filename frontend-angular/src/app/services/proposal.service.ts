import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { map, Observable } from 'rxjs';
import { API_BASE_URL, API_ENDPOINTS } from '../constants/api';
import type { ApiResponse } from '../types/api.types';
import type {
  CreateProposalRequest,
  Proposal,
  ProposalStatus,
  ProposalsResponse,
} from '../types/proposal.types';

@Injectable({
  providedIn: 'root',
})
export class ProposalService {
  private proposals = signal<Proposal[]>([]);
  readonly proposalList = this.proposals.asReadonly();

  constructor(private http: HttpClient) {}

  getProposalsByJobId(jobId: string): Observable<ProposalsResponse> {
    return this.http
      .get<ApiResponse<ProposalsResponse>>(`${API_BASE_URL}${API_ENDPOINTS.PROPOSALS.JOB(jobId)}`)
      .pipe(map((response: ApiResponse<ProposalsResponse>) => response.data));
  }

  getFreelancerProposals(): Observable<ProposalsResponse> {
    return this.http
      .get<ApiResponse<ProposalsResponse>>(`${API_BASE_URL}${API_ENDPOINTS.PROPOSALS.MY_PROPOSALS}`)
      .pipe(map((response: ApiResponse<ProposalsResponse>) => response.data));
  }

  getProposalById(id: string): Observable<Proposal> {
    return this.http
      .get<ApiResponse<{ proposal: Proposal }>>(`${API_BASE_URL}${API_ENDPOINTS.PROPOSALS.ID(id)}`)
      .pipe(map((response: ApiResponse<{ proposal: Proposal }>) => response.data.proposal));
  }

  createProposal(proposal: CreateProposalRequest): Observable<Proposal> {
    return this.http
      .post<
        ApiResponse<{ proposal: Proposal }>
      >(`${API_BASE_URL}${API_ENDPOINTS.PROPOSALS.BASE}`, proposal)
      .pipe(map((response: ApiResponse<{ proposal: Proposal }>) => response.data.proposal));
  }

  updateProposal(id: string, proposal: Partial<CreateProposalRequest>): Observable<Proposal> {
    return this.http
      .put<
        ApiResponse<{ proposal: Proposal }>
      >(`${API_BASE_URL}${API_ENDPOINTS.PROPOSALS.ID(id)}`, proposal)
      .pipe(map((response: ApiResponse<{ proposal: Proposal }>) => response.data.proposal));
  }

  updateProposalStatus(id: string, status: ProposalStatus): Observable<Proposal> {
    return this.http
      .patch<
        ApiResponse<{ proposal: Proposal }>
      >(`${API_BASE_URL}${API_ENDPOINTS.PROPOSALS.STATUS(id)}`, { status })
      .pipe(map((response: ApiResponse<{ proposal: Proposal }>) => response.data.proposal));
  }

  deleteProposal(id: string): Observable<void> {
    return this.http
      .delete<ApiResponse<void>>(`${API_BASE_URL}${API_ENDPOINTS.PROPOSALS.ID(id)}`)
      .pipe(map((response: ApiResponse<void>) => response.data));
  }
}
