import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { IonContent, IonInfiniteScroll, IonModal, NavController } from '@ionic/angular';
import * as moment from 'moment';
import { Subject, Subscription, debounceTime } from 'rxjs';
import { AlumnoService } from 'src/app/core/services/http/alumno.service';
import { DialogService } from 'src/app/core/services/dialog.service';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';
import { EventsService } from 'src/app/core/services/events.service';
import { ProfileService } from 'src/app/core/services/profile.service';
import { EmpleaInacapService } from 'src/app/core/services/http/emplea-inacap.service';
import { ExalumnoService } from 'src/app/core/services/http/exalumno.service';
import { VISTAS_ALUMNO } from 'src/app/core/constants/alumno';
import { VISTAS_EXALUMNO } from 'src/app/core/constants/exalumno';

@Component({
  selector: 'app-emplea-inacap',
  templateUrl: './emplea-inacap.page.html',
  styleUrls: ['./emplea-inacap.page.scss'],
})
export class EmpleaInacapPage implements OnInit {

  @ViewChild(IonContent) content!: IonContent;
  @ViewChild(IonInfiniteScroll) infiniteItem!: IonInfiniteScroll;
  programa: any;
  empleos: any[] | undefined;
  filtros: any;
  mostrarData = false;
  subscription: Subscription;
  formFiltros: FormGroup;
  filtro = '';
  filtroSubscription: Subscription;
  filtroChanged: Subject<string> = new Subject<string>();
  filtrosMarcados: { id: any; name: string; key: string }[] = [];

  private api = inject(EmpleaInacapService);
  private exalumno = inject(ExalumnoService);
  private alumno = inject(AlumnoService);
  private nav = inject(NavController);
  private router = inject(Router);
  private events = inject(EventsService);
  private fb = inject(FormBuilder);
  private dialog = inject(DialogService);
  private error = inject(ErrorHandlerService);
  private profile = inject(ProfileService);

