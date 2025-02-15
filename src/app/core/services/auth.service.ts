import { inject, Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import * as moment from 'moment';
import { DialogService } from './dialog.service';
import { LoginComponent } from '../components/login/login.component';
import { CapacitorHttp, HttpOptions } from '@capacitor/core';
import { AppGlobal } from 'src/app/app.global';
import { NavController } from '@ionic/angular';
import { Auth } from '../interfaces/auth.interfaces';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private storageAuth: string = 'Auth-MOVIL';
  private dialog = inject(DialogService);
  private baseUrl: string = inject(AppGlobal).Api;
  private nav = inject(NavController);

  constructor() { }

  async isAuthenticated(): Promise<boolean> {
    return await this.isTokenValid();
  }
  async isTokenValid() {
    let auth = await this.getAuth();

    if (auth) {
      let now = moment();
      let expiration_date = moment(auth.expiration_date);

      if (now.isSameOrBefore(expiration_date, 'seconds')) {
        return true;
      }
      else {
        await this.clearAuth(true);
      }
    }

    return false;
  }
  async presentLoginModal(): Promise<boolean> {
    const modal = await this.dialog.showModal({
      component: LoginComponent,
      backdropDismiss: false,
      canDismiss: async (data?: any, role?: string) => {
        if (role == 'gesture' || role == 'backdrop') {
          return false;
        }
        return true
      }
    });

    const { data } = await modal.onDidDismiss();

    if (data) {
      await this.setAuth(data);
      return true;
    }
    return false;
  }
  async login(params: any) {
    const options: HttpOptions = {
      url: `${this.baseUrl}/api/v4/login`,
      data: params,
      responseType: 'json',
      headers: { 'Content-Type': 'application/json' }
    };
    const response = await CapacitorHttp.post(options);

    if (response.status == 200) {
      return response.data;
    }
    else {
      return Promise.reject(response);
    }
  }
  async setAuth(auth: Auth) {
    if (auth.expires > 0) {
      auth.expiration_date = moment().add(auth.expires, 'minutes');
      auth.expires = 0;
    }

    const hasProfile = (await this.getProfile()) !== null;

    if (!hasProfile) {
      let profiles = 0;

      if (auth.user.esAlumno) profiles++;
      if (auth.user.esDocente) profiles++;
      if (auth.user.esExalumno) profiles++;

      if (profiles == 1) {
        if (auth.user.esAlumno) {
          auth.user.perfil = '/alumno';
        }
        else if (auth.user.esDocente) {
          auth.user.perfil = '/docente';
        }
        else if (auth.user.esExalumno) {
          auth.user.perfil = '/exalumno';
        }
      }
    }


    await Preferences.set({ key: this.storageAuth, value: JSON.stringify(auth) });
    await Preferences.set({ key: `${this.storageAuth}-cache`, value: JSON.stringify(auth.user.data) });
  }
  async setProfile(profile: string) {
    let auth = await this.getAuth();

    if (auth) {
      auth.user.perfil = profile;
      await this.setAuth(auth);
    }
  }
  async getProfile() {
    let auth = await this.getAuth();

    if (auth) {
      return auth.user.perfil;
    }
    else {
      return null;
    }
  }
  async handleProfileSelection(profile: string) {
    if (profile === '/alumno') {
      await this.nav.navigateForward('dashboard-alumno');
    }
    else if (profile === '/docente') {
      await this.nav.navigateForward('dashboard-docente');
    }
    else if (profile === '/exalumno') {
      await this.nav.navigateForward('dashboard-exalumno');
    }
  }
  async getToken() {
    const auth = await this.getAuth();

    if (auth != null) {
      return auth.access_token;
    }
    else {
      return null;
    }
  }
  async getAuth() {
    return this.getStorage(this.storageAuth);
  }
  async getStorage(key: string) {
    return Preferences.get({ key: key }).then(result => {
      return result.value ? JSON.parse(result.value) : null;
    });
  }
  async clearAuth(clearStorage: boolean) {
    if (clearStorage) {
      await Preferences.remove({ key: this.storageAuth });
    }
  }
  async clearUserCache() {
    await Preferences.remove({ key: `${this.storageAuth}-cache` });
  }

}
