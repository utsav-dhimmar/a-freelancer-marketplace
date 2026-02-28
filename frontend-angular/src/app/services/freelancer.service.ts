import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { API_BASE_URL, API_ENDPOINTS } from '../constants/api';
import type { ApiResponse } from '../types/api.types';
import type {
  CreateFreelancerRequest,
  Freelancer,
  FreelancerSearchParams,
  FreelancersResponse,
  PortfolioItem,
} from '../types/freelancer.types';

@Injectable({
  providedIn: 'root',
})
export class FreelancerService {
  private freelancers = signal<Freelancer[]>([]);
  readonly freelancerList = this.freelancers.asReadonly();

  constructor(private http: HttpClient) {}

  getAllFreelancers(page = 1, limit = 10): Observable<FreelancersResponse> {
    const params: HttpParams = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    return this.http
      .get<
        ApiResponse<FreelancersResponse>
      >(`${API_BASE_URL}${API_ENDPOINTS.FREELANCERS.BASE}`, { params })
      .pipe(
        map((response: ApiResponse<FreelancersResponse>) => response.data),
        tap((response: FreelancersResponse) => this.freelancers.set(response.freelancers)),
      );
  }

  searchFreelancers(searchParams: FreelancerSearchParams): Observable<FreelancersResponse> {
    let params: HttpParams = new HttpParams();
    if (searchParams.skills) params = params.set('skills', searchParams.skills);
    if (searchParams.minRate) params = params.set('minRate', searchParams.minRate.toString());
    if (searchParams.maxRate) params = params.set('maxRate', searchParams.maxRate.toString());
    if (searchParams.title) params = params.set('title', searchParams.title);
    if (searchParams.page) params = params.set('page', searchParams.page.toString());
    if (searchParams.limit) params = params.set('limit', searchParams.limit.toString());
    return this.http
      .get<
        ApiResponse<FreelancersResponse>
      >(`${API_BASE_URL}${API_ENDPOINTS.FREELANCERS.SEARCH}`, { params })
      .pipe(map((response: ApiResponse<FreelancersResponse>) => response.data));
  }

  getFreelancerById(id: string): Observable<Freelancer> {
    return this.http
      .get<
        ApiResponse<{ freelancer: Freelancer }>
      >(`${API_BASE_URL}${API_ENDPOINTS.FREELANCERS.ID(id)}`)
      .pipe(map((response: ApiResponse<{ freelancer: Freelancer }>) => response.data.freelancer));
  }

  getMyFreelancerProfile(): Observable<Freelancer> {
    return this.http
      .get<
        ApiResponse<{ freelancer: Freelancer }>
      >(`${API_BASE_URL}${API_ENDPOINTS.FREELANCERS.ME}`)
      .pipe(map((response: ApiResponse<{ freelancer: Freelancer }>) => response.data.freelancer));
  }

  createFreelancer(freelancer: CreateFreelancerRequest): Observable<Freelancer> {
    return this.http
      .post<
        ApiResponse<{ freelancer: Freelancer }>
      >(`${API_BASE_URL}${API_ENDPOINTS.FREELANCERS.BASE}`, freelancer)
      .pipe(map((response: ApiResponse<{ freelancer: Freelancer }>) => response.data.freelancer));
  }

  updateFreelancer(freelancer: Partial<CreateFreelancerRequest>): Observable<Freelancer> {
    return this.http
      .put<
        ApiResponse<{ freelancer: Freelancer }>
      >(`${API_BASE_URL}${API_ENDPOINTS.FREELANCERS.BASE}`, freelancer)
      .pipe(map((response: ApiResponse<{ freelancer: Freelancer }>) => response.data.freelancer));
  }

  deleteFreelancer(): Observable<void> {
    return this.http
      .delete<ApiResponse<void>>(`${API_BASE_URL}${API_ENDPOINTS.FREELANCERS.BASE}`)
      .pipe(map((response: ApiResponse<void>) => response.data));
  }

  addPortfolioItem(item: PortfolioItem): Observable<Freelancer> {
    return this.http
      .post<
        ApiResponse<{ freelancer: Freelancer }>
      >(`${API_BASE_URL}${API_ENDPOINTS.FREELANCERS.PORTFOLIO}`, item)
      .pipe(map((response: ApiResponse<{ freelancer: Freelancer }>) => response.data.freelancer));
  }

  removePortfolioItem(index: number): Observable<Freelancer> {
    return this.http
      .delete<
        ApiResponse<{ freelancer: Freelancer }>
      >(`${API_BASE_URL}${API_ENDPOINTS.FREELANCERS.PORTFOLIO_INDEX(index)}`)
      .pipe(map((response: ApiResponse<{ freelancer: Freelancer }>) => response.data.freelancer));
  }
}
