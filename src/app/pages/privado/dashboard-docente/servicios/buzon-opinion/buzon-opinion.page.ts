import { Component, OnInit } from '@angular/core';
import { VISTAS_DOCENTE } from 'src/app/core/constants/docente';
import { DocenteService } from 'src/app/core/services/docente/docente.service';

@Component({
  selector: 'app-buzon-opinion',
  templateUrl: './buzon-opinion.page.html'
})
export class BuzonOpinionPage implements OnInit {

  constructor(private api: DocenteService) { }

  ngOnInit() {
    this.api.marcarVista(VISTAS_DOCENTE.BUZON);
  }

}
