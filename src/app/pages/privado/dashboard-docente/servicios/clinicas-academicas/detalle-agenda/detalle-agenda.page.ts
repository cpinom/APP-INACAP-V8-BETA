import { Component, inject, OnInit } from '@angular/core';
import { DialogService } from 'src/app/core/services/dialog.service';

@Component({
  selector: 'app-detalle-agenda',
  templateUrl: './detalle-agenda.page.html',
  styleUrls: ['./detalle-agenda.page.scss'],
})
export class DetalleAgendaPage implements OnInit {

  data: any;
  private dialog = inject(DialogService);

  constructor() { }

  ngOnInit() {
    console.log(this.data);
  }
  async cerrar() {
    await this.dialog.dismissModal();
  }
  get participantes() {
    if (this.data && this.data.acesCcod != 1) {
      const participantes = JSON.parse(this.data.participantes);

      return participantes.map((t: any) => t.persTemailInacap);
    }
    return [];
  }
  get temas() {
    if (this.data && this.data.acesCcod == 1) {
      const asignaturas = JSON.parse(this.data.asignaturas);

      return asignaturas.map((t: any) => t.asigTdesc);
    }
    return [];
  }

}
