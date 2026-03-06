import { DatePipe } from '@angular/common';
import { Component, inject, type OnInit, signal } from '@angular/core';
import { ProposalService } from '../../../services';
import type { Proposal } from '../../../types/proposal.types';
import { CURRENCY } from '../../../constants/currency';

@Component({
  selector: 'app-proposal-list',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './proposal-list.html',
  styleUrl: './proposal-list.css',
})
export class ProposalListComponent implements OnInit {
  private proposalService: ProposalService = inject(ProposalService);

  proposals = signal<Proposal[]>([]);
  loading = signal<boolean>(true);
  currency = CURRENCY;

  ngOnInit(): void {
    this.loadProposals();
  }

  loadProposals(): void {
    this.loading.set(true);
    this.proposalService.getFreelancerProposals().subscribe({
      next: (res: { proposals: Proposal[] }) => {
        this.proposals.set(res.proposals);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  getJobTitle(proposal: Proposal): string {
    if (typeof proposal.job === 'object' && proposal.job !== null) {
      return proposal.job.title;
    }
    return 'Unknown Job';
  }

  getFreelancerName(proposal: Proposal): string {
    if (typeof proposal.freelancer === 'object' && proposal.freelancer !== null) {
      return proposal.freelancer.fullname;
    }
    return 'Unknown';
  }
}
