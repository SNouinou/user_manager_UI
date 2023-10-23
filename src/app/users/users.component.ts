import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { UserRow } from '../models/user-row';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
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

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.currentPage = 1;
    this.currentFilter = "";
    this.usersList = undefined;

    this.loading = true;
    this.fetchUserPage(this.currentPage);
  }

  fetchUserPage(page: number): void {
    this.userService.getPage(page, this.currentFilter).subscribe({
      next: ({ users, totalPages, offScreen }) => {
        this.currentPage = page;
        this.usersList = users.map(user => new UserRow(user));
        this.totalPages = totalPages;
        this.offScreenUsersList = offScreen ? [new UserRow(offScreen)] : undefined;
        this.errorMsg = "";
        this.loading = false;
      },
      error: err => {
        this.errorMsg = err;
      }
    });
  }

  handleDeleteUser(userRow: UserRow): void {
    let confirmed = confirm("Are you sure ?");
    if (!confirmed) return;

    if (this.usersList == undefined) return;
    let users = this.usersList;

    userRow.delete.loading = true;

    this.userService.deleteUser(userRow.id).subscribe(
      {
        next: ({ itemsDeleted }) => {
          userRow.delete.loading = false;

          if (itemsDeleted != 1)
            return;
          users.splice(users.indexOf(userRow), 1);

          if (this.offScreenUsersList)
            users.push(this.offScreenUsersList[0]);

          this.userService.paginationActualisation(this.currentPage, this.currentFilter).subscribe({
            next: ({ offScreen, totalPages }) => {
              this.offScreenUsersList = offScreen ? [new UserRow(offScreen)] : undefined;
              this.totalPages = totalPages;

              if (this.currentPage > this.totalPages) {
                if (this.currentPage != 1) {
                  this.fetchUserPage(this.currentPage - 1);
                }
                return;
              }

            },
            error: err => {
              this.errorMsg = err;
            }
          });

        },
        error: err => {
          userRow.delete.loading = false;
          this.errorMsg = err;
        }
      }
    );
  }

  handleDisableUser(userRow: UserRow): void {

    let confirmed = confirm(`Are you sure about ${userRow.enabled ? 'disabling' : 'enabling'} this user ?`);
    if (!confirmed) return;

    userRow.disable.loading = true;

    this.userService.setUserActiveState(userRow.id, !userRow.enabled).subscribe(
      {
        next: data => {
          userRow.disable.loading = false;
          if (data)
            userRow.enabled = !userRow.enabled;
        },
        error: err => {
          this.errorMsg = err;
        }
      }
    );
  }

  onSearchFormSubmit(query: string): void {
    this.usersList = undefined;
    this.currentFilter = query;
    this.fetchUserPage(1);
  }

}
