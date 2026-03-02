import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { map, Observable, tap } from 'rxjs';
import { API_BASE_URL, API_ENDPOINTS } from '../constants/api';
import type { ApiResponse } from '../types/api.types';
import type { AuthResponse, User } from '../types/auth.types';
import type {
  AdminContractsResponse,
  AdminJobsResponse,
  AdminReviewsResponse,
  AdminUsersResponse,
  DashboardStats,
} from '../types/admin.types';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private currentAdmin = signal<User | null>(null);
  readonly admin = this.currentAdmin.asReadonly();

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {
    this.loadAdminFromStorage();
  }

  private loadAdminFromStorage(): void {
    const data = localStorage.getItem('user');
    if (data) {
      const user: User = JSON.parse(data);
      if (user.role === 'admin') {
        this.currentAdmin.set(user);
      }
    }
  }

  // ─── Auth ──────────────────────────────────────────────────────

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<ApiResponse<AuthResponse>>(`${API_BASE_URL}${API_ENDPOINTS.ADMIN.LOGIN}`, {
        email,
        password,
      })
      .pipe(
        map((response: ApiResponse<AuthResponse>) => response.data),
        tap((response: AuthResponse) => {
          localStorage.setItem('user', JSON.stringify(response.user));
          this.currentAdmin.set(response.user);
        }),
      );
  }

  logout(): void {
    localStorage.removeItem('user');
    this.currentAdmin.set(null);
    this.router.navigate(['/admin/login']);
  }

  isAdminAuthenticated(): boolean {
    return this.currentAdmin()?.role === 'admin';
  }

  // ─── Dashboard ─────────────────────────────────────────────────

  getDashboardStats(): Observable<DashboardStats> {
    return this.http
      .get<
        ApiResponse<{ stats: DashboardStats }>
      >(`${API_BASE_URL}${API_ENDPOINTS.ADMIN.DASHBOARD}`)
      .pipe(map((response) => response.data.stats));
  }

  // ─── Users ─────────────────────────────────────────────────────

  getAllUsers(page: number = 1, limit: number = 10): Observable<AdminUsersResponse> {
    const params = new HttpParams().set('page', page.toString()).set('limit', limit.toString());

    return this.http
      .get<ApiResponse<AdminUsersResponse>>(`${API_BASE_URL}${API_ENDPOINTS.ADMIN.USERS}`, {
        params,
      })
      .pipe(map((response) => response.data));
  }

  getUserById(id: string): Observable<User> {
    return this.http
      .get<ApiResponse<{ user: User }>>(`${API_BASE_URL}${API_ENDPOINTS.ADMIN.USER_ID(id)}`)
      .pipe(map((response) => response.data.user));
  }

  updateUser(
    id: string,
    data: { role?: string; fullname?: string; email?: string; username?: string },
  ): Observable<User> {
    return this.http
      .put<ApiResponse<{ user: User }>>(`${API_BASE_URL}${API_ENDPOINTS.ADMIN.USER_ID(id)}`, data)
      .pipe(map((response) => response.data.user));
  }

  deleteUser(id: string): Observable<void> {
    return this.http
      .delete<ApiResponse<null>>(`${API_BASE_URL}${API_ENDPOINTS.ADMIN.USER_ID(id)}`)
      .pipe(map(() => undefined));
  }

  // ─── Jobs ──────────────────────────────────────────────────────

  getAllJobs(
    page: number = 1,
    limit: number = 10,
    status?: string,
    search?: string,
  ): Observable<AdminJobsResponse> {
    let params = new HttpParams().set('page', page.toString()).set('limit', limit.toString());
    if (status) params = params.set('status', status);
    if (search) params = params.set('search', search);

    return this.http
      .get<ApiResponse<AdminJobsResponse>>(`${API_BASE_URL}${API_ENDPOINTS.ADMIN.JOBS}`, {
        params,
      })
      .pipe(map((response) => response.data));
  }

  deleteJob(id: string): Observable<void> {
    return this.http
      .delete<ApiResponse<null>>(`${API_BASE_URL}${API_ENDPOINTS.ADMIN.JOB_ID(id)}`)
      .pipe(map(() => undefined));
  }

  // ─── Contracts ─────────────────────────────────────────────────

  getAllContracts(
    page: number = 1,
    limit: number = 10,
    status?: string,
  ): Observable<AdminContractsResponse> {
    let params = new HttpParams().set('page', page.toString()).set('limit', limit.toString());
    if (status) params = params.set('status', status);

    return this.http
      .get<
        ApiResponse<AdminContractsResponse>
      >(`${API_BASE_URL}${API_ENDPOINTS.ADMIN.CONTRACTS}`, { params })
      .pipe(map((response) => response.data));
  }

  updateContractStatus(id: string, status: string): Observable<any> {
    return this.http
      .patch<ApiResponse<any>>(`${API_BASE_URL}${API_ENDPOINTS.ADMIN.CONTRACT_STATUS(id)}`, {
        status,
      })
      .pipe(map((response) => response.data));
  }

  // ─── Reviews ───────────────────────────────────────────────────

  getAllReviews(page: number = 1, limit: number = 10): Observable<AdminReviewsResponse> {
    const params = new HttpParams().set('page', page.toString()).set('limit', limit.toString());

    return this.http
      .get<ApiResponse<AdminReviewsResponse>>(`${API_BASE_URL}${API_ENDPOINTS.ADMIN.REVIEWS}`, {
        params,
      })
      .pipe(map((response) => response.data));
  }

  deleteReview(id: string): Observable<void> {
    return this.http
      .delete<ApiResponse<null>>(`${API_BASE_URL}${API_ENDPOINTS.ADMIN.REVIEW_ID(id)}`)
      .pipe(map(() => undefined));
  }
}
