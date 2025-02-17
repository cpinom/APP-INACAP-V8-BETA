import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IonModal, NavController } from '@ionic/angular';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';
import { ProfileService } from 'src/app/core/services/profile.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { BuscadorDocentesService } from 'src/app/core/services/http/buscador-docentes.service';
import { DialogService } from 'src/app/core/services/dialog.service';
import { VISTAS_DOCENTE } from 'src/app/core/constants/docente';
import { VISTAS_ALUMNO } from 'src/app/core/constants/alumno';

enum Vistas {
  asignatura = '0',
  docente = '1',
  sala = '2'
};

@Component({
  selector: 'app-buscador-docente',
  templateUrl: './buscador-docente.page.html',
  styleUrls: ['./buscador-docente.page.scss'],
})
export class BuscadorDocentePage implements OnInit {

  @ViewChild('modal', { static: true }) modal!: IonModal;
  formAsignatura: FormGroup;
  formDocente: FormGroup;
  formSala: FormGroup;
  tabModel = Vistas.asignatura;
  areas: any;
  carreras: any;
  asignaturas: any;
  salas: any;
  disabledQR = false;
  submitted = false;
  nombreSede!: string;
  sedes: any;
  sede: any;
  sedeCache: any;
  mostrarCargando = true;
  mostrarData = false;

  private profile = inject(ProfileService);
  private api = inject(BuscadorDocentesService);
  private router = inject(Router);
  private nav = inject(NavController);
  private error = inject(ErrorHandlerService);
  private dialog = inject(DialogService);
  private snackbar = inject(SnackbarService);

