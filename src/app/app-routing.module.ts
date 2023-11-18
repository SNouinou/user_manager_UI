import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authenticationGuard } from './guards/authentication.guard';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { UsersComponent } from './users/users.component';
import { GenerateUsersComponent } from './generate-users/generate-users.component';

const routes: Routes = [
  { path: 'users', component: UsersComponent, canActivate: [authenticationGuard] },
  { path: 'profile/:id', component: ProfileComponent, canActivate: [authenticationGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'generate', component: GenerateUsersComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}


