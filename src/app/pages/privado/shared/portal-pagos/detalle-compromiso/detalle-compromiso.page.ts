import { Component, inject, OnInit } from '@angular/core';
import { DialogService } from 'src/app/core/services/dialog.service';

@Component({
  selector: 'app-detalle-compromiso',
  templateUrl: './detalle-compromiso.page.html',
  styleUrls: ['./detalle-compromiso.page.scss'],
})
export class DetalleCompromisoPage implements OnInit {

  data: any;

  private dialog = inject(DialogService);

  constructor() { }

  ngOnInit() { }

  async cerrar() {
    await this.dialog.dismissModal();
  }

}
