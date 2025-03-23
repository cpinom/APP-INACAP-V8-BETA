import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetalleCarreraPageRoutingModule } from './detalle-carrera-routing.module';

import { DetalleCarreraPage } from './detalle-carrera.page';
import { ModalDescripcionPageModule } from './modal-descripcion/modal-descripcion.module';
import { ModalMallaPageModule } from './modal-malla/modal-malla.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetalleCarreraPageRoutingModule,
    ModalDescripcionPageModule,
    ModalMallaPageModule
  ],
  declarations: [DetalleCarreraPage]
})
export class DetalleCarreraPageModule {}
