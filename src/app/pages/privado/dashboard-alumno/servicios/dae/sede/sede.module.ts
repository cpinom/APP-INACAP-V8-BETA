import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SedePageRoutingModule } from './sede-routing.module';

import { SedePage } from './sede.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SedePageRoutingModule
  ],
  declarations: [SedePage]
})
export class SedePageModule {}
