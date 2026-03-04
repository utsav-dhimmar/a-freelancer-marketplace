import { DatePipe } from '@angular/common';
import { Component, inject, type OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  EmptyStateComponent,
  LoadingSpinnerComponent,
  PaginationComponent,
  StatusBadgeComponent,
  UserAvatarComponent,
} from '../../../components';
import { AdminService } from '../../../services';
import type { User } from '../../../types/auth.types';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [
    FormsModule,
    DatePipe,
    LoadingSpinnerComponent,
    EmptyStateComponent,
    StatusBadgeComponent,
    PaginationComponent,
    UserAvatarComponent,
  ],
  templateUrl: './admin-users.html',
  styleUrl: './admin-users.css',
})
export class AdminUsersComponent implements OnInit {
  private adminService = inject(AdminService);

  users = signal<User[]>([]);
  loading = signal(true);
  error = signal('');
  page = signal(1);
  totalPages = signal(1);
  total = signal(0);
  limit = 10;

  // Filters

  // Edit modal state
  showEditModal = signal(false);
  editUser = signal<User | null>(null);
  editForm = { username: '', fullname: '', email: '', role: '' };
  saving = signal(false);

  // Delete confirmation
  showDeleteConfirm = signal(false);
  deleteTarget = signal<User | null>(null);
  deleting = signal(false);

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading.set(true);
    this.adminService.getAllUsers(this.page(), this.limit).subscribe({
      next: (res) => {
        this.users.set(res.users);
        this.totalPages.set(res.totalPages);
        this.total.set(res.total);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.message || 'Failed to load users');
        this.loading.set(false);
      },
    });
  }

  search(): void {
    this.page.set(1);
    this.loadUsers();
  }

  changePage(newPage: number): void {
    this.page.set(newPage);
    this.loadUsers();
  }

  openEdit(user: User): void {
    this.editUser.set(user);
    this.editForm = {
      username: user.username,
      fullname: user.fullname,
      email: user.email,
      role: user.role,
    };
    this.showEditModal.set(true);
  }

  closeEdit(): void {
    this.showEditModal.set(false);
    this.editUser.set(null);
  }

  saveUser(): void {
    const user = this.editUser();
    if (!user) return;

    this.saving.set(true);
    this.adminService.updateUser(user._id, this.editForm).subscribe({
      next: () => {
        this.saving.set(false);
        this.closeEdit();
        this.loadUsers();
      },
      error: (err) => {
        this.error.set(err.error?.message || 'Failed to update user');
        this.saving.set(false);
      },
    });
  }

  confirmDelete(user: User): void {
    this.deleteTarget.set(user);
    this.showDeleteConfirm.set(true);
  }

  cancelDelete(): void {
    this.showDeleteConfirm.set(false);
    this.deleteTarget.set(null);
  }

  executeDelete(): void {
    const user = this.deleteTarget();
    if (!user) return;

    this.deleting.set(true);
    this.adminService.deleteUser(user._id).subscribe({
      next: () => {
        this.deleting.set(false);
        this.cancelDelete();
        this.loadUsers();
      },
      error: (err) => {
        this.error.set(err.error?.message || 'Failed to delete user');
        this.deleting.set(false);
      },
    });
  }
}
