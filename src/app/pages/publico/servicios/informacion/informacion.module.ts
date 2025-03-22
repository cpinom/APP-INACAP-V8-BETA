import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { InformacionPageRoutingModule } from './informacion-routing.module';
import { InformacionPage } from './informacion.page';
import { ModalCondicionesPageModule } from './modal-condiciones/modal-condiciones.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InformacionPageRoutingModule,
    ModalCondicionesPageModule
  ],
  declarations: [InformacionPage]
})
export class InformacionPageModule { }
