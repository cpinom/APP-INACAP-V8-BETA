import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { AppGlobal } from 'src/app/app.global';
import { DocenteService } from 'src/app/core/services/http/docente.service';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';

@Component({
  selector: 'app-tutoria',
  templateUrl: './tutoria.page.html',
  styleUrls: ['./tutoria.page.scss'],
})
export class TutoriaPage implements OnInit {

  mostrarData = false;
  alumnos: any;
  displayedItems: any;
  itemsPerPage = 30;
  mostrarCargando = true;

  private api = inject(DocenteService);
  private error = inject(ErrorHandlerService);
  private global = inject(AppGlobal);
  private router = inject(Router);
  private nav = inject(NavController);

  constructor() { }

  async ngOnInit() {
    await this.cargar();
  }
  async cargar() {
    try {
      const result = await this.api.getEstudiantesTutoriaV6();

      if (result.success) {
        this.alumnos = result.data.alumnos;
        this.displayedItems = [];
        this.loadMoreItems();
      }
      else {
        throw Error();
      }
    }
    catch (error: any) {
      if (error && error.status == 401) {
        await this.error.handle(error);
      }
    }
    finally {
      this.mostrarData = true;
      this.mostrarCargando = false;
    }
  }
  loadMoreItems(event?: any) {
    const nextItems = this.alumnos.slice(this.displayedItems.length, this.displayedItems.length + this.itemsPerPage);
    this.displayedItems = [...this.displayedItems, ...nextItems];

    if (event) {
      event.target.complete();
    }

    if (this.displayedItems.length >= this.alumnos.length) {
      event.target.disabled = true;
    }
  }
  recargar() {
    this.mostrarCargando = true;
    this.mostrarData = false;
    setTimeout(() => {
      this.cargar();
    }, 500);
  }
  alumnoTap(item: any) {
    this.nav.navigateForward(`${this.router.url}/estudiante`, { state: item });
  }
  resolverFoto(persNcorr: any) {
    return `${this.global.Api}/api/v3/imagen-persona/${persNcorr}`;
  }
  get backText() {
    return this.router.url.indexOf('docente/inicio') > -1 ? 'Inicio' : 'Servicios';
  }
  get backUrl() {
    return this.router.url.replace('/tutoria', '');
  }

}
