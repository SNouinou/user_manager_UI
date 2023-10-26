import {
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { UserRow } from '../models/user-row';

@Component({
  selector: '[app-user-list-row]',
  templateUrl: './user-list-row.component.html',
  styleUrls: ['./user-list-row.component.scss'],
})
export class UserListRowComponent {
  @Input() user!: UserRow;

  @Output() handleDisableUser: EventEmitter<UserRow> =
    new EventEmitter<UserRow>();
  @Output() handleDeleteUser: EventEmitter<UserRow> =
    new EventEmitter<UserRow>();

  onDisableUser(): void {
    this.handleDisableUser.emit(this.user);
  }

  onDeleteUser(): void {
    this.handleDeleteUser.emit(this.user);
  }
}
