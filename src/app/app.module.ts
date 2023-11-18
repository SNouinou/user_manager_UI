import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GenerateUsersComponent } from './generate-users/generate-users.component';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { UserListRowComponent } from './user-list-row/user-list-row.component';
import { UserPaginationComponent } from './user-pagination/user-pagination.component';
import { UserSearchFormComponent } from './user-search-form/user-search-form.component';
import { UsersComponent } from './users/users.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    UsersComponent,
    UserSearchFormComponent,
    UserPaginationComponent,
    UserListRowComponent,
    LoginComponent,
    ProfileComponent,
    GenerateUsersComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
