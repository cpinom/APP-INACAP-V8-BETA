import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RecuperacionPageRoutingModule } from './recuperacion-routing.module';
import { RecuperacionPage } from './recuperacion.page';
import { SolicitarRecuperacionPageModule } from './solicitar-recuperacion/solicitar-recuperacion.module';
import { DetalleSolicitudPageModule } from './detalle-solicitud/detalle-solicitud.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RecuperacionPageRoutingModule,
    SolicitarRecuperacionPageModule,
    DetalleSolicitudPageModule
  ],
  declarations: [RecuperacionPage]
})
export class RecuperacionPageModule { }
