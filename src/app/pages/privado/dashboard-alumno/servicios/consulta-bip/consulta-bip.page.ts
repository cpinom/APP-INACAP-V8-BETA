import { Component, OnInit } from '@angular/core';
import { VISTAS_ALUMNO } from 'src/app/core/constants/alumno';
import { AlumnoService } from 'src/app/core/services/http/alumno.service';

@Component({
  selector: 'app-consulta-bip',
  templateUrl: './consulta-bip.page.html'
})
export class ConsultaBipPage implements OnInit {

  constructor(private api: AlumnoService) { }

  ngOnInit() {
    this.api.marcarVista(VISTAS_ALUMNO.CONSULTA_BIP);
  }

}
