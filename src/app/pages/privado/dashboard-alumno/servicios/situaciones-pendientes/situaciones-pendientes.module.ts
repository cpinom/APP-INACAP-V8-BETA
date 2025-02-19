import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SituacionesPendientesPageRoutingModule } from './situaciones-pendientes-routing.module';
import { SituacionesPendientesPage } from './situaciones-pendientes.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SituacionesPendientesPageRoutingModule
  ],
  declarations: [SituacionesPendientesPage]
})
export class SituacionesPendientesPageModule { }
