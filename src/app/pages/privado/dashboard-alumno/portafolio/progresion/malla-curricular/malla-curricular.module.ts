import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MallaCurricularPageRoutingModule } from './malla-curricular-routing.module';

import { MallaCurricularPage } from './malla-curricular.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MallaCurricularPageRoutingModule
  ],
  declarations: [MallaCurricularPage]
})
export class MallaCurricularPageModule {}
