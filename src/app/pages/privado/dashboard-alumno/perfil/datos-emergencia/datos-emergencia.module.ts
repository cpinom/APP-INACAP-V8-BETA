import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DatosEmergenciaPageRoutingModule } from './datos-emergencia-routing.module';

import { DatosEmergenciaPage } from './datos-emergencia.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DatosEmergenciaPageRoutingModule
  ],
  declarations: [DatosEmergenciaPage]
})
export class DatosEmergenciaPageModule {}
