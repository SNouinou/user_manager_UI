import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AppStateService {
  constructor() {}

  private _authState = {
    isAuthenticated: false,
    token: undefined,
    username: undefined,
    roles: undefined,
  };

  public setAuthState(state: any) {
    this._authState = { ...this._authState, ...state };
  }

  public get authState() {
    return { ...this._authState };
  }
}
