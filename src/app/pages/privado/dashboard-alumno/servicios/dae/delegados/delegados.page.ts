import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { IonItemSliding, IonModal, Platform } from '@ionic/angular';
import { AppGlobal } from 'src/app/app.global';
import { VISTAS_ALUMNO } from 'src/app/core/constants/alumno';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';
import { AlumnoService } from 'src/app/core/services/http/alumno.service';
import { MensajeService } from 'src/app/core/services/mensaje.service';
import { ProfileService } from 'src/app/core/services/profile.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import * as desconocido from 'src/scripts/foto.desconocido';

@Component({
  selector: 'app-delegados',
  templateUrl: './delegados.page.html',
  styleUrls: ['./delegados.page.scss'],
})
export class DelegadosPage implements OnInit {

  @ViewChild(IonItemSliding) slidingItem!: IonItemSliding;
  programa: any;
  mostrarData = false;
  mostrarCargando = true;
  delegados: any;
  fotoDesconocido = desconocido.imgBase64;
  usuario: any;

  private profile = inject(ProfileService);
  private api = inject(AlumnoService);
  private error = inject(ErrorHandlerService);
  private global = inject(AppGlobal);
  private mensaje = inject(MensajeService);
  private snackbar = inject(SnackbarService);
  private pt = inject(Platform);

  constructor() { }

  async ngOnInit() {
    const principal = await this.profile.getStorage('principal');
    this.programa = principal.programas[principal.programaIndex];
    await this.cargar();
    this.api.marcarVista(VISTAS_ALUMNO.DELEGADOS);
  }
  async cargar() {
    const sedeCcod = this.programa.sedeCcod;
    const carrCcod = this.programa.carrCcod;
    const jornCcod = -1;
    const nombreDelegado = '';

    try {
      const result = await this.api.getDelegadosV5(sedeCcod, carrCcod, jornCcod, nombreDelegado);

      if (result.success) {
        this.delegados = this.procesarDelegados(result.data.delegados);
      }
      else {
        throw Error();
      }
    }
    catch (error: any) {
      if (error && error.status == 401) {
        await this.error.handle(error);
        return
      }
    }
    finally {
      this.mostrarData = true;
      this.mostrarCargando = false;
    }
  }
  async recargar() {
    this.mostrarCargando = true;
    this.mostrarData = false;
    setTimeout(() => {
      this.cargar();
    }, 500);
  }
  procesarDelegados(data: any[]) {
    let delegados: any[] = [];

    if (data.length == 0 && this.pt.is('mobileweb')) {
      delegados.push({ persNcorr: 5178619, nombre: 'Abad Fierro, Jassen Patricio', carrera: 'Técnico en Automatización y Robótica', jornada: 'Diurna', correo: 'jassen.abad@inacapmail.cl' });
      delegados.push({ persNcorr: 5178620, nombre: 'Aguirre Cáceres, Cristian Andrés', carrera: 'Técnico en Automatización y Robótica', jornada: 'Diurna', correo: '' })
      return delegados;
    }

    data.forEach(item => {
      if (delegados.length == 0) {
        delegados.push(item);
      }
      else {
        if (!delegados.find(t => t.persNcorr == item.persNcorr)) {
          delegados.push(item);
        }
      }
    });

    return delegados;
  }
  async info(data: any, modal: IonModal) {
    this.usuario = data;
    await modal.present();
  }
  async correo(persTemail: string, usuario: IonModal) {
    usuario.dismiss();

    try {
      await this.mensaje.crear(persTemail);
    }
    catch (error: any) {
      await this.snackbar.showToast(error, 2000, 'danger');
    }
  }
  resolverFoto(persNcorr: any) {
    return `${this.global.Api}/api/v3/imagen-persona/${persNcorr}`;
  }

}

