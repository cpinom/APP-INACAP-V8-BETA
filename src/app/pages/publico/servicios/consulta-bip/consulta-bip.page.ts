import { Component, inject, OnInit } from '@angular/core';
import { VISTAS } from 'src/app/core/constants/publico';
import { PublicService } from 'src/app/core/services/http/public.service';

@Component({
  selector: 'app-consulta-bip',
  templateUrl: './consulta-bip.page.html',
  standalone: false
})
export class ConsultaBipPage implements OnInit {

  private api = inject(PublicService);

  constructor() { }

  ngOnInit() {
    this.api.marcarVistaPublica(VISTAS.CONSULTA_BIP);
  }

}
