import { inject, Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { DialogService } from './dialog.service';
import { LoginComponent } from '../components/login/login.component';
import { CapacitorHttp, HttpOptions } from '@capacitor/core';
import { AppGlobal } from 'src/app/app.global';
import { ActionSheetController, NavController, Platform } from '@ionic/angular';
import { Auth } from '../interfaces/auth.interfaces';
import { EventsService } from './events.service';
import { Device } from '@capacitor/device';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { FingerprintAIO } from '@awesome-cordova-plugins/fingerprint-aio/ngx';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private storageAuth: string = 'Auth-MOVIL';
  private dialog = inject(DialogService);
  private baseUrl: string = inject(AppGlobal).Api;
  private nav = inject(NavController);
  private events = inject(EventsService);
  private action = inject(ActionSheetController);
  private pt = inject(Platform);
  private faio = inject(FingerprintAIO);
  private global = inject(AppGlobal);

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
        await this.clearAuth();
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
      },
      presentingElement: this.global.PublicOutlet?.nativeEl || undefined,
      // presentingElement: getRouterOutlet() || undefined,
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
  async clearProfile() {
    let auth = await this.getAuth();

    if (auth && auth.user.perfil) {
      delete auth.user.perfil;
      await this.setAuth(auth);
    }
  }
  async getProfile() {
    let auth = await this.getAuth();

    if (auth && auth.user.perfil) {
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
  public async tryLogout() {
    const auth = await this.getAuth();
    const user = auth.user;
    let buttons = [];
    let perfiles = 0;

    if (user.esAlumno) perfiles++;
    if (user.esDocente) perfiles++;
    if (user.esExalumno) perfiles++;

    buttons.push({
      text: 'Salir',
      role: 'destructive',
      handler: async () => {
        await this.clearAuth();
        await this.nav.navigateRoot('publico');
      }
    });

    if (perfiles > 1) {
      buttons.push({
        text: 'Cambiar de Cuenta',
        role: '',
        handler: async () => {
          let auth = await this.getAuth();
          this.events.app.next({ action: 'app:auth-change-account', value: auth['perfil'] });
          await this.clearProfile();
          await this.nav.navigateRoot('privado');
        }
      });
    }

    buttons.push({
      text: 'Cancelar',
      role: 'cancel'
    });

    const actionSheet = await this.action.create({
      header: '¿Segur@ que quieres cerrar la sesión?',
      buttons: buttons
    });

    await actionSheet.present();
  }
  async getStorage(key: string) {
    return Preferences.get({ key: key }).then(result => {
      return result.value ? JSON.parse(result.value) : null;
    });
  }
  async clearAuth() {
    const auth = await this.getAuth();

    if (auth) {
      const user = auth.user;

      try {
        Filesystem.deleteFile({
          path: `CACHED-IMG/${user.data.persNcorr}`,
          directory: Directory.Cache
        })
      }
      catch (ex) { }
    }

    await Preferences.remove({ key: this.storageAuth });

    const device = await Device.getId(); {
      this.events.onLogout.next({ uuid: device.identifier });
    }
  }
  async clearUserCache() {
    await Preferences.remove({ key: `${this.storageAuth}-cache` });
  }
  validateFaceID(): Promise<boolean> {

    if (this.pt.is('mobileweb')) {
      return Promise.resolve(true);
    }

    return new Promise(async (resolve) => {
      this.faio.isAvailable({ requireStrongBiometrics: false }).then((available) => {
        console.log('*** available');
        console.log(available);

        this.faio.show({
          //clientId: 'Fingerprint-Demo',
          //clientSecret: 'password',
          disableBackup: false,
          //localizedFallbackTitle: 'Ingrese el código',
          //localizedReason: 'Ingrese el código'
        }).then(() => {
          resolve(true)
        }).catch((error) => {
          // alert('error show');
          // alert(JSON.stringify(error));
          resolve(false)
        });

      }).catch((error) => {
        // alert('error isAvailable');
        // alert(JSON.stringify(error));
        console.log('*** error');
        console.log(error);

        // this.faio.loadBiometricSecret({}).then(result => {
        //   resolve(true)
        // }).catch(error => {
        //   // alert('error loadBiometricSecret');
        //   // alert(JSON.stringify(error));
        //   resolve(false)
        // });
      })
    });
  }

}