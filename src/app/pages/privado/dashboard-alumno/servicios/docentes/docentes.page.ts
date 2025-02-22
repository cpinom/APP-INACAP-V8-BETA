import { Component, OnInit } from '@angular/core';
import { VISTAS_ALUMNO } from 'src/app/core/constants/alumno';
import { AppGlobal } from 'src/app/app.global';
import { AlumnoService } from 'src/app/core/services/http/alumno.service';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';
import { MensajeService } from 'src/app/core/services/mensaje.service';
import { ProfileService } from 'src/app/core/services/profile.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';

@Component({
  selector: 'app-docentes',
  templateUrl: './docentes.page.html',
  styleUrls: ['./docentes.page.scss'],
})
export class DocentesPage implements OnInit {

  docentes: any;
  programas!: any[];
  mostrarCargando = true;
  mostrarData = false;

  constructor(private api: AlumnoService,
    private profile: ProfileService,
    private error: ErrorHandlerService,
    private global: AppGlobal,
    private mensaje: MensajeService,
    private snackbar: SnackbarService) { }

  async ngOnInit() {
    await this.cargar();
    this.api.marcarVista(VISTAS_ALUMNO.DOCENTES);
  }
  async cargar() {
    try {
      const principal = await this.profile.getStorage('principal');
      const carrCcod = principal.programas.map((programa: any) => programa.carrCcod).join(',');
      const result = await this.api.getDocentesV5(carrCcod);

      if (result.success) {
        const { data } = result;
        const docentes = this.procesarDocentes(data.docentes);

        this.docentes = docentes;
        this.programas = principal.programas;
      }
      else {
        throw Error();
      }
    }
    catch (error: any) {
      if (error && error.status == 401) {
        await this.error.handle(error);
      }
    }
    finally {
      this.mostrarCargando = false;
      this.mostrarData = true;
    }
  }
  procesarDocentes(data: any[]) {
    const agrupadoPorCarrera = data.reduce((acc, curr) => {
      const key = curr.carrCcod;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(curr);
      return acc;
    }, {} as Record<string, typeof data>);    
    
    return Object.entries(agrupadoPorCarrera);
  }
  resolverCarrera(carrCcod: string) {
    const programa = this.programas.find(programa => programa.carrCcod == carrCcod);
    return programa.carrTdesc;
  }
  async recargar() {
    this.mostrarCargando = true;
    this.mostrarData = false;
    setTimeout(() => {
      this.cargar();
    }, 500);
  }
  async correo(persTemail: string) {
    try {
      await this.mensaje.crear(persTemail);
    }
    catch (error: any) {
      this.snackbar.showToast(error, 2000, 'danger');
    }
  }
  resolverFoto(persNcorr: any) {
    return `${this.global.Api}/api/v3/imagen-persona/${persNcorr}`;
  }

}

