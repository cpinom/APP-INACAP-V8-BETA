import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PortafolioPageRoutingModule } from './portafolio-routing.module';

import { PortafolioPage } from './portafolio.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PortafolioPageRoutingModule
  ],
  declarations: [PortafolioPage]
})
export class PortafolioPageModule {}
