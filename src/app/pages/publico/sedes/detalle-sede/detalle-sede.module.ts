import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { DetalleSedePageRoutingModule } from './detalle-sede-routing.module';
import { DetalleSedePage } from './detalle-sede.page';
import { PipesModule } from 'src/app/core/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetalleSedePageRoutingModule,
    PipesModule
  ],
  declarations: [DetalleSedePage]
})
export class DetalleSedePageModule { }
