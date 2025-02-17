import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DocenteService } from 'src/app/core/services/http/docente.service';
import * as moment from 'moment';
import { VISTAS_DOCENTE } from 'src/app/core/constants/docente';

@Component({
  selector: 'app-evaluaciones',
  templateUrl: './evaluaciones.page.html'
})
export class EvaluacionesPage implements OnInit {

  data: any;
  private api = inject(DocenteService);
  private router = inject(Router);

  constructor() {
    moment.locale('es');
  }
  ngOnInit() {
    this.data = this.router.getCurrentNavigation()?.extras.state;
    this.api.marcarVista(VISTAS_DOCENTE.EVALUACIONES);
  }
  resolverFechaEvaluacion(date: string) {
    return moment(date, 'DD/MM/YYYY').format('[<span class="dia">]DD[</span>] MMM').replace('.', '');
  }
  get backUrl() {
    return this.router.url.replace('/evaluaciones', '');
  }

}
