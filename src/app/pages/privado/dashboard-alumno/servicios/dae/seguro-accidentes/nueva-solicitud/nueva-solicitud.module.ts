import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NuevaSolicitudPageRoutingModule } from './nueva-solicitud-routing.module';
import { NuevaSolicitudPage } from './nueva-solicitud.page';
import { MatStepperModule } from '@angular/material/stepper';
import { PipesModule } from 'src/app/core/pipes/pipes.module';
import { DirectivesModule } from 'src/app/core/directives/directives.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    NuevaSolicitudPageRoutingModule,
    MatStepperModule,
    PipesModule,
    DirectivesModule
  ],
  declarations: [NuevaSolicitudPage]
})
export class NuevaSolicitudPageModule { }