  constructor() {

    this.formAsignatura = new FormGroup({
      areaCcod: new FormControl('', Validators.required),
      carrCcod: new FormControl('', Validators.required),
      asigCcod: new FormControl('', Validators.required)
    });

    this.formDocente = new FormGroup({ docente: new FormControl('', Validators.required) });
    this.formSala = new FormGroup({
      salaCcod: new FormControl('', Validators.required),
      salaTdesc: new FormControl('')
    });

    this.area?.valueChanges.subscribe(() => this.cargarCarreras());
    this.carrera?.valueChanges.subscribe(() => this.cargarAsignaturas());

  }
  async ionViewWillEnter() {
    const principal = await this.profile.getStorage('principal');

    if (!principal)
      return;

    if (this.esDocente) {
      const sedes = principal.sedes.filter((t:any) => t.sedeCcod != 33);

      if (sedes.length) {
        const sede = sedes.find((t: any) => t.sedeCcod = principal.sedeCcod);
        this.sedes = sedes;
        this.sede = sede;

        // if (this.pt.is('mobileweb')) {
        //   this.sedes.push({ sedeCcod: 7, sedeTdesc: 'Apoquindo' });
        //   this.sedes.push({ sedeCcod: 5, sedeTdesc: 'Renca' });
        //   this.sedes.push({ sedeCcod: 34, sedeTdesc: 'Puente Alto' });
        // }
      }
    }
    else {
      const programa = principal.programas[principal.programaIndex];
      this.sedes = [{ sedeCcod: programa.sedeCcod, sedeTdesc: programa.sedeTdesc }];
      this.sede = this.sedes[0];
    }

    await this.cargar();
  }
  async ngOnInit() {
    this.api.marcarVista(this.esDocente ? VISTAS_DOCENTE.BUSCADOR_DOCENTES : VISTAS_ALUMNO.BUSCADOR_DOCENTES);
  }
  async cargar() {
    if (this.sede) {
      if (this.sede.sedeCcod != this.sedeCache) {
        this.mostrarCargando = true;

        try {
          const result = await this.api.getPrincipal(this.sede.sedeCcod);

          if (result.success) {
            this.areas = result.data.areas;
            this.area?.setValue(result.data.areaCcod, { emitEvent: false });
            this.carreras = result.data.carreras;
            this.carrera?.setValue(result.data.carrCcod, { emitEvent: false });
            this.asignaturas = result.data.asignaturas;
            this.asignatura?.setValue(result.data.asigCcod);
            this.salas = this.procesarSalas(result.data.salas);
            this.sedeCache = this.sede.sedeCcod;
            this.docente?.setValue('');
            this.salaText?.setValue('');
            this.sala?.setValue('');
            this.submitted = false;
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
    }
    else {
      this.snackbar.showToast('Módulo no disponible.', 2000, 'danger')
      this.nav.navigateBack(this.backUrl);
    }
  }
  async recargar() {
    this.mostrarCargando = true;
    this.mostrarData = false;
    setTimeout(() => {
      this.cargar();
    }, 500);
  }
  async cargarCarreras() {
    const sedeCcod = this.sede.sedeCcod;
    const areaCcod = this.area?.value;
    const loading = await this.dialog.showLoading({ message: 'Cargando...' });

    try {
      const result = await this.api.getBuscadorCarrerasV5(sedeCcod, areaCcod);

      if (result.success) {
        this.carreras = result.data.carreras;
        this.carrera?.setValue(result.data.carrCcod, { emitEvent: false });
        this.asignaturas = result.data.asignaturas;
        this.asignatura?.setValue(result.data.asigCcod, { emitEvent: false });
      }
    }
    catch (error: any) {
      this.error.handle(error);
    }
    finally {
      await loading.dismiss();
    }
  }
  async cargarAsignaturas() {
    const sedeCcod = this.sede.sedeCcod;
    const carrCcod = this.carrera?.value;
    const loading = await this.dialog.showLoading({ message: 'Cargando...' });

    try {
      const result = await this.api.getBuscadorAsignaturasV5(sedeCcod, carrCcod);

      if (result.success) {
        this.asignaturas = result.data.asignaturas;
        this.asignatura?.setValue(result.data.asigCcod, { emitEvent: false });
      }
    }
    catch (error: any) {
      this.error.handle(error);
    }
    finally {
      await loading.dismiss();
    }
  }
  async cambiarSede() {
    this.mostrarData = false;
    this.tabModel = Vistas.asignatura;
    this.cargar();
  }
  async buscar() {
    this.submitted = true;

    if (this.validForm) {
      let params;

      switch (this.tabModel) {
        case Vistas.asignatura:
          params = Object.assign(this.formAsignatura.value, { tipo: this.tabModel, sedeCcod: this.sede.sedeCcod });
          break;
        case Vistas.docente:
          params = Object.assign(this.formDocente.value, { tipo: this.tabModel, sedeCcod: this.sede.sedeCcod });
          break;
        case Vistas.sala:
          params = Object.assign(this.formSala.value, { tipo: this.tabModel, sedeCcod: this.sede.sedeCcod });
          break;
      }

      if (params) {
        await this.nav.navigateForward(`${this.router.url}/resultados`, { state: params });
      }
    }
  }
  async escanearSala() {
    debugger
  }
  procesarSalas(data: any[]) {
    return data.map(t => {
      return {
        value: t.salaCcod,
        text: `${t.salaCiso} - ${t.salaTdesc}`,
        html: `<h2>${t.salaCiso} - ${t.salaTdesc}</h2><p>${t.salaTubicacion}</p>`
      }
    })
  }
  salasSelectionChanged(salaItem: any, modal: IonModal) {
    if (salaItem) {
      this.sala?.setValue(salaItem);
      this.salaText?.setValue(salaItem.text);
    }

    modal.dismiss();
  }
  get routerOutlet() { return document.getElementById('ion-router-outlet-content'); }
  get validForm() {
    if (this.tabModel == Vistas.asignatura) {
      return this.formAsignatura.valid;
    }
    if (this.tabModel == Vistas.docente) {
      return this.formDocente.valid;
    }
    if (this.tabModel == Vistas.sala) {
      return this.formSala.valid;
    }
    return null;
  }
  get area() { return this.formAsignatura.get('areaCcod'); }
  get carrera() { return this.formAsignatura.get('carrCcod'); }
  get asignatura() { return this.formAsignatura.get('asigCcod'); }
  get docente() { return this.formDocente.get('docente'); }
  get sala() { return this.formSala.get('salaCcod'); }
  get salaText() { return this.formSala.get('salaTdesc'); }
  get backUrl() { return this.router.url.replace('/buscador-docente', ''); }
  get esDocente() { return this.router.url.startsWith('/dashboard-docente'); }

}
