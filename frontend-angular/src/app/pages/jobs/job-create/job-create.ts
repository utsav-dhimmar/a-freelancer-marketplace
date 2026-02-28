import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { JobService } from '../../../services';
import type { CreateJobRequest, JobDifficulty, JobBudgetType } from '../../../types/job.types';

@Component({
  selector: 'app-job-create',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './job-create.html',
  styleUrl: './job-create.css',
})
export class JobCreateComponent {
  private fb = inject(FormBuilder);
  private jobService: JobService = inject(JobService);
  private router: Router = inject(Router);

  loading = signal<boolean>(false);
  error = signal<string>('');

  jobForm: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(100)]],
    description: ['', [Validators.required]],
    difficulty: ['entry', [Validators.required]],
    budget: [0, [Validators.required, Validators.min(0)]],
    budgetType: ['fixed', [Validators.required]],
    skillsInput: [''],
  });

  onSubmit(): void {
    if (this.jobForm.invalid) {
      this.jobForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.error.set('');

    const formValue = this.jobForm.value;

    const skills: string[] = formValue.skillsInput
      ? formValue.skillsInput
          .split(',')
          .map((s: string) => s.trim())
          .filter((s: string) => s)
      : [];

    const jobRequest: CreateJobRequest = {
      title: formValue.title,
      description: formValue.description,
      difficulty: formValue.difficulty as JobDifficulty,
      budget: formValue.budget,
      budgetType: formValue.budgetType as JobBudgetType,
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

  isFieldInvalid(fieldName: string): boolean {
    const field = this.jobForm.get(fieldName);
    return !!field && field.invalid && (field.dirty || field.touched);
  }
}
