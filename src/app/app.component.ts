import { Component, inject } from '@angular/core';
import { LoadingController, ModalController, NavController, Platform, ToastController } from '@ionic/angular';
import { EventsService } from './core/services/events.service';
import { NavigationEnd, Router } from '@angular/router';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Keyboard } from '@capacitor/keyboard';
import { AppEvent, Ingreso, Salida } from './core/interfaces/auth.interfaces';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { ProfileService } from './core/services/profile.service';
import { AlumnoService } from './core/services/http/alumno.service';
import { AuthService } from './core/services/auth.service';
import { ErrorHandlerService } from './core/services/error-handler.service';
import { PublicService } from './core/services/http/public.service';
import { AppGlobal } from './app.global';
import { DialogService } from './core/services/dialog.service';
import { UtilsService } from './core/services/utils.service';
import { AppLauncher } from '@capacitor/app-launcher';
import { SnackbarService } from './core/services/snackbar.service';
import { PrivateService } from './core/services/http/private.service';
import { FCM } from '@capacitor-community/fcm';
import { InacapMailService } from './core/services/http/inacapmail.service';
import { MicrosoftTeamsService } from './core/services/http/mteams.service';
import { DocenteService } from './core/services/http/docente.service';
import { SolicitudesService } from './core/services/http/solicitudes.service';
import { CertificadosService } from './core/services/http/certificados.service';
import { BuzonOpinionService } from './core/services/http/buzonopinion.service';
import { EmpleaInacapService } from './core/services/http/emplea-inacap.service';
import { OneDriveService } from './core/services/http/onedrive.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: false
})
export class AppComponent {

  private pt = inject(Platform);
  private events = inject(EventsService);
  private router = inject(Router);
  private nav = inject(NavController);
  private profile = inject(ProfileService);
  private api = inject(PrivateService);
  private alumno = inject(AlumnoService);
  private publicApi = inject(PublicService);
  private auth = inject(AuthService);
  private error = inject(ErrorHandlerService);
  private global = inject(AppGlobal);
  private dialog = inject(DialogService);
  private utils = inject(UtilsService);
  private snackbar = inject(SnackbarService);
  private modal = inject(ModalController);
  private loading = inject(LoadingController);
  private toast = inject(ToastController);
  private inacapmail = inject(InacapMailService);
  private mteams = inject(MicrosoftTeamsService);
  private docente = inject(DocenteService);
  // private seguro = inject(SeguroAccidentesService);
  private solicitudes = inject(SolicitudesService);
  private certificados = inject(CertificadosService);
  private buzon = inject(BuzonOpinionService);
  private emplea = inject(EmpleaInacapService);
  private onedrive = inject(OneDriveService);

