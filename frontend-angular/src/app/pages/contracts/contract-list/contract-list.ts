import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ContractService } from '../../../services/contract.service';
import type { Contract, ContractStatus } from '../../../types/contract.types';

@Component({
  selector: 'app-contract-list',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './contract-list.html',
  styleUrl: './contract-list.css',
})
export class ContractListComponent implements OnInit {
  private contractService: ContractService = inject(ContractService);

  contracts = signal<Contract[]>([]);
  loading = signal<boolean>(true);

  ngOnInit(): void {
    this.loadContracts();
  }

  loadContracts(): void {
    this.loading.set(true);
    this.contractService.getContracts().subscribe({
      next: (res: { contracts: Contract[] }) => {
        this.contracts.set(res.contracts);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  getJobTitle(contract: Contract): string {
    if (typeof contract.job === 'object' && contract.job !== null) {
      return contract.job.title;
    }
    return 'Unknown Job';
  }

  getClientName(contract: Contract): string {
    if (typeof contract.client === 'object' && contract.client !== null) {
      return contract.client.fullname;
    }
    return 'Unknown';
  }

  getFreelancerName(contract: Contract): string {
    if (typeof contract.freelancer === 'object' && contract.freelancer !== null) {
      return contract.freelancer.fullname;
    }
    return 'Unknown';
  }

  getStatusClass(status: ContractStatus): string {
    switch (status) {
      case 'active':
        return 'bg-primary';
      case 'submitted':
        return 'bg-info';
      case 'completed':
        return 'bg-success';
      case 'disputed':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  }
}
