import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  OnInit,
} from '@angular/core';

@Component({
  selector: 'app-user-pagination',
  templateUrl: './user-pagination.component.html',
  styleUrls: ['./user-pagination.component.scss'],
})
export class UserPaginationComponent implements OnChanges {
  ngOnChanges(changes: SimpleChanges): void {
    this.displayArray = [];
    if (this.totalPages < 2 * this.size + 1) {
      for (let page = 1; page <= this.totalPages; page++) {
        this.display(page + '');
      }
    } else {
      if (Math.abs(this.currentPage - 1) <= this.size + 2) {
        for (let page = 1; page <= this.currentPage + this.size; page++) {
          this.display(page + '');
        }
        this.display('...');
        this.display(this.totalPages + '');
      } else {
        this.display('1');
        this.display('...');
        if (Math.abs(this.currentPage - this.totalPages) <= this.size + 2) {
          for (
            let page = this.currentPage - this.size;
            page <= this.totalPages;
            page++
          ) {
            this.display(page + '');
          }
        } else {
          for (
            let page = this.currentPage - this.size;
            page <= this.currentPage + this.size;
            page++
          ) {
            this.display(page + '');
          }
          this.display('...');
          this.display(this.totalPages + '');
        }
      }
    }
  }

  size = 2;
  displayArray: string[] = [];
  _Number = Number;

  @Input() totalPages: number = 1;
  @Input() currentPage: number = 1;

  @Output() fetchUserPage: EventEmitter<number> = new EventEmitter<number>();

  onFetchUserPage(page: number) : void {
    this.fetchUserPage.emit(page);
  }

  display(pageButton: string) {
    this.displayArray.push(pageButton);
  }
}
