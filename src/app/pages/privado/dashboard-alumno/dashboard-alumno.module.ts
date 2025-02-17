import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DashboardAlumnoPageRoutingModule } from './dashboard-alumno-routing.module';

import { DashboardAlumnoPage } from './dashboard-alumno.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DashboardAlumnoPageRoutingModule
  ],
  declarations: [DashboardAlumnoPage]
})
export class DashboardAlumnoPageModule {}
