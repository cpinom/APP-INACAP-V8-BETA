import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { IonNav } from '@ionic/angular';
import { PrincipalPage } from './principal/principal.page';

@Component({
  selector: 'app-perfil-docente',
  template: '<ion-nav #nav></ion-nav>'
})
export class PerfilPage implements AfterViewInit {
  
  @ViewChild('nav') nav!: IonNav;

  constructor() { }

  ngAfterViewInit() {
    this.nav.setRoot(PrincipalPage);
  }

}
