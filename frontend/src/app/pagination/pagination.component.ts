import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Pagination } from 'src/model/pagination.type';

@Component({
  selector: 'pagination',
  templateUrl: './pagination.component.html'
})
export class PaginationComponent {
  @Input() pagination!: Pagination;
  @Output() changePageEvent = new EventEmitter<number>();

  ngOnChanges() {
    if (this.pagination.totalPages < 3) {
      this.pagination.pageStart = this.pagination.pageEnd = 1;
      return;
    }
    if (this.pagination.totalPages < 5) {
      this.pagination.pageStart = 1;
      this.pagination.pageEnd = this.pagination.totalPages - 1;
      return;
    }
    this.pagination.pageStart = this.pagination.page - 2 < 1 ? 1 : this.pagination.page - 2;
    this.pagination.pageEnd = this.pagination.page + 3 > this.pagination.totalPages - 1
      ? this.pagination.totalPages - 1
      : this.pagination.page + 3;
  }

  getMidPages() {
    return Array.from({ length: this.pagination.pageEnd - this.pagination.pageStart },
      (_, index) => index + this.pagination.pageStart)
  }

  changePage(newPage: number) {
    this.changePageEvent.emit(newPage);
  }

  handleEnter(event: KeyboardEvent) {
    if (event.key == "Enter" && (event.target as HTMLInputElement).checkValidity()) {
      this.changePage(+(event.target as HTMLInputElement).value - 1);
    }
  }
}
