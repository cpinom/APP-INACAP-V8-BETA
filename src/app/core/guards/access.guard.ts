import { inject } from '@angular/core';
import { CanMatchFn } from '@angular/router';
import { NavController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { Rol } from '../interfaces/auth.interfaces';

export const accessGuard: CanMatchFn = async (route, segments) => {
  const nav = inject(NavController);
  const authService = inject(AuthService);

  if (await authService.isAuthenticated()) {
    const auth = await authService.getAuth();
    const user = auth.user;
    const role = route.data?.['role'] as Rol;

    if (role == Rol.alumno && user.esAlumno) {
      return true;
    }
    if (role == Rol.docente && user.esDocente) {
      return true;
    }
    if (role == Rol.exalumno && user.esExalumno) {
      return true;
    }

    await nav.navigateRoot('privado');

  }
  else {
    await nav.navigateRoot('publico');
  }

  return true;
};
