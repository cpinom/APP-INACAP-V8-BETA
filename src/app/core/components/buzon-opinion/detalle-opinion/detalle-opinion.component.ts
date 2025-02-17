import { Component, OnInit } from '@angular/core';
import { DialogService } from 'src/app/core/services/dialog.service';

@Component({
  selector: 'app-detalle-opinion',
  templateUrl: './detalle-opinion.component.html',
  styleUrls: ['./detalle-opinion.component.scss'],
})
export class DetalleOpinionComponent implements OnInit {

  data: any;
  esreTdesc = {
    'color': '',
    'icon': ''
  };

  constructor(private dialog: DialogService) { }
  ngOnInit() {
    this.resolverEstado();
  }
  resolverEstado() {
    switch (this.data.esreTdesc) {
      case 'Finalizado':
      case 'Cerrado':
        this.esreTdesc.color = 'success';
        this.esreTdesc.icon = 'check_circle';
        break;
      case 'Abierto':
        this.esreTdesc.color = 'warning';
        this.esreTdesc.icon = 'schedule';
        break;
      default:
        return '';
    }
    return '';
  }
  cerrar() {
    this.dialog.dismissModal();
  }

}

