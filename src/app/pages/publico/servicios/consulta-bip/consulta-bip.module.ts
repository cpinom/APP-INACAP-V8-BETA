import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConsultaBipPageRoutingModule } from './consulta-bip-routing.module';

import { ConsultaBipPage } from './consulta-bip.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConsultaBipPageRoutingModule
  ],
  declarations: [ConsultaBipPage]
})
export class ConsultaBipPageModule {}
