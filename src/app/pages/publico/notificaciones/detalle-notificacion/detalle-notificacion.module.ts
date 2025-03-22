import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { DetalleNotificacionPageRoutingModule } from './detalle-notificacion-routing.module';
import { DetalleNotificacionPage } from './detalle-notificacion.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetalleNotificacionPageRoutingModule
  ],
  declarations: [DetalleNotificacionPage]
})
export class DetalleNotificacionPageModule { }
