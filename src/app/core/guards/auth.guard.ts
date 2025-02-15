import { CanMatchFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const authGuard: CanMatchFn = async () => {
  const authService = inject(AuthService);
  let loginResult = false;

  if (await authService.isAuthenticated()) {
    loginResult = true;
  }
  else {
    loginResult = await authService.presentLoginModal();
  }

  if (loginResult === false) {
    return false;
  }

  const profile = await authService.getProfile();
  const hasProfile = profile !== null;

  if (hasProfile) {
    await authService.handleProfileSelection(profile);
  }

  return loginResult;
};
