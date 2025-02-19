import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SolicitudSoportePageRoutingModule } from './solicitud-soporte-routing.module';
import { SolicitudSoportePage } from './solicitud-soporte.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    SolicitudSoportePageRoutingModule
  ],
  declarations: [SolicitudSoportePage]
})
export class SolicitudSoportePageModule { }
