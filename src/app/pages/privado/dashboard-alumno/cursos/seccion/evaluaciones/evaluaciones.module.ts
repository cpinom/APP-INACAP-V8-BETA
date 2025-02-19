import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EvaluacionesPageRoutingModule } from './evaluaciones-routing.module';
import { EvaluacionesPage } from './evaluaciones.page';
import { IonicModule } from '@ionic/angular';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    EvaluacionesPageRoutingModule
  ],
  declarations: [EvaluacionesPage]
})
export class EvaluacionesPageModule {}
