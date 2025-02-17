import { Component, OnInit } from '@angular/core';
import { IonNav, ModalController } from '@ionic/angular';
import { EditarCorreoPage } from '../editar-correo/editar-correo.page';
import { EditarTelefonoPage } from '../editar-telefono/editar-telefono.page';
import { ProfileService } from 'src/app/core/services/profile.service';
import * as moment from 'moment';

@Component({
  selector: 'app-bienvenida',
  templateUrl: './bienvenida.page.html',
  styleUrls: ['./bienvenida.page.scss'],
})
export class BienvenidaPage implements OnInit {

  actualizarCorreo!: boolean;
  actualizarCelular!: boolean;
  cantidad!: number;
  permitirOmitir = true;

  constructor(private modalCtrl: ModalController,
    private nav: IonNav,
    private profile: ProfileService) { }
  ngOnInit() {
    if (this.cantidad < 1) {
      this.permitirOmitir = false;
    }
  }
  async continuar() {
    const props = {
      modo: 1,
      actualizarCorreo: this.actualizarCorreo,
      actualizarCelular: this.actualizarCelular,
      cantidad: this.cantidad
    };

    if (this.actualizarCorreo == true) {
      await this.nav.push(EditarCorreoPage, props);
    }
    else if (this.actualizarCelular == true) {
      await this.nav.push(EditarTelefonoPage, props);
    }
  }
  async omitir() {
    await this.profile.setStorage('actualizaDatos', { cantidad: this.cantidad - 1, fecha: moment().format('DD/MM/YYYY') });
    await this.modalCtrl.dismiss();
  }

}
