import { Component, inject, OnInit } from '@angular/core';
import { DocenteService } from 'src/app/core/services/http/docente.service';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';
import { ProfileService } from 'src/app/core/services/profile.service';

@Component({
  selector: 'app-evaluacion-docente',
  templateUrl: './evaluacion-docente.page.html',
  styleUrls: ['./evaluacion-docente.page.scss'],
})
export class EvaluacionDocentePage implements OnInit {

  periodo: any;
  periodos: any;
  sede: any;
  sedes: any;
  data: any;
  mostrarCargando = true;
  mostrarData = false;

  private api = inject(DocenteService);
  private profile = inject(ProfileService);
  private error = inject(ErrorHandlerService);

  constructor() { }

  async ngOnInit() {
    await this.cargar();
  }
  async cargar() {
    await this.cargarPeriodos();
  }
  async recargar() {
    this.mostrarCargando = true;
    this.mostrarData = false;
    if (!this.periodos) {
      this.cargar();
      return;
    }

    this.cargarResultados(true);
  }
  async cargarPeriodos() {
    try {
      const perfil = await this.profile.getStorage('principal');
      const result = await this.api.getPeriodosEvaluacionDocente();

      if (result.success) {
        this.periodos = result.data.periodos;
        this.sedes = perfil.sedes;

        if (this.periodos.length) {
          this.sede = this.sedes[0].sedeCcod;
          this.periodo = this.periodos[0].periCcod;
          await this.cargarResultados();
        }
      }
      else {
        throw Error('Algo salió mal. Vuelva a intentarlo.');
      }
    }
    catch (error: any) {
      if (error && error.status == 401) {
        this.error.handle(error);
      }
    }
    finally {
      this.mostrarCargando = false;
      this.mostrarData = true;
    }
  }
  async cargarResultados(valRef?: any) {
    if (valRef) {
      this.mostrarCargando = true;
      this.mostrarData = false;
    }
    try {
      const result = await this.api.getEvaluacionDocenteV6(this.sede, this.periodo);

      if (result.success) {
        this.data = result.data;
      }
      else {
        throw Error();
      }
    }
    catch (error: any) {
      if (error && error.status == 401) {
        this.error.handle(error);
        return;
      }

      this.data = undefined;
    }
    finally {
      if (valRef) {
        this.mostrarCargando = false;
        this.mostrarData = true;
      }
    }
  }

}
