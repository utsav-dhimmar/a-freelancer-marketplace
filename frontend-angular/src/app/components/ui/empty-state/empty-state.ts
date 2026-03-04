import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="text-center py-5 fade-in" [class.container]="container()">
      <div class="empty-state-icon mb-4">
        <i [class]="icon()" class="bi"></i>
      </div>
      <h3 class="h5 mb-2">{{ title() }}</h3>
      <p class="text-muted mb-4">{{ message() }}</p>
      <ng-content></ng-content>
    </div>
  `,
  styles: [
    `
      .empty-state-icon {
        font-size: 4rem;
        color: var(--bs-gray-400);
        opacity: 0.6;
      }
    `,
  ],
})
export class EmptyStateComponent {
  icon = input<string>('bi-inbox');
  title = input<string>('No data found');
  message = input<string>('There are no items to display at this time.');
  container = input<boolean>(false);
}
