import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  AuthService,
  ContractService,
  FreelancerService,
  JobService,
  ProposalService,
} from '../../services';
import type { Job } from '../../types/job.types';
import type { Proposal } from '../../types/proposal.types';
import type { Contract } from '../../types/contract.types';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class DashboardComponent implements OnInit {
  private authService: AuthService = inject(AuthService);
  private jobService: JobService = inject(JobService);
  private proposalService: ProposalService = inject(ProposalService);
  private contractService: ContractService = inject(ContractService);
  private freelancerService: FreelancerService = inject(FreelancerService);

  myJobs = signal<Job[]>([]);
  myProposals = signal<Proposal[]>([]);
  activeContracts = signal<Contract[]>([]);
  hasFreelancerProfile = signal<boolean>(false);
  loading = signal<boolean>(true);
  private pendingRequests = 0;
  private completedRequests = 0;

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading.set(true);
    this.pendingRequests = 0;
    this.completedRequests = 0;

    if (this.isClient()) {
      this.pendingRequests++;
      this.jobService.getMyJobs().subscribe({
        next: (res: { jobs: Job[] }) => {
          this.myJobs.set(res.jobs);
          this.completedRequests++;
          this.checkLoadingComplete();
        },
        error: () => {
          this.completedRequests++;
          this.checkLoadingComplete();
        },
      });
    }

    if (this.isFreelancer()) {
      this.pendingRequests++;
      this.freelancerService.getMyFreelancerProfile().subscribe({
        next: () => {
          this.hasFreelancerProfile.set(true);
          this.completedRequests++;
          this.checkLoadingComplete();
        },
        error: () => {
          this.completedRequests++;
          this.checkLoadingComplete();
        },
      });

      this.pendingRequests++;
      this.proposalService.getFreelancerProposals().subscribe({
        next: (res: { proposals: Proposal[] }) => {
          this.myProposals.set(res.proposals);
          this.completedRequests++;
          this.checkLoadingComplete();
        },
        error: () => {
          this.completedRequests++;
          this.checkLoadingComplete();
        },
      });
    }

    this.pendingRequests++;
    this.contractService.getContracts().subscribe({
      next: (res: { contracts: Contract[] }) => {
        this.activeContracts.set(res.contracts.filter((c: Contract) => c.status === 'active'));
        this.completedRequests++;
        this.checkLoadingComplete();
      },
      error: () => {
        this.completedRequests++;
        this.checkLoadingComplete();
      },
    });
  }

  private checkLoadingComplete(): void {
    if (!this.loading()) return;

    if (this.completedRequests >= this.pendingRequests) {
      this.loading.set(false);
    }
  }

  isClient(): boolean {
    return this.authService.isClient();
  }

  isFreelancer(): boolean {
    return this.authService.isFreelancer();
  }
}
