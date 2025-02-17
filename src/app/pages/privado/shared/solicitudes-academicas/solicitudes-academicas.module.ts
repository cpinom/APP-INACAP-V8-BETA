import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SolicitudesAcademicasPageRoutingModule } from './solicitudes-academicas-routing.module';
import { SolicitudesAcademicasPage } from './solicitudes-academicas.page';
import { SolicitudDetallePageModule } from './solicitud-detalle/solicitud-detalle.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    SolicitudesAcademicasPageRoutingModule,
    SolicitudDetallePageModule
  ],
  declarations: [SolicitudesAcademicasPage]
})
export class SolicitudesAcademicasPageModule { }
