import { Component, inject, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-privado',
  templateUrl: './privado.page.html',
  styleUrls: ['./privado.page.scss'],
})
export class PrivadoPage implements OnInit {

  private authService = inject(AuthService);
  private nav = inject(NavController);
  info: any;
  mostrarAlumno!: boolean;
  mostrarDocente!: boolean;
  mostrarExalumno!: boolean;

  constructor() { }

  ngOnInit() {
    this.authService.getAuth().then((auth) => {
      this.info = auth;
      this.mostrarAlumno = auth.user.esAlumno;
      this.mostrarDocente = auth.user.esDocente;
      this.mostrarExalumno = auth.user.esExalumno;

    });
  }
  async redirectToProfile(rol: string) {
    debugger
    
    await this.authService.setProfile(rol);

    if (rol === '/alumno') {
      await this.nav.navigateForward('dashboard-alumno');
    }
    else if (rol === '/docente') {
      await this.nav.navigateForward('dashboard-docente');
    }
    else if (rol === '/exalumno') {
      await this.nav.navigateForward('dashboard-exalumno');
    }
  }
  async logout() {
    await this.authService.clearAuth(true);
    await this.nav.navigateRoot('publico');
  }
  get nombrePersona() {
    if (this.info) {
      return this.info.user.data.persTnombreSocial || this.info.user.data.persTnombre;
    }
    return '';
  }
  get fotoPerfil() {
    if (this.info) {
      return this.info.perfilImagen;
    }
    return '';
  }

}
