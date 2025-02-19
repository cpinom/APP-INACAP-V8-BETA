import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { localeEs } from '@mobiscroll/angular';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { VISTAS_ALUMNO } from 'src/app/core/constants/alumno';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';
import { EventsService } from 'src/app/core/services/events.service';
import { ReservasEspacioService } from 'src/app/core/services/http/reservas-espacio.service';
import { ProfileService } from 'src/app/core/services/profile.service';

@Component({
  selector: 'app-reserva-espacios',
  templateUrl: './reserva-espacios.page.html',
  styleUrls: ['./reserva-espacios.page.scss'],
})
export class ReservaEspaciosPage implements OnInit, OnDestroy {

  permiteReservar = false;
  mostrarCargando = true;
  mostrarData = false;
  tabsModel = 0;
  pickerLocale = localeEs;
  firstStep!: FormGroup;
  cliente: any;
  categorias: any;
  reservas: any;
  programa: any;
  subscription: Subscription;
  sedeCcod: any;

  private router = inject(Router);
  private api = inject(ReservasEspacioService);
  private profile = inject(ProfileService);
  private nav = inject(NavController);
  private events = inject(EventsService);
  private error = inject(ErrorHandlerService);

  constructor() {
    this.subscription = this.events.app.subscribe((event: any) => {
      if (event.action == 'app:reserva-espacios-reload') {
        this.cargar();
      }
    })
  }
  ngOnInit() {
    this.profile.getStorage('principal').then(principal => {
      if (principal) {
        if (this.esDocente) {
          let sedes = principal.sedes.filter((t: any) => t.sedeCcod != 33);
          this.sedeCcod = sedes[0].sedeCcod;
          this.cargar();
        }
        else {
          this.programa = principal.programas[principal.programaIndex];
          this.sedeCcod = this.programa.sedeCcod;
          this.cargar();
        }
      }
    });
    this.api.marcarVista(VISTAS_ALUMNO.RESERVAS_ESPACIOS)
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  async cargar() {
    try {
      const params = { sedeCcod: this.sedeCcod };
      const result = await this.api.getPrincipal(params);

      if (result.success) {
        this.cliente = result.cliente;
        this.categorias = result.categorias;
        this.reservas = result.reservas;
        this.permiteReservar = true;
      }
      else {
        this.permiteReservar = false;
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
  recargar(e?: any) {
    if (!e) {
      this.mostrarCargando = false;
      this.mostrarData = false;
    }
    this.cargar().finally(() => {
      e && e.target.complete();
    })
  }
  crearReserva() {
    const params = { categorias: this.categorias, cliente: this.cliente };
    this.nav.navigateForward(`${this.router.url}/nueva-reserva`, { state: params });
  }
  detalleReserva(item: any) {
    const params = { id: item.id };
    this.nav.navigateForward(`${this.router.url}/detalle-reserva`, { state: params });
  }
  resolverFecha(fecha: string) {
    return moment(fecha, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY HH:mm')
  }
  get esDocente() { return this.router.url.startsWith('/dashboard-docente'); }
  get backUrl() {
    return this.router.url.replace('/reserva-espacios', '');
  }
  get backText() {
    if (this.esDocente) {
      if (this.router.url.indexOf('/dashboard-docente/inicio') > -1)
        return 'Inicio';
      return 'Servicios';
    }
    else {
      if (this.router.url.indexOf('/dashboard-alumno/inicio') > -1)
        return 'Inicio';
      return 'Servicios';

    }
  }

}
