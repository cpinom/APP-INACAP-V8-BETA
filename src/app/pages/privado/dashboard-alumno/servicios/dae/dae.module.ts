import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DaePageRoutingModule } from './dae-routing.module';

import { DaePage } from './dae.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DaePageRoutingModule
  ],
  declarations: [DaePage]
})
export class DaePageModule {}
