import { CommonModule } from '@angular/common';
import { Component, computed, input, output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (totalPages() > 1) {
      <nav aria-label="Page navigation">
        <ul class="pagination justify-content-center mt-4">
          <li class="page-item" [class.disabled]="currentPage() === 1">
            <button
              class="page-link"
              (click)="onPageChange(currentPage() - 1)"
              aria-label="Previous"
            >
              <span aria-hidden="true">&laquo;</span>
            </button>
          </li>

          @for (page of pages(); track page) {
            <li class="page-item" [class.active]="page === currentPage()">
              <button class="page-link" (click)="onPageChange(page)">{{ page }}</button>
            </li>
          }

          <li class="page-item" [class.disabled]="currentPage() === totalPages()">
            <button class="page-link" (click)="onPageChange(currentPage() + 1)" aria-label="Next">
              <span aria-hidden="true">&raquo;</span>
            </button>
          </li>
        </ul>
      </nav>
    }
  `,
  styles: [
    `
      .page-link {
        cursor: pointer;
        box-shadow: none !important;
      }
      .page-item.active .page-link {
        background-color: var(--bs-primary);
        border-color: var(--bs-primary);
      }
    `,
  ],
})
export class PaginationComponent {
  currentPage = input.required<number>();
  totalItems = input.required<number>();
  pageSize = input<number>(10);
  pageChange = output<number>();

  totalPages = computed(() => Math.ceil(this.totalItems() / this.pageSize()));

  pages = computed(() => {
    const total = this.totalPages();
    const current = this.currentPage();
    const maxPagesToShow = 5;
    const pages: number[] = [];

    let startPage: number, endPage: number;
    if (total <= maxPagesToShow) {
      startPage = 1;
      endPage = total;
    } else {
      const maxPagesBeforeCurrentPage = Math.floor(maxPagesToShow / 2);
      const maxPagesAfterCurrentPage = Math.ceil(maxPagesToShow / 2) - 1;
      if (current <= maxPagesBeforeCurrentPage) {
        startPage = 1;
        endPage = maxPagesToShow;
      } else if (current + maxPagesAfterCurrentPage >= total) {
        startPage = total - maxPagesToShow + 1;
        endPage = total;
      } else {
        startPage = current - maxPagesBeforeCurrentPage;
        endPage = current + maxPagesAfterCurrentPage;
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  });

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages() && page !== this.currentPage()) {
      this.pageChange.emit(page);
    }
  }
}
