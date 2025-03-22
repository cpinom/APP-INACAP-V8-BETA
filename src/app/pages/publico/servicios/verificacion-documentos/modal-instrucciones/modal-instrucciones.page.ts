import { Component, inject, OnInit } from '@angular/core';
import { DialogService } from 'src/app/core/services/dialog.service';

@Component({
  selector: 'app-modal-instrucciones',
  templateUrl: './modal-instrucciones.page.html',
  styleUrls: ['./modal-instrucciones.page.scss'],
})
export class ModalInstruccionesPage implements OnInit {

  private dialog = inject(DialogService);

  constructor() { }

  ngOnInit() {
  }
  async cerrar() {
    await this.dialog.dismissModal();
  }

}
