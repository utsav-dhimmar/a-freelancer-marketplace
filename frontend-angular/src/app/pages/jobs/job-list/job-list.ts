import { SlicePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService, JobService } from '../../../services';
import type { Job, JobSearchParams } from '../../../types/job.types';

@Component({
  selector: 'app-job-list',
  standalone: true,
  imports: [RouterLink, SlicePipe, FormsModule],
  templateUrl: './job-list.html',
  styleUrl: './job-list.css',
})
export class JobListComponent implements OnInit {
  private jobService: JobService = inject(JobService);
  private authService: AuthService = inject(AuthService);

  jobs = signal<Job[]>([]);
  total = signal<number>(0);
  loading = signal<boolean>(true);

  searchTerm = signal('');
  minBudget = signal<number | undefined>(undefined);
  maxBudget = signal<number | undefined>(undefined);
  status = signal('');
  page = signal(1);

  ngOnInit(): void {
    this.loadJobs();
  }

  loadJobs(): void {
    this.loading.set(true);
    this.jobService.getAllJobs(this.page()).subscribe({
      next: (res: { jobs: Job[]; total: number }) => {
        this.jobs.set(res.jobs);
        this.total.set(res.total);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  search(): void {
    this.loading.set(true);
    const searchParams: JobSearchParams = {
      search: this.searchTerm(),
      minBudget: this.minBudget(),
      maxBudget: this.maxBudget(),
      status: this.status() as JobSearchParams['status'],
    };
    this.jobService.searchJobs(searchParams).subscribe({
      next: (res: { jobs: Job[]; total: number }) => {
        this.jobs.set(res.jobs);
        this.total.set(res.total);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  loadMore(): void {
    this.page.update((p) => p + 1);
    this.jobService.getAllJobs(this.page()).subscribe({
      next: (res: { jobs: Job[]; total: number }) => {
        this.jobs.update((j: Job[]) => [...j, ...res.jobs]);
        this.total.set(res.total);
      },
    });
  }

  isClient(): boolean {
    return this.authService.isClient();
  }

  getStatusClass(status: string): string {
    const classes: Record<string, string> = {
      open: 'bg-success',
      in_progress: 'bg-info',
      completed: 'bg-secondary',
    };
    return classes[status] || 'bg-secondary';
  }
}
