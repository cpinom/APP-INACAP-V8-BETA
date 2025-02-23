import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ActividadesExtracurricularesPageRoutingModule } from './actividades-extracurriculares-routing.module';
import { ActividadesExtracurricularesPage } from './actividades-extracurriculares.page';
import { ModalInscripcionPageModule } from './modal-inscripcion/modal-inscripcion.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ActividadesExtracurricularesPageRoutingModule,
    ModalInscripcionPageModule
  ],
  declarations: [ActividadesExtracurricularesPage]
})
export class ActividadesExtracurricularesPageModule { }
