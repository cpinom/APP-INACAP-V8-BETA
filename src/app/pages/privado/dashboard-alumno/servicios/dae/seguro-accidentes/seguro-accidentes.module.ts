import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SeguroAccidentesPageRoutingModule } from './seguro-accidentes-routing.module';

import { SeguroAccidentesPage } from './seguro-accidentes.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SeguroAccidentesPageRoutingModule
  ],
  declarations: [SeguroAccidentesPage]
})
export class SeguroAccidentesPageModule {}
