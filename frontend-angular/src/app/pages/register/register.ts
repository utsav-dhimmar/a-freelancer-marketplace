import { Component, inject, signal } from '@angular/core';
import { FormBuilder, type FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/';
import type { RegisterRequest } from '../../types/auth.types';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class RegisterComponent {
  private authService: AuthService = inject(AuthService);
  private router: Router = inject(Router);
  private fb: FormBuilder = inject(FormBuilder);

  form: FormGroup = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    fullname: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    isClient: [true],
    isFreelancer: [false],
    agreeToTerms: [false, Validators.requiredTrue],
  });

  profilePicture?: string;
  loading = signal(false);
  error = signal('');

  isClient(): boolean {
    return this.form.get('isClient')?.value ?? true;
  }

  isFreelancer(): boolean {
    return this.form.get('isFreelancer')?.value ?? false;
  }

  toggleRole(role: 'client' | 'freelancer'): void {
    if (role === 'client') {
      this.form.patchValue({ isClient: !this.isClient() });
    } else {
      this.form.patchValue({ isFreelancer: !this.isFreelancer() });
    }
  }

  onFileSelect(event: Event): void {
    const input: HTMLInputElement = event.target as HTMLInputElement;
    if (input.files?.length) {
      const file: File = input.files[0];
      const reader: FileReader = new FileReader();
      reader.onload = (): void => {
        const result: string = reader.result as string;
        this.profilePicture = result.split(',')[1];
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.error.set('');
    const registerData: RegisterRequest = {
      username: this.form.value.username,
      fullname: this.form.value.fullname,
      email: this.form.value.email,
      password: this.form.value.password,
      role: this.isFreelancer() ? 'freelancer' : 'client',
      profilePicture: this.profilePicture,
    };
    this.authService.register(registerData).subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (err: { error?: { message?: string } }) => {
        this.error.set(err.error?.message || 'Registration failed');
        this.loading.set(false);
      },
    });
  }
}
