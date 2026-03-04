import { DatePipe } from '@angular/common';
import { Component, inject, type OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  EmptyStateComponent,
  LoadingSpinnerComponent,
  PaginationComponent,
  StatusBadgeComponent,
} from '../../../components';
import { AdminService } from '../../../services';
import type { AdminJob } from '../../../types/admin.types';

@Component({
  selector: 'app-admin-jobs',
  standalone: true,
  imports: [
    FormsModule,
    DatePipe,
    LoadingSpinnerComponent,
    EmptyStateComponent,
    StatusBadgeComponent,
    PaginationComponent,
  ],
  templateUrl: './admin-jobs.html',
  styleUrl: './admin-jobs.css',
})
export class AdminJobsComponent implements OnInit {
  private adminService = inject(AdminService);

  jobs = signal<AdminJob[]>([]);
  loading = signal(true);
  error = signal('');
  page = signal(1);
  totalPages = signal(1);
  total = signal(0);
  limit = 10;

  searchQuery = '';
  statusFilter = '';

  showDeleteConfirm = signal(false);
  deleteTarget = signal<AdminJob | null>(null);
  deleting = signal(false);

  ngOnInit(): void {
    this.loadJobs();
  }

  loadJobs(): void {
    this.loading.set(true);
    this.adminService
      .getAllJobs(
        this.page(),
        this.limit,
        this.statusFilter || undefined,
        this.searchQuery || undefined,
      )
      .subscribe({
        next: (res) => {
          this.jobs.set(res.jobs);
          this.totalPages.set(res.totalPages);
          this.total.set(res.total);
          this.loading.set(false);
        },
        error: (err) => {
          this.error.set(err.error?.message || 'Failed to load jobs');
          this.loading.set(false);
        },
      });
  }

  search(): void {
    this.page.set(1);
    this.loadJobs();
  }

  changePage(newPage: number): void {
    this.page.set(newPage);
    this.loadJobs();
  }

  confirmDelete(job: AdminJob): void {
    this.deleteTarget.set(job);
    this.showDeleteConfirm.set(true);
  }

  cancelDelete(): void {
    this.showDeleteConfirm.set(false);
    this.deleteTarget.set(null);
  }

  executeDelete(): void {
    const job = this.deleteTarget();
    if (!job) return;

    this.deleting.set(true);
    this.adminService.deleteJob(job._id).subscribe({
      next: () => {
        this.deleting.set(false);
        this.cancelDelete();
        this.loadJobs();
      },
      error: (err) => {
        this.error.set(err.error?.message || 'Failed to delete job');
        this.deleting.set(false);
      },
    });
  }
}
