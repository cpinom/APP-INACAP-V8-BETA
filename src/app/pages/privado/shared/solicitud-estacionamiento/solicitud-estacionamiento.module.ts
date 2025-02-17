import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SolicitudEstacionamientoPageRoutingModule } from './solicitud-estacionamiento-routing.module';
import { SolicitudEstacionamientoPage } from './solicitud-estacionamiento.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    SolicitudEstacionamientoPageRoutingModule
  ],
  declarations: [SolicitudEstacionamientoPage]
})
export class SolicitudEstacionamientoPageModule { }
