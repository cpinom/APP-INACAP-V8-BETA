import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { IonNav } from '@ionic/angular';
import { BuscadorPage } from './buscador/buscador.page';

@Component({
  selector: 'app-solicitar-recuperacion',
  template: '<ion-nav #nav></ion-nav>'
})
export class SolicitarRecuperacionPage implements AfterViewInit {

  @ViewChild('nav') nav!: IonNav;
  data: any;
  clase: any;

  constructor() { }
  ngAfterViewInit(): void {
    this.nav.setRoot(BuscadorPage, {
      data: this.data,
      clase: this.clase
    });
  }
  ngOnInit() { }

}
