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
  handleReorder(ev: CustomEvent<ItemReorderEventDetail>) {

    this.data = ev.detail.complete(this.data);

    ev.detail.complete();
  }
  handleVisibility(item: any) {
    this.data = this.data.map((_item: any) => {
      return {
        ..._item,
        visible: _item.key == item.key ? !item.visible : _item.visible
      };
    });
  }
  resolverIcono(item: any) {
    if (item.visible) {
      return 'visibility';
    }
    else {
      return 'visibility_off';
    }
  }
  async guardar() {
    await this.dialog.dismissModal(this.data);
  }
  async cerrar() {
    await this.dialog.dismissModal();
  }

}
