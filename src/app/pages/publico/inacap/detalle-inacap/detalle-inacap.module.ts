import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { DetalleInacapPageRoutingModule } from './detalle-inacap-routing.module';
import { DetalleInacapPage } from './detalle-inacap.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetalleInacapPageRoutingModule
  ],
  declarations: [DetalleInacapPage]
})
export class DetalleInacapPageModule { }
