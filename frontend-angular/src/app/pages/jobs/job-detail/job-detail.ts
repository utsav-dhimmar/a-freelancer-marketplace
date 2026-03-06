import { DatePipe, TitleCasePipe, SlicePipe } from '@angular/common';
import { Component, inject, type OnInit, signal } from '@angular/core';
import { FormBuilder, type FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService, JobService, ProposalService } from '../../../services';
import type { User } from '../../../types/auth.types';
import type { Job } from '../../../types/job.types';
import { StatusBadgeComponent } from '../../../components/ui/status-badge/status-badge.component';
import { EmptyStateComponent } from '../../../components/ui/empty-state/empty-state';
import { CURRENCY } from '../../../constants/currency';

@Component({
  selector: 'app-job-detail',
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule,
    DatePipe,
    TitleCasePipe,
    SlicePipe,
    StatusBadgeComponent,
    EmptyStateComponent,
  ],
  templateUrl: './job-detail.html',
  styleUrl: './job-detail.css',
})
export class JobDetailComponent implements OnInit {
  private fb = inject(FormBuilder);
  private jobService: JobService = inject(JobService);
  private proposalService: ProposalService = inject(ProposalService);
  private route: ActivatedRoute = inject(ActivatedRoute);
  authService: AuthService = inject(AuthService);
  currency = CURRENCY;

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
    console.log({ client: this.authService.isClient() });
    return this.authService.isClient();
  }

  isOwner(): boolean {
    const user = this.authService.user();
    const currentJob = this.job();
    if (!user || !currentJob) return false;
    const jobClient = currentJob.client;
    const clientId = typeof jobClient === 'string' ? jobClient : jobClient?._id;
    const userId = user._id || user.id;
    console.log({ jobClient, user, owner: clientId === userId });
    return clientId === userId;
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
