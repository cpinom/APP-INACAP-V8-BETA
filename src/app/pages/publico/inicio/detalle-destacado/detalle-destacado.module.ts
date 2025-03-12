import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { DetalleDestacadoPageRoutingModule } from './detalle-destacado-routing.module';
import { DetalleDestacadoPage } from './detalle-destacado.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetalleDestacadoPageRoutingModule
  ],
  declarations: [DetalleDestacadoPage]
})
export class DetalleDestacadoPageModule { }
