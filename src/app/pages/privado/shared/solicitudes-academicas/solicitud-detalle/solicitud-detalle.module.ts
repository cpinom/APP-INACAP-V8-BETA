import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SolicitudDetallePageRoutingModule } from './solicitud-detalle-routing.module';
import { SolicitudDetallePage } from './solicitud-detalle.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SolicitudDetallePageRoutingModule
  ],
  declarations: [SolicitudDetallePage]
})
export class SolicitudDetallePageModule { }
