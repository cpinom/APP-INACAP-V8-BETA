import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { OfertasPracticaPageRoutingModule } from './ofertas-practica-routing.module';
import { OfertasPracticaPage } from './ofertas-practica.page';
import { PipesModule } from 'src/app/core/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    OfertasPracticaPageRoutingModule
  ],
  declarations: [OfertasPracticaPage]
})
export class OfertasPracticaPageModule { }
