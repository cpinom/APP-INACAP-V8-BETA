import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modal-descripcion',
  templateUrl: './modal-descripcion.page.html',
  styleUrls: ['./modal-descripcion.page.scss'],
})
export class ModalDescripcionPage implements OnInit {

  titulo: string = '';
  html!: string;

  constructor(private modalCtrl: ModalController) { }
  ngOnInit() { }
  async cerrar() {
    await this.modalCtrl.dismiss()
  }

}
