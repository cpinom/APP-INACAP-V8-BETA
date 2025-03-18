import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { DashboardExalumnoPageRoutingModule } from './dashboard-exalumno-routing.module';
import { DashboardExalumnoPage } from './dashboard-exalumno.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DashboardExalumnoPageRoutingModule
  ],
  declarations: [DashboardExalumnoPage]
})
export class DashboardExalumnoPageModule { }
