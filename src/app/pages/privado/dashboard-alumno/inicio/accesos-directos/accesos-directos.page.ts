import { Component, OnInit } from '@angular/core';
import { ItemReorderEventDetail } from '@ionic/angular';
import { DialogService } from 'src/app/core/services/dialog.service';

@Component({
  selector: 'app-accesos-directos',
  templateUrl: './accesos-directos.page.html',
  styleUrls: ['./accesos-directos.page.scss'],
})
export class AccesosDirectosPage implements OnInit {

  data: any;

  constructor(private dialog: DialogService) { }

  ngOnInit() {
  }
  handleReorder (ev: CustomEvent<ItemReorderEventDetail>) {
    ev.detail.complete();
  }
  guardar() {
    this.dialog.dismissModal({});
  }
  cerrar() {
    this.dialog.dismissModal();
  }

}
