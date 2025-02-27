import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProgresionPageRoutingModule } from './progresion-routing.module';

import { ProgresionPage } from './progresion.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProgresionPageRoutingModule
  ],
  declarations: [ProgresionPage]
})
export class ProgresionPageModule {}
