import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { DetallePageRoutingModule } from './detalle-routing.module';
import { DetallePage } from './detalle.page';
import { PipesModule } from 'src/app/core/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetallePageRoutingModule,
    PipesModule
  ],
  declarations: [DetallePage]
})
export class DetallePageModule { }
