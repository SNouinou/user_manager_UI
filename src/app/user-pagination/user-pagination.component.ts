import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-user-pagination',
  templateUrl: './user-pagination.component.html',
  styleUrls: ['./user-pagination.component.scss']
})
export class UserPaginationComponent {
  @Input() totalPages: number = 1;
  @Input() currentPage: number = 1;

  @Output() fetchUserPage: EventEmitter<number> = new EventEmitter<number>();

  onFetchUserPage(page: number) : void {
    this.fetchUserPage.emit(page);
  }

}
