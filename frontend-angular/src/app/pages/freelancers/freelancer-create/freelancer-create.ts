import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { FreelancerService } from '../../../services';
import type { CreateFreelancerRequest } from '../../../types/freelancer.types';

@Component({
  selector: 'app-freelancer-create',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './freelancer-create.html',
  styleUrl: './freelancer-create.css',
})
export class FreelancerCreateComponent {
  private freelancerService: FreelancerService = inject(FreelancerService);
  private router: Router = inject(Router);

  title: string = '';
  bio: string = '';
  skillsInput: string = '';
  hourlyRate: number = 0;
  loading = signal<boolean>(false);
  error = signal<string>('');

  onSubmit(): void {
    this.loading.set(true);
    this.error.set('');

    const skills: string[] = this.skillsInput
      .split(',')
      .map((s: string) => s.trim())
      .filter((s: string) => s);

    const freelancerRequest: CreateFreelancerRequest = {
      title: this.title,
      bio: this.bio,
      skills: skills,
      hourlyRate: this.hourlyRate,
    };

    this.freelancerService.createFreelancer(freelancerRequest).subscribe({
      next: () => {
        this.router.navigate(['/freelancers']);
      },
      error: (err: { error?: { message?: string } }) => {
        this.error.set(err.error?.message || 'Failed to create freelancer profile');
        this.loading.set(false);
      },
    });
  }
}
