import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { DetalleCompromisoPageRoutingModule } from './detalle-compromiso-routing.module';
import { DetalleCompromisoPage } from './detalle-compromiso.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetalleCompromisoPageRoutingModule
  ],
  declarations: [DetalleCompromisoPage]
})
export class DetalleCompromisoPageModule { }
