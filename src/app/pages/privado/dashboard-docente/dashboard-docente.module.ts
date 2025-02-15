import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { DashboardDocentePageRoutingModule } from './dashboard-docente-routing.module';
import { DashboardDocentePage } from './dashboard-docente.page';
import { ComponentsModule } from 'src/app/core/components/components.module';
import { PerfilPageModule } from './perfil/perfil.module';
import { NotificacionesPageModule } from './notificaciones/notificaciones.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DashboardDocentePageRoutingModule,
    ComponentsModule,
    PerfilPageModule,
    NotificacionesPageModule
  ],
  declarations: [DashboardDocentePage]
})
export class DashboardDocentePageModule { }
