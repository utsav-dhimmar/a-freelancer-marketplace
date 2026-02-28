import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { JobService } from '../../../services';
import type { CreateJobRequest, JobDifficulty, JobBudgetType } from '../../../types/job.types';

@Component({
  selector: 'app-job-create',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './job-create.html',
  styleUrl: './job-create.css',
})
export class JobCreateComponent {
  private jobService: JobService = inject(JobService);
  private router: Router = inject(Router);

  title: string = '';
  description: string = '';
  difficulty: JobDifficulty = 'entry';
  budget: number = 0;
  budgetType: JobBudgetType = 'fixed';
  skillsInput: string = '';
  loading = signal<boolean>(false);
  error = signal<string>('');

  onSubmit(): void {
    this.loading.set(true);
    this.error.set('');

    const skills: string[] = this.skillsInput
      .split(',')
      .map((s: string) => s.trim())
      .filter((s: string) => s);

    const jobRequest: CreateJobRequest = {
      title: this.title,
      description: this.description,
      difficulty: this.difficulty,
      budget: this.budget,
      budgetType: this.budgetType,
      skillsRequired: skills,
    };

    this.jobService.createJob(jobRequest).subscribe({
      next: () => {
        this.router.navigate(['/jobs']);
      },
      error: (err: { error?: { message?: string } }) => {
        this.error.set(err.error?.message || 'Failed to create job');
        this.loading.set(false);
      },
    });
  }
}