  constructor() {

    this.subscription = this.events.app.subscribe((event: any) => {
      if (event.action == 'scrollTop' && event.index == 1) {
        this.content?.scrollToTop(500);
      }
    });

    this.filtroSubscription = this.filtroChanged
      .pipe(debounceTime(750))
      .subscribe(() => {
        this.mostrarData = false;
        this.empleos = undefined;
        this.filtros.page = 1;
        this.filtrar()
      });

    this.formFiltros = this.fb.group({
      region: [],
      comuna: [],
      carrera: [],
      tipos: []
    });

    this.region?.valueChanges.subscribe((regionId: any) => {
      if (regionId) {
        this.cargarComunas(regionId);
      }
    });

  }
  async ngOnInit() {
    await this.cargarFiltros();

    if (this.filtros) {
      this.region?.setValue(this.filtros.usuario.region, { emitEvent: false });
      this.comuna?.setValue(this.filtros.usuario.comuna);
      this.carrera?.setValue(this.filtros.usuario.carrera);
      this.tipos?.setValue(this.filtros.usuario.tipos);
      await this.filtrar();
    }

    if (this.esAlumno) {
      this.alumno.marcarVista(VISTAS_ALUMNO.EMPLEA_INACAP);
    }
    else {
      this.exalumno.marcarVista(VISTAS_EXALUMNO.EMPLEA_INACAP);
    }
  }
  async ngOnDestroy() {
    this.subscription.unsubscribe();
    this.filtroSubscription.unsubscribe();
  }
  async cargarFiltros() {
    let filtros_storaged = await this.api.getStorage('filtros');

    if (filtros_storaged) {
      this.filtros = filtros_storaged;
    }
    else {
      let data;

      try {
        if (this.esAlumno) {
          let principal = await this.profile.getStorage('principal');
          let programa = principal.programas[principal.programaIndex];
          let result = await this.api.getFiltrosAlumno(programa.sedeCcod, programa.carrCcod);

          if (result.success) {
            data = result.data;
          }
        }
        else {
          let result = await this.api.getFiltrosExalumno();

          if (result.success) {
            data = result.data;
          }
        }
      }
      catch { }

      if (data) {
        data['carreras'] = this.resolverCarreras(data.carreras);

        this.filtros = data;
        this.filtros.page = 1;
        this.filtros.filtro = '';
        this.filtros.usuario = {
          region: data.region,
          comuna: -1,
          comunas: data.comunas,
          carrera: data.carrera,
          tipos: 0
        };

        await this.api.setStorage('filtros', this.filtros);
      }
      else {
        throw Error();
      }
    }
  }
  async commitFiltros() {
    this.filtrosMarcados = [];
    this.filtros.usuario.region = this.region?.value;
    this.filtros.usuario.comuna = this.comuna?.value;
    this.filtros.usuario.carrera = this.carrera?.value;
    this.filtros.usuario.tipos = this.tipos?.value;
    await this.api.setStorage('filtros', this.filtros);

    if (this.filtros.usuario.region != -1) {
      const region = this.filtros.regiones.find((t: any) => t.id == this.filtros.usuario.region);
      this.filtrosMarcados.push({ id: region.id, name: `Región - <b>${region.name}</b>`, key: 'region' });
    }

    if (this.filtros.usuario.comuna != -1) {
      const comuna = this.filtros.usuario.comunas.find((t: any) => t.id == this.filtros.usuario.comuna);
      this.filtrosMarcados.push({ id: comuna.id, name: `Comuna - <b>${comuna.name}</b>`, key: 'comuna' });
    }

    if (this.filtros.usuario.carrera != -1) {
      const carrera = this.filtros.carreras.find((t: any) => t.id == this.filtros.usuario.carrera);
      this.filtrosMarcados.push({ id: carrera.id, name: `Carrera - <b>${carrera.name}</b>`, key: 'carrera' });
    }

    if (this.filtros.usuario.tipos != -1) {
      const tipos = this.filtros.tipos.find((t: any) => t.id == this.filtros.usuario.tipos);
      this.filtrosMarcados.push({ id: tipos.id, name: `Fecha publicación - <b>${tipos.name}</b>`, key: 'tipos' });
    }

  }
  async cargarComunas(region: number) {
    let loading = await this.dialog.showLoading({ message: 'Cargando...' });

    try {
      let result = await this.api.getComunas(region);

      if (result.success) {
        this.comuna?.setValue(-1);
        this.filtros.usuario.comunas = result.data.comunas;
      }
    }
    catch {
      this.comuna?.setValue(-1);
      this.filtros.usuario.comunas = [];
    }
    finally {
      loading.dismiss();
    }
  }
  async mostrarFiltros(mdl: IonModal) {
    const { usuario } = this.filtros;

    if (usuario.region == -1) {
      this.filtros.usuario.comunas = [];
    }
    else {
      if (usuario.comunas.length) {
        this.filtros.usuario.comunas = usuario.comunas;
      }
      else {
        if (this.filtros.region == this.filtros.usuario.region) {
          this.filtros.usuario.comunas = this.filtros.comunas;
        }
        else if (this.filtros.usuario.region != -1) {
          await this.cargarComunas(this.filtros.usuario.region);
        }
      }
    }

    this.region?.setValue(usuario.region, { emitEvent: false });
    this.comuna?.setValue(usuario.comuna);
    this.carrera?.setValue(usuario.carrera);
    this.tipos?.setValue(usuario.tipos);

    await mdl.present();
  }
  async recargar() {
    await this.cargarFiltros();

    this.mostrarData = false;
    this.empleos = undefined;
    this.filtros.page = 1;

    await this.filtrar();
  }
  async loadData(e: any) {
    this.filtros.page = this.filtros.page + 1;
    this.filtrar().finally(() => {
      e.target.complete();
    });
  }
  async filtrarSubmit(mdl?: IonModal) {
    this.filtros.usuario.region = this.region?.value;
    this.filtros.usuario.comuna = this.comuna?.value;
    this.filtros.usuario.carrera = this.carrera?.value;
    this.filtros.usuario.tipos = this.tipos?.value;
    this.api.setStorage('filtros', this.filtros);
    this.mostrarData = false;
    this.empleos = undefined;
    this.filtros.page = 1;
    mdl && (await mdl.dismiss());
    await this.filtrar();
  }
  async filtrar() {

    try {
      await this.commitFiltros();

      const { carrera } = this.filtros.usuario;
      const { region } = this.filtros.usuario;
      const { comuna } = this.filtros.usuario;
      const { tipos } = this.filtros.usuario;
      const filtro = this.filtros.filtro || '';
      const page = this.filtros.page;

      let result = await this.api.getEmpleos(carrera, region, comuna, tipos, filtro, page);

      if (result.success) {
        this.infiniteItem && (this.infiniteItem.disabled = result.data.length < 20);

        if (this.empleos && this.empleos.length) {
          this.empleos = this.empleos.concat(result.data);
        }
        else {
          this.empleos = result.data;
        }
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
    }
  }
  limpiarFiltros() {
    this.region?.setValue(-1, { emitEvent: false });
    this.comuna?.setValue(-1);
    this.carrera?.setValue(-1);
    this.tipos?.setValue(-1);
    this.filtros.usuario.comunas = [];
  }
  resetFiltros() {
    if (this.filtros) {
      this.region?.setValue(this.filtros.region, { emitEvent: false })
      this.comuna?.setValue(-1);
      this.carrera?.setValue(this.filtros.carrera);
      this.tipos?.setValue(0);
      this.filtros.usuario.comunas = this.filtros.comunas;
    }
  }
  quitarFiltro(item: any) {
    const filtroIndex = this.filtrosMarcados.findIndex(t => t.id == item.id);
    const filtro = this.filtrosMarcados[filtroIndex];

    switch (filtro.key) {
      case 'region':
        this.region?.setValue(-1, { emitEvent: false });
        this.comuna?.setValue(-1);
        this.filtros.usuario.comunas = [];
        break;
      case 'comuna':
        this.comuna?.setValue(-1);
        this.filtros.usuario.comunas = [];
        break;
      case 'carrera':
        this.carrera?.setValue(-1);
        break;
      case 'tipos':
        this.tipos?.setValue(-1);
        break;
    }

    this.filtrosMarcados.splice(filtroIndex, 1);
    this.filtrarSubmit();
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
  detalleEmpleo(params: any) {
    this.nav.navigateForward(`${this.router.url}/detalle-oferta`, { state: params });
  }
  formatFecha(data: string) {
    let fecha = moment(data, 'YYYY-MM-DD');
    let valid = fecha.isValid();

    if (valid) return fecha.format('DD/MM/YYYY');
    else return data;
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
  get region() { return this.formFiltros.get('region'); }
  get comuna() { return this.formFiltros.get('comuna'); }
  get carrera() { return this.formFiltros.get('carrera'); }
  get tipos() { return this.formFiltros.get('tipos'); }
  get esAlumno() { return this.router.url.startsWith('/alumno') }
  get esExalumno() { return this.router.url.startsWith('/exalumno') }
  get mostrarConfiguraciones() { return this.router.url.startsWith('/exalumno/empleos') }

}
