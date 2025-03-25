import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController, Platform } from '@ionic/angular';
import { AuthService } from 'src/app/core/services/auth.service';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';
import { PrivateService } from 'src/app/core/services/http/private.service';
import { ProfileService } from 'src/app/core/services/profile.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { AppIcon } from '@capacitor-community/app-icon';
import { InacapMailService } from 'src/app/core/services/http/inacapmail.service';
import { DialogService } from 'src/app/core/services/dialog.service';
import * as moment from 'moment';
import { FCM } from '@capacitor-community/fcm';
import { VISTAS_ALUMNO } from 'src/app/core/constants/alumno';
import { VISTAS_DOCENTE } from 'src/app/core/constants/docente';
import { VISTAS_EXALUMNO } from 'src/app/core/constants/exalumno';

@Component({
  selector: 'app-configuraciones',
  templateUrl: './configuraciones.page.html',
  styleUrls: ['./configuraciones.page.scss'],
})
export class ConfiguracionesPage implements OnInit {

  fontSizeMode: any;
  fontSizeRange: any;
  contrastMode: any;
  darkMode: any;
  darkModeAutomatic!: boolean;
  darkModeText!: string;
  privacyMode: any;
  color!: string;
  colores = ['system', 'blue', 'purple', 'violet', /*'orange',*/ 'green']
  notificacionCorreo: any;
  notificacionSede: any;
  mostrarIcono = false;
  icono = 'claro';
  programa: any;

  constructor(private router: Router,
    private profile: ProfileService,
    private api: PrivateService,
    private error: ErrorHandlerService,
    private pt: Platform,
    private actionSheet: ActionSheetController,
    private auth: AuthService,
    private snackbar: SnackbarService,
    private dialog: DialogService,
    private inacapmail: InacapMailService) { }

