import { Component, inject, type OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { EmptyStateComponent } from '../../../components/ui/empty-state/empty-state';
import { API_BASE_URL } from '../../../constants/api';
import { CURRENCY } from '../../../constants/currency';
import { FreelancerService } from '../../../services';
import type { Freelancer } from '../../../types/freelancer.types';

import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-freelancer-profile',
  standalone: true,
  imports: [RouterLink, EmptyStateComponent, DatePipe],
  templateUrl: './freelancer-profile.html',
  styleUrl: './freelancer-profile.css',
})
export class FreelancerProfileComponent implements OnInit {
  private freelancerService: FreelancerService = inject(FreelancerService);
  private route: ActivatedRoute = inject(ActivatedRoute);

  freelancer = signal<Freelancer | null>(null);
  loading = signal<boolean>(true);
  currency = CURRENCY;

  ngOnInit(): void {
    const id: string | null = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.freelancerService.getFreelancerById(id).subscribe({
        next: (freelancer: Freelancer) => {
          this.freelancer.set(freelancer);
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      });
    }
  }

  getFreelancerName(): string {
    const currentFreelancer: Freelancer | null = this.freelancer();
    if (!currentFreelancer) return '';
    if (typeof currentFreelancer.user === 'object' && currentFreelancer.user !== null) {
      return currentFreelancer.user.fullname;
    }
    return 'Unknown';
  }

  getFreelancerEmail(): string {
    const currentFreelancer: Freelancer | null = this.freelancer();
    if (!currentFreelancer) return '';
    if (typeof currentFreelancer.user === 'object' && currentFreelancer.user !== null) {
      return currentFreelancer.user.email;
    }
    return '';
  }

  getProfilePicture(): string {
    const currentFreelancer: Freelancer | null = this.freelancer();
    if (!currentFreelancer) return 'https://via.placeholder.com/150';
    if (typeof currentFreelancer.user === 'object' && currentFreelancer.user?.profilePicture) {
      const picture = currentFreelancer.user.profilePicture;
      if (picture.startsWith('http')) return picture;
      return `${API_BASE_URL}${picture}`;
    }
    return 'https://via.placeholder.com/150';
  }
}
