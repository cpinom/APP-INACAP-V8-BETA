import { CanMatchFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { Ingreso } from '../interfaces/auth.interfaces';
import { DialogService } from '../services/dialog.service';
import { Device } from '@capacitor/device';
import { EventsService } from '../services/events.service';

export const authGuard: CanMatchFn = async () => {
  const authService = inject(AuthService);
  const dialog = inject(DialogService);
  const events = inject(EventsService);

  let loginResult = false;
  let loginPrevious = false;

  if (await authService.isAuthenticated()) {
    loginResult = true;
    loginPrevious = true;
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
    if (!loginPrevious) {
      const auth = await authService.getAuth();
      const user = auth.user;
      const loading = await dialog.showLoading({ message: 'Cargando preferencias...' });
      const id = await Device.getId();
      const diacTtipo = profile.replace('/', '');
      const data: Ingreso = {
        uuid: id.identifier,
        sedeCcod: user.sedeUsuario,
        carrCcod: '',
        diacTtipo: diacTtipo,
        time: (new Date()).getTime(),
        callback: async () => {
          await authService.handleProfileSelection(profile);
          await loading.dismiss();
        }
      };

      events.onLogin.next(data);
    }
    else {
      await authService.handleProfileSelection(profile);
    }
  }

  return loginResult;
};
