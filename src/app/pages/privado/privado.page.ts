import { Component, inject, OnInit } from '@angular/core';
import { Device } from '@capacitor/device';
import { NavController } from '@ionic/angular';
import { Ingreso } from 'src/app/core/interfaces/auth.interfaces';
import { AuthService } from 'src/app/core/services/auth.service';
import { DialogService } from 'src/app/core/services/dialog.service';
import { EventsService } from 'src/app/core/services/events.service';
import { ProfileService } from 'src/app/core/services/profile.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';

@Component({
  selector: 'app-privado',
  templateUrl: './privado.page.html',
  styleUrls: ['./privado.page.scss'],
})
export class PrivadoPage implements OnInit {

  private authService = inject(AuthService);
  private nav = inject(NavController);
  private profile = inject(ProfileService);
  private dialog = inject(DialogService);
  private events = inject(EventsService);
  private snackbar = inject(SnackbarService);

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
    const loading = await this.dialog.showLoading({ message: 'Cargando preferencias...' });
    const id = await Device.getId();
    const diacTtipo = rol.replace('/', '');
    const data: Ingreso = {
      uuid: id.identifier,
      sedeCcod: this.info.user.sedeUsuario,
      carrCcod: '',
      diacTtipo: diacTtipo,
      time: (new Date()).getTime(),
      callback: async () => {
        if (rol === '/alumno') {
          await this.nav.navigateForward('dashboard-alumno');
        }
        else if (rol === '/docente') {
          await this.nav.navigateForward('dashboard-docente');
        }
        else if (rol === '/exalumno') {
          await this.nav.navigateForward('dashboard-exalumno');
        }

        const perfil = diacTtipo.charAt(0).toUpperCase() + diacTtipo.slice(1).toLowerCase();

        await loading.dismiss();
        await this.snackbar.showToast(`Se inició con tu cuenta de ${perfil}.`, 3000);
      }
    };

    await this.authService.setProfile(rol);
    await this.profile.clearStorage();
    
    this.events.onLogin.next(data);    
  }
  async logout() {
    await this.authService.clearAuth();
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
