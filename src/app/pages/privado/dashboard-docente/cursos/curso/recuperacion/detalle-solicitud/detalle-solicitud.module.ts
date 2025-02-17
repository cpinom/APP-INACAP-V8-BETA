import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { DetalleSolicitudPageRoutingModule } from './detalle-solicitud-routing.module';
import { DetalleSolicitudPage } from './detalle-solicitud.page';
import { PipesModule } from 'src/app/core/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    DetalleSolicitudPageRoutingModule
  ],
  declarations: [DetalleSolicitudPage]
})
export class DetalleSolicitudPageModule { }
