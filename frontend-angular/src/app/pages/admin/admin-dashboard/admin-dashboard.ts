import { Component, inject, type OnInit, signal } from '@angular/core';
import { AdminService } from '../../../services';
import type { DashboardStats } from '../../../types/admin.types';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboardComponent implements OnInit {
  private adminService = inject(AdminService);

  stats = signal<DashboardStats | null>(null);
  loading = signal(true);
  error = signal('');

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.loading.set(true);
    this.adminService.getDashboardStats().subscribe({
      next: (stats) => {
        this.stats.set(stats);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.message || 'Failed to load dashboard stats');
        this.loading.set(false);
      },
    });
  }
}
