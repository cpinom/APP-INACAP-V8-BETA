import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AlumnoService } from 'src/app/core/services/http/alumno.service';
import { VISTAS_ALUMNO } from 'src/app/core/constants/alumno';
// import { Share } from '@capacitor/share';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { IonContent } from '@ionic/angular';
// import html2canvas from "html2canvas";
import * as moment from 'moment';

@Component({
  selector: 'app-evaluaciones',
  templateUrl: './evaluaciones.page.html',
  styleUrls: ['./evaluaciones.page.scss'],
})
export class EvaluacionesPage implements OnInit {

  @ViewChild(IonContent) content: any;
  data: any;
  evaluaciones: any;
  deshabilitarCompartir = false;

  constructor(private api: AlumnoService,
    private router: Router) { }

  async ngOnInit() {
    this.data = this.router.getCurrentNavigation()?.extras.state;
    this.evaluaciones = this.data.notas;
    this.api.marcarVista(VISTAS_ALUMNO.EVALUACIONES);
  }
  resolverFechaEvaluacion(data: any) {
    return moment(data.caliFevaluacion, 'DD/MM/YYYY').locale('es').format('<b>DD</b> MMM').replace('.', '');
  }
  resolverNota(nota: string) {
    if (!nota)
      return 'gris';
    if (parseInt(nota) < 4) {
      return 'rojo';
    }
    return '';
  }
  // async compartir() {
  //   this.deshabilitarCompartir = true;

  //   try {
  //     const canvas = await html2canvas(this.content.el);
  //     const base64 = canvas.toDataURL();
  //     const random = this.getRandomInt(1111111111, 9999999999);
  //     const file = await Filesystem.writeFile({
  //       path: `seccion_${random}.png`,
  //       data: base64,
  //       directory: Directory.Cache
  //     });

  //     Share.share({
  //       url: file.uri,
  //     })
  //   }
  //   catch (error: any) {
  //     console.log(error);
  //   }
  //   finally {
  //     this.deshabilitarCompartir = false;
  //   }
  // }
  getRandomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  get asignatura() {
    return this.data ? this.data.seccion.asigTdesc : '';
  }
  get backUrl() {
    return this.router.url.replace('/evaluaciones', '');
  }

}
