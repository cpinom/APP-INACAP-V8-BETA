import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { VISTAS_ALUMNO } from 'src/app/core/constants/alumno';
import { AlumnoService } from 'src/app/core/services/http/alumno.service';
import { ProfileService } from 'src/app/core/services/profile.service';

@Component({
  selector: 'app-horario',
  templateUrl: './horario.page.html',
  styleUrls: ['./horario.page.scss'],
})
export class HorarioPage implements OnInit {

  mostrarCargando = true;
  mostrarData = true;
  mostrarError = false;
  mostrarTitulo = true;

  constructor(private api: AlumnoService,
    private router: Router,
    private nav: NavController,
    private profile: ProfileService) { }

  ngOnInit() {
    this.api.marcarVista(VISTAS_ALUMNO.HORARIO);
  }
  recargar() {
    this.mostrarData = true;
  }
  async onEventoTap(data: any) {
    let seccCcod = data.seccion;
    let principal = await this.profile.getStorage('principal');
    let programa = principal.programas[principal.programaIndex];
    let asignaturas = programa.asignaturas as any[];
    let seccion = asignaturas.find(item => item.seccCcod == seccCcod);
    let params = {
      asigCcod: seccion.asigCcod,
      asigTdesc: seccion.asigTdesc,
      seccCcod: seccion.seccCcod,
      ssecNcorr: seccion.ssecNcorr,
      matrNcorr: programa.matrNcorr,
      periCcod: programa.periCcod
    };

    await this.nav.navigateForward('/alumno/inicio/seccion', { state: params });
  }
  async onAfterLoad(e: any) {
    this.mostrarCargando = true;
  }
  async onCompleteLoad(e: any) {
    this.mostrarCargando = false;
  }
  onChangeOrientation(orientation: any) {
    this.mostrarTitulo = orientation == 'landscape';
  }
  async onError(e: any) {
    this.mostrarCargando = false;
    this.mostrarData = false;
    this.mostrarError = true;
  }
  get backUrl() {
    return this.router.url.replace('/horario', '');
  }
}
