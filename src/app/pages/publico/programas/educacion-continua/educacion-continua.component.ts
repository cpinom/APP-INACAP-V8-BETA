import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, NavController } from '@ionic/angular';
import { debounceTime, Subject, Subscription } from 'rxjs';
import { AppGlobal } from 'src/app/app.global';
import { VISTAS } from 'src/app/core/constants/publico';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';
import { EventsService } from 'src/app/core/services/events.service';
import { EducacionContinuaService } from 'src/app/core/services/http/educacion-continua.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';

@Component({
  selector: 'app-educacion-continua',
  templateUrl: './educacion-continua.component.html',
  styleUrls: ['./educacion-continua.component.scss'],
})
export class EducacionContinuaComponent implements OnInit {

  destacados: any;
  proximos: any;
  cursos: any;
  cursosBuscador: any;
  mostrarData = false;
  formFiltros: FormGroup;
  cursosFiltro = '';
  cursosFiltrados: any;
  tiposPrograma = [
    { cod: 1, nombre: 'Cursos' },
    { cod: 5, nombre: 'Diplomados' }
  ];
  modalidades = [
    { cod: 7, nombre: 'Presencial' },
    { cod: 5, nombre: 'E-Learning Asincronico' },
    { cod: 6, nombre: 'E-Learning Sincronico' }
  ];
  sedesCursos: any;
  areasCursos: any;
  filtrosMarcados: any[] = [];
  numeroPagina = 1;
  mostrarMas = false;
  mostrarResultados = false;
  mostrarError = false;
  filtroBusqueda = '';
  subscription: Subscription;
  modelChanged: Subject<string> = new Subject<string>();
  subscription2!: Subscription;
  debounceTime = 750;
  errorLoadImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNcvXrhHwAG9QL1xPyX6AAAAABJRU5ErkJggg==';

