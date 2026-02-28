import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
    role: ['client', Validators.required],
  });

  profilePicture?: string;
  loading = signal(false);
  error = signal('');

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
      ...this.form.value,
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
