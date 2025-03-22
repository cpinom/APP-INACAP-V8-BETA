import { Component, inject, OnInit } from '@angular/core';
import { IonModal } from '@ionic/angular';
import { AppGlobal } from 'src/app/app.global';
import { VISTAS_ALUMNO } from 'src/app/core/constants/alumno';
import { AlumnoService } from 'src/app/core/services/http/alumno.service';
import { MensajeService } from 'src/app/core/services/mensaje.service';
import { ProfileService } from 'src/app/core/services/profile.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import * as desconocido from 'src/scripts/foto.desconocido';

@Component({
  selector: 'app-equipo',
  templateUrl: './equipo.page.html',
  styleUrls: ['./equipo.page.scss'],
})
export class EquipoPage implements OnInit {

  programa: any;
  personas: any;
  mostrarData = false;
  fotoDesconocido = desconocido.imgBase64;
  usuario: any;

  private profile = inject(ProfileService);
  private mensaje = inject(MensajeService);
  private global = inject(AppGlobal);
  private api = inject(AlumnoService);
  private snackbar = inject(SnackbarService);

  constructor() { }

  async ngOnInit() {
    const principal = await this.profile.getStorage('principal');
    const programa = principal.programas[principal.programaIndex];
    const sedeCcod = programa.sedeCcod;
    const dae = await this.profile.getStorage(`dae_${sedeCcod}`);

    this.programa = programa;
    this.personas = dae && dae.personas;
    this.mostrarData = true;

    this.api.marcarVista(VISTAS_ALUMNO.EQUIPO_DAE);
  }
  async info(data: any, modal: IonModal) {
    this.usuario = data;
    await modal.present();
  }
  async correo(persTemail: string, usuario: IonModal) {
    await usuario.dismiss();

    try {
      await this.mensaje.crear(persTemail);
    }
    catch (error: any) {
      await this.snackbar.showToast(error, 2000, 'danger');
    }
  }
  resolverFoto(ncorr: any) {
    return `${this.global.Api}/api/v3/imagen-dae/${ncorr}/1`;
  }

}


