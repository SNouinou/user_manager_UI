import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersComponent } from './users/users.component';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { authenticationGuard } from './guards/authentication.guard';

const routes: Routes = [
  { path: 'users', component: UsersComponent, canActivate: [authenticationGuard] },
  { path: 'profile/:id', component: ProfileComponent, canActivate: [authenticationGuard] },
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}


