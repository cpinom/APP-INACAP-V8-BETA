import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { SolicitarRecuperacionPageRoutingModule } from './solicitar-recuperacion-routing.module';
import { SolicitarRecuperacionPage } from './solicitar-recuperacion.page';
import { EstudiantesPageModule } from './estudiantes/estudiantes.module';
import { DisponibilidadPageModule } from './disponibilidad/disponibilidad.module';
import { BuscadorPageModule } from './buscador/buscador.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    SolicitarRecuperacionPageRoutingModule,
    BuscadorPageModule,
    EstudiantesPageModule,
    DisponibilidadPageModule
  ],
  declarations: [SolicitarRecuperacionPage]
})
export class SolicitarRecuperacionPageModule { }
