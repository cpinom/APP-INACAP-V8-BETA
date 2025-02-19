import { Component, OnInit, ViewChild } from '@angular/core';
import { IonNav } from '@ionic/angular';
import { BienvenidaPage } from '../../../shared/datos-personales/bienvenida/bienvenida.page';

@Component({
  selector: 'app-datos-contacto',
  template: '<ion-nav #nav></ion-nav>'
})
export class DatosContactoPage {

  @ViewChild('nav') nav!: IonNav;
  actualizarCorreo!: boolean;
  actualizarCelular!: boolean;
  cantidad!: number;

  constructor() { }

  async ngAfterViewInit() {
    await this.nav.setRoot(BienvenidaPage, {
      actualizarCorreo: this.actualizarCorreo,
      actualizarCelular: this.actualizarCelular,
      cantidad: this.cantidad
    });
  }

}
