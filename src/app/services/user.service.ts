import { Injectable } from '@angular/core';
import {
  Observable,
  firstValueFrom,
} from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../models/user';
import { HttpClient } from '@angular/common/http';
import { Profile } from '../models/profile';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  static readonly PAGE_SIZE = 5;
  static readonly BACKEND_HOST = 'http://localhost:4200/api';

  private users!: Array<User>;
  constructor(private _httpClient: HttpClient) {
    this.users = [
      {
        id: uuidv4(),
        username: 'admin',
        role: 'admin',
        enabled: true,
      },
      {
        id: uuidv4(),
        username: 'user1',
        role: 'role1',
        enabled: true,
      },
    ];
  }

  async deleteUser(id: string): Promise<boolean> {
    try {
      const response = await firstValueFrom(
        this._httpClient.delete<boolean>(`${UserService.BACKEND_HOST}/users/deleteItem`, {
          params: { id },
        }),
      );
      if (!response)
        throw new Error(
          `an issue occured while trying to delete the user with id: ${id}`,
        );

      return Promise.resolve(response);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async setUserActiveState(id: string, value: boolean): Promise<boolean> {
    try {
      const response = await firstValueFrom(
        this._httpClient.post<boolean>(`${UserService.BACKEND_HOST}/users/toggleUserAccess`,{id,value}),
      );
      if (!response)
        throw new Error(
          `an issue occured while performing the action on the user with id: ${id}`,
        );

      return Promise.resolve(response);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  getUserProfileObs(username: string, authToken: string): Observable<Profile> {
        return this._httpClient.get<Profile>(
          `${UserService.BACKEND_HOST}/users/${username}`, {
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${authToken}`
           }
        });
  }

  async getPage(
    page: number,
    searchFilter: string,
  ): Promise<{ users: User[]; totalPages: number; offScreen: User[] }> {
    try {
      const response = await firstValueFrom(
        this._httpClient.get<{
          content: User[];
          totalPages: number;
        }>(`${UserService.BACKEND_HOST}/users/fetch`, {
          params: { page, username: searchFilter, size: UserService.PAGE_SIZE },
        }),
      );
      if (!response || !response.content || response.content.length == 0)
        throw new Error(
          `no user is found for following filter=${searchFilter}`,
        );
      let { totalPages, content: users } = response;

      return Promise.resolve({ users, totalPages, offScreen: [] });
    } catch (error) {
      return Promise.reject(error);
    }
  }

  paginationActualisation(
    page: number,
    searchFilter: string,
  ): Promise<{ users: User[]; totalPages: number; offScreen: User[] }> {
    return this.getPage(page, searchFilter);
  }

  async generate(count: number): Promise<{ filename: string; content: any }> {
    try {
      const response = await firstValueFrom(
        this._httpClient.get(`${UserService.BACKEND_HOST}/users/generate`, {
          params: { count },
          observe: 'response', // <- provide response headers aswell.
        }),
      );
      const content = response.body;

      const contentDisposition = response.headers.get('Content-Disposition');
      const filename = this.extractFilename(contentDisposition) || 'file';

      return Promise.resolve({ filename, content });
    } catch (error) {
      return Promise.reject(error);
    }
  }

  private extractFilename(contentDisposition: string | null): string | null {
    if (!contentDisposition) {
      return null;
    }

    const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
    const matches = filenameRegex.exec(contentDisposition);

    if (matches != null && matches[1]) {
      return matches[1].replace(/['"]/g, '');
    }

    return null;
  }

  async uploadUserList(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    const upload$ = await firstValueFrom(
      this._httpClient.post(
        `${UserService.BACKEND_HOST}/users/batch`,
        formData,
        {
          observe: 'body',
        },
      ),
    );
    return upload$;
  }
}
