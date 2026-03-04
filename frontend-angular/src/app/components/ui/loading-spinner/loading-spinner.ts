import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="d-flex justify-content-center align-items-center" [class.py-5]="padding()">
      <div class="spinner-border" [class]="colorClass()" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      @if (message()) {
        <span class="ms-3 text-muted">{{ message() }}</span>
      }
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        width: 100%;
      }
    `,
  ],
})
export class LoadingSpinnerComponent {
  message = input<string>('');
  padding = input<boolean>(true);
  colorClass = input<string>('text-primary');
}
