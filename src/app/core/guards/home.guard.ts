import { inject } from '@angular/core';
import { CanMatchFn, NavigationEnd, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

let previousUrl: string = ''; // Variable para almacenar la ruta previa

export const homeGuard: CanMatchFn = async (route, segments) => {
  // debugger
  const router = inject(Router);
  const authService = inject(AuthService);
  const currentUrl = route.path;

  // Escuchar eventos de navegación y guardar la URL previa
  router.events.subscribe(event => {
    if (event instanceof NavigationEnd) {
      // debugger
      previousUrl = event.urlAfterRedirects || event.url;
      // console.log(previousUrl);
    }
  });

  // if (currentUrl === 'publico' && await authService.isAuthenticated()) {
  if (previousUrl == '' && await authService.isAuthenticated()) {

    const profile = await authService.getProfile();
    const hasProfile = profile !== null;

    if (hasProfile) {
      await authService.handleProfileSelection(profile);
    }

  }

  return true;
};
