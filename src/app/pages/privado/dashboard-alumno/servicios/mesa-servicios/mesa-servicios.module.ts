import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { MesaServiciosPageRoutingModule } from './mesa-servicios-routing.module';
import { MesaServiciosPage } from './mesa-servicios.page';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    MesaServiciosPageRoutingModule
  ],
  declarations: [MesaServiciosPage]
})
export class MesaServiciosPageModule { }
