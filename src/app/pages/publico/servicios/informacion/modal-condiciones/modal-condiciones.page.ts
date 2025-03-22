import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { UtilsService } from 'src/app/core/services/utils.service';

@Component({
  selector: 'app-modal-condiciones',
  templateUrl: './modal-condiciones.page.html',
  styleUrls: ['./modal-condiciones.page.scss'],
})
export class ModalCondicionesPage implements OnInit {

  constructor(private utils: UtilsService,
    private modalCtrl: ModalController) { }

  ngOnInit() { }
  politicas() {
    this.utils.openLink('https://portales.inacap.cl/politicas-de-privacidad');
  }
  cerrar() {
    this.modalCtrl.dismiss();
  }

}