  async cambiarIcono(icono: string) {
    this.icono = icono;

    if (icono == 'oscuro') {
      await AppIcon.change({ name: 'normal-dark', suppressNotification: false });
    }
    else {
      await AppIcon.reset({ suppressNotification: true });
    }
  }
  async ngOnInit() {
    const preferencias = await this.profile.getPreferencias();

    this.fontSizeMode = preferencias.movil.font_size == 1;
    this.fontSizeRange = preferencias.movil.font_range;
    this.contrastMode = preferencias.movil.contraste == 1;
    this.darkMode = preferencias.oscuro == true;
    this.darkModeAutomatic = preferencias.movil.oscuro_automatico != 0;
    this.privacyMode = (await this.profile.getStorage('privacyMode')) || false;
    this.color = preferencias.movil.paleta_color || '';

    if (this.pt.is('ios')) {
      try {
        this.mostrarIcono = (await AppIcon.isSupported()).value == true;

        if (this.mostrarIcono) {
          const iconName = await AppIcon.getName();

          if (iconName.value == 'normal-dark') {
            this.icono = 'oscuro';
          }
        }
      }
      catch { }
    }

    if (this.pt.is('mobileweb')) {
      this.mostrarIcono = true;
    }

    if (this.color == '') {
      this.color = 'system';
    }

    if (this.darkModeAutomatic && !this.pt.is('ios')) {
      this.darkModeAutomatic = false;
    }

    if (this.darkModeAutomatic) {
      if (preferencias.movil.oscuro_automatico == 1)
        this.darkModeText = 'Automático';
      if (preferencias.movil.oscuro_automatico == 2)
        this.darkModeText = 'Oscuro';
      if (preferencias.movil.oscuro_automatico == 3)
        this.darkModeText = 'Claro';
    }

    if (this.mostrarNotificaciones) {
      let principal = await this.profile.getStorage('principal');

      if (principal) {
        this.programa = principal.programas[principal.programaIndex];
      }

      if (preferencias.movil.hasOwnProperty('notificaciones')) {
        this.notificacionCorreo = preferencias.movil.notificaciones.inacapmail == 1;
        this.notificacionSede = preferencias.movil.notificaciones.sede == 1;
      }
    }

    this.api.marcarVista(this.Vista);
  }
  async toggleFontSizeSize() {
    if (!this.fontSizeMode) {
      this.profile.applyFontSize(2);

      let preferencias = await this.profile.getPreferencias();
      preferencias.movil.font_size = 0;

      await this.sincronizarPreferencias(preferencias);
    }
    else {
      this.toggleFontSizeRange();
    }
  }
  async toggleFontSizeRange() {
    this.profile.applyFontSize(this.fontSizeRange);

    let preferencias = await this.profile.getPreferencias();
    preferencias.movil.font_range = this.fontSizeRange;
    preferencias.movil.font_size = 1;

    await this.sincronizarPreferencias(preferencias);
  }
  async toggleContrastMode() {
    let preferencias = await this.profile.getPreferencias();

    preferencias.movil.contraste = this.contrastMode ? 1 : 0;

    this.profile.toggleBodyClass('contrast');

    try {
      await this.sincronizarPreferencias(preferencias);
    }
    catch (error: any) {
      if (error && error.status == 401) {
        await this.error.handle(error);
      }
      else {
        this.contrastMode = !this.contrastMode;
        this.profile.toggleBodyClass('contrast');
        this.error.handle("No se pudieron actualizar sus preferencias, favor intente más tarde.")
      }
    }
  }
  async toggleDarkMode() {
    let preferencias = await this.profile.getPreferencias();

    preferencias.oscuro = this.darkMode;

    if (this.darkMode) {
      preferencias.movil.contraste = 0;
      this.contrastMode = false;
      this.profile.toggleBodyClass('contrast', true)
    }

    this.profile.toggleBodyClass('dark');

    try {
      await this.sincronizarPreferencias(preferencias);
    }
    catch (error: any) {
      if (error && error.status == 401) {
        await this.error.handle(error);
      }
      else {
        this.darkMode = !this.darkMode;
        this.profile.toggleBodyClass('dark');
        this.error.handle("No se pudieron actualizar sus preferencias, favor intente más tarde.")
      }
    }
  }
  async changeDarkMode() {
    let preferencias = await this.profile.getPreferencias();

    const actionSheet = await this.actionSheet.create({
      buttons: [
        {
          text: 'Claro',
          handler: () => {
            this.saveDarkMode(3);
          },
          role: preferencias.movil.oscuro_automatico == 3 ? 'selected' : undefined
        },
        {
          text: 'Oscuro',
          handler: () => {
            this.saveDarkMode(2);
          },
          role: preferencias.movil.oscuro_automatico == 2 ? 'selected' : undefined
        },
        {
          text: 'Automático',
          handler: () => {
            this.saveDarkMode(1);
          },
          role: preferencias.movil.oscuro_automatico == 1 ? 'selected' : undefined
        },
        {
          text: 'Cancelar',
          role: 'cancel'
        }
      ]
    });

    await actionSheet.present();
  }
  async saveDarkMode(mode: number) {
    let preferencias = await this.profile.getPreferencias();
    let bodyElement = document.body;

    preferencias.movil.oscuro_automatico = mode;

    if (mode == 1) {
      let prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
      bodyElement.classList.toggle('dark', prefersDark.matches);
      this.darkModeText = 'Automático';
    }
    else if (mode == 2) {
      bodyElement.classList.toggle('dark', true);
      this.darkModeText = 'Oscuro';
    }
    else if (mode == 3) {
      bodyElement.classList.toggle('dark', false);
      this.darkModeText = 'Claro';
    }

    try {
      await this.sincronizarPreferencias(preferencias);
    }
    catch (error: any) {
      if (error && error.status == 401) {
        await this.error.handle(error);
      }
      else {
        this.error.handle("No se pudieron actualizar sus preferencias, favor intente más tarde.")
      }
    }
  }
  async togglePrivacy() {
    if (this.privacyMode) {
      const result = await this.auth.validateFaceID();

      if (!result) {
        this.privacyMode = false;
        await this.snackbar.showToast('No se pudo habilitar FaceID', 3000, 'danger');
      }
    }

    await this.profile.setStorage('privacyMode', this.privacyMode);
  }
  async sincronizarPreferencias(preferencias: any): Promise<boolean> {
    const loading = await this.dialog.showLoading({ message: 'Guardando...' });

    try {
      await this.api.guardarPreferencias(preferencias);
      await this.profile.setStorage('preferencias', preferencias);
    }
    catch {
      return Promise.resolve(false);
    }
    finally {
      await loading.dismiss();
    }

    return Promise.resolve(true);
  }
  async colorChanged(e?: any) {
    let bodyElement = document.body;

    this.colores.forEach((color: string) => {
      if (bodyElement.classList.contains(color)) {
        bodyElement.classList.toggle(color, false);
      }
    });

    if (this.color) {
      bodyElement.classList.toggle(this.color, true);

      // if (this.pt.is('mobileweb')) {
      //   if (this.color == 'blue') {
      //     this.snackbar.showToast('Blue CuraÇao', 300,)
      //   }
      //   if (this.color == 'purple') {
      //     this.snackbar.showToast('Ramazzoti Violetto', 300)
      //   }
      //   if (this.color == 'violet') {
      //     this.snackbar.showToast('Ron Coquette', 300)
      //   }
      //   if (this.color == 'orange') {
      //     this.snackbar.showToast('Tequila Sunries', 300)
      //   }
      //   if (this.color == 'green') {
      //     this.snackbar.showToast('Mojito menta', 300)
      //   }
      // }
    }

    await this.saveColor();
  }
  async saveColor() {
    let preferencias = await this.profile.getPreferencias();

    preferencias.movil.paleta_color = this.color || '';

    if (preferencias.movil.paleta_color == 'system') {
      preferencias.movil.paleta_color = '';
    }

    let result = await this.sincronizarPreferencias(preferencias);
  }
  async toggleNotificaciones(index: number) {
    let preferencias = await this.profile.getPreferencias();

    if (!preferencias.movil.hasOwnProperty('notificaciones')) {
      preferencias.movil['notificaciones'] = {
        "inacapmail": 0,
        "sede": 0,
        "academicas": 0
      }
    }

    if (index === 0) {
      preferencias.movil.notificaciones.inacapmail = this.notificacionCorreo ? 1 : 0;
    }
    else if (index === 1) {
      preferencias.movil.notificaciones.sede = this.notificacionSede ? 1 : 0;
    }

    let result = await this.sincronizarPreferencias(preferencias);

    if (result) {
      if (index === 0) {
        if (this.notificacionCorreo) {
          try {
            let storageSubs = await this.inacapmail.getStorage('subscription');
            let verifiySubs = true;

            if (storageSubs) {
              let now = moment();
              let expiration_date = moment(storageSubs, 'DD/MM/YYYY hh:mm');

              if (now.isSameOrBefore(expiration_date, 'seconds')) {
                verifiySubs = false;
              }
            }

            if (verifiySubs) {
              const resultSubs = await this.inacapmail.getMailSubscription();

              if (resultSubs.success) {
                this.inacapmail.setStorage('subscription', resultSubs.data.fechaExpiracion);
              }
            }
          }
          catch { }
        }
        else {
          try {
            const resultSubs = await this.inacapmail.deleteMailSubscription();
          }
          catch { }

          await this.inacapmail.removeStorage('subscription');
        }
      }

      if (index === 1) {
        if (this.notificacionSede === true) {
          const sedeTopic = this.programa.sedeTopic;

          if (sedeTopic && this.pt.is('capacitor')) {
            try {
              const subscribeTo = await FCM.subscribeTo({ topic: sedeTopic });
            }
            catch { }
          }
        }
        else {
          const sedeTopic = this.programa.sedeTopic;

          if (sedeTopic && this.pt.is('capacitor')) {
            try {
              const unsubscribeFrom = await FCM.unsubscribeFrom({ topic: sedeTopic });
            }
            catch { }
          }
        }
      }
    }
    else {
      if (index == 0) {
        this.notificacionCorreo = !this.notificacionCorreo;
      }
      else if (index === 1) {
        this.notificacionSede = !this.notificacionSede;
      }
    }

  }
  get mostrarCalendario() { return false; }
  get mostrarNotificaciones() { return this.router.url.startsWith('/dashboard-alumno'); }
  get mostrarFaceID() { 
    return false;
    // return this.pt.is('ios');
  }
  get backUrl() { return this.router.url.replace('/configuraciones', ''); }
  get Vista() {
    return this.router.url.startsWith('/dashboard-alumno')
      ? this.router.url.startsWith('/dashboard-docente') ? VISTAS_ALUMNO.CONFIGURACIONES : VISTAS_DOCENTE.CONFIGURACIONES
      : VISTAS_EXALUMNO.CONFIGURACIONES;
  }

}
