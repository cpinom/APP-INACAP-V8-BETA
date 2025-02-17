import { Component, OnInit } from '@angular/core';
import { AlertController, IonItemSliding, IonRouterOutlet, LoadingController, ModalController } from '@ionic/angular';
import { Compromiso } from 'src/app/core/interfaces/pagos.interfaces';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';
import { PortalPagosService } from 'src/app/core/services/portalpagos.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { Router } from '@angular/router';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { PagosService } from 'src/app/core/services/pagos.service';
import { VISTAS_ALUMNO } from 'src/app/app.constants';
import { DetalleCompromisoPage } from './detalle-compromiso/detalle-compromiso.page';
import { DetallePagoPage } from './detalle-pago/detalle-pago.page';

@Component({
  selector: 'app-portal-pagos',
  templateUrl: './portal-pagos.page.html',
  styleUrls: ['./portal-pagos.page.scss'],
})
export class PortalPagosPage implements OnInit {

  form: FormGroup;
  compromisos: Compromiso[];
  formasPago: any;
  pagoId: number;
  montoCarro: string = '0';
  mostrarCompromisos = false;
  mostrarCargando = true;
  mostrarData = false;

  constructor(private api: PortalPagosService,
    private snackbar: SnackbarService,
    private error: ErrorHandlerService,
    private loading: LoadingController,
    private modalCtrl: ModalController,
    private router: Router,
    private fb: FormBuilder,
    private pagos: PagosService,
    private routerOutlet: IonRouterOutlet,
    private alertCtrl: AlertController) {

    this.form = this.fb.group({
      compromisos: new FormArray([])
    });
  }
  async ngOnInit() {
    this.cargar();
    this.api.marcarVista(VISTAS_ALUMNO.PORTAL_PAGOS);
  }
  async cargar() {
    this.mostrarCargando = true;
    this.mostrarData = false;

    try {
      let result = await this.api.getPrincipal();
      let compromisos = result.compromisos;

      this.procesarCompromisos(compromisos);
      this.pagoId = result.pagoId;
      this.montoCarro = result.montoCarro.trim();
      this.formasPago = result.formasPago;
    }
    catch (error) {
      if (error.status == 401) {
        this.error.handle(error);
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
    catch (error) {
      if (error.status == 401) {
        this.error.handle(error);
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
    let loading = await this.loading.create({ message: 'Procesando...' });
    let params = { paonNcorr: this.pagoId, dpaoNcorr: compromiso.dpaoNcorr };
    let method = checked ? 'agregarCarro' : 'eliminarCarro';

    try {
      await loading.present();

      let result = await this.api[method](params);

      if (result.success) {
        this.montoCarro = (result.message as string).trim();
      } 
      else {
        if (result.message) {
          this.presentAlert(result.message);
        }

        this.procesarCompromisos(result.compromisos);
      }
    }
    catch (error) {
      this.error.handle(error);
    }
    finally {
      await loading.dismiss();
    }
  }
  presentAlert(message: string) {
    this.alertCtrl.create({
      header: 'Portal de Pagos',
      message: message,
      buttons: [{
        text: 'Aceptar'
      }]
    }).then(alert => alert.present())
  }
  async pagar() {
    try {
      let pagoResult = await this.pagos.procesarPago(this.formasPago, this.pagoId, this.montoCarro);
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
    catch (error) {
      if (error && error.code == 0) return;
      this.error.handle(error);
    }
  }
  async detalleCompromiso(item: any, e: Event, sliding: IonItemSliding) {
    e.stopPropagation();

    const loading = await this.loading.create({ message: 'Cargando...' });

    await loading.present();

    try {
      const result = await this.api.getDetalleCompromiso({ dpaoNcorr: item.dpaoNcorr });

      Object.assign(result, {
        institucion: item.institucion,
        carrTdesc: item.carrera
      })

      const modal = await this.modalCtrl.create({
        component: DetalleCompromisoPage,
        componentProps: { data: result },
        canDismiss: true,
        presentingElement: this.routerOutlet.nativeEl
      });

      await loading.dismiss();
      await modal.present();
    }
    catch (error) {
      this.error.handle(error);
    }
    finally {
      await loading.dismiss();
    }

    await sliding.close();
  }
  async mostrarDetallePago(detallePago: any, pagoExito: boolean) {
    const modal = await this.modalCtrl.create({
      component: DetallePagoPage,
      handle: false,
      componentProps: {
        pagoExito: pagoExito,
        data: detallePago
      },
      canDismiss: true,
      presentingElement: this.routerOutlet.nativeEl
    });

    await modal.present();

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
    if (this.router.url.indexOf('/alumno/inicio') > -1)
      return 'Inicio';
    return 'Servicios';
  }
  get compromisosSeleccionados() {
    if (this.compromisosCtrl.value) {
      return this.compromisosCtrl.value.filter(t => t.compromiso == true).length > 0;
    }
    return false;
  }

}


