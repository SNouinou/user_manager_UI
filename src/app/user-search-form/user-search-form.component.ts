import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-search-form',
  templateUrl: './user-search-form.component.html',
  styleUrls: ['./user-search-form.component.css']
})
export class UserSearchFormComponent {
  @Input() usernameSearchKeyword: string = '';
  @Input() searchFormIsInvalid: boolean = false;

  @Output() searchFormSubmit: EventEmitter<string> = new EventEmitter<string>();

  onSearchFormSubmit() : void {
    this.searchFormSubmit.emit(this.usernameSearchKeyword);
  }

  onKeyPress(e:any) : void {
    if(e.key == 'Enter'){
      e.preventDefault();
      this.onSearchFormSubmit();
    }
  }
}