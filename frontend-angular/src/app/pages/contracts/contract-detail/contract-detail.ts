import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ContractService } from '../../../services/contract.service';
import { AuthService } from '../../../services/auth.service';
import type { Contract } from '../../../types/contract.types';

@Component({
  selector: 'app-contract-detail',
  standalone: true,
  imports: [RouterLink, FormsModule, DatePipe],
  templateUrl: './contract-detail.html',
  styleUrl: './contract-detail.css',
})
export class ContractDetailComponent implements OnInit {
  private contractService: ContractService = inject(ContractService);
  private authService: AuthService = inject(AuthService);
  private route: ActivatedRoute = inject(ActivatedRoute);

  contract = signal<Contract | null>(null);
  loading = signal<boolean>(true);
  submittedWork: string = '';
  disputeReason: string = '';

  ngOnInit(): void {
    const id: string | null = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.contractService.getContractById(id).subscribe({
        next: (contract: Contract) => {
          this.contract.set(contract);
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      });
    }
  }

  isClient(): boolean {
    return this.authService.isClient();
  }

  isFreelancer(): boolean {
    return this.authService.isFreelancer();
  }

  getJobTitle(): string {
    const currentContract: Contract | null = this.contract();
    if (!currentContract) return '';
    if (typeof currentContract.job === 'object' && currentContract.job !== null) {
      return currentContract.job.title;
    }
    return 'Unknown Job';
  }

  getClientName(): string {
    const currentContract: Contract | null = this.contract();
    if (!currentContract) return '';
    if (typeof currentContract.client === 'object' && currentContract.client !== null) {
      return currentContract.client.fullname;
    }
    return 'Unknown';
  }

  getFreelancerName(): string {
    const currentContract: Contract | null = this.contract();
    if (!currentContract) return '';
    if (typeof currentContract.freelancer === 'object' && currentContract.freelancer !== null) {
      return currentContract.freelancer.fullname;
    }
    return 'Unknown';
  }

  submitWork(): void {
    const currentContract: Contract | null = this.contract();
    if (!currentContract) return;

    this.contractService
      .submitWork(currentContract._id, { submittedWork: this.submittedWork })
      .subscribe({
        next: () => {
          alert('Work submitted successfully!');
          this.reloadContract();
        },
        error: () => alert('Failed to submit work'),
      });
  }

  completeContract(): void {
    const currentContract: Contract | null = this.contract();
    if (!currentContract) return;

    if (!confirm('Are you sure you want to mark this contract as complete?')) return;

    this.contractService.completeContract(currentContract._id).subscribe({
      next: () => {
        alert('Contract completed!');
        this.reloadContract();
      },
      error: () => alert('Failed to complete contract'),
    });
  }

  raiseDispute(): void {
    const currentContract: Contract | null = this.contract();
    if (!currentContract || !this.disputeReason) return;

    this.contractService.raiseDispute(currentContract._id, this.disputeReason).subscribe({
      next: () => {
        alert('Dispute raised!');
        this.reloadContract();
      },
      error: () => alert('Failed to raise dispute'),
    });
  }

  private reloadContract(): void {
    const id: string | null = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.contractService.getContractById(id).subscribe({
        next: (contract: Contract) => this.contract.set(contract),
      });
    }
  }
}
