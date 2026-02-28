import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { API_BASE_URL, API_ENDPOINTS } from '../constants/api';
import type { ApiResponse } from '../types/api.types';
import type {
  CreateJobRequest,
  Job,
  JobSearchParams,
  JobsResponse,
  JobStatus,
} from '../types/job.types';

@Injectable({
  providedIn: 'root',
})
export class JobService {
  private jobs = signal<Job[]>([]);
  readonly jobList = this.jobs.asReadonly();

  constructor(private http: HttpClient) {}

  getAllJobs(page = 1, limit = 10): Observable<JobsResponse> {
    const params: HttpParams = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    return this.http
      .get<ApiResponse<JobsResponse>>(`${API_BASE_URL}${API_ENDPOINTS.JOBS.BASE}`, { params })
      .pipe(
        map((response: ApiResponse<JobsResponse>) => response.data),
        tap((response: JobsResponse) => this.jobs.set(response.jobs)),
      );
  }

  searchJobs(searchParams: JobSearchParams): Observable<JobsResponse> {
    let params: HttpParams = new HttpParams();
    if (searchParams.search) params = params.set('search', searchParams.search);
    if (searchParams.difficulty) params = params.set('difficulty', searchParams.difficulty);
    if (searchParams.minBudget) params = params.set('minBudget', searchParams.minBudget.toString());
    if (searchParams.maxBudget) params = params.set('maxBudget', searchParams.maxBudget.toString());
    if (searchParams.budgetType) params = params.set('budgetType', searchParams.budgetType);
    if (searchParams.skills) params = params.set('skills', searchParams.skills);
    if (searchParams.status) params = params.set('status', searchParams.status);
    if (searchParams.page) params = params.set('page', searchParams.page.toString());
    if (searchParams.limit) params = params.set('limit', searchParams.limit.toString());
    return this.http
      .get<ApiResponse<JobsResponse>>(`${API_BASE_URL}${API_ENDPOINTS.JOBS.SEARCH}`, { params })
      .pipe(map((response: ApiResponse<JobsResponse>) => response.data));
  }

  getJobById(id: string): Observable<Job> {
    return this.http
      .get<ApiResponse<{ job: Job }>>(`${API_BASE_URL}${API_ENDPOINTS.JOBS.ID(id)}`)
      .pipe(map((response: ApiResponse<{ job: Job }>) => response.data.job));
  }

  getMyJobs(): Observable<JobsResponse> {
    return this.http
      .get<ApiResponse<JobsResponse>>(`${API_BASE_URL}${API_ENDPOINTS.JOBS.MY_JOBS}`)
      .pipe(map((response: ApiResponse<JobsResponse>) => response.data));
  }

  createJob(job: CreateJobRequest): Observable<Job> {
    return this.http
      .post<ApiResponse<{ job: Job }>>(`${API_BASE_URL}${API_ENDPOINTS.JOBS.BASE}`, job)
      .pipe(map((response: ApiResponse<{ job: Job }>) => response.data.job));
  }

  updateJob(id: string, job: Partial<CreateJobRequest>): Observable<Job> {
    return this.http
      .put<ApiResponse<{ job: Job }>>(`${API_BASE_URL}${API_ENDPOINTS.JOBS.ID(id)}`, job)
      .pipe(map((response: ApiResponse<{ job: Job }>) => response.data.job));
  }

  updateJobStatus(id: string, status: JobStatus): Observable<Job> {
    return this.http
      .patch<
        ApiResponse<{ job: Job }>
      >(`${API_BASE_URL}${API_ENDPOINTS.JOBS.STATUS(id)}`, { status })
      .pipe(map((response: ApiResponse<{ job: Job }>) => response.data.job));
  }

  deleteJob(id: string): Observable<void> {
    return this.http
      .delete<ApiResponse<void>>(`${API_BASE_URL}${API_ENDPOINTS.JOBS.ID(id)}`)
      .pipe(map((response: ApiResponse<void>) => response.data));
  }
}
