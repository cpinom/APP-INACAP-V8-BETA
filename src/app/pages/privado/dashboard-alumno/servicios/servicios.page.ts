import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { IonContent, Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { VISTAS_ALUMNO } from 'src/app/core/constants/alumno';
import { AppGlobal } from 'src/app/app.global';
import { AlumnoService } from 'src/app/core/services/http/alumno.service';
import { EventsService } from 'src/app/core/services/events.service';
import { ProfileService } from 'src/app/core/services/profile.service';
import { UtilsService } from 'src/app/core/services/utils.service';

@Component({
  selector: 'app-servicios',
  templateUrl: './servicios.page.html',
  styleUrls: ['./servicios.page.scss'],
})
export class ServiciosPage implements OnInit {

  @ViewChild(IonContent) content!: IonContent;
  sedeCcod: any;
  status: any;
  urlBibliotecas = 'https://inacap.primo.exlibrisgroup.com/discovery/search?vid=56INACAP_INST:INACAP&lang=es';
  practica!: boolean;
  perfilOk!: boolean;
  mostrarCentroAyuda = false;
  scrollObs: Subscription;

  private utils = inject(UtilsService);
  private profile = inject(ProfileService);
  private global = inject(AppGlobal);
  private api = inject(AlumnoService);
  private events = inject(EventsService);
  private pt = inject(Platform);

  constructor() {
    this.scrollObs = this.events.app.subscribe((event: any) => {
      if (event.action == 'scrollTop' && event.index == 4) {
        this.content?.scrollToTop(500);
      }
    });

    this.profile.getStorage('principal').then(principal => {
      this.perfilOk = !!principal;
    });
  }
  async ionViewWillEnter() {
    let principal = await this.profile.getStorage('principal');

    if (principal) {
      let programa = principal.programas[principal.programaIndex];

      if (programa) {
        this.sedeCcod = programa.sedeCcod;
        this.status = await this.profile.getStorage('status');
        this.practica = this.status.habilitaPractica == 1;

        if (this.status && ('centroAyuda' in this.status)) {
          if (this.status.centroAyuda.indexOf(this.sedeCcod) > -1) {
            this.mostrarCentroAyuda = true;
          }
        }

        if (this.pt.is('mobileweb')) {
          this.mostrarCentroAyuda = true;
        }
      }
    }
  }
  ngOnInit() {
    this.api.marcarVista(VISTAS_ALUMNO.SERVICIOS);
  }
  ngOnDestroy() {
    this.scrollObs.unsubscribe();
  }
  async bibliotecasTap() {
    await this.utils.openLink(this.urlBibliotecas);
    this.api.marcarVista(VISTAS_ALUMNO.BUSCADOR_BIBLIOTECAS);
  }
  notificacionesTap() {
    this.events.app.next({ action: 'app:alumno-notificaciones' });
  }
  get mostrarNotificaciones() {
    return this.global.NotificationFlag;
  }
  get mostrarEstacionamiento() {
    if (this.status && this.status.estacionamientos) {
      return this.status.estacionamientos ? this.status.estacionamientos.esseNasignacion : false;
    }
  }
  get mostrarBip() {
    if (this.status) {
      if (this.status.servicios.bip) {
        if (typeof (this.status.servicios.bip) == 'boolean') {
          return this.status.servicios.bip;
        }
        else if (Array.isArray(this.status.servicios.bip)) {
          return this.status.servicios.bip.indexOf(this.sedeCcod) > -1;
        }
      }
      else {
        return false;
      }
    }
  }
  get mostrarCertificados() {
    if (this.status && this.status.servicios) {
      return this.status.servicios.certificados;
    }

    return false;
  }
  get mostrarSolicitudes() {
    if (this.status && this.status.servicios) {
      return this.status.servicios.solicitudes;
    }

    return false;
  }
  get mostrarBuscadorDocentes() {
    if (this.status) {
      return this.sedeCcod != 47;
    }
    return true;
  }
}
