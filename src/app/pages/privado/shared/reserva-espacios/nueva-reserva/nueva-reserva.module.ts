import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NuevaReservaPageRoutingModule } from './nueva-reserva-routing.module';
import { NuevaReservaPage } from './nueva-reserva.page';
import { MbscModule } from '@mobiscroll/angular';
import { MatStepperModule } from '@angular/material/stepper';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    NuevaReservaPageRoutingModule,
    MbscModule,
    MatStepperModule
  ],
  declarations: [NuevaReservaPage]
})
export class NuevaReservaPageModule { }
