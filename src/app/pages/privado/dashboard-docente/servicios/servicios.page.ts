import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { IonContent, Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { AppGlobal } from 'src/app/app.global';
import { VISTAS_DOCENTE } from 'src/app/core/constants/docente';
import { DocenteService } from 'src/app/core/services/http/docente.service';
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
  multiplesSedes = false;
  urlBibliotecas = 'https://inacap.primo.exlibrisgroup.com/discovery/search?vid=56INACAP_INST:INACAP&lang=es';
  sedes: any;
  persNcorr: any;
  mostrarAvatar = false;
  inicialesAvatar!: string;
  mostrarBip = false;
  status: any;
  subscription: Subscription;

  private api = inject(DocenteService);
  private profile = inject(ProfileService);
  private utils = inject(UtilsService);
  private events = inject(EventsService);
  private global = inject(AppGlobal);
  private pt = inject(Platform);

  constructor() {
    this.subscription = this.events.app.subscribe((event: any) => {
      if (event.action == 'scrollTop' && event.index == 3) {
        this.content?.scrollToTop(500);
      }
    });
  }

  ngOnInit() {
    this.api.marcarVista(VISTAS_DOCENTE.SERVICIOS);
  }
  async ionViewWillEnter() {
    const principal = await this.profile.getStorage("principal");

    if (principal) {
      this.sedes = principal.sedes;
      this.status = await this.profile.getStorage('status');

      if (this.sedes.length > 1) {
        this.multiplesSedes = true;
      }
    }
  }
  abrirNavegador(url: string) {
    this.utils.openLink(url);
  }
  linkBibliotecas() {
    this.abrirNavegador(encodeURI(this.urlBibliotecas));
  }
  notificacionesTap() {
    this.events.app.next({ action: 'app:docente-notificaciones' })
  }
  get mostrarReservaEspacios() {
    if (this.pt.is('mobileweb')) return true;
    
    if (this.status) {
      return this.status.reservaEspacios == true;
    }
    return false;
  }
  get mostrarTutorias() {
    if (this.pt.is('mobileweb')) return true;
    
    if (this.status) {
      return this.status.tutor === true;
    }
    return false;
  }
  get mostrarClinicas() {
    if (this.pt.is('mobileweb')) return true;

    if (this.status) {
      return this.status.clinicasAcademicas == true;
    }
    return false;
  }
  get mostrarNotificaciones() {
    return this.global.NotificationFlag;
  }
}
