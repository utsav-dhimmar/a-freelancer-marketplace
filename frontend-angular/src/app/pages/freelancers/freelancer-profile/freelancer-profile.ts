import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FreelancerService } from '../../../services';
import type { Freelancer } from '../../../types/freelancer.types';

@Component({
  selector: 'app-freelancer-profile',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './freelancer-profile.html',
  styleUrl: './freelancer-profile.css',
})
export class FreelancerProfileComponent implements OnInit {
  private freelancerService: FreelancerService = inject(FreelancerService);
  private route: ActivatedRoute = inject(ActivatedRoute);

  freelancer = signal<Freelancer | null>(null);
  loading = signal<boolean>(true);

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
      return currentFreelancer.user.profilePicture;
    }
    return 'https://via.placeholder.com/150';
  }
}
