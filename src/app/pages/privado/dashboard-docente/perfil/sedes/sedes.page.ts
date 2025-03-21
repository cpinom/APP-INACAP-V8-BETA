import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SedeComponent } from 'src/app/core/components/sede/sede.component';
import { VISTAS_DOCENTE } from 'src/app/core/constants/docente';
import { DocenteService } from 'src/app/core/services/http/docente.service';
import { ProfileService } from 'src/app/core/services/profile.service';

@Component({
  selector: 'app-sedes',
  templateUrl: './sedes.page.html'
})
export class SedesPage implements OnInit {

  @ViewChild(SedeComponent, { static: true }) sedeCmp!: SedeComponent;
  mostrarCargando = true;
  mostrarError = false;

  constructor(private profile: ProfileService,
    private api: DocenteService,
    private router: Router) { }

  async ionViewDidEnter() {
    await this.cargar();
  }
  ngOnInit() {
    this.api.marcarVista(VISTAS_DOCENTE.SEDE);
  }
  async cargar() {
    let perfil = await this.profile.getStorage('principal');
    let sedes = perfil.sedes.filter((t: any) => t.sedeCcod != 33);

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
  async sedeCargada(e: any) {
    this.mostrarCargando = false;
  }
  async sedeError(e: any) {
    this.mostrarError = true;
  }
  async sedeAction(action: string) {
    if (action == 'reserva-espacios') {
      await this.router.navigate([this.router.url.replace('/sede', '') + '/reserva-espacios'])
    }
  }
  get backText() {
    if (this.router.url.endsWith('dashboard-docente/inicio/sede'))
      return 'Inicio';
    return 'Perfil';
  }

}
