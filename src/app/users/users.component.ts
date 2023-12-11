import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { UserRow } from '../models/user-row';
import { Router } from '@angular/router';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  usersList: UserRow[] | undefined;
  offScreenUsersList: UserRow[] | undefined;

  currentFilter!: string;
  currentPage!: number;
  totalPages!: number;

  errorMsg!: string;
  searchFormIsInvalid!: boolean;

  loading!: boolean;

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.currentPage = 1;
    this.currentFilter = '';
    this.usersList = undefined;

    this.loading = true;
    this.fetchUserPage(this.currentPage);
  }

  fetchUserPage(page: number): void {
    this.userService
      .getPage(page, this.currentFilter)
      .then(({ users, totalPages, offScreen }) => {
        this.currentPage = page;
        this.usersList = users.map((user) => new UserRow(user));
        this.totalPages = totalPages;
        this.offScreenUsersList = offScreen
          ? offScreen.map((item) => new UserRow(item))
          : undefined;
        this.errorMsg = '';
        this.loading = false;
      })
      .catch((err) => {
        this.errorMsg =
          err instanceof Error ? err.message : JSON.stringify(err);
      });
  }

  handleDeleteUser(userRow: UserRow): void {
    let confirmed = confirm('Are you sure ?');
    if (!confirmed) return;

    if (this.usersList == undefined) return;
    let users = this.usersList;

    userRow.delete.loading = true;

    this.userService
      .deleteUser(userRow.id)
      .then((data) => {
        userRow.delete.loading = false;

        if (!data) return;
        users.splice(users.indexOf(userRow), 1);
      })
      .catch((err) => {
        this.errorMsg =
          err instanceof Error
            ? err.message
            : err.message || JSON.stringify(err);
      });
  }

  handleUserClick(userRow: UserRow): void {
    const username = userRow.username;
    this.router.navigateByUrl('/profile/'+username);
  }

  handleDisableUser(userRow: UserRow): void {
    let confirmed = confirm(
      `Are you sure about ${
        userRow.enabled ? 'disabling' : 'enabling'
      } this user ?`,
    );
    if (!confirmed) return;

    userRow.disable.loading = true;

    this.userService
      .setUserActiveState(userRow.id, !userRow.enabled)
      .then((data) => {
        if (data) userRow.enabled = !userRow.enabled;
      })
      .catch((err) => {
        this.errorMsg =
          err instanceof Error
            ? err.message
            : err.message || JSON.stringify(err);
      })
      .finally(() => {
        userRow.disable.loading = false;
      });
  }

  onSearchFormSubmit(query: string): void {
    this.usersList = undefined;
    this.currentFilter = query;
    this.fetchUserPage(1);
  }
}
