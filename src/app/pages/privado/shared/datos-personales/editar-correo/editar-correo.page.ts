import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { /*IonNav,*/ ModalController, NavController, Platform } from '@ionic/angular';
import { CodeInputComponent } from 'angular-code-input';
import { AlumnoService } from 'src/app/core/services/http/alumno.service';
import { DialogService } from 'src/app/core/services/dialog.service';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';
import { EventsService } from 'src/app/core/services/events.service';
import { ProfileService } from 'src/app/core/services/profile.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { EditarTelefonoPage } from '../editar-telefono/editar-telefono.page';
import { Router } from '@angular/router';

enum Movimientos {
  CORREO = 1,
  TELEFONO = 2
};

@Component({
  selector: 'app-editar-correo',
  templateUrl: './editar-correo.page.html',
  styleUrls: ['./editar-correo.page.scss'],
})
export class EditarCorreoPage implements OnInit {

  @ViewChild('codeInput') codeInput !: CodeInputComponent;
  form: FormGroup;
  perfil: any;
  mostrarCodigo = false;
  submitted = false;
  modo = 0;
  actualizarCorreo!: boolean;
  actualizarCelular!: boolean;

  constructor(private fb: FormBuilder,
    private profile: ProfileService,
    private dialog: DialogService,
    private api: AlumnoService,
    private snackbar: SnackbarService,
    private error: ErrorHandlerService,
    // private nav: IonNav,
    private events: EventsService,
    private pt: Platform,
    private modalCtrl: ModalController,
    private router: Router,
    private nav: NavController) {

    this.form = this.fb.group({
      persTemail: ['', Validators.compose([Validators.required, Validators.email])],
      persTemailConfirma: ['', Validators.compose([Validators.required, Validators.email])],
      accoTpin: ['']
    });

    if (this.pt.is('mobileweb')) {
      this.correo?.setValue('cpinom@inacap.cl');
      this.correoConfirma?.setValue('cpinom@inacap.cl');
    }

  }
  async ngOnInit() {
    this.perfil = await this.profile.getPrincipal();

    if (this.modo == 1 && this.perfil) {
      this.correo?.setValue(this.perfil.persTemail);
      this.correoConfirma?.setValue(this.perfil.persTemail);
    }
  }
  async cancelar() {
    this.mostrarCodigo = false;
    this.accoTpin?.clearValidators();
    this.accoTpin?.updateValueAndValidity();
  }
  async validar() {
    this.submitted = true;

    if (this.form.valid && this.correosIguales) {
      const loading = await this.dialog.showLoading({ message: 'Cargando...' });
      const params = {
        persTemail: this.correo?.value,
        persTemailConfirma: this.correoConfirma?.value
      };

      try {
        if (this.modo == 1) {
          let response = await this.api.actualizarCorreoSecundario(params);

          if (response.success) {
            await this.presentSuccess(() => {
              if (this.actualizarCelular) {
                // this.nav.push(EditarTelefonoPage, { modo: this.modo });
              }
              else {
                this.modalCtrl.dismiss();
              }
            });
          }
          else {
            this.snackbar.showToast(response.message);
          }
        }
        else {
          let response = await this.api.confirmarCorreo(params);

          if (response.success) {
            this.mostrarCodigo = true;
            this.accoTpin?.setValidators([Validators.required, Validators.minLength(6), Validators.maxLength(6)]);
            this.accoTpin?.updateValueAndValidity();

            setTimeout(() => {
              this.codeInput.focusOnField(0);
            }, 500);
          }
          else {
            this.snackbar.showToast(response.message);
          }
        }
      }
      catch (error: any) {
        if (this.modo == 1) {
          this.modalCtrl.dismiss();
        }
        await this.error.handle(error);
      }
      finally {
        await loading.dismiss();
      }
    }
  }
  async confirmar() {
    if (this.codigoValido) {
      const loading = await this.dialog.showLoading({ message: 'Validando...' });
      const params = { accoTpin: this.accoTpin?.value, accoTmovimiento: Movimientos.CORREO };

      try {
        const response = await this.api.confirmarPin(params);

        if (response.success) {
          await loading.dismiss();
          await this.presentSuccess(() => {
            this.volver();
            this.events.app.next({ action: 'app:alumno-datos-refresca' });
            this.events.app.next({ action: 'app:docente-datos-refresca' });
          });
        }
        else {
          this.error.handle(response.message, undefined, true);
        }
      }
      catch (error: any) {
        await this.error.handle(error);
      }
      finally {
        await loading.dismiss();
      }
    }
  }
  onPinChanged(code: string) {
    this.accoTpin?.setValue(code);
  }
  onPinCompleted(code: string) { }
  async presentSuccess(callback: Function) {
    let mensaje = 'Tu correo fue confirmado exitosamente.'

    await this.dialog.showAlert({
      keyboardClose: false,
      backdropDismiss: false,
      header: 'Datos de Contacto',
      cssClass: 'success-alert',
      message: `<div class="image"><ion-icon src = "./assets/icon/check_circle.svg"></ion-icon></div>${mensaje}`,
      buttons: [
        {
          text: 'Aceptar',
          handler: () => {
            callback();
          }
        }
      ]
    });
  }
  async volver() {
    await this.nav.navigateBack(this.backUrl);
  }
  get correo() { return this.form.get('persTemail') }
  get correoConfirma() { return this.form.get('persTemailConfirma') }
  get accoTpin() { return this.form.get('accoTpin') }
  get correosIguales() {
    if (this.correo?.valid && this.correoConfirma?.valid) {
      if (this.correo.value == this.correoConfirma.value) {
        return true;
      }
      return false;
    }

    return true;
  }
  get codigoValido() {
    return this.accoTpin?.valid;
  }
  get textoBtnCancelar() {
    return this.modo == 1 ? 'Volver' : 'Cancelar';
  }
  get backUrl() {
    return this.router.url.startsWith('/dashboard-alumno') ? '/dashboard-alumno/perfil' : '/dashboard-docente/perfil';
  }

}
