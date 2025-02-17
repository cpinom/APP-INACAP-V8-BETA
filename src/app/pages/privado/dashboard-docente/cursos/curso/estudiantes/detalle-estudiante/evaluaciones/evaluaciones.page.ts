import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import * as moment from 'moment';

@Component({
  selector: 'app-evaluaciones',
  templateUrl: './evaluaciones.page.html',
  styleUrls: ['./evaluaciones.page.scss'],
})
export class EvaluacionesPage implements OnInit {

  data: any;
  evaluaciones: any;
  private router = inject(Router);
  private nav = inject(NavController);

  constructor() {
    this.data = this.router.getCurrentNavigation()?.extras.state;
    console.log(this.data);
  }
  async ngOnInit() {
    if (!this.data) {
      await this.nav.navigateBack(this.backUrl);
      return;
    }

    this.evaluaciones = this.data.notas
  }
  resolverFechaEvaluacion(data: any) {
    return moment(data.caliFevaluacion, 'DD/MM/YYYY').locale('es').format('<b>DD</b> MMM').replace('.', '');
  }
  resolverNota(nota: string) {
    if (!nota || nota == '--' || nota.toUpperCase() == 'X')
      return 'gris';

    if (parseInt(nota) < 4) {
      return 'rojo';
    }

    return '';
  }
  get backUrl() {
    return this.router.url.replace('/evaluaciones', '');
  }

}
