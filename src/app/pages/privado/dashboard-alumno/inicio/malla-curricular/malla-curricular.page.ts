import { Component, inject, OnInit } from '@angular/core';
import { VISTAS_ALUMNO } from 'src/app/core/constants/alumno';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';
import { AlumnoService } from 'src/app/core/services/http/alumno.service';
import { ProfileService } from 'src/app/core/services/profile.service';

@Component({
  selector: 'app-malla-curricular',
  templateUrl: './malla-curricular.page.html',
  styleUrls: ['./malla-curricular.page.scss'],
})
export class MallaCurricularPage implements OnInit {

  carrera: any;
  niveles: any;
  mostrarData = false;
  mostrarCargando = true;

  private api = inject(AlumnoService);
  private profile = inject(ProfileService);
  private error = inject(ErrorHandlerService);

  constructor() { }

  async ngOnInit() {
    await this.cargar();
    this.api.marcarVista(VISTAS_ALUMNO.MALLA);
  }
  async cargar() {
    try {
      let principal = await this.profile.getStorage('principal');
      let programa = principal.programas[principal.programaIndex];
      // let params = { planCcod: programa.planCcod, periCcod: programa.periCcod };
      let result = await this.api.getMallaCurricularV5(programa.periCcod, programa.planCcod);
      // let success = !!niveles.forEach;

      if (result.success) {
        let niveles = result.data.niveles;

        niveles.forEach((nivel: any) => {
          nivel.niveTnombre = nivel.niveTnombre.replace(/<[^>]*>/g, ' ');
        });

        this.niveles = niveles;
        this.carrera = programa;
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
  async recargar() {
    this.mostrarCargando = true;
    this.mostrarData = false;
    setTimeout(() => {
      this.cargar();
    }, 500);
  }
  totalHoras(nivel: any) {
    var total = 0;

    nivel.malla.forEach((item: any) => {

      let horas = item.asigNhoras;

      if (!isNaN(Number(horas))) {
        total += Number(horas);
      }

      // total += item.asigNhoras;
      // if(item.asigCcodRe) {
      //   total += item.asigNhorasRe;
      // }
    });

    return total;
  }
  get totalHorasPlan() {
    if (this.niveles) {
      let total = 0;

      this.niveles.forEach((nivel: any) => {
        nivel.malla.forEach((asig: any) => {

          let horas = asig.asigNhoras;
          if (!isNaN(Number(horas))) {
            total += Number(horas);
          }

          // total += asig.asigNhoras;
          // if (asig.asigCcodRe) {
          //   total += asig.asigNhorasRe;
          // }
        });
      });

      return total;
    }
    return 0;
  }
  get totalAsignaturas() {
    if (this.niveles) {
      let total = 0;

      this.niveles.forEach((nivel: any) => {
        total += nivel.malla.length;
        nivel.malla.forEach((asig: any) => {
          if (asig.asigCcodRe) {
            total += 1;
          }
        })
      });

      return total;
    }

    return 0;
  }

}
