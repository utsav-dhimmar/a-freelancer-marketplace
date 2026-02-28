import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { FreelancerService } from '../../../services';
import type { CreateFreelancerRequest } from '../../../types/freelancer.types';

@Component({
  selector: 'app-freelancer-create',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './freelancer-create.html',
  styleUrl: './freelancer-create.css',
})
export class FreelancerCreateComponent {
  private fb = inject(FormBuilder);
  private freelancerService: FreelancerService = inject(FreelancerService);
  private router: Router = inject(Router);

  loading = signal<boolean>(false);
  error = signal<string>('');

  freelancerForm: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
    bio: ['', [Validators.required, Validators.minLength(50)]],
    hourlyRate: [0, [Validators.required, Validators.min(1)]],
    skillsInput: ['', [Validators.required]],
  });

  onSubmit(): void {
    if (this.freelancerForm.invalid) {
      this.freelancerForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.error.set('');

    const formValue = this.freelancerForm.value;

    const skills: string[] = formValue.skillsInput
      .split(',')
      .map((s: string) => s.trim())
      .filter((s: string) => s);

    const freelancerRequest: CreateFreelancerRequest = {
      title: formValue.title,
      bio: formValue.bio,
      skills: skills,
      hourlyRate: formValue.hourlyRate,
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

  isFieldInvalid(fieldName: string): boolean {
    const field = this.freelancerForm.get(fieldName);
    return !!field && field.invalid && (field.dirty || field.touched);
  }
}
