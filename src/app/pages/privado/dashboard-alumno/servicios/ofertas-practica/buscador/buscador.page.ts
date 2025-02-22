import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { IonInfiniteScroll, IonModal, NavController } from '@ionic/angular';
import { debounceTime, Subject, Subscription } from 'rxjs';
import { AlumnoService } from 'src/app/core/services/http/alumno.service';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';
import { ProfileService } from 'src/app/core/services/profile.service';
import * as moment from 'moment';

@Component({
  selector: 'app-buscador',
  templateUrl: './buscador.page.html',
  styleUrls: ['./buscador.page.scss'],
})
export class BuscadorPage implements OnInit {

  @ViewChild(IonInfiniteScroll) infiniteItem!: IonInfiniteScroll;
  mostrarCargando = true;
  mostrarData = false;
  programa: any;
  filtros: any;
  ofertas: any;
  ofertasFiltradas: any;
  formFiltros: FormGroup;
  filtro = '';
  filtroSubscription: Subscription;
  filtroChanged: Subject<string> = new Subject<string>();
  filtrosMarcados = [];

  constructor(private profile: ProfileService,
    private api: AlumnoService,
    private router: Router,
    private nav: NavController,
    private fb: FormBuilder,
    private error: ErrorHandlerService) {
    moment.locale('es');

    this.filtroSubscription = this.filtroChanged
      .pipe(debounceTime(750))
      .subscribe(() => {
        this.filtrarIterno();
      });

    this.formFiltros = this.fb.group({
      region: []
    });

  }
  get region() { return this.formFiltros.get('region'); }
  async ngOnInit() {
    let principal = await this.profile.getStorage('principal');

    this.programa = principal.programas[principal.programaIndex];
    this.cargar();
  }
  async cargar() {
    let filtros_storaged = await this.api.getStorage('filtros-practicas');

    if (filtros_storaged) {
      this.filtros = filtros_storaged;
      this.filtros['page'] = this.filtros['page'] || 1;
    }
    else {
      try {
        let result = await this.api.getFiltrosPracticas(this.programa.sedeCcod, this.programa.carrCcod);

        if (result.success) {
          this.filtros = result.data;
          this.api.setStorage('filtros-practicas', this.filtros);
        }
        else {
          throw Error();
        }
      }
      catch { }
    }

    if (this.filtros) {
      try {
        let career = this.filtros.carrCcodReqlut;
        let region = this.filtros.sedeCcodReqlut;
        let page = this.filtros.page;
        let result = await this.api.filtrarPracticas(career, region, page);

        if (result.success) {
          this.ofertas = result.data.ofertas;
          this.ofertasFiltradas = this.ofertas;
          this.mostrarData = true;
        }
        else {
          throw Error();
        }

        this.region?.setValue(region, { emitEvent: false })
      }
      catch (error: any) {
        await this.error.handle(error);
      }
      finally { }
    }

    this.mostrarData = true;
    this.mostrarCargando = false;
  }
  recargar() {
    this.mostrarCargando = true;
    this.mostrarData = false;
    setTimeout(() => {
      this.cargar();
    }, 500);
  }
  async loadData(e: any) {
    this.filtros.page = this.filtros.page + 1;
    let career = this.filtros.carrCcodReqlut;
    let region = this.region?.value || this.filtros.sedeCcodReqlut;
    let page = this.filtros.page;
    this.filtrarPracticas(career, region, page).finally(() => {
      e.target.complete();
    });
  }
  async filtrarPracticas(career: any, region: any, page: any) {
    this.mostrarCargando = true;

    try {
      let result = await this.api.filtrarPracticas(career, region, page);

      if (result.success) {
        this.infiniteItem && (this.infiniteItem.disabled = result.data.ofertas.length < 20);

        if (this.ofertas && this.ofertas.length) {
          this.ofertas = this.ofertas.concat(result.data.ofertas);
        }
        else {
          this.ofertas = result.data.ofertas;
        }

        this.ofertasFiltradas = this.ofertas;
      }
      else {
        throw Error();
      }
    }
    catch (error: any) {
      await this.error.handle(error);
    }
    finally {
      this.mostrarData = true;
      this.mostrarCargando = false;
    }
  }
  async filtrar(mdl?: IonModal) {
    this.infiniteItem && (this.infiniteItem.disabled = true);
    this.ofertas = [];
    this.ofertasFiltradas = this.ofertas;
    this.filtro = '';
    this.mostrarData = false;
    mdl && (await mdl.dismiss());
    let career = this.filtros.carrCcodReqlut;
    let region = this.region?.value || this.filtros.sedeCcodReqlut;

    await this.filtrarPracticas(career, region, 1);
  }
  async limpiarFiltros() {
    this.region?.setValue(-1, { emitEvent: false });
  }
  async detalleEmpleo(params: any) {
    await this.nav.navigateForward(`${this.router.url.replace('/buscador', '')}/detalle`, { state: params });
  }
  formatFecha(data: string) {
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
  async filtrarEmpleos() {
    this.filtros.filtro = this.filtro;
    this.filtroChanged.next('')
  }
  async resetEmpleos() {
    this.filtro = '';
    this.filtros.filtro = '';
    this.filtroChanged.next('')
  }
  async filtrarIterno() {
    const filtro = this.filtros.filtro || '';

    this.ofertasFiltradas = this.ofertas.filter((element: any) => {
      var text = element.jobTitle.normalize("NFD").replace(/[\u0300-\u036f]/g, '').toLowerCase();
      var filter = filtro.normalize("NFD").replace(/[\u0300-\u036f]/g, '').toLowerCase();
      var index = text.indexOf(filter);

      return index > -1;
    });

  }
  get habilitarFiltrar() {
    return this.mostrarData && this.ofertas;
  }
  get backUrl() {
    return this.router.url.startsWith('/alumno/servicios/ofertas-practica') ? '/alumno/servicios/ofertas-practica' : '/alumno/inicio/ofertas-practica';
  }

}
