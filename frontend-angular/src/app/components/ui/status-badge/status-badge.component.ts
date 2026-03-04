import { CommonModule } from '@angular/common';
import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="badge" [ngClass]="badgeClass()">
      {{ status() | titlecase }}
    </span>
  `,
  styles: [
    `
      .badge {
        font-weight: 500;
        padding: 0.5em 0.8em;
        border-radius: 4px;
        text-transform: capitalize;
      }
    `,
  ],
})
export class StatusBadgeComponent {
  status = input.required<string>();
  type = input<'job' | 'contract' | 'proposal' | 'user' | 'default'>('default');

  badgeClass = computed(() => {
    const s = this.status().toLowerCase();
    const t = this.type();

    if (t === 'job') {
      const classes: Record<string, string> = {
        open: 'bg-success',
        in_progress: 'bg-info',
        completed: 'bg-secondary',
        closed: 'bg-danger',
      };
      return classes[s] || 'bg-secondary';
    }

    if (t === 'contract') {
      const classes: Record<string, string> = {
        active: 'bg-primary',
        submitted: 'bg-warning text-dark',
        completed: 'bg-success',
        disputed: 'bg-danger',
      };
      return classes[s] || 'bg-secondary';
    }

    if (t === 'proposal') {
      const classes: Record<string, string> = {
        pending: 'bg-warning text-dark',
        accepted: 'bg-success',
        rejected: 'bg-danger',
        withdrawn: 'bg-secondary',
      };
      return classes[s] || 'bg-secondary';
    }

    // Default or user roles
    const genericClasses: Record<string, string> = {
      admin: 'bg-dark',
      client: 'bg-primary',
      freelancer: 'bg-info',
      active: 'bg-success',
      inactive: 'bg-danger',
      pending: 'bg-warning text-dark',
    };

    return genericClasses[s] || 'bg-secondary';
  });
}
