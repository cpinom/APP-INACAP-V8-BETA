import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProgramasPageRoutingModule } from './programas-routing.module';

import { ProgramasPage } from './programas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProgramasPageRoutingModule
  ],
  declarations: [ProgramasPage]
})
export class ProgramasPageModule {}
