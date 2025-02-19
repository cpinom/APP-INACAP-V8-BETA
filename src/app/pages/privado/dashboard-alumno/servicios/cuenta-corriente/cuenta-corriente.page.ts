import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { VISTAS_ALUMNO } from 'src/app/core/constants/alumno';
import { CuentaCorrienteService } from 'src/app/core/services/cuentacorriente.service';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';

@Component({
  selector: 'app-cuenta-corriente',
  templateUrl: './cuenta-corriente.page.html',
  styleUrls: ['./cuenta-corriente.page.scss'],
})
export class CuentaCorrientePage implements OnInit {

  instituciones: any[];
  info: any;
  semestreAnterior = false;
  validarCAE = false;
  mostrarCargando = true;
  mostrarData = false;

  constructor(private api: CuentaCorrienteService,
    private error: ErrorHandlerService,
    private router: Router,
    private alert: AlertController) { }

  async ngOnInit() {
    await this.cargar();
    this.api.marcarVista(VISTAS_ALUMNO.CUENTA_CORRIENTE);
  }
  async cargar() {
    try {
      let result = await this.api.getPrincipal();

      if (result.success) {
        this.instituciones = result.instituciones;
        this.info = result.info;
        this.semestreAnterior = parseInt(result.info.semanterior.trim().replace('.', '')) > 0;
        this.validarCAE = result.validarCAE === 1;
      } 
      else {
        throw Error();
      }
    }
    catch (error: any) {
      if (error && error.status == 401) {
        this.error.handle(error);
      }
    }
    finally {
      this.mostrarCargando = false;
      this.mostrarData = true;
    }
  }
  recargar(e?) {
    this.mostrarCargando = true;
    this.mostrarData = false;
    setTimeout(() => {
      this.cargar().finally(() => {
        e && e.target.complete();
      });
    }, 500);
  }
  async pagar() {
    if (this.validarCAE === true) {
      const alert = await this.alert.create({
        header: 'Cuenta Corriente Estudiantes',
        message: 'El excedente generado por asignación de CAE en Colegiaturas no podrá ser aplicado a deuda por concepto de Matricula, por lo cual, podrá generar una diferencia entre el saldo indicado en la cuenta corriente y el monto a pagar según portal de pago.',
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel'
          },
          {
            text: 'Continuar',
            handler: async () => {
              await this.router.navigate(['alumno/servicios/portal-pagos']);
            }
          }
        ]
      });

      await alert.present();
    } 
    else {
      await this.router.navigate(['alumno/servicios/portal-pagos']);
    }
  }
  get institucion() {
    if (this.info) {
      return this.info.instCcod;
    }
    return '';
  }
  get carrera() {
    if (this.info) {
      return this.info.carrera.split('|')[1];
    }
    return '';
  }
  get compNdocto() {
    if (this.info) {
      return this.info.compNdocto;
    }
    return '';
  }
  get fechaActual() {
    if (this.instituciones && this.instituciones.length) {
      return this.instituciones[0].fecha;
    }
    return '';
  }

}
