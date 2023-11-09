import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

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

  private authStateCopy = {...this._authState};

  public setAuthState(state: any) {
    this._authState = { ...this._authState, ...state };
    this.updateFromSource(this.authStateCopy, this._authState);
  }

  public get authState() {
    // reset copy if mutated
    this.updateFromSource(this.authStateCopy, this._authState);
    return this.authStateCopy;
  }

  updateFromSource(targetObj: any, sourceObj: any) {
    // Reset all properties of targetObj
    Object.keys(targetObj).forEach((key) => {
      delete targetObj[key];
    });

    // Copy properties from sourceObj to targetObj
    Object.keys(sourceObj).forEach((key) => {
      targetObj[key] = sourceObj[key];
    });
  }
}
