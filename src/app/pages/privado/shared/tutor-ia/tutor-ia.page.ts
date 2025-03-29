import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { VISTAS_ALUMNO } from 'src/app/core/constants/alumno';
import { VISTAS_DOCENTE } from 'src/app/core/constants/docente';
import { AlumnoService } from 'src/app/core/services/http/alumno.service';
import { DocenteService } from 'src/app/core/services/http/docente.service';

@Component({
  selector: 'app-tutor-ia',
  templateUrl: './tutor-ia.page.html',
  styleUrls: ['./tutor-ia.page.scss'],
})
export class TutorIaPage implements OnInit {

  private router = inject(Router);
  private nav = inject(NavController);
  private api = inject(AlumnoService);

  seccion: any;

  constructor() {
    this.seccion = this.router.getCurrentNavigation()?.extras.state;
    console.log(this.seccion);
  }
  ngOnInit() {
    this.marcarVista();
  }
  agenteSocraticoTap() {
    this.nav.navigateForward(`${this.router.url}/agente-socratico`, { state: this.seccion });
  }
  agentePracticoTap() {
    this.nav.navigateForward(`${this.router.url}/agente-practico`, { state: this.seccion });
  }
  iniciarTestTap() {
    this.nav.navigateForward(`${this.router.url}/test`, { state: this.seccion });
  }
  marcarVista() {
    if (this.esAlumno) {
      this.api.marcarVista(VISTAS_ALUMNO.TUTOR_IA);
    }
    else {
      this.api.marcarVista(VISTAS_DOCENTE.TUTOR_IA);
    }
  }
  get backUrl() {
    return this.router.url.replace('/tutor-ia', '');
  }
  get esAlumno() { return this.router.url.startsWith('/dashboard-alumno'); }

}
