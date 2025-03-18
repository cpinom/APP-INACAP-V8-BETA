import { Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { IonContent, IonModal } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';
import { EventsService } from 'src/app/core/services/events.service';
import { ExalumnoService } from 'src/app/core/services/http/exalumno.service';
import { MensajeService } from 'src/app/core/services/mensaje.service';
import { ProfileService } from 'src/app/core/services/profile.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import * as desconocido from 'src/scripts/foto.desconocido';

@Component({
  selector: 'app-equipo',
  templateUrl: './equipo.page.html',
  styleUrls: ['./equipo.page.scss'],
})
export class EquipoPage implements OnInit, OnDestroy {

  private events = inject(EventsService);
  private api = inject(ExalumnoService);
  private profile = inject(ProfileService);
  private error = inject(ErrorHandlerService);
  private mensaje = inject(MensajeService);
  private snackbar = inject(SnackbarService);

  @ViewChild(IonContent) content!: IonContent;
  scrollObs: Subscription;
  fotoDesconocido = desconocido.imgBase64;
  mostrarCargando = true;
  mostrarData = false;
  data: any;
  sedeCcod: any;
  usuario: any;

  constructor() {

    this.scrollObs = this.events.app.subscribe((event: any) => {
      if (event.action == 'scrollTop' && event.index == 2) {
        this.content?.scrollToTop(500);
      }
    });

  }
  async ngOnInit() {
    await this.cargar();
  }
  ngOnDestroy() {
    this.scrollObs.unsubscribe();
  }
  async cargar() {
    try {
      let perfil = await this.profile.getStorage('profile');

      if (!perfil) {
        const result = await this.api.getPerfil();

        if (result.success) {
          perfil = result.data.perfil;
          await this.profile.setStorage("profile", perfil);
        }
      }

      const { sedeCcod } = perfil;
      const result = await this.api.getEmplea(sedeCcod);

      if (result.success) {
        this.data = result.data;
        this.sedeCcod = sedeCcod;
      }
      else {
        throw Error();
      }
    }
    catch (error: any) {
      if (error && error.status == 401) {
        await this.error.handle(error);
        return;
      }
    }
    finally {
      this.mostrarCargando = false;
      this.mostrarData = true;
    }
  }
  async recargar() {
    this.mostrarCargando = true;
    this.mostrarData = false;
    await this.cargar();
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
  resolverFoto() {
    if (this.sedeCcod) {
      return `${this.api.baseUrl}/v4/exalumno/emplea-imagen?ncorr=${this.sedeCcod}&tipo=3`;
    }

    return '';
  }
  resolverFotoPersona(ncorr: any) {
    return `${this.api.baseUrl}/v4/exalumno/emplea-imagen?ncorr=${ncorr}&tipo=1`;
  }

}
