import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { AppStateService } from '../services/app-state.service';
import { inject } from '@angular/core';

export const authenticationGuard: any = (
  route: RouterStateSnapshot | ActivatedRouteSnapshot,
  state: undefined,
) => {
  const appStateService = inject(AppStateService);
  const router = inject(Router);
  if (!appStateService?.authState?.isAuthenticated) {
    router.navigateByUrl('login');
    return false;
  }
  return true;
};
