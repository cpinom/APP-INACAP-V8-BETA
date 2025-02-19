import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { DevolucionGratuidadPageRoutingModule } from './devolucion-gratuidad-routing.module';
import { DevolucionGratuidadPage } from './devolucion-gratuidad.page';
import { PipesModule } from 'src/app/core/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    DevolucionGratuidadPageRoutingModule,
    PipesModule
  ],
  declarations: [DevolucionGratuidadPage]
})
export class DevolucionGratuidadPageModule { }
