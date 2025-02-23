import { Component, inject, OnInit } from '@angular/core';
import { IonRouterOutlet, Platform } from '@ionic/angular';
import { VISTAS_ALUMNO } from 'src/app/core/constants/alumno';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';
import { AlumnoService } from 'src/app/core/services/http/alumno.service';
import { ProfileService } from 'src/app/core/services/profile.service';
import { ModalInscripcionPage } from './modal-inscripcion/modal-inscripcion.page';
import { DialogService } from 'src/app/core/services/dialog.service';

@Component({
  selector: 'app-actividades-extracurriculares',
  templateUrl: './actividades-extracurriculares.page.html',
  styleUrls: ['./actividades-extracurriculares.page.scss'],
})
export class ActividadesExtracurricularesPage implements OnInit {

  programa: any;
  actividades: any;
  mostrarCargando = true;
  mostrarData = false;

  private profile = inject(ProfileService);
  private api = inject(AlumnoService);
  private error = inject(ErrorHandlerService);
  private dialog = inject(DialogService);
  private routerOutlet = inject(IonRouterOutlet);
  private pt = inject(Platform);

  constructor() { }

  async ngOnInit() {
    const principal = await this.profile.getStorage('principal')
    this.programa = principal.programas[principal.programaIndex];
    await this.cargar();
    this.api.marcarVista(VISTAS_ALUMNO.ACTIVIDADES_EXTRACURRICULARES);
  }
  async recargar() {
    this.mostrarCargando = true;
    this.mostrarData = false;
    await this.cargar();
  }
  async cargar() {
    try {
      const sedeCcod = this.programa.sedeCcod;
      const result = await this.api.getActividadesInscripcion(sedeCcod);

      if (result.success) {
        this.actividades = this.procesarActividades(result.data.actividades);
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
  procesarActividades(data: any[]) {
    if (data.length == 0 && this.pt.is('mobile')) {
      return [
        { 
          reacTnombre: 'Selección de fútbol', 
          reacFinicio: '13/08/2018', 
          reacTermino: '27/11/2024',
          inscrito: 0, 
          diasTdesc: 'Lunes, Miércoles y Viernes', 
          aehsHora: '16:00 - 18:00', 
          reacObjetivo: 'El objetivo de los talleres deportivos es generar oportunidades en los jóvenes, que puedan vivenciar experiencias con sus compañeros y la comunidad Inacapina , así también obtener todos los beneficios físicos, cognitivos y sociales que nos entrega el deporte y la participación en actividades de gran nivel deportivo.', 
          reacTcomentario: 'El taller es ejecutado por el Profesor De Educación Física, Salud Y Calidad De Vida Fernando Flores , este taller busca entregar todos los conocimientos del futsal para luego ponerlos a prueba en amistosos, partidos de liga , y en las olimpiadas . el taller es para todo el publico que quiera disfrutar de este  hermoso deporte.',
          persTnombre: 'multicancha sede'
        },
        { 
          reacTnombre: 'Selección de fútbol', 
          reacFinicio: '13/08/2018', 
          reacTermino: '27/11/2024',
          inscrito: 1, 
          diasTdesc: 'Lunes, Miércoles y Viernes', 
          aehsHora: '16:00 - 18:00', 
          reacObjetivo: 'El objetivo de los talleres deportivos es generar oportunidades en los jóvenes, que puedan vivenciar experiencias con sus compañeros y la comunidad Inacapina , así también obtener todos los beneficios físicos, cognitivos y sociales que nos entrega el deporte y la participación en actividades de gran nivel deportivo.', 
          reacTcomentario: 'El taller es ejecutado por el Profesor De Educación Física, Salud Y Calidad De Vida Fernando Flores , este taller busca entregar todos los conocimientos del futsal para luego ponerlos a prueba en amistosos, partidos de liga , y en las olimpiadas . el taller es para todo el publico que quiera disfrutar de este  hermoso deporte.',
          persTnombre: 'multicancha sede'
        }
      ];
    }

    return data;
  }
  async inscripcion(data: any) {
    const modal = await this.dialog.showModal({
      component: ModalInscripcionPage,
      componentProps: { data: data },
      presentingElement: this.routerOutlet.nativeEl
    });

    modal.onWillDismiss().then(async (result) => {
      if (result.data === true) {
        await this.cargar();
      }
    });
  }

}
