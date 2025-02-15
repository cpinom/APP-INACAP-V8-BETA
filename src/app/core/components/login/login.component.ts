import { Component, inject, OnInit } from '@angular/core';
import { DialogService } from '../../services/dialog.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProfileService } from '../../services/profile.service';
import { AuthService } from '../../services/auth.service';
import { UtilsService } from '../../services/utils.service';
import { Platform, ToastController } from '@ionic/angular';
import { formatRUT, validateRUT } from '../../utils/rut';
import { validateEmail } from '../../utils/email';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  private dialog = inject(DialogService);
  private perfil = inject(ProfileService);
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private utils = inject(UtilsService);
  private toast = inject(ToastController);
  private pt = inject(Platform);
  loginForm!: FormGroup;
  userCache: any;
  submitted = false;
  procesando = false;

  constructor() {

    this.loginForm = this.fb.group({
      usuario: ['', Validators.required],
      clave: ['', Validators.required],
    });

    if (this.pt.is('mobileweb')) {
      this.usuario?.setValue('16645936-2');
      this.clave?.setValue('Vivi?E2025');
    }

  }

  ngOnInit() { }
  async login() {

    const isValid = this.loginForm.valid;

    if (isValid) {
      this.procesando = true;

      try {
        const params = this.loginForm.value;
        const result = await this.authService.login(params);

        if (result.success) {
          await this.dialog.dismissModal(result.data);
        }
        else {
          if (result.code == 400) {
            await this.presentError('El identificador de usuario es incorrecto.');
          }
          else if (result.code == 401) {
            this.clave?.setValue('');
            await this.presentError('La contraseña es incorrecta.');
          }
          else if (result.code == 403) {
            if (result.passwordExpired == true) {
              let rut = this.usuario?.value;
              let url = 'https://adfs.inacap.cl/adfs/portal/updatepassword?username=';

              if (validateRUT(rut)) {
                rut = formatRUT(rut).split('.').join('');
                url = url + encodeURIComponent('inacap\\' + rut);
              }
              else if (validateEmail(rut)) {
                url = url + encodeURIComponent(rut);
              }
              else {
                url = url + encodeURIComponent(rut + '@inacapmail.cl');
              }

              this.mostrarResetPassword(result.message, url);
            }
            else {
              this.presentError('No posee los permisos suficientes para acceder.');
            }
          }
          else if (result.code == 404) {
            this.presentError('El identificador puede ser incorrecto o no existe en nuestros registros.');
          }
          else {
            this.presentError('Al parecer hay un problema de conectividad. Verifique la conexión Wifi o red de Datos del dispositivo.');
          }
        }
      }
      catch (error) {
        await this.presentError('Al parecer hay un problema de conectividad. Verifique la conexión Wifi o red de Datos del dispositivo.');
      }
      finally {
        this.procesando = false;
      }
    }
    else {
      this.loginForm.markAllAsTouched();
    }

  }
  async presentError(message: string) {
    const alert = await this.dialog.showAlert({
      cssClass: 'alert-message',
      message: `<img src="./assets/images/warning.svg" /><br />${message}`,
      header: 'Mi Intranet',
      buttons: ['Aceptar']
    });

    return alert;
  }
  async mostrarResetPassword(message: string, url: string) {
    const currentToast = await this.toast.getTop();

    currentToast?.dismiss();

    const self = this;
    const toast = await this.toast.create({
      message: message,
      color: 'dark',
      buttons: [{
        text: 'Actualizar ahora',
        handler() {
          self.abrirNavegador(url);
        }
      }],
      duration: 5000
    });

    await toast.present();
  }
  async cancelar() {
    await this.dialog.dismissModal();
  }
  async borrarUsuario() {
    this.usuario?.setValue('');
    this.clave?.setValue('');
    this.userCache = null;
    await this.authService.clearUserCache();
  }
  async abrirNavegador(url: string) {
    await this.utils.openLink(url);
  }
  async politicas() {
    await this.abrirNavegador('https://portales.inacap.cl/politicas-de-privacidad');
  }
  resolverLogo() {
    if (this.perfil.isDarkMode()) {
      return 'assets/images/inacap-logo-blanco.png';
    }
    return 'assets/images/inacap-logo.png';
  }
  get usuarioError() {
    return this.usuario?.hasError('required') ? 'Debe ingresar un usuario' : '';
  }
  get claveError() {
    return this.clave?.hasError('required') ? 'Debe ingresar una clave' : '';
  }
  get usuario() { return this.loginForm.get('usuario'); }
  get clave() { return this.loginForm.get('clave'); }

}
