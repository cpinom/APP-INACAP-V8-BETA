import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-detalle-compromiso',
  templateUrl: './detalle-compromiso.page.html',
  styleUrls: ['./detalle-compromiso.page.scss'],
})
export class DetalleCompromisoPage implements OnInit {

  data: any;

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() { }

  cerrar() {
    this.modalCtrl.dismiss();
  }

}
