import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ActionSheetController, LoadingController } from '@ionic/angular';
import { VISTAS_ALUMNO } from 'src/app/core/constants/alumno';
import { AlumnoService } from 'src/app/core/services/http/alumno.service';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';

@Component({
  selector: 'app-devolucion-gratuidad',
  templateUrl: './devolucion-gratuidad.page.html',
  styleUrls: ['./devolucion-gratuidad.page.scss'],
})
export class DevolucionGratuidadPage implements OnInit {

  mostrarData = false;
  data: any;
  mensaje!: string;
  form: FormGroup;
  tipoDevolucion: any;
  submitted = false;
  montosSolicitados = false;
  mostrarCargando = true;

  constructor(private api: AlumnoService,
    private fb: FormBuilder,
    private snack: SnackbarService,
    private error: ErrorHandlerService,
    private router: Router,
    private action: ActionSheetController,
    private loading: LoadingController) {

    this.form = this.fb.group({
      bancCcod: ['', Validators.required],
      tcueCcod: ['', Validators.required],
      persTnumeroCuenta: ['', Validators.compose([
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(24),
        Validators.pattern(/^[0-9]\d*$/)
      ])]
    });

  }
  async ngOnInit() {
    await this.cargar();
    this.api.marcarVista(VISTAS_ALUMNO.DEVOLUCION_GRATIUDAD);
  }
  recargar(e: any) {
    this.cargar().finally(() => {
      e.target.complete();
    })
  }
  async cargar() {
    try {
      let result = await this.api.getGratiudad();

      if (result.success) {
        this.montosSolicitados = result.montosPagados.filter((t: any) => t.solicitado == 1).length > 0;
        this.data = result;
      }
      else {
        this.mensaje = result.message;
      }
    }
    catch (error: any) {
      this.error.handle(error, async () => {
        await this.router.navigate(['/alumno/servicios'], { replaceUrl: true })
      });
    }
    finally {
      this.mostrarCargando = false;
      this.mostrarData = true;
    }
  }
  async solicitar() {
    this.submitted = true;

    if (this.tipoDevolucion && this.montoSeleccionado) {
      let permiteAvanzar = false;
      let params = {
        matrNcorr: this.data.montosPagados[0].matrNcorr,
        tdevCcod: this.tipoDevolucion,
        dagrMonto: this.monto
      };

      if (this.monto > 0) {
        permiteAvanzar = true;

        if (this.tipoDevolucion == 2) {
          if (this.form.valid) {
            params = Object.assign(params, this.form.value);
          }
          else {
            permiteAvanzar = false;
          }
        }
      }
      else {
        this.snack.showToast('El monto debe ser mayor a CLP $0.');
        return;
      }

      if (permiteAvanzar) {
        let confirmarSolicitud = await this.confirmarSolicitud();
        let loading = await this.loading.create({ message: 'Procesando...' });

        if (confirmarSolicitud) {
          await loading.present();

          try {
            let result = await this.api.solicitarDevolucion(params);

            if (result.success) {
              this.tipoDevolucion = undefined;
              this.submitted = false;
              this.data.montosPagados = result.montosPagados;
              this.snack.showToast(result.message, 2000, 'success');
            }
            else {
              this.snack.showToast(result.message, 2000, 'danger');
            }
          }
          catch (error: any) {
            this.error.handle(error);
          }
          finally {
            await loading.dismiss();
          }
        }
      }
    }
  }
  async confirmarSolicitud(): Promise<any> {
    return new Promise((resolve) => {
      this.action.create({
        header: 'Devolución Montos Pagados',
        subHeader: 'A continuación se procesará su solicitud de devolución de montos pagados en la modalidad que ha seleccionado. ¿Desea continuar?',
        buttons: [
          {
            text: 'Continuar',
            role: 'destructive',
            handler: () => {
              resolve(true);
            }
          },
          {
            text: 'Cancelar',
            role: 'cancel'
          }
        ]
      }).then(alert => alert.present());
    });
  }
  async tipoDevolucionChanged(e: any) {
    if (this.tipoDevolucion == 2) {
      if (this.data.bancCcod) {
        this.bancCcod?.setValue(this.data.bancCcod);
      }
      if (this.data.tcueCcod) {
        this.tcueCcod?.setValue(this.data.tcueCcod);
      }
      if (this.data.persTnumeroCuenta) {
        this.persTnumeroCuenta?.setValue(this.data.persTnumeroCuenta);
      }
    }
    else {
      this.bancCcod?.setValue('');
      this.tcueCcod?.setValue('');
      this.persTnumeroCuenta?.setValue('');
    }
  }
  get monto() {
    if (this.data) {
      let monto = 0;

      this.data.montosPagados.forEach((item: any) => {
        if (item.checked === true) {
          monto += item.monto;
        }
      });

      return monto;
    }

    return 0;
  }
  get bancCcod() { return this.form.get('bancCcod'); }
  get tcueCcod() { return this.form.get('tcueCcod'); }
  get persTnumeroCuenta() { return this.form.get('persTnumeroCuenta'); }
  get persTnumeroCuentaError() {
    if (this.persTnumeroCuenta?.hasError('required')) {
      return 'Campo obligatorio.';
    }
    if (this.persTnumeroCuenta?.hasError('pattern')) {
      return 'Debe ingresar sólo dígitos.';
    }
    if (this.persTnumeroCuenta?.hasError('minlength')) {
      return 'El número de cuenta debe tener entre 5 y 24 caracteres.';
    }
    if (this.persTnumeroCuenta?.hasError('maxlength')) {
      return 'El número de cuenta debe tener entre 5 y 24 caracteres';
    }

    return '';
  }
  get montoSeleccionado() {
    if (this.data) {
      return this.data.montosPagados.filter((t: any) => t.checked == true).length > 0;
    }
    return false;
  }

}
