import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { DetalleCuentaPageRoutingModule } from './detalle-cuenta-routing.module';
import { DetalleCuentaPage } from './detalle-cuenta.page';
import { PipesModule } from 'src/app/core/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    DetalleCuentaPageRoutingModule,
    PipesModule
  ],
  declarations: [DetalleCuentaPage]
})
export class DetalleCuentaPageModule { }
