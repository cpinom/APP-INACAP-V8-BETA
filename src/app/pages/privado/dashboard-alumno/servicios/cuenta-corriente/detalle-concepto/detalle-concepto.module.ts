import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { DetalleConceptoPageRoutingModule } from './detalle-concepto-routing.module';
import { DetalleConceptoPage } from './detalle-concepto.page';
import { PipesModule } from 'src/app/core/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetalleConceptoPageRoutingModule,
    PipesModule
  ],
  declarations: [DetalleConceptoPage]
})
export class DetalleConceptoPageModule { }
