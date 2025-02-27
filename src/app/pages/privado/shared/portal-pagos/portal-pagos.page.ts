import { Component, inject, OnInit } from '@angular/core';
import { IonItemSliding, IonRouterOutlet } from '@ionic/angular';
import { Compromiso } from 'src/app/core/interfaces/pagos.interfaces';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';
import { Router } from '@angular/router';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { DetalleCompromisoPage } from './detalle-compromiso/detalle-compromiso.page';
import { DetallePagoPage } from './detalle-pago/detalle-pago.page';
import { PortalPagosService } from 'src/app/core/services/http/portalpagos.service';
import { PagosService } from 'src/app/core/services/http/pagos.service';
import { DialogService } from 'src/app/core/services/dialog.service';
import { VISTAS_ALUMNO } from 'src/app/core/constants/alumno';

@Component({
  selector: 'app-portal-pagos',
  templateUrl: './portal-pagos.page.html',
  styleUrls: ['./portal-pagos.page.scss'],
})
export class PortalPagosPage implements OnInit {

  form: FormGroup;
  compromisos!: Compromiso[];
  formasPago: any;
  pagoId!: number;
  montoCarro: string = '0';
  mostrarCompromisos = false;
  mostrarCargando = true;
  mostrarData = false;

  private api = inject(PortalPagosService);
  private error = inject(ErrorHandlerService);
  private dialog = inject(DialogService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private pagos = inject(PagosService);
  private routerOutlet = inject(IonRouterOutlet);

  constructor() {

    this.form = this.fb.group({
      compromisos: new FormArray([])
    });
  }
  async ngOnInit() {
    await this.cargar();
    this.api.marcarVista(VISTAS_ALUMNO.PORTAL_PAGOS);
  }
  async cargar() {
    this.mostrarCargando = true;
    this.mostrarData = false;

    try {
      const result = await this.api.getPrincipal();
      const compromisos = result.compromisos;

      this.procesarCompromisos(compromisos);
      this.pagoId = result.pagoId;
      this.montoCarro = result.montoCarro.trim();
      this.formasPago = result.formasPago;
    }
    catch (error: any) {
      if (error && error.status == 401) {
        await this.error.handle(error);
        return;
      }
    }
    finally {
      this.mostrarCargando = false;
      this.mostrarData = true;
    }
  }
  async recargar() {
    this.mostrarCargando = true;
    this.mostrarData = false;

    if (!this.pagoId) {
      await this.cargar();
      return;
    }

    try {
      let params = { paonNcorr: this.pagoId };
      let result = await this.api.getCompromisos(params);
      let compromisos = result.compromisos;

      this.procesarCompromisos(compromisos);
      this.montoCarro = result.montoCarro.trim();
    }
    catch (error: any) {
      if (error && error.status == 401) {
        await this.error.handle(error);
        return;
      }
    }
    finally {
      this.mostrarCargando = false;
      this.mostrarData = true;
    }
  }
  procesarCompromisos(compromisos: Compromiso[]) {
    this.compromisosCtrl.clear();

    compromisos.forEach((item: Compromiso, index: number) => {
      item.checked = item.existeCarro === 1;

      const itemToAdd = this.fb.group({
        compromiso: [item.checked],
        data: item,
        index: index
      });

      itemToAdd.valueChanges
        .subscribe(data => this.procesarCompromiso(data))

      this.compromisosCtrl.push(itemToAdd);
    });

    this.compromisos = compromisos;
    this.mostrarCompromisos = compromisos.length > 0;
  }
  async procesarCompromiso(control: any) {
    let compromiso: Compromiso = control.data;
    let checked = control.compromiso === true;
    let loading = await this.dialog.showLoading({ message: 'Procesando...' });
    let params = { paonNcorr: this.pagoId, dpaoNcorr: compromiso.dpaoNcorr };
    // let method = checked ? 'agregarCarro' : 'eliminarCarro';

    try {
      await loading.present();

      // let result = await this.api[method](params);
      let result = checked == true ? await this.api.agregarCarro(params) : await this.api.eliminarCarro(params);


      if (result.success) {
        this.montoCarro = (result.message as string).trim();
      }
      else {
        if (result.message) {
          await this.presentAlert(result.message);
        }

        this.procesarCompromisos(result.compromisos);
      }
    }
    catch (error: any) {
      await this.error.handle(error);
    }
    finally {
      await loading.dismiss();
    }
  }
  async presentAlert(message: string) {
    await this.dialog.showAlert({
      header: 'Portal de Pagos',
      message: message,
      buttons: [{
        text: 'Aceptar'
      }]
    })
  }
  async pagar() {
    debugger
    try {
      const pagoResult = await this.pagos.procesarPago(this.formasPago, this.pagoId, this.montoCarro);
      let detalleResult;

      if (!pagoResult.hasOwnProperty('paonNcorr'))
        return;

      let params = { paonNcorr: pagoResult.paonNcorr, tpaoCcod: pagoResult.tpaoCcod };

      if (pagoResult.success) {
        detalleResult = await this.api.getPagoExito(params);
      }
      else {
        detalleResult = await this.api.getPagoFracaso(params);
      }

      if (detalleResult) {
        detalleResult = Object.assign(detalleResult, params)
        await this.mostrarDetallePago(detalleResult, pagoResult.success);
      }
    }
    catch (error: any) {
      if (error && error.code == 0) return;
      await this.error.handle(error);
    }
  }
  async detalleCompromiso(item: any, e: Event, sliding: IonItemSliding) {
    e.stopPropagation();

    const loading = await this.dialog.showLoading({ message: 'Cargando...' });

    try {
      const result = await this.api.getDetalleCompromiso({ dpaoNcorr: item.dpaoNcorr });

      Object.assign(result, {
        institucion: item.institucion,
        carrTdesc: item.carrera
      });

      await loading.dismiss();
      await this.dialog.showModal({
        component: DetalleCompromisoPage,
        componentProps: { data: result },
        canDismiss: true,
        presentingElement: this.routerOutlet.nativeEl
      });
    }
    catch (error: any) {
      await this.error.handle(error);
    }
    finally {
      await loading.dismiss();
    }

    await sliding.close();
  }
  async mostrarDetallePago(detallePago: any, pagoExito: boolean) {
    const modal = await this.dialog.showModal({
      component: DetallePagoPage,
      handle: false,
      componentProps: {
        pagoExito: pagoExito,
        data: detallePago
      },
      canDismiss: true,
      presentingElement: this.routerOutlet.nativeEl
    });

    const modalResult = await modal.onWillDismiss();

    if (modalResult.data) {
      await this.cargar();
    }
  }
  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  get compromisosCtrl() {
    return this.form.get('compromisos') as FormArray;
  }
  get backUrl() {
    return this.router.url.replace('/portal-pagos', '');
  }
  get backText() {
    if (this.router.url.indexOf('/dashboard-alumno/inicio') > -1)
      return 'Inicio';
    return 'Servicios';
  }
  get compromisosSeleccionados() {
    if (this.compromisosCtrl.value) {
      return this.compromisosCtrl.value.filter((t: any) => t.compromiso == true).length > 0;
    }
    return false;
  }

}


