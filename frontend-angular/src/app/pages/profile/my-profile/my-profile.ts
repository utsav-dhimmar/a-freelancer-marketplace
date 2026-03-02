import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
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
    return currentUser.profilePicture || 'https://via.placeholder.com/150';
  }
}
