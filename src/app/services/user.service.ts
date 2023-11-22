import { Injectable } from '@angular/core';
import {
  Observable,
  delay,
  dematerialize,
  firstValueFrom,
  materialize,
  of,
  throwError,
} from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../models/user';
import { HttpClient } from '@angular/common/http';

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
        roles: ['admin'],
        enabled: true,
      },
      {
        id: uuidv4(),
        username: 'user1',
        roles: ['role1', 'role2'],
        enabled: true,
      },
    ];
  }

  public deleteUser(id: string): Observable<{ itemsDeleted: number }> {
    let out = this.users.length;
    this.users = this.users.filter((u) => u.id != id);
    out -= this.users.length;
    if (out == 0)
      return throwError(() => {
        new Error(`no user is found for id=${id}`);
      }).pipe(delay(500));

    return of({ itemsDeleted: out }).pipe(delay(500));
  }

  public setUserActiveState(id: string, value: boolean): Observable<boolean> {
    let lookup = this.users.filter((u) => u.id == id);
    if (!lookup || lookup.length == 0)
      return throwError(() => new Error(`no user is found for id=${id}`)).pipe(
        delay(500),
      );

    lookup[0].enabled = value;
    return of(true).pipe(delay(500));
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
