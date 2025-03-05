import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ActionSheetController } from '@ionic/angular';
import { DialogService } from 'src/app/core/services/dialog.service';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';
import { AlumnoService } from 'src/app/core/services/http/alumno.service';

@Component({
  selector: 'app-acuerdo-tutorial',
  templateUrl: './acuerdo-tutorial.page.html',
  styleUrls: ['./acuerdo-tutorial.page.scss']
})
export class AcuerdoTutorialPage implements OnInit {

  mostrarCargando = true;
  mostrarData = false;
  data: any;
  form: FormGroup;

  private api = inject(AlumnoService);
  private error = inject(ErrorHandlerService);
  private dialog = inject(DialogService);
  private router = inject(Router);
  private actionCtrl = inject(ActionSheetController);
  private fb = inject(FormBuilder);

  constructor() {

    this.form = this.fb.group({
      acuerdo: [, Validators.requiredTrue]
    });

  }
  async ngOnInit() {
    await this.cargar();
  }
  async cargar() {
    try {
      const result = await this.api.getAcuerdoTutorial();

      if (result.success) {
        this.data = result.data;
      }
      else {
        throw Error();
      }
    }
    catch (error: any) {
      if (error && error.status == 401) {
        await this.error.handle(error);
      }
    }
    finally {
      this.mostrarData = true;
      this.mostrarCargando = false;
    }
  }
  recargar() {
    this.mostrarCargando = true;
    this.mostrarData = false;
    setTimeout(() => {
      this.cargar();
    }, 500);
  }
  async enviar() {
    if (this.form.valid) {
      const confirmar = await this.confirmarSolicitud('¿Estás seguro de que deseas enviar el Acuerdo de Atención Tutorial?');      

      if (!confirmar) return;

      const loading = await this.dialog.showLoading({ message: 'Procesando...' });

      try {
        const result = await this.api.enviarAcuerdoTutorial({ paatNestado: 1 });

        await loading.dismiss();

        if (result.success) {
          await this.presentSuccess();
        }
        else {
          throw Error();
        }
      }
      catch (error: any) {
        if (error && error.status == 401) {
          await this.error.handle(error);
        }
      }
      finally {
        loading.dismiss();
      }
    }
  }
  confirmarSolicitud(message: string): Promise<boolean> {

    return new Promise(async (resolve) => {
      await this.dialog.showAlert({
        header: 'Firma de Acuerdo',
        subHeader: message,
        buttons: [          
          {
            text: 'Cancelar',
            role: 'cancel',
            handler: () => resolve(false)
          },
          {
            text: 'Continuar',
            role: 'destructive',
            handler: () => resolve(true)
          }
        ]
      });
    })
  }
  async presentSuccess() {
    const mensaje = 'El Acuerdo se ha firmado y enviado exitosamente.'
    const alert = await this.dialog.showAlert({
      keyboardClose: false,
      backdropDismiss: false,
      header: 'Acuerdo enviado con éxito.',
      cssClass: 'success-alert',
      message: '<div class="image"><img src = "./assets/images/icon_check_circle.svg" width="35px" height="35px"></div>' + mensaje,

      buttons: [
        {
          text: 'Aceptar',
          handler: async () => {
            await this.router.navigate([this.backUrl]);
          }
        }
      ]
    });

    return alert;
  }
  get acuerdo() { return this.form.get('acuerdo'); }
  get backUrl() { return this.router.url.replace('/progresion/acuerdo-tutorial', ''); }

}