  constructor(private api: EducacionContinuaService,
    private fb: FormBuilder,
    private error: ErrorHandlerService,
    private loading: LoadingController,
    private snackbar: SnackbarService,
    private nav: NavController,
    private router: Router,
    private events: EventsService,
    private global: AppGlobal) {

    // this.subscription = this.events.app.subscribe((event: any) => {
    //   if (event.action == 'scrollTop' && event.index == 2 && this.router.url == '/publico/programas/educacion-continua') {
    //     this.content?.scrollToTop(500);
    //   }
    // });

    this.formFiltros = this.fb.group({
      tipo: [],
      modalidad: [],
      areas: [],
      sedes: [],
      ordenar: []
    });

    this.subscription = this.modelChanged
      .pipe(debounceTime(this.debounceTime))
      .subscribe(() => {
        this.cursos = undefined;
        this.numeroPagina = 1;
        this.filtrar()
      });

  }
  async ngOnInit() {
    await this.cargar();
    this.api.marcarVistaPublica(VISTAS.EDUC_CONTINUA);
  }
  async cargar() {
    try {
      let result = await this.api.getPrincipal();

      if (result.success) {
        this.destacados = result.destacados;
        this.proximos = result.proximos;
        this.cursosBuscador = result.cursosBuscador;
        this.sedesCursos = result.sedes;
        this.areasCursos = result.areas;
      }
      else {
        this.mostrarError = true;
      }
    }
    catch (error) {
      this.mostrarError = true;
    }
    finally {
      this.mostrarData = true;
    }
  }
  recargar(e?: any) {
    this.mostrarError = false;
    this.cursosFiltro = '';
    this.numeroPagina = 1;
    this.filtrosMarcados = [];
    this.mostrarResultados = false;
    this.cargar().finally(() => {
      e && e.target.complete();
    })
  }
  async detalleCurso(data: any, url?: boolean) {
    let loading = await this.loading.create({ message: 'Cargando...' });
    let params: any = { sedeCcod: 0 };
    let curso;

    if (url == true) {
      let arr = data.replace('/educacion-continua/cursos/curso#', '').split('/');
      params.codTipoCurso = arr[0];
      params.codCurso = arr[2];
      params.vias = arr[3];
    }
    else {
      params.codTipoCurso = data.codTipoCurso || 0;
      params.codCurso = data.codCurso;
      params.vias = data.vias || 1;
    }

    await loading.present();

    try {
      let result = await this.api.getDetalleCurso(params);

      if (result.success) {
        curso = Object.assign(result.data, { codTipoCurso: params.codTipoCurso });
      }
      else {
        this.snackbar.showToast('Información no disponible.', 2000);
        return;
      }
    }
    catch (error) {
      this.error.handle(error);
      return;
    }
    finally {
      await loading.dismiss();
    }

    if (curso) {
      if (this.esExalumno) {
        await this.nav.navigateForward(`${this.router.url}/detalle-curso`, { state: curso });
      }
      else {
        await this.nav.navigateForward('/publico/programas/detalle-curso', { state: curso });
      }
    }
  }
  filtrarCursos() {
    if (!this.mostrarResultados) {
      this.cursosFiltrados = this.cursosBuscador.filter((element: any) => {
        return element.label.normalize("NFD").replace(/[\u0300-\u036f]/g, '').toLowerCase().indexOf(this.cursosFiltro.normalize("NFD").replace(/[\u0300-\u036f]/g, '').toLowerCase()) > -1;
      });
    }
    else {
      this.filtroBusqueda = this.cursosFiltro;
      this.modelChanged.next("")
    }
  }
  resetCursos() {
    if (!this.filtroBusqueda) {
      this.cursosFiltro = '';
    }
    this.cursosFiltrados = [];
  }
  async quitarFiltro(item: any, modal: any) {
    if (item.tipo == 1) {
      let index = -1;
      if (item.valor == 1) index = this.filtrosMarcados.findIndex((t: any) => t.tipo == 1 && t.valor == 1);
      if (item.valor == 5) index = this.filtrosMarcados.findIndex((t: any) => t.tipo == 1 && t.valor == 5);
      if (index > -1) {
        this.tipo?.value.splice(index, 1);
        this.filtrosMarcados.splice(index, 1);
      }
    }

    if (item.tipo == 2) {
      let index = -1;
      if (item.valor == 5) index = this.filtrosMarcados.findIndex((t: any) => t.tipo == 2 && t.valor == 5);
      if (item.valor == 6) index = this.filtrosMarcados.findIndex((t: any) => t.tipo == 2 && t.valor == 6);
      if (item.valor == 7) index = this.filtrosMarcados.findIndex((t: any) => t.tipo == 2 && t.valor == 7);
      if (index > -1) {
        this.modalidad?.value.splice(index, 1);
        this.filtrosMarcados.splice(index, 1);
      }
    }

    if (item.tipo == 3) {
      this.filtrosMarcados = this.filtrosMarcados.filter((t: any) => t.tipo != 3);
      this.areas?.setValue('');
    }

    if (item.tipo == 4) {
      this.filtrosMarcados = this.filtrosMarcados.filter((t: any) => t.tipo != 4);
      this.sedes?.setValue('');
    }

    if (item.tipo == 5) {
      this.filtrosMarcados = this.filtrosMarcados.filter((t: any) => t.tipo != 5);
      this.ordenar?.setValue('');
    }

    if (this.filtrosMarcados.length == 0) {
      this.numeroPagina = 1;
      this.mostrarData = false;
      this.cursos = undefined;
    }

    await this.filtrar(modal);
  }
  async filtrar(modal?: any) {
    const loading = await this.loading.create({ message: 'Filtrando...' });

    this.mostrarResultados = true;
    this.resetCursos();
    modal && modal.dismiss();
    await loading.present();

    try {
      let params = {
        tipoCurso: this.tipo?.value ? (this.tipo.value.find((t: any) => t.cod == 1) ? 1 : 0) : 0,
        tipoDiplomado: this.tipo?.value ? (this.tipo.value.find((t: any) => t.cod == 5) ? 5 : 0) : 0,
        modPresencial: this.modalidad?.value ? (this.modalidad.value.find((t: any) => t.cod == 7) ? 7 : 0) : 0,
        modAsincronico: this.modalidad?.value ? (this.modalidad.value.find((t: any) => t.cod == 5) ? 5 : 0) : 0,
        modSincronico: this.modalidad?.value ? (this.modalidad.value.find((t: any) => t.cod == 6) ? 6 : 0) : 0,
        areas: this.areas?.value ? (this.areas.value.map((area: any) => { return area.codarea }).join(',')) : '',
        sedes: this.sedes?.value ? (this.sedes.value.map((sede: any) => { return sede.codsedes }).join(',')) : '',
        ordenAlfabetico: this.ordenar?.value == '1' ? 1 : 0,
        ordenFecha: this.ordenar?.value == '2' ? 1 : 0,
        ordenPrecioDesc: this.ordenar?.value == '3' ? 1 : 0,
        ordenPrecioAsc: this.ordenar?.value == '4' ? 1 : 0,
        buscar: this.filtroBusqueda,
        numPagina: this.numeroPagina
      };

      this.filtrosMarcados = [];

      if (params.tipoCurso == 1) this.filtrosMarcados.push({ texto: 'Tipo - Cursos', tipo: 1, valor: 1 });
      if (params.tipoDiplomado == 5) this.filtrosMarcados.push({ texto: 'Tipo - Diplomados', tipo: 1, valor: 5 });
      if (params.modPresencial == 7) this.filtrosMarcados.push({ texto: 'Mod - Presencial', tipo: 2, valor: 7 });
      if (params.modAsincronico == 5) this.filtrosMarcados.push({ texto: 'Mod - E-Learning Asincronico', tipo: 2, valor: 5 });
      if (params.modSincronico == 6) this.filtrosMarcados.push({ texto: 'Mod - E-Learning Sincronico', tipo: 2, valor: 6 });
      if (params.areas) this.filtrosMarcados.push({ texto: `(${this.areas?.value.length}) Areas`, tipo: 3, valor: this.areas?.value });
      if (params.sedes) this.filtrosMarcados.push({ texto: `(${this.sedes?.value.length}) Sedes`, tipo: 4, valor: this.sedes?.value });
      if (params.ordenAlfabetico == 1) this.filtrosMarcados.push({ texto: 'De A a Z', tipo: 5, valor: this.ordenar?.value });
      if (params.ordenFecha == 1) this.filtrosMarcados.push({ texto: 'Fecha más cercana', tipo: 5, valor: this.ordenar?.value });
      if (params.ordenPrecioDesc == 1) this.filtrosMarcados.push({ texto: 'Precio de menor a mayor', tipo: 5, valor: this.ordenar?.value });
      if (params.ordenPrecioAsc == 1) this.filtrosMarcados.push({ texto: 'Precio de mayor a menor', tipo: 5, valor: this.ordenar?.value });

      let response = await this.api.filtrarCursos(params);

      if (response.success) {
        if (!this.cursos) {
          this.cursos = response.cursos;
        }
        else {
          if (this.numeroPagina == 1 && response.cursos.length === 0) {
            this.cursos = [];
          }
          else {
            this.cursos = this.cursos.concat(response.cursos);
          }
        }
        this.mostrarData = true;
        this.mostrarMas = response.cursos.length == 21;
      }
      else {
        throw Error();
      }
    }
    catch (error) {
      this.error.handle(error);
    }
    finally {
      await loading.dismiss();
    }
  }
  async limpiarFiltros(modal: any) {
    modal.dismiss();
    this.numeroPagina = 1;
    this.filtrosMarcados = [];
    this.mostrarResultados = false;
  }
  resolverImagen(data: any) {
    return `${this.global.Api}/api/v3/educacion-continua/imagen-curso/${data.codCurso}/1`;
  }
  resaltarTexto(valor: string) {
    let filtro = this.cursosFiltro.normalize("NFD").replace(/[\u0300-\u036f]/g, '').toLowerCase();
    let texto = valor.normalize("NFD").replace(/[\u0300-\u036f]/g, '').toLowerCase();
    let startIndex = texto.indexOf(filtro);

    if (startIndex != -1) {
      let endLength = filtro.length;
      let matchingString = valor.substr(startIndex, endLength);
      return valor.replace(matchingString, "<b>" + matchingString + "</b>");
    }

    return valor;
  }
  resolverSedeDestacados(data: any) {
    if (data.cursNmodalidadInstruccion == 5) return 'E-Learning Asincronico';
    if (data.cursNmodalidadInstruccion == 6) return 'E-Learning Sincronico';
    if (data.cursNmodalidadInstruccion == 8) return 'E-Learning Sincronico';
    if (data.modalidad.toLowerCase() == 'presencial') return 'Varias Sedes';
    return '';
  }
  resolverSedeProximos(data: any) {
    if (data.cursNmodalidadInstruccion == 5) return 'E-Learning Asincronico';
    if (data.cursNmodalidadInstruccion == 6) return 'E-Learning Sincronico';
    if (data.cursNmodalidadInstruccion == 8) return 'E-Learning Sincronico';
    if (data.modalidad.toLowerCase() == 'presencial') return data.sedeTdesc;
  }

  get tipo() { return this.formFiltros.get('tipo'); }
  get modalidad() { return this.formFiltros.get('modalidad'); }
  get areas() { return this.formFiltros.get('areas'); }
  get sedes() { return this.formFiltros.get('sedes'); }
  get ordenar() { return this.formFiltros.get('ordenar'); }
  get esExalumno() { return this.router.url.startsWith('/exalumno'); }

}
