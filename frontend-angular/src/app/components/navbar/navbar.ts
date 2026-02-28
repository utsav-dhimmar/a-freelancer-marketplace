import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class NavbarComponent {
  authService: AuthService = inject(AuthService);

  logout(): void {
    this.authService.logout().subscribe();
  }

  isLoggedIn(): boolean {
    return this.authService.isAuthenticated();
  }

  isClient(): boolean {
    return this.authService.isClient();
  }

  isFreelancer(): boolean {
    return this.authService.isFreelancer();
  }

  getUserName(): string {
    const user = this.authService.user();
    return user?.fullname || user?.username || '';
  }
}
