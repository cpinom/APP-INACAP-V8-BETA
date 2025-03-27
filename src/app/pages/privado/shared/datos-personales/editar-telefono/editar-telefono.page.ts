import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProfileService } from 'src/app/core/services/profile.service';
import { CodeInputComponent } from 'angular-code-input';
import { /*IonNav,*/ IonNav, ModalController, NavController } from '@ionic/angular';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';
import { DocenteService } from 'src/app/core/services/http/docente.service';
import { EventsService } from 'src/app/core/services/events.service';
import { DialogService } from 'src/app/core/services/dialog.service';
import { PrivateService } from 'src/app/core/services/http/private.service';
import { Router } from '@angular/router';

enum Movimientos {
  CORREO = 1,
  TELEFONO = 2
};

@Component({
  selector: 'app-editar-telefono',
  templateUrl: './editar-telefono.page.html',
  styleUrls: ['./editar-telefono.page.scss'],
})
export class EditarTelefonoPage implements OnInit {

  @ViewChild('codeInput') codeInput !: CodeInputComponent;
  form: FormGroup;
  perfil: any;
  submitted!: boolean;
  mostrarCodigo = false;
  modo = 0;
  actualizarCorreo!: boolean;
  actualizarCelular!: boolean;
  regexCelular = /^\+569\d{8}$/;

  constructor(private fb: FormBuilder,
    private profile: ProfileService,
    private api: PrivateService,
    // private ionNav: IonNav,
    private snackbar: SnackbarService,
    private dialog: DialogService,
    private error: ErrorHandlerService,
    private events: EventsService,
    private modalCtrl: ModalController,
    private router: Router,
    private nav: NavController) {

    this.form = this.fb.group({
      persTcelular: ['', Validators.compose([
        Validators.required,
        // Validators.pattern(/^(\+56){0,1}(9)[98765]\d{7}$/)
        Validators.pattern(this.regexCelular)
      ])],
      persTcelularConfirma: ['', Validators.compose([
        Validators.required,
        // Validators.pattern(/^(\+56){0,1}(9)[98765]\d{7}$/)
        Validators.pattern(this.regexCelular)
      ])],
      accoTpin: ['']
    });

  }
  async ngOnInit() {
    this.perfil = await this.profile.getPrincipal();
  }
  async cancelar() {
    this.mostrarCodigo = false;
    this.accoTpin?.clearValidators();
    this.accoTpin?.updateValueAndValidity();
  }
  async validar() {
    this.submitted = true;

    if (this.form.valid && this.telefonosIguales) {
      const loading = await this.dialog.showLoading({ message: 'Cargando...' });
      const params = {
        persTcelular: this.celular?.value,
        persTcelularConfirma: this.celularConfirma?.value
      };

      try {
        let response = await this.api.confirmarTelefono(params);

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
      catch (error: any) {
        if (this.modo == 1) {
          this.modalCtrl.dismiss();
        }
        if (error && error.status == 401) {
          await this.error.handle(error);
          return;
        }
        this.snackbar.showToast('No pudimos procesar tu solicitud. Vuelve a intentarlo.', 3000, 'danger');
      }
      finally {
        await loading.dismiss();
      }
    }
  }
  async confirmar() {
    if (this.codigoValido) {
      const loading = await this.dialog.showLoading({ message: 'Validando...' });
      const params = { accoTpin: this.accoTpin?.value, accoTmovimiento: Movimientos.TELEFONO };

      try {
        const response = await this.api.confirmarPin(params);

        if (response.success) {
          await loading.dismiss();

          if (this.modo == 1) {
            await this.presentSuccess(() => {
              this.modalCtrl.dismiss();
            });
          }
          else {
            await this.presentSuccess(() => {
              this.volver();
              this.events.app.next({ action: 'app:alumno-datos-refresca' });
              this.events.app.next({ action: 'app:docente-datos-refresca' });
            });
          }
        }
        else {
          this.error.handle(response.message, undefined, true);
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
  onPinChanged(code: string) {
    this.accoTpin?.setValue(code);
  }
  onPinCompleted(code: string) { }
  async presentSuccess(callback: Function) {
    let mensaje = 'Tu teléfono fue confirmado correctamente.'

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
    if (this.esDocente) {
      await this.dialog.dismissModal();
      // await this.ionNav.pop();
    }
    else {
      await this.nav.navigateBack(this.backUrl);
    }
  }
  get celular() { return this.form.get('persTcelular') }
  get celularConfirma() { return this.form.get('persTcelularConfirma') }
  get accoTpin() { return this.form.get('accoTpin') }
  get telefonosIguales() {
    if (this.celular?.valid && this.celularConfirma?.valid) {
      if (this.celular.value == this.celularConfirma.value) {
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
  get esDocente() {
    return this.router.url.startsWith('/dashboard-docente');
  }

}
