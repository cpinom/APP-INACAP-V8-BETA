import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IonRouterOutlet, NavController } from '@ionic/angular';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { SolicitudDetallePage } from './solicitud-detalle/solicitud-detalle.page';
import { ProfileService } from 'src/app/core/services/profile.service';
import { EventsService } from 'src/app/core/services/events.service';
import { SolicitudesService } from 'src/app/core/services/http/solicitudes.service';
import { VISTAS_EXALUMNO } from 'src/app/core/constants/exalumno';
import { VISTAS_ALUMNO } from 'src/app/core/constants/alumno';
import { DialogService } from 'src/app/core/services/dialog.service';

@Component({
  selector: 'app-solicitudes-academicas',
  templateUrl: './solicitudes-academicas.page.html',
  styleUrls: ['./solicitudes-academicas.page.scss'],
})
export class SolicitudesAcademicasPage implements OnInit {

  mostrarCargando = true;
  activeTab: number = 0;
  carreras!: any[];
  carrera: any;
  solicitudes!: any[];
  historial!: any[];
  mostrarData = false;
  recargando = false;
  carreraForm: FormGroup;

  private api = inject(SolicitudesService);
  private error = inject(ErrorHandlerService);
  private router = inject(Router);
  private dialog = inject(DialogService);
  private routerOutlet = inject(IonRouterOutlet);
  private fb = inject(FormBuilder);
  private events = inject(EventsService);
  private nav = inject(NavController);
  private snackbar = inject(SnackbarService);
  private profile = inject(ProfileService);

  constructor() {

    this.carreraForm = this.fb.group({
      planCcod: ['', Validators.required]
    });

    this.planCcod?.valueChanges.subscribe(async () => {
      await this.cargarSolicitudes();
    });

    this.events.app.subscribe(event => {
      if (event.action == 'app:solicitudes-academicas-inicio') {
        this.mostrarData = false;
        this.cargar();
      }
    });

  }
  async ngOnInit() {
    if (this.esExalumno) {
      this.api.marcarVista(VISTAS_EXALUMNO.SOLICITUDES);
    }
    else {
      this.api.marcarVista(VISTAS_ALUMNO.SOLICITUDES);
    }
    await this.cargar();
  }
  async cargar() {
    try {
      let planCcod = await this.api.getStorage('plan');

      if (!planCcod) {
        if (!this.esExalumno) {
          let principal = await this.profile.getStorage('principal');
          let programa = principal.programas[principal.programaIndex];

          planCcod = programa.planCcod;
        }
        else {
          planCcod = 0;
        }
      }

      if (!this.esExalumno) {
        const result = await this.api.getPrincipalV5(planCcod);

        if (result.success) {
          const { data } = result;
          let carrera = data.carreras.find((t: any) => t.planCcod == planCcod);

          this.carreras = data.carreras;
          this.solicitudes = data.solicitudes;
          this.historial = data.historial;

          if (!carrera) {
            carrera = result.carreras[0];
          }

          this.planCcod?.setValue(carrera.planCcod, { emitEvent: false });
          await this.api.setStorage('plan', carrera.planCcod);
        }
      }
      else {
        const params = { planCcod: planCcod };
        const result = await this.api.getPrincipalV3(params);
        const carrera = result.carreras[0];

        this.carreras = result.carreras;
        this.solicitudes = result.solicitudes;
        this.historial = result.historial;

        this.planCcod?.setValue(carrera.planCcod, { emitEvent: false });
        await this.api.setStorage('plan', carrera.planCcod);
      }
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
  recargar(e?: any) {
    this.mostrarCargando = false;
    this.cargar().finally(() => {
      e && e.target.complete();
    });
  }
  async anular(soliNcorr: string) {
    let snackbar = await this.snackbar.create('Procesando...', false, 'secondary');
    let params = { soliNcorr: soliNcorr };

    await snackbar.present();

    try {
      let result = await this.api.anularSolicitud(params);

      if (result.success) {
        this.historial = result.historial;
        this.snackbar.showToast(result.message, 3000);
      }
      else {
        this.snackbar.showToast(result.message, 3000, 'danger');
      }
    }
    catch (error: any) {
      await this.error.handle(error);
    }
    finally {
      await snackbar.dismiss();
    }
  }
  async cargarSolicitudes() {
    this.mostrarData = false;
    this.mostrarCargando = true;

    try {
      const planCcod = this.planCcod?.value;
      const result = await this.api.getSolicitudesV5(planCcod);

      if (result.success) {
        this.solicitudes = result.data.solicitudes;
        await this.api.setStorage('plan', this.planCcod?.value);
      }
      else {
        throw Error();
      }
    }
    catch (error: any) {
      if (error && error.status == 401) {
        await this.error.handle(error);
        return;
      }

      await this.snackbar.showToast('No se pudo cargar las solicitudes', 3000, 'danger');
    }
    finally {
      this.mostrarData = true;
      this.mostrarCargando = false;
    }
  }
  async detalleSolicitud(item: any) {
    const loading = await this.dialog.showLoading({ message: 'Cargando...' });

    try {
      const result = await this.api.getDetalleSolicitudV5(item.soliNcorr, item.tisoCcod);

      await loading.dismiss();

      if (!result.success) {
        throw Error();
      }

      const modal = await this.dialog.showModal({
        component: SolicitudDetallePage,
        componentProps: {
          data: result.data
        },
        canDismiss: true,
        presentingElement: this.routerOutlet.nativeEl
      });

      const detalleResult = await modal.onWillDismiss();

      if (detalleResult.data && detalleResult.data.anular == true) {
        await this.anular(item.soliNcorr);
      }
    }
    catch (error: any) {
      if (error && error.status == 401) {
        await this.error.handle(error);
        return;
      }

      await this.presentError('Detalle Solicitud', 'No se pudo cargar el detalle de la solicitud.');
    }
    finally {
      await loading.dismiss();
    }
  }
  async resolverSolicitud(item: any) {
    const data = Object.assign(item, { planCcod: this.planCcod?.value });

    if (item.tisoCcod == 1 || item.tisoCcod == 4 || item.tisoCcod == 9 || item.tisoCcod == 14 || item.tisoCcod == 19 || item.tisoCcod == 29 || item.tisoCcod == 35 || item.tisoCcod == 50) {
      await this.nav.navigateForward(`${this.router.url}/solicitud-documentos`, { state: data });
    }
    else if (item.tisoCcod == 2 || item.tisoCcod == 43 || item.tisoCcod == 44) {
      await this.nav.navigateForward(`${this.router.url}/solicitud-practica`, { state: data });
    }
    else {
      await this.nav.navigateForward(`${this.router.url}/solicitud-simple`, { state: data });
    }
  }
  resolverEstado(item: any) {
    if (item.esolCcod == 3) return 'danger';
    if (item.esolCcod == 2) return 'success';
    if (item.esolCcod == 1) return 'warning';
    if (item.esolCcod == 6) return 'medium';
    if (item.esolCcod == 8 || item.esolCcod == 11) return 'danger';
    return '';
  }
  async presentError(title: string, message: string) {
    const alert = await this.dialog.showAlert({
      cssClass: 'alert-message',
      message: `<img src="./assets/images/warning.svg" /><br />${message}`,
      header: title,
      buttons: ['Aceptar']
    });

    return alert;
  }
  get planCcod() { return this.carreraForm.get('planCcod'); }
  get backUrl() { return this.router.url.replace('/solicitudes-academicas', ''); }
  get backText() { return 'Volver'; }
  get esExalumno() { return this.router.url.startsWith('/dashboard-exalumno'); }

}

