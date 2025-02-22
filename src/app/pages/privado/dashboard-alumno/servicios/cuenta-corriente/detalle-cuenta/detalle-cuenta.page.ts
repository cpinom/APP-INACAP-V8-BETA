import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { IonRouterOutlet } from '@ionic/angular';
import { CuentaCorrienteService } from 'src/app/core/services/http/cuentacorriente.service';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { DetalleConceptoPage } from '../detalle-concepto/detalle-concepto.page';
import { DialogService } from 'src/app/core/services/dialog.service';

@Component({
  selector: 'app-detalle-cuenta',
  templateUrl: './detalle-cuenta.page.html',
  styleUrls: ['./detalle-cuenta.page.scss'],
})
export class DetalleCuentaPage implements OnInit {

  @ViewChild('conceptosDiv', { read: ElementRef }) public conceptosContent!: ElementRef<any>;
  instituciones!: any[];
  form: FormGroup;
  conceptos!: any[];
  mostrarData = false;
  mostrarCargando = true;

  private api = inject(CuentaCorrienteService);
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private error = inject(ErrorHandlerService);
  private snackbar = inject(SnackbarService);
  private dialog = inject(DialogService);
  private routerOutlet = inject(IonRouterOutlet);

  constructor() {

    this.form = this.fb.group({
      institucion: [],
      semestre: [2]
    });

    this.institucion?.valueChanges.subscribe(() => {
      this.recargar();
    });

    this.semestre?.valueChanges.subscribe(() => {
      this.recargar();
    });
  }
  async ngOnInit() {
    try {
      await this.cargarInstituciones();
      await this.cargar();
    }
    catch (error: any) {
      if (error && error.status == 401) {
        await this.error.handle(error);
      }
    }
    finally {
      this.mostrarCargando = false;
      this.mostrarData = true;
    }
  }
  async cargarInstituciones() {
    let result = await this.api.getIntitucionesHistorial();

    if (result.success) {
      const instCcod = this.route.snapshot.paramMap.get('instCcod');
      this.instituciones = result.instituciones;
      this.institucion?.setValue(instCcod, { emitEvent: false });
    }
    else {
      throw Error();
    }
  }
  async cargar() {
    let carrCcod = this.route.snapshot.paramMap.get('carrCcod');
    let params = {
      instCcod: this.institucion?.value,
      tipoSemestre: this.semestre?.value,
      carrCcod: carrCcod
    };
    let result = await this.api.getCuentaCorriente(params);

    if (result.success) {
      this.conceptos = result.data;

      if (this.conceptosContent) {
        this.conceptosContent.nativeElement.scrollTo({ left: 0, behavior: 'smooth' });
      }
    }
    else {
      throw Error();
    }

    if (!this.mostrarData) this.mostrarData = true;
    if (this.mostrarCargando) this.mostrarCargando = false;
  }
  async recargar() {
    this.conceptos = [];
    this.mostrarCargando = true;
    this.mostrarData = false;

    try {
      await this.cargar();
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
  async detalle(data: any, e: any) {
    const loading = await this.dialog.showLoading({ message: 'Cargando...' });
    const instCcod = this.route.snapshot.paramMap.get('instCcod');
    const carrCcod = this.route.snapshot.paramMap.get('carrCcod');
    const params = {
      instCcod: instCcod,
      tipoSemestre: this.semestre?.value,
      carrCcod: carrCcod,
      ingrNcorr: data.ingreso,
      dcomNcompromiso: data.dcomNcompromiso,
      tcomCcod: data.tcomCcod,
      compNdocto: data.compNdocto
    };

    let result: any;

    try {
      result = await this.api.getDetalleConcepto(params);
    }
    catch (error: any) {
      if (error && error.status == 401) {
        await this.error.handle(error);
      }
    }
    finally {
      await loading.dismiss();
    }

    if (result && result.success && result.data.length) {
      await this.dialog.showModal({
        component: DetalleConceptoPage,
        componentProps: {
          data: Object.assign(result, { fechaActual: this.fechaActual })
        },
        canDismiss: true,
        presentingElement: this.routerOutlet.nativeEl
      });
    }
    else {
      this.snackbar.showToast('Detalle no disponible.', 3000, 'danger');
    }
  }
  get institucion() { return this.form.get('institucion'); }
  get semestre() { return this.form.get('semestre'); }
  get fechaActual() {
    if (this.instituciones && this.instituciones.length) {
      return this.instituciones[0].fecha;
    }
    return '';
  }

}
