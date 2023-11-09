import { Injectable } from '@angular/core';
import { compareSync, hashSync } from 'bcryptjs';
import { jwtDecode } from 'jwt-decode';
import { Observable, firstValueFrom } from 'rxjs';
import { AppStateService } from './app-state.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private data: Array<any> = [
    {
      username: 'user1',
      password: hashSync('pwd1', 2),
      role: ['user1', 'admin'],
      token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InVzZXIxIiwicm9sZXMiOlsidXNlcjEiLCJhZG1pbiJdfQ.a2tXpb5K2qD-D3hfcq75MTs5Z7YRO9BaJ8cI6G7t1l8',
    },
  ];

  constructor(private appStateService: AppStateService) {}

  // TODO: replace this method with http request  
  authenticate(username: string, password: string): Observable<any> {
    return new Observable((subscriber) => {
      const credentials = this.data.find((item) => item.username === username);

      if (!credentials) {
        subscriber.error(new Error('user not found'));
      }

      if (!compareSync(password, credentials.password)) {
        subscriber.error(new Error('user not found'));
      } else {
        subscriber.next(credentials);
      }
      subscriber.complete();
    });
  }

  async login(username: string, password: string) {
    try {
      const response = await firstValueFrom(
        this.authenticate(username, password),
      );
      if (response.token) {
        const payload = jwtDecode<any>(response.token);
        const { roles, username } = payload;
        this.appStateService.setAuthState({
          isAuthenticated: true,
          auth: response.token,
          roles,
          username,
        });
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
