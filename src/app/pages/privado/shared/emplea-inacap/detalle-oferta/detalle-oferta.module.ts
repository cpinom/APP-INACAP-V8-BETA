import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { DetalleOfertaPageRoutingModule } from './detalle-oferta-routing.module';
import { DetalleOfertaPage } from './detalle-oferta.page';
import { PipesModule } from 'src/app/core/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    DetalleOfertaPageRoutingModule
  ],
  declarations: [DetalleOfertaPage]
})
export class DetalleOfertaPageModule { }
