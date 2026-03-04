import { CommonModule } from '@angular/common';
import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-user-avatar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="avatar-container"
      [style.width.px]="size()"
      [style.height.px]="size()"
      [style.border-radius]="shape() === 'circle' ? '50%' : '4px'"
      [style.background-color]="!src() ? bgColor() : 'transparent'"
    >
      @if (src()) {
        <img
          [src]="src()"
          [alt]="name()"
          class="avatar-img"
          [style.border-radius]="shape() === 'circle' ? '50%' : '4px'"
        />
      } @else {
        <span class="initials" [style.font-size.px]="size() * 0.4">
          {{ initials() }}
        </span>
      }
    </div>
  `,
  styles: [
    `
      .avatar-container {
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        color: white;
        font-weight: 600;
        flex-shrink: 0;
      }
      .avatar-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .initials {
        text-transform: uppercase;
      }
    `,
  ],
})
export class UserAvatarComponent {
  src = input<string | null | undefined>(null);
  name = input<string>('User');
  size = input<number>(40);
  shape = input<'circle' | 'square'>('circle');

  initials = computed(() => {
    const name = this.name() || 'User';
    return name
      .split(' ')
      .map((part) => part.charAt(0))
      .slice(0, 2)
      .join('');
  });

  bgColor = computed(() => {
    const name = this.name() || 'User';
    const colors = [
      '#F44336',
      '#E91E63',
      '#9C27B0',
      '#673AB7',
      '#3F51B5',
      '#2196F3',
      '#03A9F4',
      '#00BCD4',
      '#009688',
      '#4CAF50',
      '#8BC34A',
      '#CDDC39',
      '#FFC107',
      '#FF9800',
      '#FF5722',
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  });
}
