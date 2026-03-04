import { DatePipe } from '@angular/common';
import { Component, inject, type OnInit, signal } from '@angular/core';
import {
  EmptyStateComponent,
  LoadingSpinnerComponent,
  PaginationComponent,
  UserAvatarComponent,
} from '../../../components';
import { AdminService } from '../../../services';
import type { AdminReview } from '../../../types/admin.types';

@Component({
  selector: 'app-admin-reviews',
  standalone: true,
  imports: [
    DatePipe,
    LoadingSpinnerComponent,
    EmptyStateComponent,
    PaginationComponent,
    UserAvatarComponent,
  ],
  templateUrl: './admin-reviews.html',
  styleUrl: './admin-reviews.css',
})
export class AdminReviewsComponent implements OnInit {
  private adminService = inject(AdminService);

  reviews = signal<AdminReview[]>([]);
  loading = signal(true);
  error = signal('');
  page = signal(1);
  totalPages = signal(1);
  total = signal(0);
  limit = 10;

  showDeleteConfirm = signal(false);
  deleteTarget = signal<AdminReview | null>(null);
  deleting = signal(false);

  ngOnInit(): void {
    this.loadReviews();
  }

  loadReviews(): void {
    this.loading.set(true);
    this.adminService.getAllReviews(this.page(), this.limit).subscribe({
      next: (res) => {
        this.reviews.set(res.reviews);
        this.totalPages.set(res.totalPages);
        this.total.set(res.total);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.message || 'Failed to load reviews');
        this.loading.set(false);
      },
    });
  }

  changePage(newPage: number): void {
    this.page.set(newPage);
    this.loadReviews();
  }

  confirmDelete(review: AdminReview): void {
    this.deleteTarget.set(review);
    this.showDeleteConfirm.set(true);
  }

  cancelDelete(): void {
    this.showDeleteConfirm.set(false);
    this.deleteTarget.set(null);
  }

  executeDelete(): void {
    const review = this.deleteTarget();
    if (!review) return;

    this.deleting.set(true);
    this.adminService.deleteReview(review._id).subscribe({
      next: () => {
        this.deleting.set(false);
        this.cancelDelete();
        this.loadReviews();
      },
      error: (err) => {
        this.error.set(err.error?.message || 'Failed to delete review');
        this.deleting.set(false);
      },
    });
  }

  getStars(rating: number): number[] {
    return Array.from({ length: 5 }, (_, i) => (i < rating ? 1 : 0));
  }
}
