import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ReservaEspaciosPageRoutingModule } from './reserva-espacios-routing.module';
import { ReservaEspaciosPage } from './reserva-espacios.page';
import { MbscModule } from '@mobiscroll/angular';
import { MatStepperModule } from '@angular/material/stepper';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReservaEspaciosPageRoutingModule,
    MbscModule,
    MatStepperModule
  ],
  declarations: [ReservaEspaciosPage]
})
export class ReservaEspaciosPageModule { }
