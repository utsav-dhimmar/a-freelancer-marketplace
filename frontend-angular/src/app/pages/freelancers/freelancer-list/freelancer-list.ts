import { SlicePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FreelancerService } from '../../../services';
import type { Freelancer, FreelancerSearchParams } from '../../../types/freelancer.types';

@Component({
  selector: 'app-freelancer-list',
  standalone: true,
  imports: [RouterLink, FormsModule, SlicePipe],
  templateUrl: './freelancer-list.html',
  styleUrl: './freelancer-list.css',
})
export class FreelancerListComponent implements OnInit {
  private freelancerService: FreelancerService = inject(FreelancerService);

  freelancers = signal<Freelancer[]>([]);
  loading = signal<boolean>(true);

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
      return freelancer.user.profilePicture;
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