  constructor() {
    this.pt.ready().then(() => this.initializeApp());
  }
  async initializeApp() {
    this.events.app.subscribe(this.onAppEvents.bind(this));
    this.events.onLogin.subscribe(this.onAppLogin.bind(this));
    this.events.onLogout.subscribe(this.onAppLogout.bind(this));
    this.router.events.subscribe(this.onRouterEvents.bind(this));
    this.pt.resume.subscribe(this.onPlatformResume.bind(this));

    if (this.pt.is('capacitor')) {
      await this.notificactionsSetup();
      await StatusBar.setStyle({ style: Style.Dark });

      if (this.pt.is('ios')) {
        await Keyboard.setAccessoryBarVisible({ isVisible: true });
      }
    }
    else {
      await this.notificacionsWeb();
    }

    await this.accessibilitySetup();
    await this.createCacheFolder();
    this.validarVersion();
    this.verificarEstados();
  }
  async onAppEvents(event: AppEvent) {
    if (event.action == 'app:auth-change-account') {
      this.profile.clearStorage();
    }

    if (event.action == 'app:notificaciones-registro') {
      if (this.pt.is('capacitor')) {
        const subscribeTo = FCM.subscribeTo({ topic: this.global.NotificationTopic });

        subscribeTo.then((result) => {
          console.log(result);
        });
      }
    }

    if (event.action == 'app:modal-dismiss') {
      if (this.pt.is('ios')) {
        await StatusBar.setStyle({ style: Style.Dark });
      }
    }

    if (event.action == 'app:foto-perfil-enviada') {
      debugger
      await this.profile.setStorage('estadoFotoPerfil', 'FOTO_PENDIENTE');
      await this.verificarFotoPerfil();
    }
  }
  async onAppLogin(data: Ingreso) {
    try {
      let preferencias = await this.api.getPreferencias();

      if (!preferencias.movil || typeof (preferencias.movil) == 'string') {
        preferencias = {
          "oscuro": ('oscuro' in preferencias) ? preferencias.oscuro : false,
          "movil": {
            "sincronizar_calendario": false,
            "contraste": 0,
            "font_size": 0,
            "font_range": 2,
            "oscuro_automatico": 0,
            "paleta_color": "",
            "notificaciones": {
              "inacapmail": 0,
              "sede": 0,
              "academicas": 0
            }
          }
        };
      }

      if (!('oscuro_automatico' in preferencias.movil)) {
        preferencias.movil["oscuro_automatico"] = 0;
      }

      if (!('paleta_color' in preferencias.movil)) {
        preferencias.movil["paleta_color"] = "";
      }

      await this.profile.setStorage('preferencias', preferencias);
      const params = { uuid: data.uuid, sedeCcod: data.sedeCcod, carrCcod: data.carrCcod, diacTtipo: data.diacTtipo };
      this.api.registrarAcceso(params).catch(error => console.log(error));

    } catch (error) { }

    await this.accessibilitySetup();
    data.callback();
  }
  async onAppLogout(data: Salida) {
    this.profile.clearStorage();
    this.profile.removeAllClassname();
    this.alumno.clearStorage();
    this.inacapmail.clearStorage();
    this.mteams.clearStorage();
    this.docente.clearStorage();
    // this.seguro.clearStorage();
    this.solicitudes.clearStorage();
    this.certificados.clearStorage();
    this.buzon.clearStorage();
    this.emplea.clearStorage();
    this.onedrive.clearStorage();
    this.accessibilitySetup();
    this.clearCacheFolder();
    this.snackbar.showToast('Se ha cerrado su sesión correctamente.');
    this.api.registrarSalida(data.uuid).catch(error => console.log(error));
  }
  async onRouterEvents(val: any) {
    if (val instanceof NavigationEnd) {
      const currentModal = await this.modal.getTop();

      if (currentModal) {
        await currentModal.dismiss();
      }

      const currentLoading = await this.loading.getTop();

      if (currentLoading) {
        await currentLoading.dismiss();
      }

      const currentToast = await this.toast.getTop();

      if (currentToast) {
        await currentToast.dismiss();
      }
    }
  }
  async onPlatformResume() {
    const auth = await this.auth.getAuth();
    const tokenValid = await this.auth.isTokenValid();

    await this.accessibilitySetup();

    if (auth && !tokenValid) {
      await this.auth.clearAuth();

      if (this.router.url.indexOf('/dashboard') > -1) {
        await this.nav.navigateRoot('publico');
      }
    }
  }
  async notificactionsSetup() {
    // throw new Error('Method not implemented.');
  }
  async notificacionsWeb() {
    // throw new Error('Method not implemented.');
  }
  async accessibilitySetup() {
    try {
      const bodyElement = document.body;
      const tokenValid = await this.auth.isTokenValid();
      let preferencias = await this.profile.getPreferencias();

      if (tokenValid && preferencias) {
        let prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
        let contrastMode = preferencias.movil["contraste"] == 1;
        let fontSizeMode = preferencias.movil["font_size"] == 1;
        let fontSizeRange = preferencias.movil["font_range"];
        let darkMode = preferencias.oscuro == true;
        let color = preferencias.movil['paleta_color'];

        if (this.pt.is("ios")) {
          prefersDark.addEventListener('change', async (mediaQuery) => {
            let tokenValid = await this.auth.isTokenValid();

            if (tokenValid) {
              let preferencias = await this.profile.getPreferencias();

              if (preferencias.movil['oscuro_automatico'] == 1) {
                bodyElement.classList.toggle('dark', mediaQuery.matches);
              }
            }
          });

          if (prefersDark.matches) {
            darkMode = prefersDark.matches;

            if (preferencias.movil['oscuro_automatico'] == 3) {
              darkMode = false;
            }
            else if (preferencias.movil['oscuro_automatico'] == 0) {
              preferencias.movil['oscuro_automatico'] = 1;
            }

            await this.profile.setStorage('preferencias', preferencias);
          }
          else {
            if (preferencias.movil['oscuro_automatico'] == 2) {
              darkMode = true;
            }
            else if (preferencias.movil['oscuro_automatico'] == 3) {
              darkMode = false;
            }
            else if (preferencias.movil['oscuro_automatico'] == 0) {
              preferencias.movil['oscuro_automatico'] = 1;
            }
          }
        }
        else {
          preferencias.movil.oscuro_automatico = 0;
        }

        if (fontSizeMode) {
          this.profile.applyFontSize(fontSizeRange);
        }

        color && bodyElement.classList.toggle(color, true);
        bodyElement.classList.toggle('dark', darkMode);

        if (darkMode && contrastMode) {
          preferencias.movil["contraste"] = 0;
          contrastMode = false;
        }

        bodyElement.classList.toggle('contrast', contrastMode);

        await this.profile.setStorage('preferencias', preferencias);

      }
      else {
        if (this.pt.is("ios")) {
          let prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

          prefersDark.addEventListener('change', async (mediaQuery) => {
            const tokenValid = await this.auth.isTokenValid();

            if (!tokenValid) {
              bodyElement.classList.toggle('dark', mediaQuery.matches);
            }
          });

          if (prefersDark.matches) {
            bodyElement.classList.toggle('dark', true);
          }
        }
      }
    }
    catch (error) {
      console.log('ERROR: accessibilitySetup', error);
    }
  }
  async createCacheFolder() {
    try {
      await Filesystem.mkdir({
        directory: Directory.Cache,
        path: 'CACHED-IMG',
        recursive: true
      });
    }
    catch (error) {
      console.log('ERROR: createCacheFolder', error);
    }
  }
  async clearCacheFolder() {
    try {
      await Filesystem.rmdir({
        directory: Directory.Cache,
        path: 'CACHED-IMG',
        recursive: true
      })
    }
    catch (error) {
      console.log('ERROR: clearCacheFolder', error);
    }
  }
  validarVersion() {
    try {
      const versionExp = /^(?:(\d+)\.){2}(\*|\d+)$/;
      const query = this.publicApi.getAppVersion();

      query.then(result => {
        if (result && result.success) {
          if (versionExp.test(result.version)) {
            let compareResult = this.compararVersion(this.global.Version, result.version);

            if (!compareResult) {
              this.presentAlertUpdate();
            }
          }
        }
      })
    }
    catch { }
  }
  compararVersion(myVersion: string, minimumVersion: string) {
    let v1 = myVersion.split(".");
    let v2 = minimumVersion.split(".");
    let minLength;

    minLength = Math.min(v1.length, v2.length);

    for (let i = 0; i < minLength; i++) {
      if (Number(v1[i]) > Number(v2[i])) {
        return true;
      }
      if (Number(v1[i]) < Number(v2[i])) {
        return false;
      }
    }

    return (v1.length >= v2.length);
  }
  async presentAlertUpdate() {
    await this.dialog.showAlert({
      header: 'Actualización Requerida',
      message: 'Una actualización es requerida para continuar.',
      buttons: [
        {
          text: 'Salir'
        },
        {
          text: 'Actualizar',
          role: 'destructive',
          handler: async () => {
            await this.openInAppStore();
          }
        }
      ]
    });
  }
  async openInAppStore() {
    if (this.pt.is('ios')) {
      await AppLauncher.openUrl({ url: 'itms-apps://itunes.apple.com/app/1175403829' });
    }
    else {
      await this.utils.openLink('https://play.google.com/store/apps/details?id=com.inacap.push&hl=es_CL')
    }
  }
  async verificarEstados() {
    // Verificamos estados
    // Primera verificación - Foto Perfil
    const estadoFotoPerfil = await this.profile.getStorage('estadoFotoPerfil');

    if (estadoFotoPerfil && estadoFotoPerfil == 'FOTO_PENDIENTE') {
      await this.verificarFotoPerfil();
    }
  }
  async verificarFotoPerfil() {
    try {
      const response = await this.alumno.getEstadoFotoPerfil();

      if (response.success) {
        // 0 - Estado Pendiente de Aprobación
        if (response.status == 0) {
          // Si no hubo cambios o errores, vuelve a verificar después de 5 segundos
          setTimeout(() => this.verificarFotoPerfil(), 5000);
        }
        // -1 
        else if (response.status == -1) {
          const auth = await this.auth.getAuth();
          const user = auth.user;

          try {
            await Filesystem.deleteFile({
              path: `CACHED-IMG/${user.data.persNcorr}`,
              directory: Directory.Cache
            })
          }
          catch { }

          this.events.app.next({ action: 'app:auth-notify-property', prop: 'perfilImagen' });
          await this.profile.removeStorage('estadoFotoPerfil');
        }
      }
    }
    catch (error: any) {
      if (error && error.status == 401) {
        await this.error.handle(error);
        return;
      }
    }
  }

}
