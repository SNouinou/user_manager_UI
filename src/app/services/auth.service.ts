import { Injectable } from '@angular/core';
import { compareSync, hashSync } from 'bcryptjs';
import { jwtDecode } from 'jwt-decode';
import { Observable, firstValueFrom } from 'rxjs';
import { AppStateService } from './app-state.service';
import { HttpClient } from '@angular/common/http';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  constructor(private appStateService: AppStateService, private _httpClient: HttpClient) {}

  async authenticate(username: string, password: string): Promise<{accessToken:string}> {
    try {
      const response = await firstValueFrom(
        this._httpClient.post<{accessToken:string}>(`${UserService.BACKEND_HOST}/auth`,{username,password}),
      );
      if (!response || !response.accessToken)
        throw new Error(
          'unvalid response from authentication server.',
        );

      return Promise.resolve(response);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async login(username: string, password: string) {
    try {
      const response = await this.authenticate(username, password);
      if (response.accessToken) {
        const payload = jwtDecode<any>(response.accessToken);
        const { auth: roles, sub: username } = payload;
        this.appStateService.setAuthState({
          isAuthenticated: true,
          token: response.accessToken,
          roles: roles[0].authority,
          username,
        });
        sessionStorage.setItem('accessToken',response.accessToken);
      }
      return;
    } catch (err) {
      throw err;
    }
  }

  async disconnect() {
    this.appStateService.setAuthState({
      isAuthenticated: false,
      auth: undefined,
      roles: undefined,
      username: undefined,
    });
  }
}
