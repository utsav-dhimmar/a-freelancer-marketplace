import { DatePipe } from '@angular/common';
import { Component, inject, type OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { API_BASE_URL } from '../../../constants/api';
import { AuthService } from '../../../services/auth.service';
import type { User } from '../../../types/auth.types';

@Component({
  selector: 'app-my-profile',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './my-profile.html',
  styleUrl: './my-profile.css',
})
export class MyProfileComponent implements OnInit {
  private authService: AuthService = inject(AuthService);

  user = signal<User | null>(null);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.authService.getProfile().subscribe({
      next: (user: User) => {
        this.user.set(user);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.message || 'Failed to load profile');
        this.loading.set(false);
      },
    });
  }

  getProfilePicture(): string {
    const currentUser = this.user();
    if (!currentUser) return 'https://via.placeholder.com/150';
    const picture = currentUser.profilePicture;
    if (!picture) return 'https://via.placeholder.com/150';
    if (picture.startsWith('http')) return picture;
    return `${API_BASE_URL}${picture}`;
  }
}
