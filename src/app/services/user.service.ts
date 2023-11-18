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

  readonly PAGE_SIZE = 5;
  static readonly BACKEND_HOST = 'http://localhost:4200/api';

  private users!: Array<User>;
  constructor(private _httpClient: HttpClient) {
    this.users = [
      {
        id: uuidv4(),
        username: 'admin',
        profile: { roles: ['admin'] },
        enabled: true,
      },
      {
        id: uuidv4(),
        username: 'user1',
        profile: { roles: ['role1', 'role2'] },
        enabled: true,
      },
      {
        id: uuidv4(),
        username: 'user2',
        profile: { roles: [] },
        enabled: false,
      },
      {
        id: uuidv4(),
        username: 'admin',
        profile: { roles: ['admin'] },
        enabled: true,
      },
      {
        id: uuidv4(),
        username: 'user1',
        profile: { roles: ['role1', 'role2'] },
        enabled: true,
      },
      {
        id: uuidv4(),
        username: 'user2',
        profile: { roles: [] },
        enabled: false,
      },
      {
        id: uuidv4(),
        username: 'admin',
        profile: { roles: ['admin'] },
        enabled: true,
      },
      {
        id: uuidv4(),
        username: 'user1',
        profile: { roles: ['role1', 'role2'] },
        enabled: true,
      },
      {
        id: uuidv4(),
        username: 'user2',
        profile: { roles: [] },
        enabled: false,
      },
      {
        id: uuidv4(),
        username: 'admin',
        profile: { roles: ['admin'] },
        enabled: true,
      },
      {
        id: uuidv4(),
        username: 'user1',
        profile: { roles: ['role1', 'role2'] },
        enabled: true,
      },
      {
        id: uuidv4(),
        username: 'user2',
        profile: { roles: [] },
        enabled: false,
      },
      {
        id: uuidv4(),
        username: 'admin',
        profile: { roles: ['admin'] },
        enabled: true,
      },
      {
        id: uuidv4(),
        username: 'user1',
        profile: { roles: ['role1', 'role2'] },
        enabled: true,
      },
      {
        id: uuidv4(),
        username: 'user2',
        profile: { roles: [] },
        enabled: false,
      },
      {
        id: uuidv4(),
        username: 'admin',
        profile: { roles: ['admin'] },
        enabled: true,
      },
      {
        id: uuidv4(),
        username: 'user1',
        profile: { roles: ['role1', 'role2'] },
        enabled: true,
      },
      {
        id: uuidv4(),
        username: 'user2',
        profile: { roles: [] },
        enabled: false,
      },
    ];
  }

  public getAllUsers(): Observable<Array<User>> {
    return of([...this.users]).pipe(delay(1000));
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

  public filterByUsername(
    usernameSearchKey: string,
  ): Observable<User[] | never> {
    let filter = this.users.filter((u) =>
      u.username.includes(usernameSearchKey),
    );
    if (!filter || filter.length == 0)
      return throwError(
        () => new Error(`no user is found for username=${usernameSearchKey}`),
      ).pipe(delay(250));
    return of(filter).pipe(delay(250));
  }

  getPage(
    page: number,
    searchFilter: string,
  ): Observable<{ users: User[]; totalPages: number; offScreen: User }> {
    let filter = this.users.filter((u) => u.username.includes(searchFilter));
    if (!filter || filter.length == 0)
      return throwError(
        () =>
          new Error(`no user is found for following filter=${searchFilter}`),
      ).pipe(delay(250));
    let totalPages;
    if (filter.length % this.PAGE_SIZE == 0) {
      totalPages = Math.floor(filter.length / this.PAGE_SIZE);
    } else {
      totalPages = Math.floor(filter.length / this.PAGE_SIZE) + 1;
    }
    if (page > totalPages) {
      return throwError(() => new Error("page requested doesn't exist")).pipe(
        materialize(),
        delay(500),
        dematerialize(),
      );
    }

    let start = this.PAGE_SIZE * (page - 1); // page 2: 5
    let end = Math.min(filter.length, this.PAGE_SIZE * page); // page 2: min(size,10)
    let users = filter.slice(start, end); // page 2: 5->6th , 10 -> 11th(exculsed) -> 10th
    let offScreen = filter[end];
    return of({ users, totalPages, offScreen }).pipe(delay(250));
  }

  paginationActualisation(
    page: number,
    searchFilter: string,
  ): Observable<{ totalPages: number; offScreen: User }> {
    let filter = this.users.filter((u) => u.username.includes(searchFilter));
    if (!filter || filter.length == 0)
      return throwError(
        () =>
          new Error(`no user is found for following filter=${searchFilter}`),
      ).pipe(delay(250));

    let totalPages;
    if (filter.length % this.PAGE_SIZE == 0) {
      totalPages = Math.floor(filter.length / this.PAGE_SIZE);
    } else {
      totalPages = Math.floor(filter.length / this.PAGE_SIZE) + 1;
    }

    let end = Math.min(filter.length, this.PAGE_SIZE * page); // page 2: min(size,10)
    let offScreen = filter[end];

    return of({ totalPages, offScreen }).pipe(delay(250));
  }

  async generate(count: number): Promise<{ filename: string, content:any }> {
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
      this._httpClient.post(`${UserService.BACKEND_HOST}/users/batch`, formData, {
        observe: 'body',
      })
    );
    return upload$;
  }

}
