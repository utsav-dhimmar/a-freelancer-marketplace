import { DatePipe } from '@angular/common';
import { Component, inject, type OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  EmptyStateComponent,
  LoadingSpinnerComponent,
  PaginationComponent,
  StatusBadgeComponent,
} from '../../../components';
import { CURRENCY } from '../../../constants/currency';
import { AdminService } from '../../../services';
import type { AdminContract } from '../../../types/admin.types';

@Component({
  selector: 'app-admin-contracts',
  standalone: true,
  imports: [
    FormsModule,
    DatePipe,
    LoadingSpinnerComponent,
    EmptyStateComponent,
    StatusBadgeComponent,
    PaginationComponent,
  ],
  templateUrl: './admin-contracts.html',
  styleUrl: './admin-contracts.css',
})
export class AdminContractsComponent implements OnInit {
  private adminService = inject(AdminService);

  contracts = signal<AdminContract[]>([]);
  loading = signal(true);
  error = signal('');
  page = signal(1);
  totalPages = signal(1);
  total = signal(0);
  limit = 10;
  currency = CURRENCY;

  statusFilter = '';
  updatingId = signal<string | null>(null);

  ngOnInit(): void {
    this.loadContracts();
  }

  loadContracts(): void {
    this.loading.set(true);
    this.adminService
      .getAllContracts(this.page(), this.limit, this.statusFilter || undefined)
      .subscribe({
        next: (res) => {
          this.contracts.set(res.contracts);
          this.totalPages.set(res.totalPages);
          this.total.set(res.total);
          this.loading.set(false);
        },
        error: (err) => {
          this.error.set(err.error?.message || 'Failed to load contracts');
          this.loading.set(false);
        },
      });
  }

  filterByStatus(): void {
    this.page.set(1);
    this.loadContracts();
  }

  changePage(newPage: number): void {
    this.page.set(newPage);
    this.loadContracts();
  }

  updateStatus(contract: AdminContract, newStatus: string): void {
    if (newStatus === contract.status) return;
    this.updatingId.set(contract._id);
    this.adminService.updateContractStatus(contract._id, newStatus).subscribe({
      next: () => {
        this.updatingId.set(null);
        this.loadContracts();
      },
      error: (err) => {
        this.error.set(err.error?.message || 'Failed to update status');
        this.updatingId.set(null);
      },
    });
  }
}
