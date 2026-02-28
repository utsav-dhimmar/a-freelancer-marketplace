import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { map, Observable, tap } from 'rxjs';
import { API_BASE_URL, API_ENDPOINTS } from '../constants/api';
import type { ApiResponse } from '../types/api.types';
import type { AuthResponse, LoginRequest, RegisterRequest, User } from '../types/auth.types';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUser = signal<User | null>(null);
  readonly user = this.currentUser.asReadonly();

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    const userData = localStorage.getItem('user');
    if (userData) {
      this.currentUser.set(JSON.parse(userData));
    }
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http
      .post<ApiResponse<AuthResponse>>(`${API_BASE_URL}${API_ENDPOINTS.USERS.LOGIN}`, credentials)
      .pipe(
        map((response: ApiResponse<AuthResponse>) => {
          return response.data;
        }),
        tap((response: AuthResponse) => {
          localStorage.setItem('user', JSON.stringify(response.user));
          this.currentUser.set(response.user);
          this.router.navigate(['/dashboard']);
        }),
      );
  }

  register(data: RegisterRequest): Observable<AuthResponse> {
    const formData: FormData = new FormData();
    formData.append('username', data.username);
    formData.append('fullname', data.fullname);
    formData.append('email', data.email);
    formData.append('password', data.password);
    formData.append('role', data.role);

    if (data.profilePicture) {
      const file: Blob = this.base64ToBlob(data.profilePicture);
      const profileFile: File = new File([file], 'profile.jpg', { type: 'image/jpeg' });
      formData.append('profilePicture', profileFile);
    }

    return this.http
      .post<ApiResponse<AuthResponse>>(`${API_BASE_URL}${API_ENDPOINTS.USERS.REGISTER}`, formData)
      .pipe(
        map((response: ApiResponse<AuthResponse>) => response.data),
        tap((response: AuthResponse) => {
          this.router.navigate(['/login']);
        }),
      );
  }

  private base64ToBlob(base64: string): Blob {
    const byteCharacters: string = atob(base64);
    const byteNumbers: number[] = new Array(byteCharacters.length);
    for (let i: number = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray: Uint8Array = new Uint8Array(byteNumbers);
    return new Blob([byteArray as unknown as BlobPart], { type: 'image/jpeg' });
  }

  logout(): Observable<void> {
    return this.http
      .post<ApiResponse<void>>(`${API_BASE_URL}${API_ENDPOINTS.USERS.LOGOUT}`, {})
      .pipe(
        map(() => undefined),
        tap(() => {
          this.clearStorage();
        }),
      );
  }

  getProfile(): Observable<User> {
    return this.http
      .get<ApiResponse<{ user: User }>>(`${API_BASE_URL}${API_ENDPOINTS.USERS.ME}`)
      .pipe(
        map((response: ApiResponse<{ user: User }>) => response.data.user),
        tap((user: User) => {
          this.currentUser.set(user);
          localStorage.setItem('user', JSON.stringify(user));
        }),
      );
  }

  updateProfilePicture(profilePicture: string): Observable<User> {
    return this.http
      .post<ApiResponse<{ user: User }>>(`${API_BASE_URL}${API_ENDPOINTS.USERS.PROFILE_PICTURE}`, {
        profilePicture,
      })
      .pipe(
        map((response: ApiResponse<{ user: User }>) => response.data.user),
        tap((user: User) => {
          this.currentUser.set(user);
          localStorage.setItem('user', JSON.stringify(user));
        }),
      );
  }

  isAuthenticated(): boolean {
    return !!this.currentUser();
  }

  isClient(): boolean {
    return this.currentUser()?.role === 'client';
  }

  isFreelancer(): boolean {
    return this.currentUser()?.role === 'freelancer';
  }

  private clearStorage(): void {
    localStorage.removeItem('user');
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }
}
