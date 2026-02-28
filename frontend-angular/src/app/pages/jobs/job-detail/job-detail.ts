import { DatePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService, JobService, ProposalService } from '../../../services';
import type { Job } from '../../../types/job.types';
import type { User } from '../../../types/auth.types';

@Component({
  selector: 'app-job-detail',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, DatePipe],
  templateUrl: './job-detail.html',
  styleUrl: './job-detail.css',
})
export class JobDetailComponent implements OnInit {
  private fb = inject(FormBuilder);
  private jobService: JobService = inject(JobService);
  private proposalService: ProposalService = inject(ProposalService);
  private route: ActivatedRoute = inject(ActivatedRoute);
  authService: AuthService = inject(AuthService);

  job = signal<Job | null>(null);
  loading = signal<boolean>(true);
  showProposalForm: boolean = false;
  submittingProposal = signal<boolean>(false);

  proposalForm: FormGroup = this.fb.group({
    coverLetter: ['', [Validators.required, Validators.minLength(50)]],
    bidAmount: [0, [Validators.required, Validators.min(1)]],
    estimatedTime: ['', [Validators.required]],
  });

  ngOnInit(): void {
    const id: string | null = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.jobService.getJobById(id).subscribe({
        next: (job: Job) => {
          this.job.set(job);
          this.loading.set(false);
          // Set initial bid amount to job budget
          this.proposalForm.patchValue({ bidAmount: job.budget });
        },
        error: () => this.loading.set(false),
      });
    }
  }

  isFreelancer(): boolean {
    return this.authService.isFreelancer();
  }

  isClient(): boolean {
    return this.authService.isClient();
  }

  isOwner(): boolean {
    const user: User | null = this.authService.user();
    const currentJob: Job | null = this.job();
    if (!user || !currentJob) return false;
    const jobClient = currentJob.client;
    return jobClient._id === user._id;
  }

  submitProposal(): void {
    if (this.proposalForm.invalid) {
      this.proposalForm.markAllAsTouched();
      return;
    }

    const currentJob: Job | null = this.job();
    if (!currentJob) return;

    this.submittingProposal.set(true);
    const formValue = this.proposalForm.value;

    this.proposalService
      .createProposal({
        job: currentJob._id,
        coverLetter: formValue.coverLetter,
        bidAmount: formValue.bidAmount,
        estimatedTime: formValue.estimatedTime,
      })
      .subscribe({
        next: () => {
          this.submittingProposal.set(false);
          this.showProposalForm = false;
          this.proposalForm.reset({
            coverLetter: '',
            bidAmount: currentJob.budget,
            estimatedTime: '',
          });
          alert('Proposal submitted successfully!');
        },
        error: (err: { error?: { message?: string } }) => {
          this.submittingProposal.set(false);
          alert(err.error?.message || 'Failed to submit proposal');
        },
      });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.proposalForm.get(fieldName);
    return !!field && field.invalid && (field.dirty || field.touched);
  }
}
