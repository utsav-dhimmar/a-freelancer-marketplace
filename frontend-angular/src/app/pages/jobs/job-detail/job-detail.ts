import { DatePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService, JobService, ProposalService } from '../../../services';
import type { Job } from '../../../types/job.types';
import type { User } from '../../../types/auth.types';

@Component({
  selector: 'app-job-detail',
  standalone: true,
  imports: [RouterLink, FormsModule, DatePipe],
  templateUrl: './job-detail.html',
  styleUrl: './job-detail.css',
})
export class JobDetailComponent implements OnInit {
  private jobService: JobService = inject(JobService);
  private proposalService: ProposalService = inject(ProposalService);
  private route: ActivatedRoute = inject(ActivatedRoute);
  authService: AuthService = inject(AuthService);

  job = signal<Job | null>(null);
  loading = signal<boolean>(true);
  showProposalForm: boolean = false;

  coverLetter: string = '';
  bidAmount: number = 0;
  estimatedTime: string = '';

  ngOnInit(): void {
    const id: string | null = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.jobService.getJobById(id).subscribe({
        next: (job: Job) => {
          this.job.set(job);
          this.loading.set(false);
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
    const currentJob: Job | null = this.job();
    if (!currentJob) return;

    this.proposalService
      .createProposal({
        job: currentJob._id,
        coverLetter: this.coverLetter,
        bidAmount: this.bidAmount,
        estimatedTime: this.estimatedTime,
      })
      .subscribe({
        next: () => {
          this.showProposalForm = false;
          alert('Proposal submitted successfully!');
        },
        error: () => alert('Failed to submit proposal'),
      });
  }
}
