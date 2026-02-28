import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable, tap, map } from 'rxjs';
import { API_BASE_URL, API_ENDPOINTS } from '../constants/api';
import type { ApiResponse } from '../types/api.types';
import type {
  Contract,
  ContractStatus,
  ContractsResponse,
  CreateContractRequest,
  SubmitWorkRequest,
} from '../types/contract.types';

@Injectable({
  providedIn: 'root',
})
export class ContractService {
  private contracts = signal<Contract[]>([]);
  readonly contractList = this.contracts.asReadonly();

  constructor(private http: HttpClient) {}

  getContracts(): Observable<ContractsResponse> {
    return this.http
      .get<ApiResponse<ContractsResponse>>(`${API_BASE_URL}${API_ENDPOINTS.CONTRACTS.BASE}`)
      .pipe(
        map((response: ApiResponse<ContractsResponse>) => response.data),
        tap((response: ContractsResponse) => this.contracts.set(response.contracts)),
      );
  }

  getContractById(id: string): Observable<Contract> {
    return this.http
      .get<ApiResponse<{ contract: Contract }>>(`${API_BASE_URL}${API_ENDPOINTS.CONTRACTS.ID(id)}`)
      .pipe(map((response: ApiResponse<{ contract: Contract }>) => response.data.contract));
  }

  createContract(contract: CreateContractRequest): Observable<Contract> {
    return this.http
      .post<
        ApiResponse<{ contract: Contract }>
      >(`${API_BASE_URL}${API_ENDPOINTS.CONTRACTS.BASE}`, contract)
      .pipe(map((response: ApiResponse<{ contract: Contract }>) => response.data.contract));
  }

  updateContractStatus(id: string, status: ContractStatus): Observable<Contract> {
    return this.http
      .patch<
        ApiResponse<{ contract: Contract }>
      >(`${API_BASE_URL}${API_ENDPOINTS.CONTRACTS.STATUS(id)}`, { status })
      .pipe(map((response: ApiResponse<{ contract: Contract }>) => response.data.contract));
  }

  submitWork(id: string, workDetails: SubmitWorkRequest): Observable<Contract> {
    return this.http
      .patch<
        ApiResponse<{ contract: Contract }>
      >(`${API_BASE_URL}${API_ENDPOINTS.CONTRACTS.SUBMIT(id)}`, workDetails)
      .pipe(map((response: ApiResponse<{ contract: Contract }>) => response.data.contract));
  }

  completeContract(id: string): Observable<Contract> {
    return this.http
      .patch<
        ApiResponse<{ contract: Contract }>
      >(`${API_BASE_URL}${API_ENDPOINTS.CONTRACTS.COMPLETE(id)}`, {})
      .pipe(map((response: ApiResponse<{ contract: Contract }>) => response.data.contract));
  }

  raiseDispute(id: string, reason: string): Observable<Contract> {
    return this.http
      .patch<
        ApiResponse<{ contract: Contract }>
      >(`${API_BASE_URL}${API_ENDPOINTS.CONTRACTS.DISPUTE(id)}`, { reason })
      .pipe(map((response: ApiResponse<{ contract: Contract }>) => response.data.contract));
  }
}
