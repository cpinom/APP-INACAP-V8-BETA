import { Component, inject, OnInit } from '@angular/core';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';
import { AlumnoService } from 'src/app/core/services/http/alumno.service';
import { ProfileService } from 'src/app/core/services/profile.service';

@Component({
  selector: 'app-malla-curricular',
  templateUrl: './malla-curricular.page.html',
  styleUrls: ['./malla-curricular.page.scss'],
})
export class MallaCurricularPage implements OnInit {

  private api = inject(AlumnoService);
  private profile = inject(ProfileService);
  private error = inject(ErrorHandlerService);

  mostrarCargando = true;
  mostrarData = false;
  niveles: any;
  carrera: any;

  constructor() { }

  async ngOnInit() {
    await this.cargar();
  }
  async cargar() {
    try {
      const principal = await this.profile.getStorage('principal');
      this.carrera = principal.programas[principal.programaIndex];
      const { periCcod, planCcod } = this.carrera;
      const result = await this.api.getMallaCurricularV5(periCcod, planCcod);

      if (result.success) {
        this.niveles = this.procesarNiveles(result.data.niveles);
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
  procesarNiveles(niveles: any[]) {
    return niveles.map(nivel => {
      nivel.niveTnombre = nivel.niveTnombre.replace(/<[^>]*>/g, ' ');
      return nivel;
    });
  }
  resolverAprobados(malla: any[]) {
    const totalCursos = malla.length;
    const cursosAprobados = malla.filter(curso => curso.situFinal == 'course-passed').length;

    return `${cursosAprobados}/${totalCursos} Aprobados`;
  }
  resolverEstado(situacion: string) {
    if (situacion == 'course-passed')
      return 'success';
    else if (situacion == 'course-failed')
      return 'danger';
    else
      return '';
  }
  async accordionChange(e: any) {
  }
  async recargar() {
    this.mostrarCargando = true;
    this.mostrarData = false;
    setTimeout(() => {
      this.cargar();
    }, 500);
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
