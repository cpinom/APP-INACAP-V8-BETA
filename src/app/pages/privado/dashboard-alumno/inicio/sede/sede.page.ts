import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { VISTAS_ALUMNO } from 'src/app/core/constants/alumno';
import { SedeComponent } from 'src/app/core/components/sede/sede.component';
import { AlumnoService } from 'src/app/core/services/http/alumno.service';
import { ProfileService } from 'src/app/core/services/profile.service';

@Component({
  selector: 'app-sede',
  templateUrl: './sede.page.html'
})
export class SedePage implements OnInit {

  @ViewChild(SedeComponent, { static: true }) sedeCmp!: SedeComponent;
  mostrarCargando = true;
  mostrarError = false;

  constructor(private profile: ProfileService,
    private api: AlumnoService,
    private router: Router) { }

  ngOnInit() {
    this.api.marcarVista(VISTAS_ALUMNO.SEDE);
  }
  async ionViewDidEnter() {
    await this.cargar();
  }
  async cargar() {
    const principal = await this.profile.getStorage('principal');
    const programa = principal.programas[principal.programaIndex];
    const sedes = [{ sedeCcod: programa.sedeCcod }];

    await this.sedeCmp.loadData(sedes);
  }
  async recargar() {
    this.sedeCmp._sedeCcod = '';
    this.mostrarCargando = true;
    this.mostrarError = false;
    setTimeout(() => {
      this.cargar();
    }, 500);
  }
  async sedeCargada(e?: any) {
    this.mostrarCargando = false;
  }
  async sedeError(e?: any) {
    this.mostrarError = true;
  }
  async sedeAction(action: string) {
    if (action == 'reserva-espacios') {
      await this.router.navigate([this.router.url.replace('/sede', '') + '/reserva-espacios'])
    }
  }
  async sedeServices(service: string) {
    if (service == 'cafeteria') {
      this.api.marcarVista(VISTAS_ALUMNO.CAFETERIA);
    }
    else if (service == 'biblioteca') {
      this.api.marcarVista(VISTAS_ALUMNO.BIBLIOTECA);
    }
  }
  get backUrl() {
    return this.router.url.replace('/sede', '');
  }
  get backText() {
    if (this.router.url.indexOf('/dashboard-alumno/inicio') > -1)
      return 'Inicio';
    return 'DAE';
  }

}
