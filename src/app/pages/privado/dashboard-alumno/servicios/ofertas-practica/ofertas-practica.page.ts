import { Component, OnInit } from '@angular/core';
import { AlumnoService } from 'src/app/core/services/http/alumno.service';
import { NavController } from '@ionic/angular';
import { ProfileService } from 'src/app/core/services/profile.service';
import { Router } from '@angular/router';
import { VISTAS_ALUMNO } from 'src/app/core/constants/alumno';
import { UtilsService } from 'src/app/core/services/utils.service';
import * as moment from 'moment';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';
import { DialogService } from 'src/app/core/services/dialog.service';

@Component({
  selector: 'app-ofertas-practica',
  templateUrl: './ofertas-practica.page.html',
  styleUrls: ['./ofertas-practica.page.scss'],
})
export class OfertasPracticaPage implements OnInit {

  data: any;
  ofertas: any;
  carrCcod: string;
  programas: any;
  programa: any;
  practica: any;
  mostrarCargando = true;
  mostrarData = false;

  constructor(private api: AlumnoService,
    private nav: NavController,
    private profile: ProfileService,
    private router: Router,
    private utils: UtilsService,
    private error: ErrorHandlerService,
    private dialog: DialogService) {
    moment.locale('es');
  }
  async ngOnInit() {
    let principal = await this.profile.getStorage('principal');

    this.programas = principal.programas;
    this.programa = this.programas[principal.programaIndex];
    this.carrCcod = this.programa.carrCcod;
    this.cargar();
    this.api.marcarVista(VISTAS_ALUMNO.OFERTASPRACTICAS);
  }
  async cargar() {
    try {
      let result = await this.api.getPracticasPrincipal(this.programa.sedeCcod, this.programa.planCcod, this.carrCcod);

      if (result.success) {
        const { data } = result;
        this.data = data;
        this.ofertas = data.ofertas || [];
        this.practica = data.practica;
      }
      else {
        throw Error();
      }
    }
    catch (error: any) {
      if (error && error.status == 401) {
        this.error.handle(error);
        return;
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
  async mostrarInfoPracticas() {
    await this.nav.navigateForward(`${this.router.url}/practicas`, { state: this.practica });
  }
  async mostrarSolicitudPractica() {

    if (this.data.habilitaPractica == 0) {
      await this.dialog.showAlert({
        header: 'Práctica Profesional',
        message: 'El módulo de práctica profesional estará disponible una vez obtenidos los créditos necesarios, según su plan de estudio.',
        buttons: [{
          text: 'Aceptar'
        }]
      });
      return;
    }

    const params = {
      tisoCcod: 2,
      tisoTdesc: 'Solicitud de Inscripción de Práctica',
      planCcod: this.programa.planCcod
    };
    
    await this.nav.navigateForward(`${this.router.url}/solicitud-practica`, { state: params });
  }
  async mostrarCertificadoPractica() {
    await this.utils.openLink('https://certificadoinacap.geasa.cl/');
  }
  async cambiarCarrera() {
    this.programa = this.programas.find(t => t.carrCcod == this.carrCcod);
    this.mostrarCargando = true;
    this.mostrarData = false;
    this.cargar();
  }
  async detalleEmpleo(params: any) {
    await this.nav.navigateForward(`${this.router.url}/detalle`, { state: params });
  }
  formatFecha(data) {
    let fecha = moment(data, 'YYYY-MM-DD');
    let today = moment();
    let yesterday = today.clone().subtract(1, 'days').startOf('day');

    if (fecha.isSame(today, 'd')) {
      return 'Publicado Hoy';
    }

    if (fecha.isSame(yesterday, 'd')) {
      return 'Publicado Ayer';
    }

    return `Publicado el ${fecha.format('D [de] MMMM, YYYY')}`;
  }
  get backUrl() { return this.router.url.startsWith('/alumno/servicios') ? '/alumno/servicios' : '/alumno/inicio'; }
  get backText() { return this.router.url.startsWith('/alumno/servicios') ? 'Servicios' : 'Inicio'; }

}
