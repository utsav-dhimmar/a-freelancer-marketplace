import { SlicePipe } from '@angular/common';
import { Component, inject, type OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  EmptyStateComponent,
  LoadingSpinnerComponent,
  UserAvatarComponent,
} from '../../../components/ui';
import { API_BASE_URL } from '../../../constants/api';
import { CURRENCY } from '../../../constants/currency';
import { FreelancerService } from '../../../services';
import type { Freelancer, FreelancerSearchParams } from '../../../types/freelancer.types';

@Component({
  selector: 'app-freelancer-list',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    SlicePipe,
    LoadingSpinnerComponent,
    EmptyStateComponent,
    UserAvatarComponent,
  ],
  templateUrl: './freelancer-list.html',
  styleUrl: './freelancer-list.css',
})
export class FreelancerListComponent implements OnInit {
  private freelancerService: FreelancerService = inject(FreelancerService);

  freelancers = signal<Freelancer[]>([]);
  loading = signal<boolean>(true);
  currency = CURRENCY;

  skills: string = '';
  minRate?: number;
  maxRate?: number;

  ngOnInit(): void {
    this.loadFreelancers();
  }

  loadFreelancers(): void {
    this.loading.set(true);
    this.freelancerService.getAllFreelancers().subscribe({
      next: (res: { freelancers: Freelancer[] }) => {
        this.freelancers.set(res.freelancers);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  search(): void {
    this.loading.set(true);
    const searchParams: FreelancerSearchParams = {
      skills: this.skills,
      minRate: this.minRate,
      maxRate: this.maxRate,
    };
    this.freelancerService.searchFreelancers(searchParams).subscribe({
      next: (res: { freelancers: Freelancer[] }) => {
        this.freelancers.set(res.freelancers);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  getFreelancerName(freelancer: Freelancer): string {
    if (typeof freelancer.user === 'object' && freelancer.user !== null) {
      return freelancer.user.fullname;
    }
    return 'Unknown';
  }

  getFreelancerProfilePicture(freelancer: Freelancer): string {
    if (typeof freelancer.user === 'object' && freelancer.user?.profilePicture) {
      const picture = freelancer.user.profilePicture;
      if (picture.startsWith('http')) return picture;
      return `${API_BASE_URL}${picture}`;
    }
    return 'https://via.placeholder.com/100';
  }

  clearFilters(): void {
    this.skills = '';
    this.minRate = undefined;
    this.maxRate = undefined;
    this.loadFreelancers();
  }
}
