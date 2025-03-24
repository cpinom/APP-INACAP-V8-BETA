import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { DashboardExalumnoPageRoutingModule } from './dashboard-exalumno-routing.module';
import { DashboardExalumnoPage } from './dashboard-exalumno.page';
import { ComponentsModule } from 'src/app/core/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DashboardExalumnoPageRoutingModule,
    ComponentsModule
  ],
  declarations: [DashboardExalumnoPage]
})
export class DashboardExalumnoPageModule { }
