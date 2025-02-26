import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { DashboardAlumnoPageRoutingModule } from './dashboard-alumno-routing.module';
import { DashboardAlumnoPage } from './dashboard-alumno.page';
import { ComponentsModule } from 'src/app/core/components/components.module';
import { NotificacionesPageModule } from './notificaciones/notificaciones.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DashboardAlumnoPageRoutingModule,
    ComponentsModule,
    NotificacionesPageModule
  ],
  declarations: [DashboardAlumnoPage]
})
export class DashboardAlumnoPageModule { }
