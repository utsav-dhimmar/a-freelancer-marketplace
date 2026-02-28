import { DatePipe, SlicePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ContractService, ProposalService } from '../../../services';
import type { Proposal, ProposalStatus } from '../../../types/proposal.types';

@Component({
  selector: 'app-job-proposals',
  standalone: true,
  imports: [RouterLink, SlicePipe, DatePipe],
  templateUrl: './job-proposals.html',
  styleUrl: './job-proposals.css',
})
export class JobProposalsComponent implements OnInit {
  private proposalService: ProposalService = inject(ProposalService);
  private contractService: ContractService = inject(ContractService);
  private route: ActivatedRoute = inject(ActivatedRoute);

  proposals = signal<Proposal[]>([]);
  loading = signal<boolean>(true);

  ngOnInit(): void {
    const jobId: string | null = this.route.snapshot.paramMap.get('id');
    if (jobId) {
      this.loadProposals(jobId);
    }
  }

  loadProposals(jobId: string): void {
    this.loading.set(true);
    this.proposalService.getProposalsByJobId(jobId).subscribe({
      next: (res: { proposals: Proposal[] }) => {
        this.proposals.set(res.proposals);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  getFreelancerName(proposal: Proposal): string {
    if (typeof proposal.freelancer === 'object' && proposal.freelancer !== null) {
      return proposal.freelancer.fullname;
    }
    return 'Unknown';
  }

  getFreelancerPicture(proposal: Proposal): string {
    if (typeof proposal.freelancer === 'object' && proposal.freelancer?.profilePicture) {
      return proposal.freelancer.profilePicture;
    }
    return 'https://via.placeholder.com/50';
  }

  acceptProposal(proposal: Proposal): void {
    if (!confirm('Are you sure you want to accept this proposal?')) return;

    this.proposalService.updateProposalStatus(proposal._id, 'accepted').subscribe({
      next: () => {
        this.contractService
          .createContract({
            proposal: proposal._id,
          })
          .subscribe({
            next: () => {
              alert('Proposal accepted and contract created!');
              this.reloadProposals();
            },
            error: () => alert('Failed to create contract'),
          });
      },
      error: () => alert('Failed to accept proposal'),
    });
  }

  rejectProposal(proposal: Proposal): void {
    const status: ProposalStatus = 'rejected';
    this.proposalService.updateProposalStatus(proposal._id, status).subscribe({
      next: () => this.reloadProposals(),
      error: () => alert('Failed to reject proposal'),
    });
  }

  private reloadProposals(): void {
    const jobId: string | null = this.route.snapshot.paramMap.get('id');
    if (jobId) {
      this.loadProposals(jobId);
    }
  }
}
