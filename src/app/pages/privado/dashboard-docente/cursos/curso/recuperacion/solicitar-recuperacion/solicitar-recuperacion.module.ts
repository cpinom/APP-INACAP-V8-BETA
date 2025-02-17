import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { SolicitarRecuperacionPageRoutingModule } from './solicitar-recuperacion-routing.module';
import { SolicitarRecuperacionPage } from './solicitar-recuperacion.page';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    SolicitarRecuperacionPageRoutingModule
  ],
  declarations: [SolicitarRecuperacionPage]
})
export class SolicitarRecuperacionPageModule { }
