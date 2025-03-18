import { Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { IonContent, NavController } from '@ionic/angular';
import moment from 'moment';
import { Subscription } from 'rxjs';
import { AppGlobal } from 'src/app/app.global';
import { AuthService } from 'src/app/core/services/auth.service';
import { DialogService } from 'src/app/core/services/dialog.service';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';
import { EventsService } from 'src/app/core/services/events.service';
import { EmpleaInacapService } from 'src/app/core/services/http/emplea-inacap.service';
import { ExalumnoService } from 'src/app/core/services/http/exalumno.service';
import { ProfileService } from 'src/app/core/services/profile.service';
import { UtilsService } from 'src/app/core/services/utils.service';
import { CredencialVirtualPage } from '../perfil/credencial-virtual/credencial-virtual.page';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit, OnDestroy {

  private emplea = inject(EmpleaInacapService);
  private error = inject(ErrorHandlerService);
  private auth = inject(AuthService);
  private profile = inject(ProfileService);
  private api = inject(ExalumnoService);
  private global = inject(AppGlobal);
  private utils = inject(UtilsService);
  private nav = inject(NavController);
  private events = inject(EventsService);
  private dialog = inject(DialogService);

  @ViewChild(IonContent) content!: IonContent;
  empleos!: any[];
  mostrarCargando = true;
  mostrarData = false;
  status: any;
  inacapMail: any;
  scrollObs: Subscription;

  constructor() {

    this.scrollObs = this.events.app.subscribe((event: any) => {
      if (event.action == 'scrollTop' && event.index == 0) {
        this.content?.scrollToTop(500);
      }
    });

  }

  async ngOnInit() {
    await this.cargar();
  }
  ngOnDestroy() {
    this.scrollObs.unsubscribe();
  }
  async cargar(forzar?: boolean) {
    // debugger
    try {
      let filtros = await this.emplea.getStorage('filtros');

      if (!filtros) {
        let result = await this.emplea.getFiltrosExalumno();

        if (result.success) {
          const { data } = result;

          data['carreras'] = this.resolverCarreras(data.carreras);

          filtros = data;
          filtros.page = 1;
          filtros.filtro = '';
          filtros.usuario = {
            region: data.region,
            comuna: -1,
            comunas: data.comunas,
            carrera: data.carrera,
            tipos: 0
          };

          await this.emplea.setStorage('filtros', filtros);
        }
      }

      if (filtros) {
        let carrera = filtros.carrera || -1;
        let region = filtros.region || -1;
        let comuna = filtros.comuna || -1;
        let tipo = 2;
        let filtro = '';
        let page = 1;
        let result = await this.emplea.getEmpleos(carrera, region, comuna, tipo, filtro, page);

        if (result.success) {
          this.resolverEmpleos(result.data);
        }
      }

      this.cargarStatus(forzar);
      this.cargarCorreos();
    }
    catch (error: any) {
      if (error && error.status == 401) {
        await this.error.handle(error);
        return;
      }
    }
    finally {
      this.mostrarData = true;
      this.mostrarCargando = false;
    }
  }
  resolverCarreras(carreras: any[]) {
    let carrerasList: any[] = [];

    try {
      carreras.forEach(carrera => {
        const checkExist = Boolean(carrerasList.find(t => t.id == carrera.id));

        if (!checkExist) {
          carrerasList.push({
            id: carrera.id,
            name: carrera.name
          });
        }

      });
    }
    catch {
      return carreras;
    }

    carrerasList.sort((a, b) => a.name.localeCompare(b.name));

    return carrerasList;
  }
  resolverEmpleos(data: any[]) {
    const length = data.length > 3 ? 3 : data.length;
    this.empleos = data.slice(0, length);
  }
  resolverFecha(data: string) {
    let fecha = moment(data, 'YYYY-MM-DD');
    let valid = fecha.isValid();

    if (valid) return fecha.format('DD/MM/YYYY');
    else return data;
  }
  async cargarStatus(forzar?: boolean) {
    try {
      const auth = await this.auth.getAuth();
      const user = auth.user;
      let status = await this.profile.getStorage('status');

      if (!status || forzar) {
        status = await this.api.getConfiguraciones({ sedeCcod: user.sedeUsuario });
      }

      this.status = status;
      this.profile.setStorage('status', status);
    }
    catch (error: any) {
      if (error && error.status == 401) {
        this.error.handle(error);
      }
    }
  }
  async cargarCorreos() {
    try {
      let result = await this.api.getCorreos();

      if (result.success) {
        this.inacapMail = result.inbox;
      }
    }
    catch (error: any) {
      if (error && error.status == 401) {
        await this.error.handle(error);
      }
    }
  }
  async detalleOferta(params: any) {
    this.nav.navigateForward('/dashboard-exalumno/inicio/detalle-oferta', { state: params });
  }
  async educacionContinuaTap() {
    await this.utils.openLink('https://portal.inacap.cl/educacion-continua');
  }
  async credencialVirtualTap() {
    await this.dialog.showModal({
      cssClass: 'modal-credencial-virtual',
      component: CredencialVirtualPage,
      animated: false
    });
  }
  async logout() {
    await this.auth.tryLogout();
  }
  get version() {
    return this.global.Version;
  }

}
