import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProfileService } from 'src/app/core/services/profile.service';

@Component({
  selector: 'app-practica-profesional',
  templateUrl: './practica-profesional.page.html',
  styleUrls: ['./practica-profesional.page.scss'],
})
export class PracticaProfesionalPage implements OnInit {

  private router = inject(Router);
  private profileService = inject(ProfileService);

  perfil: any;
  carrera: any;

  constructor() { }

  async ngOnInit() {
    if (this.esAlumno) {
      const programa = await this.profileService.getPrograma();
      this.carrera = programa.carrTdesc;
    }
    else {
      const perfil = await this.profileService.getStorage('profile');
      this.carrera = perfil.carrTdesc;
    }
  }
  mostrarInfoPracticas() { }
  mostrarSolicitudPractica() { }
  mostrarCertificadoPractica() { }

  get esAlumno() { return this.router.url.startsWith('/dashboard-alumno'); }
  get esExalumno() { return this.router.url.startsWith('/dashboard-exalumno'); }
  get backUrl() {
    if (this.esAlumno) {
      return this.router.url.startsWith('/dashboard-alumno/portafolio') ? '/dashboard-alumno/portafolio' : '/dashboard-alumno/inicio';
    }

    return '/dashboard-alumno/inicio';
  }
  get backText() {
    if (this.esAlumno) {
      return this.router.url.startsWith('/dashboard-alumno/portafolio') ? 'Portafolio' : 'Inicio';
    }

    return 'Inicio';
  }

}
